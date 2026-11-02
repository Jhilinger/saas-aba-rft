import { stripe } from '@/utils/stripe'
import { PAISES, preciosStripe, type Plan, type TarifaVisible } from '@/utils/tarifas'

// Importes que verá el cliente, leídos de Stripe, por país y plan
export async function tarifasVisibles(): Promise<Record<string, Partial<Record<Plan, TarifaVisible>>>> {
  const cache = new Map<string, Promise<{ moneda: string; importe: number }>>()
  const importe = (id: string) => {
    if (!cache.has(id)) {
      cache.set(
        id,
        stripe.prices.retrieve(id).then((p) => ({ moneda: p.currency.toUpperCase(), importe: (p.unit_amount ?? 0) / 100 }))
      )
    }
    return cache.get(id)!
  }
  const resultado: Record<string, Partial<Record<Plan, TarifaVisible>>> = {}
  for (const pais of PAISES) {
    resultado[pais.codigo] = {}
    for (const plan of ['clinica', 'independiente'] as Plan[]) {
      const precios = preciosStripe(pais.codigo, plan)
      if (!precios) continue
      try {
        const alumno = await importe(precios.alumno)
        const cuota = precios.cuota ? (await importe(precios.cuota)).importe : null
        resultado[pais.codigo][plan] = { moneda: alumno.moneda, cuota, alumno: alumno.importe }
      } catch {
        // Precio mal configurado en Stripe: el plan no se ofrece en ese país
      }
    }
  }
  return resultado
}
