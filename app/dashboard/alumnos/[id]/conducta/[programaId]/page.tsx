import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AbcClient from './abc-client'
import TasaClient from './tasa-client'
import DuracionClient from './duracion-client'
import EstadoProgramaSelector from '../../../../programas/[id]/estado-programa-selector'

export default async function ProgramaConductaPage({
  params,
}: {
  params: Promise<{ id: string; programaId: string }>
}) {
  const { id: alumnoId, programaId } = await params
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

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, formato_recogida, direccion_objetivo, estado, objetivo, alumno_id')
    .eq('id', programaId)
    .single()

  if (!programa || programa.tipo !== 'conducta' || programa.alumno_id !== alumnoId) notFound()

    const cabecera = (
    <div>
      <Link href={`/dashboard/alumnos/${alumnoId}/conducta`} className="text-sm text-indigo-600 hover:underline">
        ← Volver a Registros de conducta
      </Link>
      <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>
      <div className="mt-1">
                <EstadoProgramaSelector
          programaAlumnoId={programa.id}
          alumnoId={alumnoId}
          estadoActual={programa.estado}
          variante="conducta"
        />
      </div>
      {programa.objetivo && <p className="text-sm text-slate-500 mt-1">{programa.objetivo}</p>}
    </div>
  )

  if (programa.formato_recogida === 'abc') {
    const { data: registros } = await supabase
      .from('registros_abc')
      .select('id, fecha_hora, antecedente, conducta, consecuencia, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha_hora', { ascending: false })

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <AbcClient programaAlumnoId={programaId} registrosIniciales={registros ?? []} />
      </div>
    )
  }

    if (programa.formato_recogida === 'tasa') {
    const { data: bloques } = await supabase
      .from('bloques_tasa')
      .select('id, fecha, fase, duracion_observacion_segundos, numero_ocurrencias, tasa_por_minuto, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <TasaClient programaAlumnoId={programaId} bloquesIniciales={bloques ?? []} />
      </div>
    )
  }

  if (programa.formato_recogida === 'duracion') {
    const { data: bloques } = await supabase
      .from('bloques_duracion')
      .select('id, fecha, fase, duracion_sesion_segundos, numero_episodios, duracion_total_conducta_segundos, porcentaje, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <DuracionClient programaAlumnoId={programaId} bloquesIniciales={bloques ?? []} />
      </div>
    )
  }

  // Intervalo se construye en la siguiente fase — de momento, un aviso
  // claro en vez de un error.
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      {cabecera}
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
        La toma de datos para "{programa.formato_recogida}" está en construcción.
      </p>
    </div>
  )
}