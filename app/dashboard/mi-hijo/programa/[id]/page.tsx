import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EvolucionChart from '../../../programas/[id]/evolucion-chart'
import { obtenerEvolucionAba } from '../../../programas/[id]/evolucion-actions'

export default async function ProgramaFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, alumno_id, porcentaje_dominio, alumnos(nombre_anonimizado)')
    .eq('id', id)
    .single()

  if (!programa) notFound()

  if (programa.tipo !== 'aba_clasico') redirect('/dashboard/mi-hijo')

  const { data: vinculo } = await supabase
    .from('alumno_familia')
    .select('alumno_id')
    .eq('alumno_id', programa.alumno_id)
    .eq('perfil_id', user.id)
    .maybeSingle()

  if (!vinculo) redirect('/dashboard/mi-hijo')

  const { conjuntos: datosEvolucion } = await obtenerEvolucionAba(id)

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estimulos_alumno(nombre)')
    .eq('programa_alumno_id', id)
    .order('orden')

  const alumnoNombre = (programa.alumnos as any)?.nombre_anonimizado ?? ''

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
      <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Progreso
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
        <EvolucionChart
          conjuntos={datosEvolucion}
          porcentajeDominio={programa.porcentaje_dominio}
          titulo={`${alumnoNombre} — ${programa.nombre}`}
          estimulosPorConjunto={(conjuntos ?? []).map((c: any) => ({
            id: c.id,
            nombre: c.nombre,
            estimulos: c.estimulos_alumno.map((e: any) => e.nombre),
          }))}
        />
      </div>
    </div>
  )
}