import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ConfirmarAsistencia from '../confirmar-asistencia'
import HistorialAsistencia from '../historial-asistencia'
import type { Tables } from '@/database.types'

type VinculoAlumno = {
  alumnos: Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado'> | null
}

type SesionPendiente = Pick<Tables<'sesiones_programadas'>, 'id' | 'fecha_hora' | 'cancelado_por'> & {
  estado: Exclude<Tables<'sesiones_programadas'>['estado'], 'programada'>
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

type SesionHistorial = Pick<
  Tables<'sesiones_programadas'>,
  'id' | 'fecha_hora' | 'estado' | 'cancelado_por' | 'confirmada_familia'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

export default async function AsistenciaFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado)')
    .eq('perfil_id', user.id)

  const alumnos = ((vinculos ?? []) as unknown as VinculoAlumno[])
    .map((v) => v.alumnos)
    .filter((a): a is Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado'> => Boolean(a))

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-400 py-8">Sin alumnos vinculados todavía.</p>
  }

  const alumnoIds = alumnos.map((a) => a.id)

  const { data: sesionesPendientes } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora, estado, cancelado_por, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .neq('estado', 'programada')
    .eq('confirmada_familia', false)
    .order('fecha_hora', { ascending: false })

  const pendientesFormateadas = ((sesionesPendientes ?? []) as unknown as SesionPendiente[]).map((s) => ({
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

  const historialFormateado = ((historial ?? []) as unknown as SesionHistorial[]).map((s) => ({
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