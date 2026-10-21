import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProgresoCurriculo from './progreso-curriculo'
import { calcularProgreso } from './calcular-progreso'
import { cargarEstructuraCurriculo } from '../../../curriculo/estructura'

function hrefPrograma({ id, tipo }: { id: string; tipo: string }) {
  if (tipo === 'aba_clasico') return `/dashboard/programas/${id}`
  if (tipo === 'rft') return `/dashboard/programas-rft/${id}`
  return null
}

export default async function ProgresoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: alumnoId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumno } = await supabase.from('alumnos').select('id, clinica_id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const filtroClinica = alumno.clinica_id
    ? `clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`
    : 'clinica_id.is.null'

  const [{ data: curriculo }, { data: asignados }, { data: evaluados }, estructura] = await Promise.all([
    supabase
      .from('programas_base')
      .select('id, nombre, tipo, dominio_id, orden, clinica_id')
      .eq('activo', true)
      .or(filtroClinica),
    supabase
      .from('programas_alumno')
      .select('id, nombre, tipo, estado, programa_base_id, programas_base(id, nombre, tipo, dominio_id, orden, clinica_id, activo)')
      .eq('alumno_id', alumnoId),
    supabase.from('evaluaciones_iniciales').select('programa_base_id, valoracion').eq('alumno_id', alumnoId),
    cargarEstructuraCurriculo(supabase),
  ])

  const { niveles, fueraDelCurriculo } = calcularProgreso({
    estructura,
    curriculo: curriculo ?? [],
    asignados: asignados ?? [],
    dominadoEnValoracion: new Set(
      (evaluados ?? []).filter((v) => v.valoracion === 'dominado').map((v) => v.programa_base_id)
    ),
    hrefAsignado: hrefPrograma,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Progreso del Alumno</h2>
      <ProgresoCurriculo niveles={niveles} fueraDelCurriculo={fueraDelCurriculo} />
    </div>
  )
}
