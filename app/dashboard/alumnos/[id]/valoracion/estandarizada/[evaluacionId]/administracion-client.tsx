'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  borrarRespuesta,
  cambiarEstadoEvaluacion,
  finalizarEvaluacion,
  fijarNivelInicio,
  guardarRespuesta,
} from '../actions'
import {
  calcularRuta,
  CRITERIO_BLOQUE,
  estadoEntrenamiento,
  MAX_BLOQUES,
  nivelPorCribado,
  ordenarItems,
  puntuacionPropuesta,
  TAM_BLOQUE,
  type Ensayo,
  type EstadoItem,
  type FaseEnsayo,
  type Fuente,
  type ItemEvaluacion,
  type RespuestaEvaluacion,
} from '../logica'
import { ESTADO_EVALUACION, ESTADO_ITEM, ICONO_FORMATO } from '../etiquetas'
import { useToast } from '../../../../../../providers/toast-provider'
import { Button, Panel } from '../../../../../../ui'

type Evaluacion = { id: string; estado: string; modalidad: 'vocal' | 'no_vocal'; nivelInicio: number | null }

const NIVELES = [1, 2, 3, 4]
const RESPUESTA_CRIBADO = [
  { puntuacion: 2, label: 'Sí' },
  { puntuacion: 1, label: 'A veces' },
  { puntuacion: 0, label: 'No' },
]

export default function AdministracionClient({
  evaluacion,
  items,
  respuestas,
}: {
  evaluacion: Evaluacion
  items: ItemEvaluacion[]
  respuestas: RespuestaEvaluacion[]
}) {
  const [mapa, setMapa] = useState(() => new Map(respuestas.map((r) => [r.itemId, r])))
  const [nivelInicio, setNivelInicio] = useState(evaluacion.nivelInicio)
  const [verCribado, setVerCribado] = useState(evaluacion.nivelInicio === null)
  const [seleccionado, setSeleccionado] = useState<string | null>(null)
  const [ignorarSuelo, setIgnorarSuelo] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const editable = evaluacion.estado === 'en_curso'
  const cribado = useMemo(() => items.filter((i) => i.tipo === 'cribado').sort((a, b) => a.orden - b.orden), [items])
  const ordenados = useMemo(() => ordenarItems(items.filter((i) => i.tipo === 'item')), [items])
  const porId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])
  const ruta = useMemo(() => calcularRuta(items, mapa, nivelInicio), [items, mapa, nivelInicio])
  const nivelCribado = nivelPorCribado(cribado, mapa)
  const actual = porId.get(seleccionado ?? ruta.siguiente ?? '') ?? null

  const accion = (fn: () => Promise<{ error?: string }>, alTerminar?: () => void) =>
    startTransition(async () => {
      const res = await fn()
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      alTerminar?.()
    })

  const actualizar = (respuesta: RespuestaEvaluacion) =>
    setMapa((prev) => new Map(prev).set(respuesta.itemId, respuesta))

  const responderCribado = (item: ItemEvaluacion, puntuacion: number) => {
    const respuesta: RespuestaEvaluacion = {
      itemId: item.id,
      puntuacion,
      noAplicado: null,
      fuente: 'informado',
      ensayos: [],
      notas: null,
    }
    accion(
      () => guardarRespuesta(evaluacion.id, item.id, { puntuacion, noProcede: false, fuente: 'informado', ensayos: [], notas: '' }),
      () => actualizar(respuesta)
    )
  }

  const cambiarNivel = (nivel: number) =>
    accion(
      () => fijarNivelInicio(evaluacion.id, nivel),
      () => {
        setNivelInicio(nivel)
        setVerCribado(false)
        setSeleccionado(null)
      }
    )

  const finalizar = () => {
    if (ruta.siguiente && !window.confirm('Quedan ítems pendientes en la ruta. ¿Finalizar igualmente?')) return
    accion(() => finalizarEvaluacion(evaluacion.id), () => router.refresh())
  }

  const cambiarEstado = (estado: 'en_curso' | 'anulada') => {
    if (estado === 'anulada' && !window.confirm('¿Anular esta evaluación? No se usará para la colocación.')) return
    accion(() => cambiarEstadoEvaluacion(evaluacion.id, estado), () => router.refresh())
  }

  const estadoEval = ESTADO_EVALUACION[evaluacion.estado] ?? ESTADO_EVALUACION.en_curso

  return (
    <div className="space-y-4">
      <Panel className="flex flex-wrap items-center gap-3 p-3 text-sm">
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${estadoEval.color}`}>{estadoEval.label}</span>
        <span className="text-slate-600">{evaluacion.modalidad === 'no_vocal' ? 'Sin lenguaje vocal' : 'Vocal'}</span>
        {nivelInicio !== null && (
          <label className="flex items-center gap-1 text-slate-600">
            Nivel de inicio
            <select
              value={nivelInicio}
              disabled={!editable || isPending}
              onChange={(e) => cambiarNivel(Number(e.target.value))}
              className="rounded border border-slate-300 px-2 py-1"
            >
              {NIVELES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        {nivelInicio !== null && (
          <button onClick={() => setVerCribado((v) => !v)} className="text-xs font-medium text-indigo-600 hover:underline">
            {verCribado ? 'Ocultar cribado' : 'Ver cribado'}
          </button>
        )}
        <span className="ml-auto flex flex-wrap gap-2">
          {editable && (
            <>
              <Button variant="success" onClick={finalizar} disabled={isPending || nivelInicio === null} className="px-3 py-1.5">
                Finalizar
              </Button>
              <Button variant="secondary" onClick={() => cambiarEstado('anulada')} disabled={isPending} className="px-3 py-1.5">
                Anular
              </Button>
            </>
          )}
          {!editable && (
            <Button variant="secondary" onClick={() => cambiarEstado('en_curso')} disabled={isPending} className="px-3 py-1.5">
              {evaluacion.estado === 'anulada' ? 'Recuperar' : 'Reabrir'}
            </Button>
          )}
        </span>
      </Panel>

      {verCribado && (
        <Panel className="space-y-3 p-4">
          <div>
            <p className="font-semibold text-slate-800">Cribado</p>
            <p className="text-sm text-slate-500">
              Con la familia o por observación. El nivel de inicio es el del primer ítem que no se responde con «Sí».
            </p>
          </div>
          <ul className="space-y-2">
            {cribado.map((item) => {
              const puntuacion = mapa.get(item.id)?.puntuacion
              return (
                <li key={item.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center">
                  <span className="flex-1 text-sm text-slate-700">
                    <span className="mr-2 font-mono text-xs text-indigo-600">
                      {item.codigo} · N{item.nivel}
                    </span>
                    {item.consigna}
                  </span>
                  <span className="flex gap-1">
                    {RESPUESTA_CRIBADO.map((o) => (
                      <button
                        key={o.puntuacion}
                        onClick={() => responderCribado(item, o.puntuacion)}
                        disabled={!editable || isPending}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                          puntuacion === o.puntuacion
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </span>
                </li>
              )
            })}
          </ul>
          {editable && nivelCribado !== null && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-indigo-50 p-3 text-sm">
              <span className="text-slate-700">
                Nivel de inicio según el cribado: <strong>{nivelCribado}</strong>
              </span>
              <Button onClick={() => cambiarNivel(nivelCribado)} disabled={isPending} className="px-3 py-1.5">
                {nivelInicio === null ? 'Empezar en este nivel' : 'Usar este nivel'}
              </Button>
            </div>
          )}
        </Panel>
      )}

      {nivelInicio !== null && (
        <>
          {editable && ruta.sugerirBajar && !ignorarSuelo && (
            <Aviso>
              El primer dominio del nivel {nivelInicio} queda por debajo de la mitad de los puntos. Se recomienda bajar al
              nivel {nivelInicio - 1}.
              <span className="mt-2 flex gap-2">
                <Button variant="warning" onClick={() => cambiarNivel(nivelInicio - 1)} disabled={isPending} className="px-3 py-1.5">
                  Bajar al nivel {nivelInicio - 1}
                </Button>
                <Button variant="secondary" onClick={() => setIgnorarSuelo(true)} className="px-3 py-1.5">
                  Seguir en el nivel {nivelInicio}
                </Button>
              </span>
            </Aviso>
          )}
          {ruta.nivelCortado !== null && (
            <Aviso>
              El nivel {ruta.nivelCortado} no llega a la mitad de los puntos: la ruta termina aquí. Si lo consideras
              oportuno, puedes aplicar ítems del nivel siguiente desde la lista.
            </Aviso>
          )}
          {editable && ruta.siguiente === null && (
            <Aviso>No quedan ítems pendientes en la ruta. Revisa las puntuaciones y finaliza la evaluación.</Aviso>
          )}

          <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
            <ListaItems
              items={ordenados}
              estados={ruta.estados}
              mapa={mapa}
              nivelesActivos={ruta.nivelesActivos}
              actualId={actual?.id ?? null}
              onElegir={setSeleccionado}
            />
            {actual ? (
              <FichaItem
                key={actual.id}
                evaluacionId={evaluacion.id}
                item={actual}
                estado={ruta.estados.get(actual.id) ?? 'pendiente'}
                respuesta={mapa.get(actual.id) ?? null}
                requisito={actual.requiereItemId ? porId.get(actual.requiereItemId)?.codigo ?? null : null}
                modalidad={evaluacion.modalidad}
                editable={editable}
                onGuardado={(r) => {
                  actualizar(r)
                  setSeleccionado(null)
                }}
                onBorrado={() => {
                  setMapa((prev) => {
                    const siguiente = new Map(prev)
                    siguiente.delete(actual.id)
                    return siguiente
                  })
                }}
              />
            ) : (
              <Panel className="p-6 text-center text-sm text-slate-500">Elige un ítem de la lista.</Panel>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{children}</div>
}

function ListaItems({
  items,
  estados,
  mapa,
  nivelesActivos,
  actualId,
  onElegir,
}: {
  items: ItemEvaluacion[]
  estados: Map<string, EstadoItem>
  mapa: Map<string, RespuestaEvaluacion>
  nivelesActivos: number[]
  actualId: string | null
  onElegir: (id: string) => void
}) {
  const niveles = [...new Set(items.map((i) => i.nivel))]
  return (
    <Panel className="max-h-[70vh] space-y-3 overflow-y-auto p-3 lg:sticky lg:top-4">
      {niveles.map((nivel) => (
        <div key={nivel} className="space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wide ${nivelesActivos.includes(nivel) ? 'text-slate-700' : 'text-slate-400'}`}>
            Nivel {nivel}
          </p>
          {items
            .filter((i) => i.nivel === nivel)
            .map((item, idx, delNivel) => {
              const estado = estados.get(item.id) ?? 'fuera'
              const puntuacion = mapa.get(item.id)?.puntuacion
              const nuevoDominio = idx === 0 || delNivel[idx - 1].dominioId !== item.dominioId
              return (
                <div key={item.id}>
                  {nuevoDominio && <p className="mt-2 text-xs text-slate-500">{item.dominioCodigo} {item.dominioNombre}</p>}
                  <button
                    onClick={() => onElegir(item.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left text-sm ${
                      item.id === actualId ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-slate-50'
                    } ${estado === 'fuera' ? 'text-slate-400' : 'text-slate-700'}`}
                  >
                    <span className="truncate">
                      <span className="font-mono text-xs">{item.codigo.replace('EV-', '')}</span> {item.titulo}
                    </span>
                    <span className={`shrink-0 rounded-full border px-1.5 text-xs ${ESTADO_ITEM[estado].color}`}>
                      {estado === 'puntuado' ? puntuacion : ESTADO_ITEM[estado].label}
                    </span>
                  </button>
                </div>
              )
            })}
        </div>
      ))}
    </Panel>
  )
}

function FichaItem({
  evaluacionId,
  item,
  estado,
  respuesta,
  requisito,
  modalidad,
  editable,
  onGuardado,
  onBorrado,
}: {
  evaluacionId: string
  item: ItemEvaluacion
  estado: EstadoItem
  respuesta: RespuestaEvaluacion | null
  requisito: string | null
  modalidad: 'vocal' | 'no_vocal'
  editable: boolean
  onGuardado: (r: RespuestaEvaluacion) => void
  onBorrado: () => void
}) {
  const [ensayos, setEnsayos] = useState<Ensayo[]>(respuesta?.ensayos ?? [])
  const [fuente, setFuente] = useState<Fuente>(respuesta?.fuente ?? 'observado')
  const [elegida, setElegida] = useState<number | null>(respuesta?.puntuacion ?? null)
  const [notas, setNotas] = useState(respuesta?.notas ?? '')
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const entrenamiento = estadoEntrenamiento(ensayos)
  const propuesta = fuente === 'observado' ? puntuacionPropuesta(item, ensayos) : null
  const efectiva = elegida ?? propuesta
  const sinTest = item.relacional && entrenamiento.superado === false

  const registrar = (fase: FaseEnsayo, correcto: boolean) => setEnsayos((prev) => [...prev, { fase, correcto }])
  const deshacer = (fase: FaseEnsayo) =>
    setEnsayos((prev) => {
      const i = prev.findLastIndex((e) => e.fase === fase)
      return i < 0 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)]
    })

  const guardar = (noProcede: boolean) => {
    const puntuacion = noProcede ? null : efectiva
    const ensayosGuardados = fuente === 'observado' ? ensayos : []
    startTransition(async () => {
      const res = await guardarRespuesta(evaluacionId, item.id, { puntuacion, noProcede, fuente, ensayos: ensayosGuardados, notas })
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      onGuardado({
        itemId: item.id,
        puntuacion,
        noAplicado: noProcede ? 'no_procede' : null,
        fuente,
        ensayos: ensayosGuardados,
        notas: notas.trim() || null,
      })
    })
  }

  const borrar = () =>
    startTransition(async () => {
      const res = await borrarRespuesta(evaluacionId, item.id)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setEnsayos([])
      setElegida(null)
      setNotas('')
      onBorrado()
    })

  const criterios = [
    { puntuacion: 2, texto: item.criterio2 },
    { puntuacion: 1, texto: item.criterio1 },
    { puntuacion: 0, texto: item.criterio0 },
  ]

  return (
    <Panel className="space-y-4 p-4 sm:p-5">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-indigo-600">{item.codigo}</span>
          <span className="text-slate-500">
            {item.dominioCodigo} {item.dominioNombre}
          </span>
          <span>{item.formatos.map((f) => ICONO_FORMATO[f] ?? '').join(' ')}</span>
          {item.relacional && <span className="rounded-full bg-violet-50 px-2 text-violet-700">Relacional</span>}
          {item.indicador && <span className="rounded-full bg-slate-100 px-2 text-slate-600">Indicador: no marca programas</span>}
          <span className={`rounded-full border px-2 ${ESTADO_ITEM[estado].color}`}>{ESTADO_ITEM[estado].label}</span>
        </div>
        <p className="text-xl font-bold text-slate-800">{item.titulo}</p>
        {requisito && (
          <p className="text-xs text-slate-500">
            Solo se aplica si {requisito} obtuvo un {item.requierePuntuacion}.
          </p>
        )}
        {estado === 'techo' && <p className="text-xs text-amber-700">Fuera de la ruta por el techo del dominio (dos ceros seguidos).</p>}
        {estado === 'requisito' && <p className="text-xs text-amber-700">Fuera de la ruta: no se cumple el requisito.</p>}
      </div>

      {item.materiales && (
        <Bloque titulo="Materiales">
          <p>{item.materiales}</p>
        </Bloque>
      )}
      <Bloque titulo={item.ensayos ? `Consigna · ${item.ensayos} ensayos` : 'Consigna'}>
        <p className="whitespace-pre-wrap">{item.consigna}</p>
        {modalidad === 'no_vocal' && item.relacional && (
          <p className="mt-1 text-xs text-violet-700">Alumno sin lenguaje vocal: aplica la variante por selección si la ficha la indica.</p>
        )}
      </Bloque>

      {item.formatos.includes('familia') && (
        <div className="flex flex-wrap gap-2 text-sm">
          {(['observado', 'informado'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFuente(f)}
              disabled={!editable}
              className={`rounded-lg border px-3 py-1.5 ${
                fuente === f ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600'
              }`}
            >
              {f === 'observado' ? 'Observado en sesión' : 'Informado por la familia'}
            </button>
          ))}
        </div>
      )}
      {fuente === 'informado' && item.preguntaFamilia && (
        <Bloque titulo="Pregunta a la familia">
          <p>{item.preguntaFamilia}</p>
        </Bloque>
      )}

      {fuente === 'observado' && (
        <div className="space-y-3">
          {item.relacional && (
            <Contador
              titulo="Entrenamiento (si la ficha lo incluye)"
              fase="entrenamiento"
              ensayos={ensayos}
              editable={editable}
              onRegistrar={registrar}
              onDeshacer={deshacer}
              resumen={
                entrenamiento.superado === true
                  ? `Criterio alcanzado en el bloque ${entrenamiento.superadoEn}`
                  : entrenamiento.superado === false
                    ? `No alcanza ${CRITERIO_BLOQUE} de ${TAM_BLOQUE} en ${MAX_BLOQUES} bloques: puntuación 0 y no se aplica el test`
                    : `Bloques de ${TAM_BLOQUE}; criterio ${CRITERIO_BLOQUE} de ${TAM_BLOQUE}, máximo ${MAX_BLOQUES} bloques`
              }
              porBloques
            />
          )}
          {!sinTest && (
            <Contador
              titulo="Test"
              fase="test"
              ensayos={ensayos}
              editable={editable}
              onRegistrar={registrar}
              onDeshacer={deshacer}
              resumen={`${ensayos.filter((e) => e.fase === 'test' && e.correcto).length} aciertos de ${
                ensayos.filter((e) => e.fase === 'test').length
              }${item.ensayos ? ` (previstos: ${item.ensayos})` : ''}`}
            />
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">
          Puntuación
          {propuesta !== null && <span className="ml-2 font-normal text-slate-500">· propuesta según los ensayos: {propuesta}</span>}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {criterios.map((c) => (
            <button
              key={c.puntuacion}
              onClick={() => setElegida(c.puntuacion)}
              disabled={!editable}
              className={`rounded-lg border p-2 text-left text-sm ${
                efectiva === c.puntuacion
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 text-slate-600 hover:border-indigo-300'
              } ${propuesta === c.puntuacion && elegida === null ? 'ring-2 ring-indigo-200' : ''}`}
            >
              <span className="block text-lg font-bold">{c.puntuacion}</span>
              <span className="text-xs">{c.texto}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        disabled={!editable}
        placeholder="Notas (opcional): ayudas, conducta, variante aplicada…"
        rows={2}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />

      {editable && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => guardar(false)} disabled={isPending || efectiva === null}>
            Guardar y seguir
          </Button>
          <Button variant="secondary" onClick={() => guardar(true)} disabled={isPending}>
            No procede
          </Button>
          {respuesta && (
            <Button variant="secondary" onClick={borrar} disabled={isPending} className="ml-auto">
              Borrar respuesta
            </Button>
          )}
        </div>
      )}
    </Panel>
  )
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 text-sm text-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titulo}</p>
      {children}
    </div>
  )
}

function Contador({
  titulo,
  fase,
  ensayos,
  editable,
  onRegistrar,
  onDeshacer,
  resumen,
  porBloques = false,
}: {
  titulo: string
  fase: FaseEnsayo
  ensayos: Ensayo[]
  editable: boolean
  onRegistrar: (fase: FaseEnsayo, correcto: boolean) => void
  onDeshacer: (fase: FaseEnsayo) => void
  resumen: string
  porBloques?: boolean
}) {
  const deFase = ensayos.filter((e) => e.fase === fase)
  const grupos: Ensayo[][] = []
  const tam = porBloques ? TAM_BLOQUE : Math.max(deFase.length, 1)
  for (let i = 0; i < deFase.length; i += tam) grupos.push(deFase.slice(i, i + tam))

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">{titulo}</p>
        {editable && (
          <span className="flex gap-1">
            <button
              onClick={() => onRegistrar(fase, true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white active:scale-95"
              aria-label="Correcto"
            >
              ✓
            </button>
            <button
              onClick={() => onRegistrar(fase, false)}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white active:scale-95"
              aria-label="Incorrecto"
            >
              ✗
            </button>
            <button
              onClick={() => onDeshacer(fase)}
              disabled={deFase.length === 0}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 disabled:opacity-40"
            >
              Deshacer
            </button>
          </span>
        )}
      </div>
      {grupos.length > 0 && (
        <div className="space-y-1">
          {grupos.map((g, i) => (
            <div key={i} className="flex items-center gap-1">
              {porBloques && <span className="w-16 text-xs text-slate-500">Bloque {i + 1}</span>}
              {g.map((e, j) => (
                <span key={j} className={`h-3 w-3 rounded-full ${e.correcto ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              ))}
              {porBloques && (
                <span className="ml-1 text-xs text-slate-500">
                  {g.filter((e) => e.correcto).length}/{g.length}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500">{resumen}</p>
    </div>
  )
}
