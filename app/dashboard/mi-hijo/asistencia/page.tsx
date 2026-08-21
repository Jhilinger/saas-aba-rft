import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ConfirmarAsistencia from '../confirmar-asistencia'
import HistorialAsistencia from '../historial-asistencia'

export default async function AsistenciaFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-400 py-8">Sin alumnos vinculados todavía.</p>
  }

  const alumnoIds = alumnos.map((a: any) => a.id)

  const { data: sesionesPendientes } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora, estado, cancelado_por, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .neq('estado', 'programada')
    .eq('confirmada_familia', false)
    .order('fecha_hora', { ascending: false })

  const pendientesFormateadas = (sesionesPendientes ?? []).map((s: any) => ({
    id: s.id,
    fecha_hora: s.fecha_hora,
    estado: s.estado,
    cancelado_por: s.cancelado_por,
    alumno_nombre: s.alumnos?.nombre_anonimizado ?? '—',
  }))

  const { data: historial } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora, estado, cancelado_por, confirmada_familia, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .order('fecha_hora', { ascending: false })
    .limit(50)

  const historialFormateado = (historial ?? []).map((s: any) => ({
    id: s.id,
    fecha_hora: s.fecha_hora,
    estado: s.estado,
    cancelado_por: s.cancelado_por,
    confirmada_familia: s.confirmada_familia,
    alumno_nombre: s.alumnos?.nombre_anonimizado ?? '—',
  }))

  return (
    <div className="space-y-6">
      <ConfirmarAsistencia sesionesIniciales={pendientesFormateadas} />
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
        <HistorialAsistencia sesiones={historialFormateado} />
      </div>
    </div>
  )
}