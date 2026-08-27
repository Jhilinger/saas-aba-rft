'use server'

import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function iniciarRegistro(formData: FormData) {
    const nombreClinica = formData.get('nombre_clinica') as string
  const nombreAdmin = formData.get('nombre_admin') as string
  const emailAdmin = formData.get('email_admin') as string
  const telefono = formData.get('telefono') as string
  const pais = formData.get('pais') as string
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
    ciudad,
    terminos_aceptados_en: new Date().toISOString(),
  }

  let session: any
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: process.env.STRIPE_PRICE_CUOTA_FIJA!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_POR_ALUMNO!, quantity: 1 },
      ],
      customer_email: emailAdmin,
      success_url: `${URL_BASE}/registro/completado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL_BASE}/registro`,
      metadata: metadataComun,
      subscription_data: {
        metadata: metadataComun,
      },
    })
  } catch (err: any) {
    return { error: 'Error iniciando el pago: ' + (err?.message ?? 'error desconocido') }
  }

  if (!session.url) {
    return { error: 'No se pudo generar el enlace de pago. Inténtalo de nuevo.' }
  }

  return { success: true, url: session.url }
}