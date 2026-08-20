import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AgendaClient from './agenda-client'

export default async function AgendaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, clinica_id, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  const puedeGestionar =
    perfil &&
    (perfil.rol === 'superadmin' ||
      perfil.rol === 'terapeuta' ||
      (perfil.rol === 'clinica_admin' && true))

  if (!perfil || !puedeGestionar) redirect('/dashboard')

  let alumnos: any[] = []
  if (perfil.rol === 'clinica_admin' || perfil.rol === 'superadmin') {
    const { data } = await supabase
      .from('alumnos')
      .select('id, nombre_anonimizado')
      .eq('clinica_id', perfil.clinica_id)
      .eq('activo', true)
      .order('nombre_anonimizado')
    alumnos = data ?? []
  } else {
    const { data } = await supabase
      .from('alumno_terapeuta')
      .select('alumnos(id, nombre_anonimizado)')
      .eq('terapeuta_id', perfil.id)
    alumnos = (data ?? []).map((v: any) => v.alumnos).filter(Boolean)
  }

  let terapeutas: any[] = []
  if (perfil.rol === 'clinica_admin') {
    const { data } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .eq('clinica_id', perfil.clinica_id)
      .eq('rol', 'terapeuta')
      .eq('activo', true)
      .order('nombre')
    terapeutas = [{ id: perfil.id, nombre: `${perfil.nombre} (tú)` }, ...(data ?? [])]
  }

  let sesiones: any[] = []
  if (perfil.rol === 'clinica_admin' || perfil.rol === 'superadmin') {
    const { data } = await supabase
      .from('sesiones_programadas')
      .select('id, fecha_hora, duracion_minutos, estado, cancelado_por, notas, confirmada_familia, alumno_id, terapeuta_id, serie_id, alumnos(nombre_anonimizado), terapeuta:terapeuta_id(nombre)')
      .in('alumno_id', alumnos.map((a) => a.id))
      .order('fecha_hora', { ascending: true })
    sesiones = data ?? []
  } else {
    const { data } = await supabase
      .from('sesiones_programadas')
      .select('id, fecha_hora, duracion_minutos, estado, cancelado_por, notas, confirmada_familia, alumno_id, terapeuta_id, serie_id, alumnos(nombre_anonimizado)')
      .eq('terapeuta_id', perfil.id)
      .order('fecha_hora', { ascending: true })
    sesiones = data ?? []
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Agenda</h1>

      <AgendaClient
        miPerfilId={perfil.id}
        miRol={perfil.rol}
        alumnos={alumnos}
        terapeutas={terapeutas}
        sesionesIniciales={sesiones}
      />
    </div>
  )
}