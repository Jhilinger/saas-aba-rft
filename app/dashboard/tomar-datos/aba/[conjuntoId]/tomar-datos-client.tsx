'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueAba } from './actions'
import VideoDiferido from '../../../video-diferido'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'
import { leerProgreso, guardarProgreso, borrarProgreso, esFalloDeRed } from '../../offline-sync'
import { BannerSinConexion, PantallaGuardadoPendiente } from '../../estado-sincronizacion'

type Estimulo = { id: string; nombre: string }

type EnsayoRegistrado = {
  estimuloId: string
  estimuloNombre: string
  correcto: boolean
  ayuda: string
}

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

function generarSecuencia(estimulos: Estimulo[], n: number): Estimulo[] {
  const k = estimulos.length
  const base = Math.floor(n / k)
  const remainder = n % k
  const barajados = [...estimulos].sort(() => Math.random() - 0.5)

  const pool: Estimulo[] = []
  barajados.forEach((e, idx) => {
    const count = base + (idx < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) pool.push(e)
  })

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  for (let i = 1; i < pool.length; i++) {
    if (pool[i].id === pool[i - 1].id) {
      const j = pool.findIndex((e, idx) => idx > i && e.id !== pool[i - 1].id)
      if (j !== -1) {
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }
  }

  return pool
}

export default function TomarDatosClient({
  conjuntoId,
  programaAlumnoId,
  alumnoId,
  estimulos,
  ensayosPorBloque,
  instrucciones,
  ayudasPosibles,
  videoUrl,
  faseConjunto,
}: {
  conjuntoId: string
  programaAlumnoId: string
  alumnoId: string
  estimulos: Estimulo[]
  ensayosPorBloque: number
  instrucciones: string | null
  ayudasPosibles: string | null
  videoUrl: string | null
  faseConjunto: 'linea_base' | 'adquisicion' | 'mantenimiento' | 'dominado' | 'pausado'
}) {
  const enLineaBase = faseConjunto === 'linea_base'
  const puedeSonda = faseConjunto === 'dominado' || faseConjunto === 'mantenimiento'
  const claveProgreso = `aba:${conjuntoId}`

  const [tamanoBloque, setTamanoBloque] = useState<number>(ensayosPorBloque)
  const [tipoSonda, setTipoSonda] = useState<'normal' | 'generalizacion' | 'mantenimiento'>('normal')
  const [contexto, setContexto] = useState('')
  // Igual que en línea base: en una sonda no se dan ayudas, se comprueba si
  // el alumno lo hace por sí mismo en el nuevo contexto o tras el tiempo.
  const enSonda = tipoSonda !== 'normal'
  const sinAyudas = enLineaBase || enSonda
  const [secuencia, setSecuencia] = useState<Estimulo[] | null>(null)
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  const [ensayos, setEnsayos] = useState<EnsayoRegistrado[]>([])
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{ porcentaje: number; dominioLogrado: boolean; tipoSonda: string } | null>(null)
  const [estadoGuardado, setEstadoGuardado] = useState<'idle' | 'pendiente' | 'error'>('idle')
  const [sinConexion, setSinConexion] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const intentarGuardar = useCallback(
    (listaEnsayos: EnsayoRegistrado[], notasActuales: string, sondaActual: 'normal' | 'generalizacion' | 'mantenimiento') => {
      startTransition(async () => {
        try {
          const res = await guardarBloqueAba(
            conjuntoId,
            programaAlumnoId,
            alumnoId,
            listaEnsayos.map(({ estimuloId, correcto, ayuda }) => ({ estimuloId, correcto, ayuda })),
            notasActuales,
            sondaActual === 'normal' ? undefined : sondaActual
          )
          if (res.error) {
            setEstadoGuardado('error')
            toast(res.error, 'error')
            return
          }
          borrarProgreso(claveProgreso)
          setEstadoGuardado('idle')
          setResultado({ porcentaje: res.porcentaje ?? 0, dominioLogrado: res.dominioLogrado ?? false, tipoSonda: sondaActual })
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
    [conjuntoId, programaAlumnoId, alumnoId, claveProgreso, toast]
  )

  // Restaura un bloque en curso (o completo pero sin sincronizar todavía) si
  // se recargó la página o se cerró tras un fallo de red.
  useEffect(() => {
    const guardado = leerProgreso<{
      secuencia: Estimulo[]
      ensayos: EnsayoRegistrado[]
      notas: string
      tamanoBloque: number
      tipoSonda: 'normal' | 'generalizacion' | 'mantenimiento'
    }>(claveProgreso)
    if (guardado) {
      setSecuencia(guardado.secuencia)
      setEnsayos(guardado.ensayos)
      setNotas(guardado.notas)
      setTamanoBloque(guardado.tamanoBloque)
      setTipoSonda(guardado.tipoSonda ?? 'normal')
      if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) {
        intentarGuardar(guardado.ensayos, guardado.notas, guardado.tipoSonda ?? 'normal')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reintenta solo en cuanto vuelva la conexión, y muestra un aviso mientras
  // se está tomando el bloque sin conexión.
  useEffect(() => {
    const actualizarEstado = () => setSinConexion(!navigator.onLine)
    actualizarEstado()
    const onOnline = () => {
      actualizarEstado()
      if (estadoGuardado === 'pendiente') intentarGuardar(ensayos, notas, tipoSonda)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', actualizarEstado)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', actualizarEstado)
    }
  }, [estadoGuardado, ensayos, notas, tipoSonda, intentarGuardar])

  const empezarBloque = () => {
    setSecuencia(generarSecuencia(estimulos, tamanoBloque))
    setEnsayos([])
    setNotas(tipoSonda === 'generalizacion' && contexto.trim() ? `Contexto: ${contexto.trim()}` : '')
    setResultado(null)
    setEstadoGuardado('idle')
  }

  const registrar = (correcto: boolean, ayuda: string) => {
    if (!secuencia) return
    const actual = secuencia[ensayos.length]
    const nuevos = [
      ...ensayos,
      { estimuloId: actual.id, estimuloNombre: actual.nombre, correcto, ayuda },
    ]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)

    if (nuevos.length === secuencia.length) {
      intentarGuardar(nuevos, notas, tipoSonda)
    }
  }

  const deshacerUltimo = () => {
    setEnsayos((prev) => prev.slice(0, -1))
  }

  // Guarda el progreso en el dispositivo según se registra cada ensayo
  useEffect(() => {
    if (!secuencia) return
    guardarProgreso(claveProgreso, { secuencia, ensayos, notas, tamanoBloque, tipoSonda })
  }, [secuencia, ensayos, notas, tamanoBloque, tipoSonda, claveProgreso])

  if (resultado) {
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${
        resultado.dominioLogrado
          ? 'border-amber-300 bg-amber-50'
          : 'border-emerald-200 bg-emerald-50'
      }`}>
        {resultado.dominioLogrado && (
          <p className="text-2xl">🎉</p>
        )}
        <p className={`text-base sm:text-lg font-semibold ${
          resultado.dominioLogrado ? 'text-amber-800' : 'text-emerald-800'
        }`}>
          {resultado.dominioLogrado
            ? '¡Dominio conseguido! Este conjunto acaba de superar el criterio'
            : resultado.tipoSonda === 'generalizacion'
              ? `Sonda de generalización guardada — ${resultado.porcentaje}% de acierto`
              : resultado.tipoSonda === 'mantenimiento'
                ? `Sonda de mantenimiento guardada — ${resultado.porcentaje}% de acierto`
                : enLineaBase
                  ? `Bloque de línea base guardado — ${resultado.porcentaje}% de acierto`
                  : `Bloque guardado — ${resultado.porcentaje}% de acierto independiente`}
        </p>
        {resultado.dominioLogrado && (
          <p className="text-sm text-amber-700">{resultado.porcentaje}% de acierto en este último bloque</p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => {
              setResultado(null)
              setSecuencia(null)
              setEstadoGuardado('idle')
              setContexto('')
            }}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Registrar otro bloque
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/programas/${programaAlumnoId}`)}
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
        onReintentar={() => intentarGuardar(ensayos, notas, tipoSonda)}
        onVolver={() => router.push(`/dashboard/programas/${programaAlumnoId}`)}
      />
    )
  }

  if (!secuencia) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}
        {enLineaBase && (
          <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-sm text-sky-800">
            Estás en fase de <strong>línea base</strong>: no se evalúa el criterio de dominio ni se registran ayudas, solo el nivel de partida sin intervención.
          </div>
        )}

        {puedeSonda && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Tipo de sesión</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'normal', label: 'Seguimiento normal' },
                { value: 'mantenimiento', label: 'Sonda de mantenimiento' },
                { value: 'generalizacion', label: 'Sonda de generalización' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    const v = t.value as typeof tipoSonda
                    setTipoSonda(v)
                    setTamanoBloque(v === 'normal' ? ensayosPorBloque : 3)
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    tipoSonda === t.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {tipoSonda === 'generalizacion' && (
              <input
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Contexto (opcional): con quién, dónde..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            )}
          </div>
        )}

        <p className="text-sm font-medium text-slate-600">Tamaño del bloque</p>
        <div className="flex gap-2">
          {(tipoSonda === 'normal' ? [10, 20] : [1, 3, 5]).map((n) => (
            <button
              key={n}
              onClick={() => setTamanoBloque(n)}
              className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                tamanoBloque === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {n} ensayo{n === 1 ? '' : 's'}
            </button>
          ))}
        </div>
        <button
          onClick={empezarBloque}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700"
        >
          Generar secuencia y empezar
        </button>
      </Panel>
    )
  }

  const estimuloActual = secuencia[ensayos.length]

  if (!estimuloActual) {
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

      {enLineaBase && (
        <div className="rounded-lg bg-sky-50 border border-sky-200 px-3 py-2 text-xs text-sky-800">
          Fase de línea base — sin ayudas, sin criterio de dominio.
        </div>
      )}

      {enSonda && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {tipoSonda === 'generalizacion' ? 'Sonda de generalización' : 'Sonda de mantenimiento'} — sin
          ayudas, no afecta al criterio de dominio.
          {contexto.trim() && <> Contexto: {contexto.trim()}.</>}
        </div>
      )}

            {(instrucciones || ayudasPosibles || videoUrl) && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-2">
          {instrucciones && (
            <div>
              <strong>Instrucciones:</strong>
              <p className="whitespace-pre-wrap">{instrucciones}</p>
            </div>
          )}
          {!sinAyudas && ayudasPosibles && (
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
        <p className="text-xl sm:text-2xl font-bold text-slate-800">{estimuloActual.nombre}</p>

        {sinAyudas ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="success"
              onClick={() => registrar(true, 'independiente')}
              disabled={isPending}
              className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]"
            >
              ✓ Correcto
            </Button>
            <Button
              variant="danger"
              onClick={() => registrar(false, 'independiente')}
              disabled={isPending}
              className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]"
            >
              ✗ Incorrecto
            </Button>
          </div>
        ) : !mostrandoAyudas ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="success"
              onClick={() => registrar(true, 'independiente')}
              disabled={isPending}
              className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]"
            >
              ✓ Correcto sin ayuda
            </Button>
            <Button
              variant="warning"
              onClick={() => setMostrandoAyudas(true)}
              disabled={isPending}
              className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]"
            >
              ✓ Correcto con ayuda
            </Button>
            <Button
              variant="danger"
              onClick={() => registrar(false, 'independiente')}
              disabled={isPending}
              className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]"
            >
              ✗ Incorrecto
            </Button>
          </div>
        ) : (
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
            <button
              onClick={() => setMostrandoAyudas(false)}
              className="text-sm text-slate-500 hover:text-slate-600 py-2"
            >
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
          placeholder="Observaciones sobre este bloque: motivación, distracciones, contexto..."
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>

      {ensayos.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-600">Ensayos registrados</p>
          <ul className="space-y-1 max-h-40 sm:max-h-48 overflow-y-auto">
            {ensayos.map((e, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>
                  {i + 1}. {e.estimuloNombre}
                  {e.ayuda !== 'independiente' ? ` (${e.ayuda})` : ''}
                </span>
                <span className={e.correcto ? 'text-emerald-700' : 'text-rose-600'}>
                  {e.correcto ? '✓' : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isPending && (
        <p className="text-center text-sm text-slate-500">Guardando bloque...</p>
      )}
    </div>
  )
}