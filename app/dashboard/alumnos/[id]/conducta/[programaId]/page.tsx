import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AbcClient from './abc-client'
import TasaClient from './tasa-client'
import DuracionClient from './duracion-client'
import IntervaloClient from './intervalo-client'
import LatenciaClient from './latencia-client'
import GraficoConducta from './grafico-conducta'
import EstadoProgramaSelector from '../../../../programas/[id]/estado-programa-selector'
import { Panel } from '../../../../../ui'

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

    const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tasa_por_minuto: number } => b.tasa_por_minuto !== null && ['linea_base', 'intervencion'].includes(b.fase))
    const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.tasa_por_minuto, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <Panel className="p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="Ocurrencias/min"
            direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null}
            titulo={programa.nombre}
          />
        </Panel>
        <TasaClient programaAlumnoId={programaId} bloquesIniciales={bloquesValidos} />
      </div>
    )
  }
    if (programa.formato_recogida === 'duracion') {
    const { data: bloques } = await supabase
      .from('bloques_duracion')
      .select('id, fecha, fase, duracion_sesion_segundos, numero_episodios, duracion_total_conducta_segundos, porcentaje, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase))
    const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <Panel className="p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="% del tiempo"
            direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null}
            titulo={programa.nombre}
            dominioYFijo={[0, 100]}
          />
        </Panel>
        <DuracionClient programaAlumnoId={programaId} bloquesIniciales={bloquesValidos} />
      </div>
    )
  }

  if (programa.formato_recogida === 'intervalo') {
    const { data: bloques } = await supabase
      .from('bloques_intervalo')
      .select('id, fecha, fase, tipo_intervalo, duracion_intervalo_segundos, total_intervalos, intervalos_con_conducta, porcentaje, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tipo_intervalo: 'parcial' | 'total' | 'momentaneo'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase) && ['parcial', 'total', 'momentaneo'].includes(b.tipo_intervalo))
    const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <Panel className="p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="% de intervalos"
            direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null}
            titulo={programa.nombre}
            dominioYFijo={[0, 100]}
          />
        </Panel>
        <IntervaloClient programaAlumnoId={programaId} bloquesIniciales={bloquesValidos} />
      </div>
    )
  }

  if (programa.formato_recogida === 'latencia') {
    const { data: bloques } = await supabase
      .from('bloques_latencia')
      .select('id, fecha, fase, numero_ensayos, latencia_total_segundos, latencia_media_segundos, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; latencia_media_segundos: number } => b.latencia_media_segundos !== null && ['linea_base', 'intervencion'].includes(b.fase))
    const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.latencia_media_segundos, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <Panel className="p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="Latencia media (s)"
            direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null}
            titulo={programa.nombre}
          />
        </Panel>
        <LatenciaClient programaAlumnoId={programaId} bloquesIniciales={bloquesValidos} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      {cabecera}
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        La toma de datos para "{programa.formato_recogida}" está en construcción.
      </p>
    </div>
  )
}