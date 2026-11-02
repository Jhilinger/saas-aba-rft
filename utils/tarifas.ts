// Precios por país. Cada país pertenece a un escalón y se cobra en su moneda;
// el precio de Stripe de cada escalón y moneda está en una variable de entorno.
// Los importes se leen de Stripe, así que se cambian en el panel de Stripe sin
// tocar código. Solo se cobra por alumno activo, sin cuota fija, con un mínimo
// facturado de MINIMO_ALUMNOS.
//
// Añadir un país = añadir una línea a PAISES. Un país cuyo precio aún no está
// configurado en Stripe no aparece en el registro.

export type Escalon = 'a' | 'b' | 'c' | 'd'
export type Moneda = 'EUR' | 'USD'

export const PAISES: { codigo: string; nombre: string; escalon: Escalon; moneda: Moneda }[] = [
  // Europa (el resto de países, cuando el asesor fiscal lo confirme)
  { codigo: 'ES', nombre: 'España', escalon: 'a', moneda: 'EUR' },
  // Norteamérica
  { codigo: 'US', nombre: 'Estados Unidos', escalon: 'a', moneda: 'USD' },
  { codigo: 'CA', nombre: 'Canadá', escalon: 'a', moneda: 'USD' },
  { codigo: 'PR', nombre: 'Puerto Rico', escalon: 'a', moneda: 'USD' },
  // Latinoamérica
  { codigo: 'AR', nombre: 'Argentina', escalon: 'd', moneda: 'USD' },
  { codigo: 'BO', nombre: 'Bolivia', escalon: 'd', moneda: 'USD' },
  { codigo: 'CL', nombre: 'Chile', escalon: 'b', moneda: 'USD' },
  { codigo: 'CO', nombre: 'Colombia', escalon: 'c', moneda: 'USD' },
  { codigo: 'CR', nombre: 'Costa Rica', escalon: 'b', moneda: 'USD' },
  { codigo: 'DO', nombre: 'República Dominicana', escalon: 'c', moneda: 'USD' },
  { codigo: 'EC', nombre: 'Ecuador', escalon: 'c', moneda: 'USD' },
  { codigo: 'SV', nombre: 'El Salvador', escalon: 'd', moneda: 'USD' },
  { codigo: 'GT', nombre: 'Guatemala', escalon: 'd', moneda: 'USD' },
  { codigo: 'HN', nombre: 'Honduras', escalon: 'd', moneda: 'USD' },
  { codigo: 'MX', nombre: 'México', escalon: 'c', moneda: 'USD' },
  { codigo: 'NI', nombre: 'Nicaragua', escalon: 'd', moneda: 'USD' },
  { codigo: 'PA', nombre: 'Panamá', escalon: 'b', moneda: 'USD' },
  { codigo: 'PY', nombre: 'Paraguay', escalon: 'd', moneda: 'USD' },
  { codigo: 'PE', nombre: 'Perú', escalon: 'c', moneda: 'USD' },
  { codigo: 'UY', nombre: 'Uruguay', escalon: 'b', moneda: 'USD' },
  { codigo: 'VE', nombre: 'Venezuela', escalon: 'd', moneda: 'USD' },
]

// Alumnos que se facturan como mínimo, aunque haya menos activos
export const MINIMO_ALUMNOS = 3

// Precio por alumno de cada escalón y moneda (ids de Stripe)
const VARIABLES: Record<string, string> = {
  'a-EUR': 'STRIPE_PRICE_ALUMNO_A_EUR',
  'a-USD': 'STRIPE_PRICE_ALUMNO_A_USD',
  'b-USD': 'STRIPE_PRICE_ALUMNO_B',
  'c-USD': 'STRIPE_PRICE_ALUMNO_C',
  'd-USD': 'STRIPE_PRICE_ALUMNO_D',
}

export function paisPorCodigo(codigo: string) {
  return PAISES.find((p) => p.codigo === codigo) ?? null
}

// Precio de Stripe (id) del país, o null si aún no está configurado
export function precioStripe(codigoPais: string) {
  const pais = paisPorCodigo(codigoPais)
  if (!pais) return null
  const id = process.env[VARIABLES[`${pais.escalon}-${pais.moneda}`] ?? '']
  return id ? { escalon: pais.escalon, alumno: id } : null
}

export function alumnosFacturados(activos: number) {
  return Math.max(activos, MINIMO_ALUMNOS)
}

export type TarifaVisible = { moneda: string; alumno: number }

export function formatearImporte(importe: number, moneda: string) {
  const decimales = importe % 1 ? 2 : 0
  return new Intl.NumberFormat('es', { style: 'currency', currency: moneda, minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(importe)
}
