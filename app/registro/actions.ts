'use server'

import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import type Stripe from 'stripe'
import { MINIMO_ALUMNOS, paisPorCodigo, precioStripe } from '@/utils/tarifas'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function iniciarRegistro(formData: FormData) {
    const nombreClinica = formData.get('nombre_clinica') as string
  const nombreAdmin = formData.get('nombre_admin') as string
  const emailAdmin = formData.get('email_admin') as string
  const telefono = formData.get('telefono') as string
  const paisCodigo = formData.get('pais_codigo') as string
  const pais = paisPorCodigo(paisCodigo)?.nombre ?? ''
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
    ciudad,
    terminos_aceptados_en: new Date().toISOString(),
  }

  // Precio por alumno del escalón y la moneda del país
  const precio = precioStripe(paisCodigo)
  if (!precio) return { error: 'Todavía no estamos disponibles en tu país.' }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      // Sin cuota fija: solo alumnos activos, con un mínimo facturado
      line_items: [{ price: precio.alumno, quantity: MINIMO_ALUMNOS }],
      customer_email: emailAdmin,
      success_url: `${URL_BASE}/registro/completado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL_BASE}/registro`,
      metadata: { ...metadataComun, escalon: precio.escalon, precio_alumno: precio.alumno },
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