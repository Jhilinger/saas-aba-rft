'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Panel } from '../../../../../../ui'
import { useToast } from '../../../../../../providers/toast-provider'
import PantallaAlumno from '../../estandarizada/[evaluacionId]/pantalla-alumno'
import { parsearGuion, pasosParaModalidad, type Paso } from '../../estandarizada/guion'
import { anularEntrevista, finalizarEntrevista, responder } from '../actions'
import { calcularEstado, ETIQUETA_RESPUESTA, preguntasDesde, respuestaSugerida, RESPUESTAS, type Respuesta, type Respuestas } from '../logica'
import { NOMBRE_DOMINIO, type Pregunta } from '../preguntas'
import { textoResultado } from '../resultado'

// «Comprobar ahora»: los primeros ensayos de test del ítem de tableta (sin el
// entrenamiento por bloques de la antigua evaluación)
const ENSAYOS_COMPROBAR = 4
function pasosComprobar(guion: unknown, modalidad: 'vocal' | 'no_vocal'): Paso[] {
  const pasos = pasosParaModalidad(parsearGuion(guion), modalidad)
  let tests = 0
  return pasos.filter((p) => {
    if (p.fase === 'entrenamiento') return false
    if (p.fase === 'test') return ++tests <= ENSAYOS_COMPROBAR
    return true
  })
}

const COLOR: Record<Respuesta, string> = {
  si: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  a_veces: 'border-amber-300 bg-amber-50 text-amber-800',
  no: 'border-rose-300 bg-rose-50 text-rose-800',
  no_se: 'border-slate-300 bg-slate-50 text-slate-700',
}

export default function EntrevistaClient({
  alumnoId,
  entrevistaId,
  cerrada,
  nivelSalto,
  modalidad,
  respuestasIniciales,
  notasIniciales,
  guiones,
  imagenes,
}: {
  alumnoId: string
  entrevistaId: string
  cerrada: boolean
  nivelSalto: number | null
  modalidad: 'vocal' | 'no_vocal'
  respuestasIniciales: Respuestas
  notasIniciales: string
  guiones: Record<string, unknown>
  imagenes: Record<string, string>
}) {
  const [respuestas, setRespuestas] = useState<Respuestas>(respuestasIniciales)
  const [notas, setNotas] = useState(notasIniciales)
  // Pregunta que se está cambiando (al tocar una ya contestada)
  const [cambiando, setCambiando] = useState<number | null>(null)
  const [comprobando, setComprobando] = useState<Pregunta | null>(null)
  const [sugerencia, setSugerencia] = useState<{ n: number; aciertos: number; total: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const estado = useMemo(() => calcularEstado(respuestas, nivelSalto), [respuestas, nivelSalto])
  const lista = useMemo(() => preguntasDesde(nivelSalto), [nivelSalto])
  const actual = cambiando !== null ? lista.find((p) => p.n === cambiando) ?? null : estado.siguiente

  const contestar = (p: Pregunta, r: Respuesta, comprobado?: { aciertos: number; total: number }) => {
    const anterior = respuestas
    const nuevas = { ...respuestas, [p.n]: { r, ...(comprobado ? { comprobado } : {}) } }
    setRespuestas(nuevas)
    setCambiando(null)
    setSugerencia(null)
    startTransition(async () => {
      const res = await responder(entrevistaId, p.n, r, comprobado)
      if ('error' in res && res.error) {
        toast(res.error, 'error')
        setRespuestas(anterior)
      }
    })
  }

  const finalizar = () =>
    startTransition(async () => {
      const res = await finalizarEntrevista(entrevistaId, notas)
      if ('error' in res && res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Entrevista guardada', 'exito')
      router.push(`/dashboard/alumnos/${alumnoId}/valoracion/entrevista`)
      router.refresh()
    })

  const anular = () => {
    if (!window.confirm('¿Anular esta entrevista? No se tendrá en cuenta.')) return
    startTransition(async () => {
      const res = await anularEntrevista(entrevistaId)
      if ('error' in res && res.error) toast(res.error, 'error')
      else router.push(`/dashboard/alumnos/${alumnoId}/valoracion/entrevista`)
    })
  }

  const resumen = textoResultado(estado.dominio, estado.lagunas, estado.pendientes)

  return (
    <div className="space-y-4">
      {comprobando && guiones[comprobando.item!] !== undefined && (
        <PantallaAlumno
          codigo={comprobando.item!}
          pasos={pasosComprobar(guiones[comprobando.item!], modalidad)}
          imagenes={imagenes}
          alCancelar={() => setComprobando(null)}
          alTerminar={(resultado) => {
            const tests = resultado.ensayos.filter((x) => x.fase === 'test' && !x.control)
            setSugerencia({ n: comprobando.n, aciertos: tests.filter((x) => x.correcto).length, total: tests.length })
            setComprobando(null)
          }}
        />
      )}

      <Panel className="space-y-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>
            {estado.contestadas} de {estado.total} preguntas{nivelSalto ? ` · desde el nivel ${nivelSalto}` : ''}
          </span>
          {!cerrada && (
            <button onClick={anular} className="text-xs text-slate-400 hover:text-rose-700">
              Anular
            </button>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-indigo-100">
          <div className="h-full bg-indigo-600" style={{ width: `${(estado.contestadas / Math.max(estado.total, 1)) * 100}%` }} />
        </div>
      </Panel>

      {!cerrada && actual && (
        <Panel className="space-y-4 p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
            {actual.dominio} · {NOMBRE_DOMINIO[actual.dominio]} · P{actual.n}
          </p>
          <p className="text-xl font-semibold leading-snug text-slate-800 sm:text-2xl">{actual.pregunta}</p>
          <p className="rounded-lg bg-indigo-50 px-4 py-3 text-sm text-slate-700">
            <strong className="text-indigo-800">Ejemplo:</strong> {actual.ejemplo}
          </p>
          {sugerencia && sugerencia.n === actual.n && (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              En la tableta: <strong>{sugerencia.aciertos} de {sugerencia.total}</strong> correctos. Respuesta sugerida:{' '}
              <strong>{ETIQUETA_RESPUESTA[respuestaSugerida(sugerencia.aciertos, sugerencia.total)]}</strong>. Elija la respuesta que dé por buena.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {RESPUESTAS.map((r) => (
              <button
                key={r}
                onClick={() =>
                  contestar(actual, r, sugerencia && sugerencia.n === actual.n ? { aciertos: sugerencia.aciertos, total: sugerencia.total } : undefined)
                }
                disabled={isPending}
                className={`rounded-xl border-2 px-4 py-4 text-base font-semibold active:scale-[0.98] ${
                  respuestas[actual.n]?.r === r ? COLOR[r] : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                }`}
              >
                {ETIQUETA_RESPUESTA[r]}
              </button>
            ))}
          </div>
          {actual.item && guiones[actual.item] !== undefined && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-200 bg-white p-3 text-sm">
              <Button variant="secondary" onClick={() => setComprobando(actual)} className="px-3 py-1.5">
                🖥 Comprobar ahora
              </Button>
              <span className="text-xs text-slate-500">
                Si hay dudas, {ENSAYOS_COMPROBAR} ensayos rápidos en la tableta con el alumno. Después elija la respuesta.
              </span>
            </div>
          )}
          {cambiando !== null && (
            <button onClick={() => setCambiando(null)} className="text-sm text-slate-500">
              Volver a la pregunta siguiente
            </button>
          )}
        </Panel>
      )}

      {(cerrada || !actual) && (
        <Panel className="space-y-3 p-5">
          <p className="text-sm font-medium text-slate-500">
            {cerrada ? 'Resultado' : estado.parada ? 'Ya hay suficiente información: se puede terminar' : 'Se han contestado todas las preguntas'}
          </p>
          <p className="text-lg font-semibold text-slate-800">{resumen}</p>
          <p className="text-sm text-slate-600">
            Es una orientación. Elija los programas con su criterio y las recomendaciones del currículo; el primer bloque sin ayudas de cada
            programa es la prueba real, y si el alumno no aprende, mire los requisitos del programa o baje de dominio o de nivel.
          </p>
        </Panel>
      )}

      {!cerrada && (
        <Panel className="space-y-3 p-4">
          {actual && estado.contestadas > 0 && (
            <p className="text-sm text-slate-600">
              Resultado provisional: <strong>{resumen}</strong>
            </p>
          )}
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas de la entrevista (opcional): quién responde, observaciones…"
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <Button onClick={finalizar} disabled={isPending || estado.contestadas === 0} variant={actual ? 'secondary' : 'primary'}>
            {actual ? 'Terminar ya la entrevista' : 'Terminar y guardar'}
          </Button>
        </Panel>
      )}

      {estado.contestadas > 0 && (
        <Panel className="space-y-1 p-4">
          <p className="mb-2 text-sm font-medium text-slate-600">Respuestas{!cerrada ? ' (toque una para cambiarla)' : ''}</p>
          {lista
            .filter((p) => respuestas[p.n])
            .map((p) => (
              <button
                key={p.n}
                disabled={cerrada}
                onClick={() => setCambiando(p.n)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 disabled:hover:bg-transparent"
              >
                <span className="min-w-0 flex-1 text-slate-700">
                  <span className="mr-1 font-mono text-xs text-indigo-600">{p.dominio}</span> {p.pregunta}
                  {respuestas[p.n].comprobado && (
                    <span className="ml-1 text-xs text-slate-400">
                      (tableta {respuestas[p.n].comprobado!.aciertos}/{respuestas[p.n].comprobado!.total})
                    </span>
                  )}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${COLOR[respuestas[p.n].r]}`}>
                  {ETIQUETA_RESPUESTA[respuestas[p.n].r]}
                </span>
              </button>
            ))}
        </Panel>
      )}
    </div>
  )
}
