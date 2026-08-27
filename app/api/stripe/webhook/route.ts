import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { sincronizarAlumnosStripe } from '@/utils/stripe-sync'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const firma = req.headers.get('stripe-signature')

  if (!firma) {
    return NextResponse.json({ error: 'Falta la firma de Stripe' }, { status: 400 })
  }

  let evento: Stripe.Event
  try {
    evento = stripe.webhooks.constructEvent(body, firma, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Firma de webhook inválida:', err.message)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  const admin = createAdminClient()

  switch (evento.type) {
    // --- Pago completado: creamos la clínica + su primer admin ---
    case 'checkout.session.completed': {
      const session = evento.data.object as Stripe.Checkout.Session
      const metadata = session.metadata

      if (!metadata?.nombre_clinica || !metadata?.email_admin) {
        console.error('checkout.session.completed sin metadata esperada')
        break
      }

      const subscriptionId = session.subscription as string
      const suscripcion = await stripe.subscriptions.retrieve(subscriptionId)
      const itemAlumno = suscripcion.items.data.find(
        (i) => i.price.id === process.env.STRIPE_PRICE_POR_ALUMNO
      )

      // Evitamos duplicados si Stripe reintenta el mismo evento
      const { data: yaExiste } = await admin
        .from('clinicas')
        .select('id')
        .eq('stripe_subscription_id', subscriptionId)
        .maybeSingle()

      if (yaExiste) break

                const { data: clinica, error: clinicaError } = await admin
        .from('clinicas')
        .insert({
          nombre: metadata.nombre_clinica,
          pais: metadata.pais ?? 'ES',
          telefono: metadata.telefono ?? null,
          ciudad: metadata.ciudad ?? null,
          terminos_aceptados_at: metadata.terminos_aceptados_en ?? new Date().toISOString(),
          precio_fijo_mensual: 30,
          precio_por_alumno: 5,
          sin_facturacion: false,
          estado_suscripcion: suscripcion.status,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          stripe_subscription_item_alumno_id: itemAlumno?.id ?? null,
        })
        .select('id')
        .single()

      if (clinicaError || !clinica) {
        console.error('Error creando la clínica desde el webhook:', clinicaError)
        break
      }

      // Creamos la cuenta del admin con contraseña aleatoria (no la conoce
      // nadie) y le mandamos una invitación por email para que ponga la suya
      const { data: authUser, error: authError } = await admin.auth.admin.inviteUserByEmail(
        metadata.email_admin,
        { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login` }
      )

      if (authError || !authUser.user) {
        console.error('Error invitando al admin desde el webhook:', authError)
        // Sin admin, la clínica queda inutilizable: la borramos para no
        // dejarla huérfana (el cliente habrá pagado, así que además de
        // esto conviene revisar el error y contactarle a mano)
        await admin.from('clinicas').delete().eq('id', clinica.id)
        break
      }

      const { error: perfilError } = await admin.from('perfiles').insert({
        id: authUser.user.id,
        clinica_id: clinica.id,
        rol: 'clinica_admin',
        nombre: metadata.nombre_admin,
        email: metadata.email_admin,
      })

      if (perfilError) {
        console.error('Error creando el perfil admin desde el webhook:', perfilError)
        await admin.auth.admin.deleteUser(authUser.user.id)
        await admin.from('clinicas').delete().eq('id', clinica.id)
        break
      }

      // La suscripción arranca con cantidad=1 "por alumno" por defecto
      // (Stripe exige al menos 1 al crearla), pero la clínica empieza sin
      // alumnos. Corregimos la cantidad real inmediatamente.
      await sincronizarAlumnosStripe(clinica.id)

      break
    }

    // --- La suscripción cambia de estado (renovación, impago, etc.) ---
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const suscripcion = evento.data.object as Stripe.Subscription

      await admin
        .from('clinicas')
        .update({
          estado_suscripcion: suscripcion.status,
          activa: ['active', 'trialing', 'past_due'].includes(suscripcion.status),
        })
        .eq('stripe_subscription_id', suscripcion.id)

      break
    }
  }

  return NextResponse.json({ received: true })
}