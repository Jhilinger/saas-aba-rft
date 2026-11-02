// Precios por país. Cada país pertenece a un escalón y cada escalón tiene sus
// precios en Stripe (variables de entorno). Los importes se leen de Stripe,
// así que se cambian en el panel de Stripe sin tocar código. Un escalón cuyos
// precios aún no están configurados cobra con los de España.
//
// Añadir un país = añadir una línea a PAISES.

export type Escalon = 'es' | 'a' | 'b' | 'c'
export type Plan = 'clinica' | 'independiente'

export const PAISES: { codigo: string; nombre: string; escalon: Escalon }[] = [
  { codigo: 'ES', nombre: 'España', escalon: 'es' },
  { codigo: 'AR', nombre: 'Argentina', escalon: 'c' },
  { codigo: 'BO', nombre: 'Bolivia', escalon: 'c' },
  { codigo: 'CL', nombre: 'Chile', escalon: 'a' },
  { codigo: 'CO', nombre: 'Colombia', escalon: 'b' },
  { codigo: 'CR', nombre: 'Costa Rica', escalon: 'a' },
  { codigo: 'DO', nombre: 'República Dominicana', escalon: 'b' },
  { codigo: 'EC', nombre: 'Ecuador', escalon: 'b' },
  { codigo: 'SV', nombre: 'El Salvador', escalon: 'c' },
  { codigo: 'GT', nombre: 'Guatemala', escalon: 'c' },
  { codigo: 'HN', nombre: 'Honduras', escalon: 'c' },
  { codigo: 'MX', nombre: 'México', escalon: 'b' },
  { codigo: 'NI', nombre: 'Nicaragua', escalon: 'c' },
  { codigo: 'PA', nombre: 'Panamá', escalon: 'a' },
  { codigo: 'PY', nombre: 'Paraguay', escalon: 'c' },
  { codigo: 'PE', nombre: 'Perú', escalon: 'b' },
  { codigo: 'UY', nombre: 'Uruguay', escalon: 'a' },
  { codigo: 'VE', nombre: 'Venezuela', escalon: 'c' },
]

// Alumnos activos como máximo en el plan de terapeuta independiente
export const MAX_ALUMNOS_INDEPENDIENTE = 10

// Precios de Stripe de cada escalón: cuota fija y precio por alumno del plan
// de clínica, y precio por alumno del plan independiente (sin cuota fija)
const VARIABLES: Record<Escalon, { cuota: string; alumno: string; independiente: string }> = {
  es: { cuota: 'STRIPE_PRICE_CUOTA_FIJA', alumno: 'STRIPE_PRICE_POR_ALUMNO', independiente: 'STRIPE_PRICE_INDEPENDIENTE' },
  a: { cuota: 'STRIPE_PRICE_CUOTA_FIJA_A', alumno: 'STRIPE_PRICE_POR_ALUMNO_A', independiente: 'STRIPE_PRICE_INDEPENDIENTE_A' },
  b: { cuota: 'STRIPE_PRICE_CUOTA_FIJA_B', alumno: 'STRIPE_PRICE_POR_ALUMNO_B', independiente: 'STRIPE_PRICE_INDEPENDIENTE_B' },
  c: { cuota: 'STRIPE_PRICE_CUOTA_FIJA_C', alumno: 'STRIPE_PRICE_POR_ALUMNO_C', independiente: 'STRIPE_PRICE_INDEPENDIENTE_C' },
}

export function paisPorCodigo(codigo: string) {
  return PAISES.find((p) => p.codigo === codigo) ?? null
}

// Precios de Stripe (ids) que corresponden a un país y un plan. null si el
// plan no está disponible (el independiente sin precio configurado).
export function preciosStripe(codigoPais: string, plan: Plan) {
  const escalon = paisPorCodigo(codigoPais)?.escalon ?? 'es'
  const propios = VARIABLES[escalon]
  const configurado = !!process.env[propios.cuota] && !!process.env[propios.alumno]
  const v = configurado ? propios : VARIABLES.es
  if (plan === 'independiente') {
    const id = process.env[v.independiente]
    return id ? { escalon: configurado ? escalon : ('es' as Escalon), cuota: null, alumno: id } : null
  }
  return { escalon: configurado ? escalon : ('es' as Escalon), cuota: process.env[v.cuota]!, alumno: process.env[v.alumno]! }
}

export type TarifaVisible = { moneda: string; cuota: number | null; alumno: number }

export function formatearImporte(importe: number, moneda: string) {
  const decimales = importe % 1 ? 2 : 0
  return new Intl.NumberFormat('es', { style: 'currency', currency: moneda, minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(importe)
}
