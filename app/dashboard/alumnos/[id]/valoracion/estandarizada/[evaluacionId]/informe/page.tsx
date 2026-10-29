import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cargarItems, cargarRespuestas } from '../../cargar'
import { estadoEntrenamiento, ordenarItems, type RespuestaEvaluacion } from '../../logica'
import { porcentaje, resumirPorDominio, resumirPorNivel, type ResumenDominio } from '../../resumen'
import { Panel } from '../../../../../../../ui'
import BotonImprimir from './boton-imprimir'

function edadEnFecha(nacimiento: string, fecha: string) {
  const n = new Date(nacimiento)
  const f = new Date(fecha)
  let meses = (f.getFullYear() - n.getFullYear()) * 12 + f.getMonth() - n.getMonth()
  if (f.getDate() < n.getDate()) meses--
  return `${Math.floor(meses / 12)} años y ${meses % 12} meses`
}

function textoPuntuacion(r: RespuestaEvaluacion | undefined) {
  if (!r) return '—'
  if (r.puntuacion !== null) return String(r.puntuacion)
  if (r.noAplicado === 'techo') return '0 (techo)'
  if (r.noAplicado === 'requisito') return '0 (sin requisito)'
  if (r.noAplicado === 'no_procede') return 'No procede'
  return '—'
}

function Barra({ valor }: { valor: number | null }) {
  return (
    <span className="block h-2 w-full rounded-full bg-slate-100 print:border print:border-slate-300">
      {valor !== null && <span className="block h-2 rounded-full bg-indigo-500" style={{ width: `${valor}%` }} />}
    </span>
  )
}

export default async function InformeEvaluacionPage({ params }: { params: Promise<{ id: string; evaluacionId: string }> }) {
  const { id: alumnoId, evaluacionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: evaluacion }, { data: alumno }] = await Promise.all([
    supabase
      .from('evaluaciones')
      .select('id, alumno_id, estado, modalidad, nivel_inicio, iniciada_at, finalizada_at, perfiles(nombre)')
      .eq('id', evaluacionId)
      .single(),
    supabase.from('alumnos').select('nombre_anonimizado, fecha_nacimiento').eq('id', alumnoId).single(),
  ])
  if (!evaluacion || !alumno || evaluacion.alumno_id !== alumnoId) notFound()

  // Evaluación finalizada anterior, para comparar
  const { data: anteriores } = await supabase
    .from('evaluaciones')
    .select('id, iniciada_at')
    .eq('alumno_id', alumnoId)
    .eq('estado', 'finalizada')
    .lt('iniciada_at', evaluacion.iniciada_at)
    .order('iniciada_at', { ascending: false })
    .limit(1)
  const anterior = anteriores?.[0] ?? null

  const [items, respuestas, respuestasAnteriores] = await Promise.all([
    cargarItems(supabase),
    cargarRespuestas(supabase, evaluacionId),
    anterior ? cargarRespuestas(supabase, anterior.id) : Promise.resolve([]),
  ])
  const mapa = new Map(respuestas.map((r) => [r.itemId, r]))
  const dominios = resumirPorDominio(items, mapa)
  const niveles = resumirPorNivel(dominios)
  const previos = new Map(
    anterior ? resumirPorDominio(items, new Map(respuestasAnteriores.map((r) => [r.itemId, r]))).map((d) => [d.dominioId, d]) : []
  )
  const ordenados = ordenarItems(items.filter((i) => i.tipo === 'item'))
  const relacionales = ordenados.filter((i) => i.relacional && mapa.has(i.id))
  const informados = respuestas.filter((r) => r.fuente === 'informado' && items.find((i) => i.id === r.itemId)?.tipo === 'item').length
  const fecha = (f: string) => new Date(f).toLocaleDateString('es-ES')

  const filaDominio = (d: ResumenDominio) => {
    const pct = porcentaje(d)
    const previo = previos.get(d.dominioId)
    const pctPrevio = previo ? porcentaje(previo) : null
    return (
      <tr key={d.dominioId} className="border-t border-slate-100">
        <td className="py-1.5 pr-2 text-slate-700">
          {d.codigo} {d.nombre}
        </td>
        <td className="w-32 py-1.5 pr-2">{d.maximo > 0 ? <Barra valor={pct} /> : <span className="text-xs text-slate-400">No evaluado</span>}</td>
        <td className="py-1.5 pr-2 text-right tabular-nums text-slate-700">{d.maximo > 0 ? `${d.obtenidos}/${d.maximo}` : ''}</td>
        <td className="py-1.5 pr-2 text-right tabular-nums font-medium text-slate-800">{pct !== null ? `${pct} %` : ''}</td>
        {anterior && (
          <td className="py-1.5 text-right tabular-nums text-slate-500">
            {pctPrevio !== null ? `${pctPrevio} %` : '—'}
            {pct !== null && pctPrevio !== null && pct !== pctPrevio && (
              <span className={pct > pctPrevio ? 'text-emerald-600' : 'text-rose-600'}>
                {' '}
                ({pct > pctPrevio ? '+' : ''}
                {pct - pctPrevio})
              </span>
            )}
          </td>
        )}
      </tr>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Link
          href={`/dashboard/alumnos/${alumnoId}/valoracion/estandarizada/${evaluacionId}`}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Volver a la evaluación
        </Link>
        <BotonImprimir />
      </div>

      <Panel className="space-y-1 p-5 print:border-0 print:shadow-none">
        <h2 className="text-xl font-bold text-slate-800">Evaluación inicial estandarizada</h2>
        <p className="text-sm text-slate-600">
          {alumno.nombre_anonimizado} · {edadEnFecha(alumno.fecha_nacimiento, evaluacion.iniciada_at)} en la evaluación
        </p>
        <p className="text-sm text-slate-600">
          {fecha(evaluacion.iniciada_at)}
          {evaluacion.finalizada_at && fecha(evaluacion.finalizada_at) !== fecha(evaluacion.iniciada_at) && ` – ${fecha(evaluacion.finalizada_at)}`}
          {evaluacion.perfiles?.nombre && ` · Evaluador: ${evaluacion.perfiles.nombre}`} ·{' '}
          {evaluacion.modalidad === 'no_vocal' ? 'Sin lenguaje vocal' : 'Con lenguaje vocal'}
          {evaluacion.nivel_inicio !== null && ` · Inicio en el nivel ${evaluacion.nivel_inicio}`}
        </p>
        {evaluacion.estado !== 'finalizada' && (
          <p className="text-sm font-medium text-amber-700">Evaluación {evaluacion.estado === 'anulada' ? 'anulada' : 'en curso'}: resultados provisionales.</p>
        )}
      </Panel>

      <Panel className="space-y-4 p-5 print:border-0 print:shadow-none">
        <h3 className="font-semibold text-slate-800">Perfil por nivel y dominio</h3>
        {[...niveles].map(([nivel, resumen]) => {
          const pct = porcentaje(resumen)
          return (
            <div key={nivel} className="break-inside-avoid space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                Nivel {nivel}
                <span className="ml-2 font-normal text-slate-500">
                  {pct !== null ? `${resumen.obtenidos}/${resumen.maximo} puntos (${pct} %)` : 'No evaluado'}
                </span>
              </p>
              <table className="w-full text-sm">
                {anterior && (
                  <thead>
                    <tr className="text-xs text-slate-500">
                      <th colSpan={4} />
                      <th className="text-right font-normal">{fecha(anterior.iniciada_at)}</th>
                    </tr>
                  </thead>
                )}
                <tbody>{dominios.filter((d) => d.nivel === nivel).map(filaDominio)}</tbody>
              </table>
            </div>
          )
        })}
      </Panel>

      {relacionales.length > 0 && (
        <Panel className="space-y-2 p-5 print:border-0 print:shadow-none">
          <h3 className="font-semibold text-slate-800">Habilidades relacionales con estímulos nuevos</h3>
          <p className="text-xs text-slate-500">
            Ítems que enseñan relaciones con estímulos que el alumno no conocía y prueban las relaciones derivadas. Los
            indicadores describen el repertorio y no marcan programas.
          </p>
          <table className="w-full text-sm">
            <tbody>
              {relacionales.map((i) => {
                const r = mapa.get(i.id)
                const ent = estadoEntrenamiento(r?.ensayos ?? [])
                return (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="py-1.5 pr-2 font-mono text-xs text-indigo-600">{i.codigo}</td>
                    <td className="py-1.5 pr-2 text-slate-700">
                      {i.titulo}
                      {i.indicador && <span className="ml-1 text-xs text-slate-500">(indicador)</span>}
                    </td>
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {ent.superado === true
                        ? `Entrenamiento superado en el bloque ${ent.superadoEn}`
                        : ent.superado === false
                          ? 'No alcanza el criterio de entrenamiento'
                          : ''}
                    </td>
                    <td className="py-1.5 text-right font-medium text-slate-800">{textoPuntuacion(r)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      )}

      <Panel className="space-y-2 p-5 print:border-0 print:shadow-none">
        <h3 className="font-semibold text-slate-800">Detalle de ítems</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="pb-1 font-normal">Ítem</th>
              <th className="pb-1 font-normal">Test</th>
              <th className="pb-1 text-right font-normal">Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {ordenados
              .filter((i) => mapa.has(i.id))
              .map((i) => {
                const r = mapa.get(i.id)!
                const test = r.ensayos.filter((e) => e.fase === 'test')
                return (
                  <tr key={i.id} className="break-inside-avoid border-t border-slate-100 align-top">
                    <td className="py-1.5 pr-2 text-slate-700">
                      <span className="font-mono text-xs text-indigo-600">{i.codigo}</span> {i.titulo}
                      {r.fuente === 'informado' && <span className="ml-1 text-xs text-amber-700">(informado por la familia)</span>}
                      {r.notas && <span className="block text-xs text-slate-500">{r.notas}</span>}
                    </td>
                    <td className="py-1.5 pr-2 text-xs tabular-nums text-slate-500">
                      {test.length > 0 ? `${test.filter((e) => e.correcto).length}/${test.length}` : ''}
                    </td>
                    <td className="py-1.5 text-right font-medium text-slate-800">{textoPuntuacion(r)}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </Panel>

      <Panel className="space-y-1 p-5 text-xs text-slate-500 print:border-0 print:shadow-none">
        <p className="font-semibold text-slate-600">Notas sobre la interpretación</p>
        <p>
          Escala por ítem: 2 = adquirido, 1 = emergente o con ayuda, 0 = no adquirido. En cada dominio se dejó de aplicar
          tras dos ceros seguidos (techo); esos ítems y los que no cumplían su requisito cuentan como 0. Los dominios
          «No evaluado» quedaron fuera de la ruta por el nivel de inicio o por el rendimiento en el nivel anterior.
        </p>
        <p>
          La administración y la puntuación están estandarizadas, pero el instrumento aún no tiene baremos: los
          resultados describen un perfil de habilidades para planificar la intervención, no una medida de inteligencia
          ni una comparación con otros niños.
          {informados > 0 && ` ${informados} ítems se puntuaron con información de la familia.`}
        </p>
      </Panel>
    </div>
  )
}
