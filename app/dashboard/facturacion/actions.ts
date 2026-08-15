'use server'

import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/utils/stripe'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function crearSesionPortal() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol !== 'clinica_admin') {
    return { error: 'No autorizado' }
  }

  const { data: clinica } = await supabase
    .from('clinicas')
    .select('stripe_customer_id, sin_facturacion')
    .eq('id', perfil.clinica_id)
    .single()

  if (!clinica || clinica.sin_facturacion || !clinica.stripe_customer_id) {
    return { error: 'Esta clínica no tiene facturación con Stripe configurada.' }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: clinica.stripe_customer_id,
      return_url: `${URL_BASE}/dashboard/facturacion`,
    })
    return { success: true, url: session.url }
  } catch (err: any) {
    return { error: 'Error abriendo el portal de facturación: ' + (err?.message ?? 'error desconocido') }
  }
}