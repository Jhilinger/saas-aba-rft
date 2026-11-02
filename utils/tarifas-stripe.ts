import { stripe } from '@/utils/stripe'
import { PAISES, precioStripe, type TarifaVisible } from '@/utils/tarifas'

// Importes que verá el cliente, leídos de Stripe, por país. Los países sin
// precio configurado (o mal configurado) no aparecen.
export async function tarifasVisibles(): Promise<Record<string, TarifaVisible>> {
  const cache = new Map<string, Promise<TarifaVisible>>()
  const importe = (id: string) => {
    if (!cache.has(id)) {
      cache.set(id, stripe.prices.retrieve(id).then((p) => ({ moneda: p.currency.toUpperCase(), alumno: (p.unit_amount ?? 0) / 100 })))
    }
    return cache.get(id)!
  }
  const resultado: Record<string, TarifaVisible> = {}
  for (const pais of PAISES) {
    const precio = precioStripe(pais.codigo)
    if (!precio) continue
    try {
      resultado[pais.codigo] = await importe(precio.alumno)
    } catch {
      // Precio mal configurado en Stripe: el país no se ofrece
    }
  }
  return resultado
}
