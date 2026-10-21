import type { createClient } from '@/utils/supabase/server'
import { calcularProgreso } from './calcular-progreso'
import { cargarEstructuraCurriculo, type EstructuraCurriculo } from '../../../curriculo/estructura'

type Supabase = Awaited<ReturnType<typeof createClient>>

function hrefPrograma({ id, tipo }: { id: string; tipo: string }) {
  if (tipo === 'aba_clasico') return `/dashboard/programas/${id}`
  if (tipo === 'rft') return `/dashboard/programas-rft/${id}`
  return null
}

// Progreso por nivel/dominio de un alumno, visto por el personal de la
// clínica (incluye la valoración inicial). Lo usan la página de progreso, el
// PEI y las importaciones (para aplicar la secuencia del currículo).
export async function cargarProgresoAlumno(
  supabase: Supabase,
  alumno: { id: string; clinica_id: string | null },
  estructuraPrecargada?: EstructuraCurriculo
) {
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
      .eq('alumno_id', alumno.id),
    supabase.from('evaluaciones_iniciales').select('programa_base_id, valoracion').eq('alumno_id', alumno.id),
    estructuraPrecargada ?? cargarEstructuraCurriculo(supabase),
  ])

  return calcularProgreso({
    estructura,
    curriculo: curriculo ?? [],
    asignados: asignados ?? [],
    dominadoEnValoracion: new Set(
      (evaluados ?? []).filter((v) => v.valoracion === 'dominado').map((v) => v.programa_base_id)
    ),
    hrefAsignado: hrefPrograma,
  })
}
