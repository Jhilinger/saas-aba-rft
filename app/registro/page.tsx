import { PAISES } from '@/utils/tarifas'
import { tarifasVisibles } from '@/utils/tarifas-stripe'
import RegistroForm from './registro-form'

// Los importes se leen de Stripe: se refrescan cada hora
export const revalidate = 3600

export default async function RegistroPage() {
  const tarifas = await tarifasVisibles()
  // Solo los países con precio configurado en Stripe
  const paises = PAISES.filter((p) => tarifas[p.codigo]).map(({ codigo, nombre }) => ({ codigo, nombre }))
  return <RegistroForm paises={paises} tarifas={tarifas} />
}
