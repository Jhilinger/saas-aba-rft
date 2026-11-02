import { PAISES } from '@/utils/tarifas'
import { tarifasVisibles } from '@/utils/tarifas-stripe'
import RegistroForm from './registro-form'

// Los importes se leen de Stripe: se refrescan cada hora
export const revalidate = 3600

export default async function RegistroPage() {
  const tarifas = await tarifasVisibles()
  return <RegistroForm paises={PAISES.map(({ codigo, nombre }) => ({ codigo, nombre }))} tarifas={tarifas} />
}
