import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import NuevoConjuntoForm from './nuevo-conjunto-form'
import ConjuntoCard from './conjunto-card'
import EvolucionChart from './evolucion-chart'
import { obtenerEvolucionAba } from './evolucion-actions'
import DistribucionAyudasChart from '../../distribucion-ayudas-chart'
import SondasLista from '../../sondas-lista'
import ObservacionesPendientes from './observaciones-pendientes'
import ProgramaAbaTabs from './programa-aba-tabs'
import EstadoProgramaSelector from './estado-programa-selector'
import VideoDiferido from '../../video-diferido'
import AbcClient from '../../alumnos/[id]/conducta/[programaId]/abc-client'
import TasaClient from '../../alumnos/[id]/conducta/[programaId]/tasa-client'
import DuracionClient from '../../alumnos/[id]/conducta/[programaId]/duracion-client'
import IntervaloClient from '../../alumnos/[id]/conducta/[programaId]/intervalo-client'
import LatenciaClient from '../../alumnos/[id]/conducta/[programaId]/latencia-client'
import GraficoConducta from '../../alumnos/[id]/conducta/[programaId]/grafico-conducta'
import PasosTareaPanel from './pasos-tarea-panel'
import AnalisisTareasClient from './analisis-tareas-client'
import ToggleVisibleFamilia from './toggle-visible-familia'
import { Breadcrumb, Panel } from '../../../ui'
import type { Tables } from '@/database.types'

export default async function ProgramaAlumnoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
    .select(
      'id, nombre, tipo, estado, alumno_id, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, formato_recogida, direccion_objetivo, direccion_cadena, visible_familia, alumnos(nombre_anonimizado), programas_base(video_url)'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()

  if (programa.tipo !== 'aba_clasico') redirect(`/dashboard/alumnos/${programa.alumno_id}`)

  const alumno = programa.alumnos as unknown as Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
  const programaBase = programa.programas_base as unknown as Pick<Tables<'programas_base'>, 'video_url'> | null
  const alumnoNombre = alumno?.nombre_anonimizado ?? ''
  const tieneInfo =
    programa.objetivo || programa.materiales || programa.instrucciones_terapeuta || programa.ayudas_posibles

  const infoPanel = (
    <Panel className="space-y-3 p-4 text-sm sm:p-5">
      {programa.formato_recogida === 'ensayo_discreto' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-slate-500">Ensayos por bloque</span>
            <p className="text-slate-700">{programa.ensayos_por_bloque}</p>
          </div>
          <div>
            <span className="text-slate-500">Criterio de dominio</span>
            <p className="text-slate-700">
              {programa.bloques_para_dominio} bloques al {programa.porcentaje_dominio}%
            </p>
          </div>
        </div>
      )}

      {programa.objetivo && (
        <div>
          <span className="text-slate-500">Objetivo / habilidad</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo}</p>
        </div>
      )}
      {programa.materiales && (
        <div>
          <span className="text-slate-500">Materiales</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales}</p>
        </div>
      )}
      {programa.instrucciones_terapeuta && (
        <div>
          <span className="text-slate-500">Instrucciones para el terapeuta</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.instrucciones_terapeuta}</p>
        </div>
      )}
      {programa.ayudas_posibles && (
        <div>
          <span className="text-slate-500">Ayudas posibles</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.ayudas_posibles}</p>
        </div>
      )}
      {programaBase?.video_url && (
        <div>
          <span className="text-slate-500">Vídeo de ejemplo</span>
          <VideoDiferido url={programaBase.video_url} />
        </div>
      )}
      {!tieneInfo && (
        <p className="text-xs text-slate-500 italic">
          Este programa no tiene objetivo/materiales/instrucciones registrados (probablemente se
          importó antes de que añadiéramos esta información).
        </p>
      )}
    </Panel>
  )

  const cabecera = (
    <div>
      <Breadcrumb items={[{ label: 'Alumnos', href: '/dashboard/alumnos' }, { label: alumnoNombre, href: `/dashboard/alumnos/${programa.alumno_id}` }, { label: programa.nombre }]} />
      <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{programa.nombre}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {programa.area && <span>{programa.area}</span>}
        <EstadoProgramaSelector
          programaAlumnoId={programa.id}
          alumnoId={programa.alumno_id}
          estadoActual={programa.estado}
          variante={programa.formato_recogida === 'ensayo_discreto' ? 'habilidad' : 'conducta'}
        />
        {programa.formato_recogida !== 'ensayo_discreto' && (
          <ToggleVisibleFamilia
            programaAlumnoId={programa.id}
            alumnoId={programa.alumno_id}
            visibleFamilia={programa.visible_familia}
          />
        )}
      </div>
    </div>
  )

  if (programa.formato_recogida !== 'ensayo_discreto') {
    const cuerpo = await (async () => {
      if (programa.formato_recogida === 'abc') {
        const { data: registros } = await supabase
          .from('registros_abc')
          .select('id, fecha_hora, antecedente, conducta, consecuencia, notas')
          .eq('programa_alumno_id', id)
          .order('fecha_hora', { ascending: false })
        return <AbcClient programaAlumnoId={id} registrosIniciales={registros ?? []} alumnoId={programa.alumno_id} />
      }

      if (programa.formato_recogida === 'tasa') {
        const { data: bloques } = await supabase
          .from('bloques_tasa')
          .select('id, fecha, fase, duracion_observacion_segundos, numero_ocurrencias, tasa_por_minuto, notas')
          .eq('programa_alumno_id', id)
          .order('fecha', { ascending: false })
        const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tasa_por_minuto: number } => b.tasa_por_minuto !== null && ['linea_base', 'intervencion'].includes(b.fase))
        const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.tasa_por_minuto, fase: b.fase }))
        return (
          <>
            <Panel className="p-3 sm:p-5">
              <GraficoConducta puntos={puntos} etiquetaY="Ocurrencias/min" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} />
            </Panel>
            <TasaClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
          </>
        )
      }

      if (programa.formato_recogida === 'duracion') {
        const { data: bloques } = await supabase
          .from('bloques_duracion')
          .select('id, fecha, fase, duracion_sesion_segundos, numero_episodios, duracion_total_conducta_segundos, porcentaje, notas')
          .eq('programa_alumno_id', id)
          .order('fecha', { ascending: false })
        const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase))
        const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))
        return (
          <>
            <Panel className="p-3 sm:p-5">
              <GraficoConducta puntos={puntos} etiquetaY="% del tiempo" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} dominioYFijo={[0, 100]} />
            </Panel>
            <DuracionClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
          </>
        )
      }

      if (programa.formato_recogida === 'intervalo') {
        const { data: bloques } = await supabase
          .from('bloques_intervalo')
          .select('id, fecha, fase, tipo_intervalo, duracion_intervalo_segundos, total_intervalos, intervalos_con_conducta, porcentaje, notas')
          .eq('programa_alumno_id', id)
          .order('fecha', { ascending: false })
        const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; tipo_intervalo: 'parcial' | 'total' | 'momentaneo'; porcentaje: number } => b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase) && ['parcial', 'total', 'momentaneo'].includes(b.tipo_intervalo))
        const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))
        return (
          <>
            <Panel className="p-3 sm:p-5">
              <GraficoConducta puntos={puntos} etiquetaY="% de intervalos" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} dominioYFijo={[0, 100]} />
            </Panel>
            <IntervaloClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
          </>
        )
      }

      if (programa.formato_recogida === 'latencia') {
        const { data: bloques } = await supabase
          .from('bloques_latencia')
          .select('id, fecha, fase, numero_ensayos, latencia_total_segundos, latencia_media_segundos, notas')
          .eq('programa_alumno_id', id)
          .order('fecha', { ascending: false })
        const bloquesValidos = (bloques ?? []).filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; latencia_media_segundos: number } => b.latencia_media_segundos !== null && ['linea_base', 'intervencion'].includes(b.fase))
        const puntos = bloquesValidos.map((b) => ({ fecha: b.fecha, valor: b.latencia_media_segundos, fase: b.fase }))
        return (
          <>
            <Panel className="p-3 sm:p-5">
              <GraficoConducta puntos={puntos} etiquetaY="Latencia media (s)" direccionObjetivo={programa.direccion_objetivo as 'aumentar' | 'reducir' | null} titulo={programa.nombre} />
            </Panel>
            <LatenciaClient programaAlumnoId={id} bloquesIniciales={bloquesValidos} alumnoId={programa.alumno_id} />
          </>
        )
      }

      if (programa.formato_recogida === 'analisis_tareas') {
        const { data: pasos } = await supabase
          .from('pasos_tarea_alumno')
          .select('id, nombre, descripcion, orden, estado')
          .eq('programa_alumno_id', id)
          .order('orden')

        const pasosOrdenados = pasos ?? []
        const pasoObjetivo =
          programa.direccion_cadena === 'atras'
            ? [...pasosOrdenados].reverse().find((p) => p.estado !== 'dominado')
            : pasosOrdenados.find((p) => p.estado !== 'dominado')

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

        return (
          <>
            <PasosTareaPanel pasos={pasosOrdenados} programaAlumnoId={id} pasoObjetivoId={pasoObjetivo?.id ?? null} />
            <Panel className="p-3 sm:p-5">
              <GraficoConducta puntos={puntos} etiquetaY="% de pasos independientes" direccionObjetivo="aumentar" titulo={programa.nombre} dominioYFijo={[0, 100]} />
            </Panel>
            <AnalisisTareasClient
              programaAlumnoId={id}
              pasos={pasosOrdenados.map((p) => ({ id: p.id, nombre: p.nombre, orden: p.orden }))}
              bloquesIniciales={bloquesResumen}
            />
          </>
        )
      }

      return null
    })()

    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
        {cabecera}
        {infoPanel}
        {cuerpo}
      </div>
    )
  }

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estado, estimulos_alumno(id, nombre, descripcion)')
    .eq('programa_alumno_id', id)
    .order('orden')

  const { conjuntos: datosEvolucion, distribucionAyudas, sondas } = await obtenerEvolucionAba(id)

  const { data: observacionesPendientes } = await supabase
    .from('observaciones_familia')
    .select('id, texto, consiguio, fecha_evento, created_at, perfiles!observaciones_familia_perfil_id_fkey(nombre)')
    .eq('programa_alumno_id', id)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })

  const enLineaBase = (conjuntos ?? []).filter((c) => c.estado === 'linea_base')
  const enAdquisicion = (conjuntos ?? []).filter((c) => c.estado !== 'dominado' && c.estado !== 'linea_base')
  const dominados = (conjuntos ?? []).filter((c) => c.estado === 'dominado')

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {cabecera}
      {infoPanel}
      {observacionesPendientes && observacionesPendientes.length > 0 && (
        <ObservacionesPendientes
          observaciones={observacionesPendientes.map((o) => ({
            id: o.id,
            texto: o.texto,
            consiguio: o.consiguio,
            fechaEvento: o.fecha_evento,
            autorNombre: o.perfiles?.nombre ?? 'Familia',
          }))}
          conjuntosElegibles={(conjuntos ?? [])
            .filter((c) => c.estado === 'dominado' || c.estado === 'mantenimiento')
            .map((c) => ({ id: c.id, nombre: c.nombre }))}
          programaAlumnoId={id}
          alumnoId={programa.alumno_id}
        />
      )}
      <ProgramaAbaTabs
       evolucion={
          <div className="space-y-4">
            <Panel className="p-3 sm:p-5">
              <EvolucionChart
                conjuntos={datosEvolucion}
                porcentajeDominio={programa.porcentaje_dominio}
                titulo={`${alumnoNombre} — ${programa.nombre}`}
                estimulosPorConjunto={(conjuntos ?? []).map((c) => ({
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
          </div>
        }
        conjuntos={
          <section className="space-y-6">
            <NuevoConjuntoForm programaAlumnoId={id} />

            {enLineaBase.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-sky-700">
                  Línea base ({enLineaBase.length})
                </h2>
                <div className="space-y-4">
                  {enLineaBase.map((c) => (
                    <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id}/>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">
                En adquisición ({enAdquisicion.length})
              </h2>
              <div className="space-y-4">
                {enAdquisicion.map((c) => (
                  <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id} />
                ))}
                {enAdquisicion.length === 0 && (
                  <p className="text-sm text-slate-500">Sin conjuntos en adquisición.</p>
                )}
              </div>
            </div>

            {dominados.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-emerald-700">
                  Dominados ({dominados.length})
                </h2>
                <div className="space-y-4">
                  {dominados.map((c) => (
                    <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id} />
                  ))}
                </div>
              </div>
            )}

            {(!conjuntos || conjuntos.length === 0) && (
              <p className="text-center text-slate-500">Sin conjuntos de estímulos todavía.</p>
            )}
          </section>
        }
      />
    </div>
  )
}