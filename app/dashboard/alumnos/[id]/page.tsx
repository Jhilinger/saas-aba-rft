import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

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
    return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Inicio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href={`/dashboard/alumnos/${alumnoId}/pei`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
          <p className="text-3xl font-bold text-indigo-600">{programasActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Programas activos en el PEI</p>
        </Link>

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