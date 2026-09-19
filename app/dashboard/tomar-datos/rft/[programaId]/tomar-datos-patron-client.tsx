'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueRft } from './actions'
import VideoDiferido from '../../../video-diferido'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'
import { leerProgreso, guardarProgreso, borrarProgreso, esFalloDeRed } from '../../offline-sync'
import { BannerSinConexion, PantallaGuardadoPendiente } from '../../estado-sincronizacion'
import {
  FASES_QUE_REQUIEREN_CONEXION,
  construirGrafoEntrenado,
  estanConectadas,
  relacionesDominadasTexto,
  type ParEntrenado,
} from './relaciones-rft'
import { calcularPatron, formatearPatron } from '../../../patron-rft'

type Estimulo = { id: string; nombre: string; elemento: string | null }
type Clase = { id: string; nombre: string; grupo: string; estimulos_rft: Estimulo[] }
type DominioFase = { grupo: string; fase: string; posicion_origen: string; posicion_destino: string }

type Trial = { muestra: Clase; correcta: Clase; comparativos: Clase[] }
type EnsayoPatron = { claseId: string; estimuloOrigenId: string; estimuloDestinoId: string; correcto: boolean; ayuda: string }

const AYUDAS = [
  { value: 'verbal', label: 'Verbal' },
  { value: 'verbal_parcial', label: 'Verbal parcial' },
  { value: 'gestual', label: 'Gestual' },
  { value: 'visual', label: 'Visual' },
  { value: 'modelado', label: 'Modelado' },
  { value: 'fisica_parcial', label: 'Física parcial' },
  { value: 'fisica_total', label: 'Física total' },
  { value: 'textual', label: 'Textual' },
]

function nombresEstimulos(clase: Clase): string {
  return clase.estimulos_rft.map((e) => e.nombre).join(', ')
}

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function generarSecuencia(clasesDelGrupo: Clase[], tipoPregunta: 'igual' | 'diferente', n: number): Trial[] {
  const conPatron = clasesDelGrupo.map((c) => ({ clase: c, patron: formatearPatron(calcularPatron(c.estimulos_rft)) }))
  const trials: Trial[] = []
  let intentos = 0
  while (trials.length < n && intentos < n * 25 + 50) {
    intentos++
    const muestra = conPatron[Math.floor(Math.random() * conPatron.length)]
    const otras = conPatron.filter((c) => c.clase.id !== muestra.clase.id)
    const coinciden = otras.filter((c) => c.patron === muestra.patron)
    const difieren = otras.filter((c) => c.patron !== muestra.patron)
    const correctasPool = tipoPregunta === 'igual' ? coinciden : difieren
    const distractorasPool = tipoPregunta === 'igual' ? difieren : coinciden
    if (correctasPool.length === 0 || distractorasPool.length === 0) continue
    const correcta = correctasPool[Math.floor(Math.random() * correctasPool.length)].clase
    const distractoras = barajar(distractorasPool).slice(0, 2).map((d) => d.clase)
    trials.push({ muestra: muestra.clase, correcta, comparativos: barajar([correcta, ...distractoras]) })
  }
  return trials
}

export default function TomarDatosPatronClient({
  programaAlumnoId,
  alumnoId,
  clases,
  ensayosPorBloqueDefecto,
  instrucciones,
  ayudasPosibles,
  videoUrl,
  grupoInicial,
  dominioFases,
}: {
  programaAlumnoId: string
  alumnoId: string
  clases: Clase[]
  ensayosPorBloqueDefecto: number
  instrucciones: string | null
  ayudasPosibles: string | null
  videoUrl: string | null
  grupoInicial?: string | null
  dominioFases: DominioFase[]
}) {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(grupoInicial ?? null)
  const [fase, setFase] = useState<'entrenamiento' | 'test_mutuo'>('entrenamiento')
  const [tipoPregunta, setTipoPregunta] = useState<'igual' | 'diferente'>('igual')
  const [tipoSonda, setTipoSonda] = useState<'normal' | 'generalizacion' | 'mantenimiento'>('normal')
  const [tamanoBloque, setTamanoBloque] = useState(ensayosPorBloqueDefecto)
  const [secuencia, setSecuencia] = useState<Trial[] | null>(null)
  const [ensayos, setEnsayos] = useState<EnsayoPatron[]>([])
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{ porcentaje: number; clasesDominadasAhora: string[] } | null>(null)
  const [estadoGuardado, setEstadoGuardado] = useState<'idle' | 'pendiente' | 'error'>('idle')
  const [sinConexion, setSinConexion] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const claveProgreso = `patron:${programaAlumnoId}`

  const grupos = [...new Set(clases.map((c) => c.grupo))]
  const clasesDelGrupo = clases.filter((c) => c.grupo === grupoSeleccionado)

  const entrenamientosDominados: ParEntrenado[] = dominioFases
    .filter((d) => d.fase === 'entrenamiento')
    .map((d) => ({ grupo: d.grupo, posicion_origen: d.posicion_origen, posicion_destino: d.posicion_destino }))
  const combosDominados = dominioFases
    .filter((d) => d.fase !== 'entrenamiento')
    .map((d) => `${d.grupo}__${d.posicion_origen}__${d.posicion_destino}`)

  const puedeSonda =
    !!grupoSeleccionado && combosDominados.includes(`${grupoSeleccionado}__${tipoPregunta}__na`)
  const faseEfectiva = puedeSonda && tipoSonda !== 'normal' ? tipoSonda : fase

  const requiereConexion = grupoSeleccionado !== null && (FASES_QUE_REQUIEREN_CONEXION as readonly string[]).includes(fase)
  const grafoEntrenado = grupoSeleccionado ? construirGrafoEntrenado(entrenamientosDominados, grupoSeleccionado) : new Map()
  const conectadas = !requiereConexion || estanConectadas(grafoEntrenado, tipoPregunta, 'na')
  const relacionesYaDominadas = grupoSeleccionado ? relacionesDominadasTexto(entrenamientosDominados, grupoSeleccionado) : []

  const conAyudas = faseEfectiva === 'entrenamiento'

  const intentarGuardar = useCallback(
    (
      listaEnsayos: EnsayoPatron[],
      notasActuales: string,
      grupo: string,
      faseActual: string,
      pregunta: 'igual' | 'diferente'
    ) => {
      startTransition(async () => {
        try {
          const res = await guardarBloqueRft(
            programaAlumnoId,
            alumnoId,
            grupo,
            faseActual,
            pregunta,
            'na',
            listaEnsayos.length > 0 ? listaEnsayos.length : 3,
            listaEnsayos.map(({ claseId, estimuloOrigenId, estimuloDestinoId, correcto, ayuda }) => ({
              claseId,
              estimuloOrigenId,
              estimuloDestinoId,
              correcto,
              ayuda,
            })),
            notasActuales
          )
          if (res.error) {
            setEstadoGuardado('error')
            toast(res.error, 'error')
            return
          }
          borrarProgreso(claveProgreso)
          setEstadoGuardado('idle')
          setResultado({ porcentaje: res.porcentaje ?? 0, clasesDominadasAhora: res.clasesDominadasAhora ?? [] })
        } catch (e) {
          if (esFalloDeRed(e)) {
            setEstadoGuardado('pendiente')
          } else {
            setEstadoGuardado('error')
            toast('No se pudo guardar el bloque', 'error')
          }
        }
      })
    },
    [programaAlumnoId, alumnoId, claveProgreso, toast]
  )

  useEffect(() => {
    const guardado = leerProgreso<{
      secuencia: Trial[]
      ensayos: EnsayoPatron[]
      notas: string
      grupoSeleccionado: string
      fase: 'entrenamiento' | 'test_mutuo'
      tipoPregunta: 'igual' | 'diferente'
      tipoSonda: 'normal' | 'generalizacion' | 'mantenimiento'
      tamanoBloque: number
    }>(claveProgreso)
    if (guardado) {
      setGrupoSeleccionado(guardado.grupoSeleccionado)
      setFase(guardado.fase)
      setTipoPregunta(guardado.tipoPregunta)
      setTipoSonda(guardado.tipoSonda)
      setTamanoBloque(guardado.tamanoBloque)
      setSecuencia(guardado.secuencia)
      setEnsayos(guardado.ensayos)
      setNotas(guardado.notas)
      if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) {
        const faseGuardada = guardado.tipoSonda === 'normal' ? guardado.fase : guardado.tipoSonda
        intentarGuardar(guardado.ensayos, guardado.notas, guardado.grupoSeleccionado, faseGuardada, guardado.tipoPregunta)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const actualizarEstado = () => setSinConexion(!navigator.onLine)
    actualizarEstado()
    const onOnline = () => {
      actualizarEstado()
      if (estadoGuardado === 'pendiente' && grupoSeleccionado) {
        intentarGuardar(ensayos, notas, grupoSeleccionado, faseEfectiva, tipoPregunta)
      }
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', actualizarEstado)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', actualizarEstado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoGuardado, ensayos, notas, grupoSeleccionado, faseEfectiva, tipoPregunta, intentarGuardar])

  const empezarBloque = () => {
    const generados = generarSecuencia(clasesDelGrupo, tipoPregunta, tamanoBloque)
    if (generados.length === 0) {
      toast('No hay suficiente variedad de patrones en este grupo: hace falta al menos una clase con un patrón que se repita y otra con un patrón distinto.', 'error')
      return
    }
    setSecuencia(generados)
    setEnsayos([])
    setNotas('')
    setResultado(null)
    setEstadoGuardado('idle')
  }

  const registrar = (correcto: boolean, ayuda: string) => {
    if (!secuencia) return
    const trial = secuencia[ensayos.length]
    const nuevo: EnsayoPatron = {
      claseId: trial.muestra.id,
      estimuloOrigenId: trial.muestra.estimulos_rft[0]?.id ?? '',
      estimuloDestinoId: trial.correcta.estimulos_rft[0]?.id ?? '',
      correcto,
      ayuda,
    }
    const nuevos = [...ensayos, nuevo]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)

    if (nuevos.length === secuencia.length) {
      intentarGuardar(nuevos, notas, grupoSeleccionado!, faseEfectiva, tipoPregunta)
    }
  }

  const deshacerUltimo = () => setEnsayos((prev) => prev.slice(0, -1))

  useEffect(() => {
    if (!secuencia) return
    guardarProgreso(claveProgreso, { secuencia, ensayos, notas, grupoSeleccionado, fase, tipoPregunta, tipoSonda, tamanoBloque })
  }, [secuencia, ensayos, notas, grupoSeleccionado, fase, tipoPregunta, tipoSonda, tamanoBloque, claveProgreso])

  if (resultado) {
    const hayDominio = resultado.clasesDominadasAhora.length > 0
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${hayDominio ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
        {hayDominio && <p className="text-2xl">🎉</p>}
        <p className={`text-base sm:text-lg font-semibold ${hayDominio ? 'text-amber-800' : 'text-emerald-800'}`}>
          {hayDominio ? `¡Dominio conseguido en ${resultado.clasesDominadasAhora.join(', ')}!` : `Bloque guardado — ${resultado.porcentaje}% de acierto`}
        </p>
        {hayDominio && <p className="text-sm text-amber-700">{resultado.porcentaje}% de acierto en este último bloque</p>}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => {
              setResultado(null)
              setSecuencia(null)
              setEstadoGuardado('idle')
            }}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Registrar otro bloque
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Volver al programa
          </Button>
        </div>
      </div>
    )
  }

  if (estadoGuardado === 'pendiente' || estadoGuardado === 'error') {
    return (
      <PantallaGuardadoPendiente
        tipo={estadoGuardado}
        reintentando={isPending}
        onReintentar={() => intentarGuardar(ensayos, notas, grupoSeleccionado!, faseEfectiva, tipoPregunta)}
        onVolver={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
      />
    )
  }

  if (!grupoSeleccionado) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        <p className="text-sm font-medium text-slate-600">¿Qué grupo de clases vas a trabajar?</p>
        <div className="flex flex-wrap gap-2">
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoSeleccionado(g)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 sm:py-2 text-base sm:text-sm font-medium hover:bg-slate-50"
            >
              {g}
            </button>
          ))}
        </div>
        {grupos.length === 0 && <p className="text-sm text-slate-500">No hay clases todavía en este programa.</p>}
      </Panel>
    )
  }

  if (!secuencia) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{grupoSeleccionado}</p>
          {!grupoInicial && (
            <button onClick={() => setGrupoSeleccionado(null)} className="text-xs text-indigo-600 hover:underline">
              Cambiar grupo
            </button>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Fase</label>
          <select
            value={fase}
            onChange={(e) => setFase(e.target.value as 'entrenamiento' | 'test_mutuo')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="entrenamiento">Entrenamiento</option>
            <option value="test_mutuo">Test de vínculo mutuo</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Pregunta</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTipoPregunta('igual')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${tipoPregunta === 'igual' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              ¿Cuál es igual?
            </button>
            <button
              onClick={() => setTipoPregunta('diferente')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${tipoPregunta === 'diferente' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              ¿Cuál es diferente?
            </button>
          </div>
        </div>

        {requiereConexion && !conectadas && (
          <p className="text-xs font-medium text-rose-700 bg-rose-50 rounded-lg p-2">
            ⚠ Todavía no se puede probar "{tipoPregunta === 'igual' ? '¿Cuál es igual?' : '¿Cuál es diferente?'}": hace
            falta dominar antes esa misma pregunta en entrenamiento.{' '}
            {relacionesYaDominadas.length > 0
              ? `Ya dominado en "${grupoSeleccionado}": ${relacionesYaDominadas.join(', ')}.`
              : 'Todavía no hay nada dominado en entrenamiento en este grupo.'}
          </p>
        )}

        {puedeSonda && (
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Tipo de bloque</p>
            <div className="flex gap-2">
              {(['normal', 'mantenimiento', 'generalizacion'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipoSonda(t)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${tipoSonda === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {t === 'normal' ? 'Normal' : t === 'mantenimiento' ? 'Sonda de mantenimiento' : 'Sonda de generalización'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm text-slate-600">Tamaño del bloque</p>
          <div className="flex gap-2">
            {[10, 20].map((n) => (
              <button
                key={n}
                onClick={() => setTamanoBloque(n)}
                className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${tamanoBloque === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {n} ensayos
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={empezarBloque}
          disabled={!conectadas}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Generar secuencia y empezar
        </button>
      </Panel>
    )
  }

  const trial = secuencia[ensayos.length]

  if (!trial) {
    return (
      <Panel className="p-8 text-center">
        <p className="text-slate-500">Guardando bloque...</p>
      </Panel>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {sinConexion && <BannerSinConexion />}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span aria-live="polite">
          Ensayo <strong>{ensayos.length + 1}</strong> / {secuencia.length}
        </span>
        {ensayos.length > 0 && (
          <button onClick={deshacerUltimo} className="text-rose-700 hover:text-rose-800">
            Deshacer último
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Progreso del bloque"
        aria-valuemin={0}
        aria-valuemax={secuencia.length}
        aria-valuenow={ensayos.length}
        className="h-2 overflow-hidden rounded-full bg-indigo-100"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
          style={{ width: `${(ensayos.length / secuencia.length) * 100}%` }}
        />
      </div>

      {(instrucciones || ayudasPosibles || videoUrl) && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-2">
          {instrucciones && (
            <div>
              <strong>Instrucciones:</strong>
              <p className="whitespace-pre-wrap">{instrucciones}</p>
            </div>
          )}
          {ayudasPosibles && (
            <div>
              <strong>Ayudas sugeridas:</strong>
              <p className="whitespace-pre-wrap">{ayudasPosibles}</p>
            </div>
          )}
          {videoUrl && (
            <div>
              <strong>Vídeo de ejemplo:</strong>
              <VideoDiferido url={videoUrl} />
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">Muestra</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800">{nombresEstimulos(trial.muestra)}</p>
        </div>

        <p className="text-sm text-slate-600">
          {tipoPregunta === 'igual' ? '¿Cuál de estas combina con la muestra?' : '¿Cuál de estas es diferente a la muestra?'}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {trial.comparativos.map((c) => (
            <span
              key={c.id}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                c.id === trial.correcta.id ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-600'
              }`}
              title={c.id === trial.correcta.id ? 'Respuesta correcta (solo visible para ti)' : ''}
            >
              {nombresEstimulos(c)}
            </span>
          ))}
        </div>

        {!conAyudas && !mostrandoAyudas && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="success" onClick={() => registrar(true, 'independiente')} disabled={isPending} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
              ✓ Correcto
            </Button>
            <Button variant="danger" onClick={() => registrar(false, 'independiente')} disabled={isPending} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
              ✗ Incorrecto
            </Button>
          </div>
        )}

        {conAyudas && !mostrandoAyudas && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="success" onClick={() => registrar(true, 'independiente')} disabled={isPending} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
              ✓ Correcto sin ayuda
            </Button>
            <Button variant="warning" onClick={() => setMostrandoAyudas(true)} disabled={isPending} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
              ✓ Correcto con ayuda
            </Button>
            <Button variant="danger" onClick={() => registrar(false, 'independiente')} disabled={isPending} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
              ✗ Incorrecto
            </Button>
          </div>
        )}

        {conAyudas && mostrandoAyudas && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">¿Qué tipo de ayuda?</p>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
              {AYUDAS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => registrar(true, a.value)}
                  disabled={isPending}
                  className="rounded-lg bg-white border border-amber-300 px-3 py-3 sm:py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 active:scale-[0.98]"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button onClick={() => setMostrandoAyudas(false)} className="text-sm text-slate-500 hover:text-slate-600 py-2">
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-600">Notas (opcional)</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Observaciones sobre este bloque..."
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>

      {ensayos.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-600">Ensayos registrados</p>
          <ul className="space-y-1 max-h-40 sm:max-h-48 overflow-y-auto">
            {ensayos.map((e, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span>
                  {i + 1}. {e.ayuda !== 'independiente' ? `con ayuda (${e.ayuda})` : e.correcto ? 'independiente' : ''}
                </span>
                <span className={e.correcto ? 'text-emerald-700' : 'text-rose-600'}>{e.correcto ? '✓' : '✗'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
