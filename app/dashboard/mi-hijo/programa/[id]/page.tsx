import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import Link from 'next/link'
import EvolucionChart from '../../../programas/[id]/evolucion-chart'
import { obtenerEvolucionAba } from '../../../programas/[id]/evolucion-actions'
import DistribucionAyudasChart from '../../../distribucion-ayudas-chart'
import SondasLista from '../../../sondas-lista'
import NuevaObservacionForm from './nueva-observacion-form'
import HistorialObservaciones from './historial-observaciones'
import AbcClient from '../../../alumnos/[id]/conducta/[programaId]/abc-client'
import TasaClient from '../../../alumnos/[id]/conducta/[programaId]/tasa-client'
import DuracionClient from '../../../alumnos/[id]/conducta/[programaId]/duracion-client'
import IntervaloClient from '../../../alumnos/[id]/conducta/[programaId]/intervalo-client'
import LatenciaClient from '../../../alumnos/[id]/conducta/[programaId]/latencia-client'
import GraficoConducta from '../../../alumnos/[id]/conducta/[programaId]/grafico-conducta'
import type { Tables } from '@/database.types'
import { Panel } from '../../../../ui'

type ProgramaConAlumno = Pick<
  Tables<'programas_alumno'>,
  'id' | 'nombre' | 'tipo' | 'alumno_id' | 'porcentaje_dominio' | 'formato_recogida' | 'direccion_objetivo' | 'direccion_cadena'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

const ETIQUETA_ESTADO_PASO: Record<string, string> = {
  linea_base: 'Línea base',
  adquisicion: 'En enseñanza',
  mantenimiento: 'Mantenimiento',
  dominado: 'Dominado',
  pausado: 'Pausado',
}

type ConjuntoConEstimulos = Pick<Tables<'conjuntos_estimulos_alumno'>, 'id' | 'nombre'> & {
  estimulos_alumno: Pick<Tables<'estimulos_alumno'>, 'nombre'>[]
}

export default async function ProgramaFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, alumno_id, porcentaje_dominio, formato_recogida, direccion_objetivo, direccion_cadena, alumnos(nombre_anonimizado)')
    .eq('id', id)
    .single()

  if (!programa) notFound()

  if (programa.tipo !== 'aba_clasico') redirect('/dashboard/mi-hijo')

  const { data: vinculo } = await supabase
    .from('alumno_familia')
    .select('alumno_id')
    .eq('alumno_id', programa.alumno_id)
    .eq('perfil_id', user.id)
    .maybeSingle()

  if (!vinculo) redirect('/dashboard/mi-hijo')

  const alumnoNombre = (programa as unknown as ProgramaConAlumno).alumnos?.nombre_anonimizado ?? ''

  if (programa.formato_recogida !== 'ensayo_discreto') {
    const cabecera = (
      <>
        <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
          ← Volver a Progreso
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>
      </>
    )

    let cuerpo: ReactNode = null

    if (programa.formato_recogida === 'abc') {
      const { data: registros } = await supabase
        .from('registros_abc')
        .select('id, fecha_hora, antecedente, conducta, consecuencia, notas')
        .eq('programa_alumno_id', id)
        .order('fecha_hora', { ascending: false })
      cuerpo = <AbcClient programaAlumnoId={id} registrosIniciales={registros ?? []} alumnoId={programa.alumno_id} />
    } else if (programa.formato_recogida === 'tasa') {
      const { data: bloques } = await supabase
        .from('bloques_tasa')
        .select('id, fecha, fase, duracion_observacion_segundos, numero_ocurrencias, tasa_por_minuto, notas')
        .eq('programa_alumno_id', id)
        .order('fecha', { ascending: false })
      const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tasa_por_minuto: number } => b.tasa_por_minuto !== null && ['linea_base', 'intervencion'].includes(b.fase))
      const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.tasa_por_minuto, fase: b.fase }))
      cuerpo = (
        <>
          <Panel className="p-3 sm:p-5">
            <GraficoConducta puntos={puntos} etiquetaY="Ocurrencias/min" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} />
          </Panel>
          <TasaClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
        </>
      )
    } else if (programa.formato_recogida === 'duracion') {
      const { data: bloques } = await supabase
        .from('bloques_duracion')
        .select('id, fecha, fase, duracion_sesion_segundos, numero_episodios, duracion_total_conducta_segundos, porcentaje, notas')
        .eq('programa_alumno_id', id)
        .order('fecha', { ascending: false })
      const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase))
      const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))
      cuerpo = (
        <>
          <Panel className="p-3 sm:p-5">
            <GraficoConducta puntos={puntos} etiquetaY="% del tiempo" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} dominioYFijo={[0, 100]} />
          </Panel>
          <DuracionClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
        </>
      )
    } else if (programa.formato_recogida === 'intervalo') {
      const { data: bloques } = await supabase
        .from('bloques_intervalo')
        .select('id, fecha, fase, tipo_intervalo, duracion_intervalo_segundos, total_intervalos, intervalos_con_conducta, porcentaje, notas')
        .eq('programa_alumno_id', id)
        .order('fecha', { ascending: false })
      const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tipo_intervalo: 'parcial' | 'total' | 'momentaneo'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase) && ['parcial', 'total', 'momentaneo'].includes(b.tipo_intervalo))
      const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))
      cuerpo = (
        <>
          <Panel className="p-3 sm:p-5">
            <GraficoConducta puntos={puntos} etiquetaY="% de intervalos" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} dominioYFijo={[0, 100]} />
          </Panel>
          <IntervaloClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
        </>
      )
    } else if (programa.formato_recogida === 'latencia') {
      const { data: bloques } = await supabase
        .from('bloques_latencia')
        .select('id, fecha, fase, numero_ensayos, latencia_total_segundos, latencia_media_segundos, notas')
        .eq('programa_alumno_id', id)
        .order('fecha', { ascending: false })
      const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; latencia_media_segundos: number } => b.latencia_media_segundos !== null && ['linea_base', 'intervencion'].includes(b.fase))
      const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.latencia_media_segundos, fase: b.fase }))
      cuerpo = (
        <>
          <Panel className="p-3 sm:p-5">
            <GraficoConducta puntos={puntos} etiquetaY="Latencia media (s)" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} />
          </Panel>
          <LatenciaClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
        </>
      )
    } else if (programa.formato_recogida === 'analisis_tareas') {
      const { data: pasos } = await supabase
        .from('pasos_tarea_alumno')
        .select('id, nombre, descripcion, orden, estado')
        .eq('programa_alumno_id', id)
        .order('orden')

      const { data: bloques } = await supabase
        .from('bloques_analisis_tareas')
        .select('id, fecha, notas, resultados_paso_bloque(independiente)')
        .eq('programa_alumno_id', id)
        .order('fecha', { ascending: false })

      const bloquesResumen = (bloques ?? []).map((b) => ({
        id: b.id,
        fecha: b.fecha,
        notas: b.notas,
        total: b.resultados_paso_bloque.length,
        independientes: b.resultados_paso_bloque.filter((r) => r.independiente).length,
      }))

      const puntos = [...bloquesResumen]
        .filter((b) => b.total > 0)
        .reverse()
        .map((b) => ({ fecha: b.fecha, valor: Math.round((b.independientes / b.total) * 100), fase: 'intervencion' as const }))

      cuerpo = (
        <>
          <Panel className="p-3 sm:p-5 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Pasos de la cadena</p>
            <div className="space-y-2">
              {(pasos ?? []).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Paso {p.orden}</span>{' '}
                    <span className="text-slate-800">{p.nombre}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{ETIQUETA_ESTADO_PASO[p.estado] ?? p.estado}</span>
                </div>
              ))}
              {(!pasos || pasos.length === 0) && <p className="text-sm text-slate-500 text-center py-2">Sin pasos todavía.</p>}
            </div>
          </Panel>
          <Panel className="p-3 sm:p-5">
            <GraficoConducta puntos={puntos} etiquetaY="% de pasos independientes" direccionObjetivo="aumentar" titulo={programa.nombre} dominioYFijo={[0, 100]} />
          </Panel>
          <Panel className="p-3 sm:p-5 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Historial de sondeos</p>
            <div className="space-y-2">
              {bloquesResumen.map((b) => (
                <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">{new Date(b.fecha).toLocaleDateString('es-ES')}</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {b.independientes}/{b.total} pasos ({b.total > 0 ? Math.round((b.independientes / b.total) * 100) : 0}%)
                    </span>
                  </div>
                  {b.notas && <p className="mt-1 text-xs text-slate-500">{b.notas}</p>}
                </div>
              ))}
              {bloquesResumen.length === 0 && <p className="text-center text-slate-500 py-4">Sin sondeos todavía.</p>}
            </div>
          </Panel>
        </>
      )
    }

    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
        {cabecera}
        {cuerpo}
      </div>
    )
  }

  const { conjuntos: datosEvolucion, distribucionAyudas, sondas } = await obtenerEvolucionAba(id)

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estimulos_alumno(nombre)')
    .eq('programa_alumno_id', id)
    .order('orden')

  const { data: misObservaciones } = await supabase
    .from('observaciones_familia')
    .select('id, texto, consiguio, fecha_evento, estado, respuesta_terapeuta')
    .eq('programa_alumno_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
      <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Progreso
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>

      <Panel className="p-3 sm:p-5">
        <EvolucionChart
          conjuntos={datosEvolucion}
          porcentajeDominio={programa.porcentaje_dominio}
          titulo={`${alumnoNombre} — ${programa.nombre}`}
          estimulosPorConjunto={((conjuntos ?? []) as unknown as ConjuntoConEstimulos[]).map((c) => ({
            id: c.id,
            nombre: c.nombre,
            estimulos: c.estimulos_alumno.map((e) => e.nombre),
          }))}
        />
      </Panel>
      <Panel className="p-3 sm:p-5">
        <DistribucionAyudasChart distribucion={distribucionAyudas} titulo="Distribución de ayudas" />
      </Panel>
      <Panel className="p-3 sm:p-5">
        <p className="mb-2 text-sm font-semibold text-slate-700">Sondas de generalización y mantenimiento</p>
        <SondasLista sondas={sondas} />
      </Panel>

      <Panel className="p-3 sm:p-5 space-y-4">
        <NuevaObservacionForm programaAlumnoId={id} />
        <HistorialObservaciones
          observaciones={(misObservaciones ?? []).map((o) => ({
            id: o.id,
            texto: o.texto,
            consiguio: o.consiguio,
            fechaEvento: o.fecha_evento,
            estado: o.estado as 'pendiente' | 'confirmada' | 'descartada',
            respuestaTerapeuta: o.respuesta_terapeuta,
          }))}
        />
      </Panel>
    </div>
  )
}