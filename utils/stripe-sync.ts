import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'

// Actualiza en Stripe la cantidad del ítem "por alumno" de la suscripción
// de una clínica, para que coincida con su nº real de alumnos activos.
// No hace nada si la clínica no tiene suscripción de Stripe (sin_facturacion=true).
export async function sincronizarAlumnosStripe(clinicaId: string) {
  const admin = createAdminClient()

  const { data: clinica } = await admin
    .from('clinicas')
    .select('stripe_subscription_item_alumno_id, sin_facturacion')
    .eq('id', clinicaId)
    .single()

  if (!clinica || clinica.sin_facturacion || !clinica.stripe_subscription_item_alumno_id) {
    return
  }

  const { count } = await admin
    .from('alumnos')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
    .eq('activo', true)

  try {
    await stripe.subscriptionItems.update(clinica.stripe_subscription_item_alumno_id, {
      quantity: count ?? 0,
    })
  } catch (err) {
    // No bloqueamos la acción del usuario (crear/archivar un alumno) si
    // falla la sincronización con Stripe — simplemente lo registramos.
    console.error(`Error sincronizando alumnos con Stripe para la clínica ${clinicaId}:`, err)
  }
}