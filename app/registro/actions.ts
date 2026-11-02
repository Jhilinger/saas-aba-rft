'use server'

import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import type Stripe from 'stripe'
import { paisPorCodigo, preciosStripe, type Plan } from '@/utils/tarifas'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function iniciarRegistro(formData: FormData) {
    const nombreClinica = formData.get('nombre_clinica') as string
  const nombreAdmin = formData.get('nombre_admin') as string
  const emailAdmin = formData.get('email_admin') as string
  const telefono = formData.get('telefono') as string
  const paisCodigo = formData.get('pais_codigo') as string
  const pais = paisPorCodigo(paisCodigo)?.nombre ?? ''
  const plan: Plan = formData.get('plan') === 'independiente' ? 'independiente' : 'clinica'
  const ciudad = formData.get('ciudad') as string
  const aceptaTerminos = formData.get('acepta_terminos') === 'on'

  if (!nombreClinica || !nombreAdmin || !emailAdmin || !telefono || !pais || !ciudad) {
    return { error: 'Rellena todos los campos.' }
  }

  if (!aceptaTerminos) {
    return { error: 'Debes aceptar los Términos de Uso y la Política de Privacidad.' }
  }

  const admin = createAdminClient()
  const { data: existentes } = await admin
    .from('perfiles')
    .select('id')
    .eq('email', emailAdmin)
    .limit(1)

  if (existentes && existentes.length > 0) {
    return { error: `Ya existe una cuenta con el email "${emailAdmin}". Usa otro email o inicia sesión.` }
  }

    const metadataComun = {
    nombre_clinica: nombreClinica,
    nombre_admin: nombreAdmin,
    email_admin: emailAdmin,
    telefono,
    pais,
    pais_codigo: paisCodigo,
    plan,
    ciudad,
    terminos_aceptados_en: new Date().toISOString(),
  }

  // Precios del escalón del país (o los de España si aún no están en Stripe)
  const precios = preciosStripe(paisCodigo, plan)
  if (!precios) return { error: 'Ese tipo de cuenta no está disponible en tu país.' }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        ...(precios.cuota ? [{ price: precios.cuota, quantity: 1 }] : []),
        { price: precios.alumno, quantity: 1 },
      ],
      customer_email: emailAdmin,
      success_url: `${URL_BASE}/registro/completado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL_BASE}/registro`,
      metadata: { ...metadataComun, escalon: precios.escalon, precio_alumno: precios.alumno },
      subscription_data: {
        trial_period_days: 14,
        // IVA español solo en España; los impuestos de otros países, pendientes del asesor
        ...(paisCodigo === 'ES' ? { default_tax_rates: [process.env.STRIPE_TAX_RATE_ID!] } : {}),
        metadata: metadataComun,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'error desconocido'
    return { error: 'Error iniciando el pago: ' + message }
  }

  if (!session.url) {
    return { error: 'No se pudo generar el enlace de pago. Inténtalo de nuevo.' }
  }

  return { success: true, url: session.url }
}