import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EvolucionRftFamilia from './evolucion-rft-familia'
import { obtenerEvolucionRft } from '../../../programas-rft/[id]/evolucion-actions'
import type { Tables } from '@/database.types'

type ProgramaConAlumno = Pick<
  Tables<'programas_alumno'>,
  'id' | 'nombre' | 'tipo' | 'alumno_id' | 'porcentaje_dominio'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

export default async function ProgramaRftFamiliaPage({
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

  if (programa.tipo !== 'rft') redirect('/dashboard/mi-hijo')

  const { data: vinculo } = await supabase
    .from('alumno_familia')
    .select('alumno_id')
    .eq('alumno_id', programa.alumno_id)
    .eq('perfil_id', user.id)
    .maybeSingle()

  if (!vinculo) redirect('/dashboard/mi-hijo')

  const { data: clases } = await supabase
    .from('clases_rft')
    .select('grupo')
    .eq('programa_alumno_id', id)

  const grupos = [...new Set((clases ?? []).map((c) => c.grupo))]

  const { porFase, distribucionPorGrupo } = await obtenerEvolucionRft(id)

  const { data: dominioFases } = await supabase
    .from('dominio_rft_fases')
    .select('grupo, fase, posicion_origen, posicion_destino, dominado')
    .eq('programa_alumno_id', id)

  const alumnoNombre = (programa as unknown as ProgramaConAlumno).alumnos?.nombre_anonimizado ?? ''

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
      <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Progreso
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
        {alumnoNombre} — {programa.nombre}
      </h1>

      <EvolucionRftFamilia
        grupos={grupos}
        porFase={porFase}
        distribucionPorGrupo={distribucionPorGrupo}
        dominioFases={dominioFases ?? []}
        porcentajeDominio={programa.porcentaje_dominio}
      />
    </div>
  )
}
