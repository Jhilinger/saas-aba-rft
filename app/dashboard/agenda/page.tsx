import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AgendaClient from './agenda-client'

function hoyISO() {
  const d = new Date()
  const tz = d.getTimezoneOffset()
  const local = new Date(d.getTime() - tz * 60000)
  return local.toISOString().split('T')[0]
}

function lunesDeLaSemana(fechaISO: string) {
  const d = new Date(fechaISO + 'T12:00:00')
  const diaSemana = d.getDay()
  const offset = diaSemana === 0 ? -6 : 1 - diaSemana
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

function sumarDias(fechaISO: string, n: number) {
  const d = new Date(fechaISO + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string; vista?: string }>
}) {
  const { fecha: fechaParam, vista } = await searchParams
  const fechaRef = fechaParam || hoyISO()
  const lunes = lunesDeLaSemana(fechaRef)
  const domingo = sumarDias(lunes, 6)

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

  const esAdminOSuper = perfil.rol === 'clinica_admin' || perfil.rol === 'superadmin'
  const alumnoIds = alumnos.map((a) => a.id)
  const selectCampos =
    'id, fecha_hora, duracion_minutos, estado, cancelado_por, notas, confirmada_familia, alumno_id, terapeuta_id, serie_id, alumnos(nombre_anonimizado)' +
    (esAdminOSuper ? ', terapeuta:terapeuta_id(nombre)' : '')

  let queryConteo = supabase
    .from('sesiones_programadas')
    .select('id', { count: 'exact', head: true })
    .eq('estado', 'programada')
    .lt('fecha_hora', new Date().toISOString())
  queryConteo = esAdminOSuper ? queryConteo.in('alumno_id', alumnoIds) : queryConteo.eq('terapeuta_id', perfil!.id)

  const { count: pendientesCount } = await queryConteo

  let sesiones: any[] = []

  if (vista === 'pendientes') {
    let q = supabase
      .from('sesiones_programadas')
      .select(selectCampos)
      .eq('estado', 'programada')
      .lt('fecha_hora', new Date().toISOString())
      .order('fecha_hora', { ascending: true })
      .limit(100)
    q = esAdminOSuper ? q.in('alumno_id', alumnoIds) : q.eq('terapeuta_id', perfil.id)
    const { data } = await q
    sesiones = data ?? []
  } else {
    const inicio = new Date(lunes + 'T00:00:00').toISOString()
    const fin = new Date(domingo + 'T23:59:59.999').toISOString()
    let q = supabase
      .from('sesiones_programadas')
      .select(selectCampos)
      .gte('fecha_hora', inicio)
      .lte('fecha_hora', fin)
      .order('fecha_hora', { ascending: true })
    q = esAdminOSuper ? q.in('alumno_id', alumnoIds) : q.eq('terapeuta_id', perfil.id)
    const { data } = await q
    sesiones = data ?? []
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Agenda</h1>

      <AgendaClient
        miPerfilId={perfil.id}
        miRol={perfil.rol}
        alumnos={alumnos}
        terapeutas={terapeutas}
        sesiones={sesiones}
        lunes={lunes}
        vista={vista === 'pendientes' ? 'pendientes' : 'semana'}
        pendientesCount={pendientesCount ?? 0}
      />
    </div>
  )
}