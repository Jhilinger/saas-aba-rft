import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProgresoTabla from './progreso-tabla'

function simplificar(estado: string | null): 'dominado' | 'adquisicion' | 'sin_ensenar' {
  if (!estado) return 'sin_ensenar'
  if (estado === 'dominado' || estado === 'mantenimiento') return 'dominado'
  return 'adquisicion'
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

  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const { data: curriculo } = await supabase
    .from('programas_base')
    .select('id, nombre, tipo, area, orden')
    .eq('activo', true)
    .order('orden', { ascending: true, nullsFirst: false })

  const { data: importados } = await supabase
    .from('programas_alumno')
    .select('programa_base_id, estado')
    .eq('alumno_id', alumnoId)
    .not('programa_base_id', 'is', null)

  const { data: evaluados } = await supabase
    .from('evaluaciones_iniciales')
    .select('programa_base_id, valoracion')
    .eq('alumno_id', alumnoId)

  const estadoPorBase = new Map((importados ?? []).map((p) => [p.programa_base_id, p.estado]))
  const valoracionPorBase = new Map((evaluados ?? []).map((v) => [v.programa_base_id, v.valoracion]))

  const filas = (curriculo ?? []).map((p) => {
    // Prioridad: si está importado al PEI, manda su estado real (es el
    // trabajo activo). Si no está importado pero la evaluación inicial ya
    // lo marcó como dominado, se considera dominado igualmente.
    const estadoImportado = estadoPorBase.get(p.id)
    let estado: 'dominado' | 'adquisicion' | 'sin_ensenar'

    if (estadoImportado) {
      estado = simplificar(estadoImportado)
    } else if (valoracionPorBase.get(p.id) === 'dominado') {
      estado = 'dominado'
    } else {
      estado = 'sin_ensenar'
    }

    return {
      id: p.id,
      nombre: p.nombre,
      tipo: p.tipo,
      area: p.area || 'General',
      orden: p.orden ?? 999999,
      estado,
    }
  })

    return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Progreso del Alumno</h2>
      <ProgresoTabla filas={filas} />
    </div>
  )
}