import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Panel } from '../../../ui'

function primerDiaDelMes() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

export default async function InicioAlumnoPage({
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

  const { count: programasActivos } = await supabase
    .from('programas_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('alumno_id', alumnoId)
    .in('tipo', ['aba_clasico', 'rft'])
    .neq('estado', 'pausado')

  const { count: conductaActivos } = await supabase
    .from('programas_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('alumno_id', alumnoId)
    .eq('tipo', 'conducta')
    .not('estado', 'in', '(dominado,pausado)')

  const { data: sesionesMes } = await supabase
    .from('sesiones_programadas')
    .select('estado')
    .eq('alumno_id', alumnoId)
    .gte('fecha_hora', primerDiaDelMes())

  const resumenSesiones = {
    asistio: (sesionesMes ?? []).filter((s) => s.estado === 'asistio').length,
    cancelada: (sesionesMes ?? []).filter((s) => s.estado === 'cancelada').length,
    no_asistio: (sesionesMes ?? []).filter((s) => s.estado === 'no_asistio').length,
  }

  const { data: proximaSesion } = await supabase
    .from('sesiones_programadas')
    .select('fecha_hora, terapeuta:terapeuta_id(nombre)')
    .eq('alumno_id', alumnoId)
    .eq('estado', 'programada')
    .gte('fecha_hora', new Date().toISOString())
    .order('fecha_hora', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: ultimoInforme } = await supabase
    .from('informes')
    .select('created_at, destinatario')
    .eq('alumno_id', alumnoId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: evaluaciones } = await supabase
    .from('evaluaciones_iniciales')
    .select('programa_base_id, programas_base(tipo)')
    .eq('alumno_id', alumnoId)

  const evaluadosAba = (evaluaciones ?? []).filter((e) => e.programas_base?.tipo === 'aba_clasico').length
  const evaluadosRft = (evaluaciones ?? []).filter((e) => e.programas_base?.tipo === 'rft').length

  const { count: programasDominados } = await supabase
    .from('programas_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('alumno_id', alumnoId)
    .in('estado', ['dominado', 'mantenimiento'])

  const { count: preferenciasRegistradas } = await supabase
    .from('preferencias_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('alumno_id', alumnoId)
  const terapeutaProximaSesion = proximaSesion?.terapeuta as { nombre: string } | null | undefined
    return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Inicio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href={`/dashboard/alumnos/${alumnoId}/pei`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-3xl font-bold text-indigo-600">{programasActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Programas activos en el PEI</p>
        </Link>

        <Link href={`/dashboard/alumnos/${alumnoId}/conducta`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-amber-50/30">
          <p className="text-3xl font-bold text-amber-600">{conductaActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Registros de conducta activos</p>
        </Link>

        <Panel className="p-5">
          <p className="text-sm font-semibold text-slate-700 mb-2">Sesiones este mes</p>
          <div className="flex gap-4 text-sm">
            <span className="text-emerald-700">✓ {resumenSesiones.asistio} asistidas</span>
            <span className="text-amber-600">{resumenSesiones.cancelada} canceladas</span>
            <span className="text-rose-600">{resumenSesiones.no_asistio} no asistió</span>
          </div>
        </Panel>

        <Panel className="p-5">
          <p className="text-sm font-semibold text-slate-700 mb-1">Próxima sesión</p>
          {proximaSesion ? (
            <p className="text-sm text-slate-600">
              {new Date(proximaSesion.fecha_hora).toLocaleString('es-ES', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {terapeutaProximaSesion?.nombre && ` · ${terapeutaProximaSesion.nombre}`}
            </p>
          ) : (
            <p className="text-sm text-slate-500">Sin sesiones programadas</p>
          )}
        </Panel>

        <Link href={`/dashboard/alumnos/${alumnoId}/informes`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-sm font-semibold text-slate-700 mb-1">Último informe</p>
          {ultimoInforme ? (
            <p className="text-sm text-slate-600">
              {new Date(ultimoInforme.created_at).toLocaleDateString('es-ES')}
              {' · '}
              {ultimoInforme.destinatario === 'familia' ? 'Para la familia' : 'Formal'}
            </p>
          ) : (
            <p className="text-sm text-slate-500">Sin informes todavía</p>
          )}
        </Link>

        <Link href={`/dashboard/alumnos/${alumnoId}/valoracion`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-sm font-semibold text-slate-700 mb-1">Evaluación inicial</p>
          <p className="text-sm text-slate-600">
            {evaluadosAba} programa{evaluadosAba !== 1 ? 's' : ''} ABA · {evaluadosRft} RFT evaluados
          </p>
        </Link>

        <Link href={`/dashboard/alumnos/${alumnoId}/progreso`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-emerald-50/30">
          <p className="text-3xl font-bold text-emerald-700">{programasDominados ?? 0}</p>
          <p className="text-sm text-slate-500">Programas dominados o en mantenimiento</p>
        </Link>

        <Link href={`/dashboard/alumnos/${alumnoId}/preferencias`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-sm font-semibold text-slate-700 mb-1">Preferencias</p>
          <p className="text-sm text-slate-600">
            {preferenciasRegistradas ?? 0} reforzador{preferenciasRegistradas === 1 ? '' : 'es'} registrado{preferenciasRegistradas === 1 ? '' : 's'}
          </p>
        </Link>

        <Link href={`/dashboard/alumnos/${alumnoId}/datos-clinicos`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-sm font-semibold text-slate-700 mb-1">Datos clínicos</p>
          <p className="text-sm text-slate-600">Diagnóstico, contacto de emergencia y notas clínicas</p>
        </Link>
      </div>
    </div>
  )
}