'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueAnalogias } from '../../../programas-rft/[id]/analogias-actions'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'
import { leerProgreso, guardarProgreso, borrarProgreso, esFalloDeRed } from '../../offline-sync'
import { BannerSinConexion, PantallaGuardadoPendiente } from '../../estado-sincronizacion'

type Analogia = {
  id: string
  par1_termino_a: string
  par1_termino_b: string
  par1_relacion: string
  par2_termino_a: string
  par2_termino_b: string
  par2_relacion: string
}

type EnsayoAnalogia = {
  analogiaId: string
  respuestaDada: 'igual' | 'distinta'
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

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export default function TomarDatosAnalogiasClient({
  programaAlumnoId,
  analogias,
  faseActual,
  puedeSonda,
}: {
  programaAlumnoId: string
  analogias: Analogia[]
  faseActual: 'linea_base' | 'intervencion'
  puedeSonda: boolean
}) {
  const [tipoSonda, setTipoSonda] = useState<'normal' | 'generalizacion' | 'mantenimiento'>('normal')
  const [tamanoBloque, setTamanoBloque] = useState(10)
  const [secuencia, setSecuencia] = useState<Analogia[] | null>(null)
  const [ensayos, setEnsayos] = useState<EnsayoAnalogia[]>([])
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{ porcentaje: number } | null>(null)
  const [estadoGuardado, setEstadoGuardado] = useState<'idle' | 'pendiente' | 'error'>('idle')
  const [sinConexion, setSinConexion] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const claveProgreso = `analogias:${programaAlumnoId}`
  const faseEfectiva = tipoSonda === 'normal' ? faseActual : tipoSonda
  const conAyudas = faseEfectiva === 'intervencion'

  const intentarGuardar = useCallback(
    (listaEnsayos: EnsayoAnalogia[], notasActuales: string, sonda: 'normal' | 'generalizacion' | 'mantenimiento') => {
      startTransition(async () => {
        try {
          const res = await guardarBloqueAnalogias(programaAlumnoId, listaEnsayos, sonda, notasActuales)
          if (res.error) {
            setEstadoGuardado('error')
            toast(res.error, 'error')
            return
          }
          borrarProgreso(claveProgreso)
          setEstadoGuardado('idle')
          setResultado({ porcentaje: res.porcentaje ?? 0 })
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
    [programaAlumnoId, claveProgreso, toast]
  )

  useEffect(() => {
    const guardado = leerProgreso<{
      secuencia: Analogia[]
      ensayos: EnsayoAnalogia[]
      notas: string
      tipoSonda: 'normal' | 'generalizacion' | 'mantenimiento'
      tamanoBloque: number
    }>(claveProgreso)
    if (guardado) {
      setTipoSonda(guardado.tipoSonda)
      setTamanoBloque(guardado.tamanoBloque)
      setSecuencia(guardado.secuencia)
      setEnsayos(guardado.ensayos)
      setNotas(guardado.notas)
      if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) {
        intentarGuardar(guardado.ensayos, guardado.notas, guardado.tipoSonda)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const actualizarEstado = () => setSinConexion(!navigator.onLine)
    actualizarEstado()
    const onOnline = () => {
      actualizarEstado()
      if (estadoGuardado === 'pendiente') {
        intentarGuardar(ensayos, notas, tipoSonda)
      }
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', actualizarEstado)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', actualizarEstado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoGuardado, ensayos, notas, tipoSonda, intentarGuardar])

  const empezarBloque = () => {
    if (analogias.length === 0) {
      toast('Añade alguna analogía antes de tomar datos.', 'error')
      return
    }
    setSecuencia(barajar(analogias).slice(0, Math.min(tamanoBloque, analogias.length)))
    setEnsayos([])
    setNotas('')
    setResultado(null)
    setEstadoGuardado('idle')
  }

  const registrar = (correcto: boolean, ayuda: string) => {
    if (!secuencia) return
    const analogiaActual = secuencia[ensayos.length]
    const respuestaCorrecta: 'igual' | 'distinta' = analogiaActual.par1_relacion === analogiaActual.par2_relacion ? 'igual' : 'distinta'
    const respuestaDada: 'igual' | 'distinta' = correcto ? respuestaCorrecta : (respuestaCorrecta === 'igual' ? 'distinta' : 'igual')

    const nuevos = [...ensayos, { analogiaId: analogiaActual.id, respuestaDada, correcto, ayuda }]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)

    if (nuevos.length === secuencia.length) {
      intentarGuardar(nuevos, notas, tipoSonda)
    }
  }

  const deshacerUltimo = () => setEnsayos((prev) => prev.slice(0, -1))

  useEffect(() => {
    if (!secuencia) return
    guardarProgreso(claveProgreso, { secuencia, ensayos, notas, tipoSonda, tamanoBloque })
  }, [secuencia, ensayos, notas, tipoSonda, tamanoBloque, claveProgreso])

  if (resultado) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6 text-center space-y-3">
        <p className="text-base sm:text-lg font-semibold text-emerald-800">
          Bloque guardado — {resultado.porcentaje}% de acierto
        </p>
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
        onReintentar={() => intentarGuardar(ensayos, notas, tipoSonda)}
        onVolver={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
      />
    )
  }

  if (!secuencia) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}

        {puedeSonda && (
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Tipo de bloque</p>
            <div className="flex gap-2">
              {(['normal', 'mantenimiento', 'generalizacion'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipoSonda(t)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                    tipoSonda === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
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
                className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                  tamanoBloque === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n} ensayos
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={empezarBloque}
          disabled={analogias.length === 0}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Generar secuencia y empezar
        </button>
        {analogias.length === 0 && (
          <p className="text-xs text-slate-500 text-center">Añade analogías desde la página del programa primero.</p>
        )}
      </Panel>
    )
  }

  const analogiaActual = secuencia[ensayos.length]

  if (!analogiaActual) {
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

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <p className="text-xs text-slate-500 mb-1">Par 1</p>
            <p className="text-lg font-semibold text-slate-800">{analogiaActual.par1_termino_a}</p>
            <p className="text-lg font-semibold text-slate-800">{analogiaActual.par1_termino_b}</p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <p className="text-xs text-slate-500 mb-1">Par 2</p>
            <p className="text-lg font-semibold text-slate-800">{analogiaActual.par2_termino_a}</p>
            <p className="text-lg font-semibold text-slate-800">{analogiaActual.par2_termino_b}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          ¿La relación del par 2 es igual o distinta a la del par 1?
        </p>

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
                  {i + 1}. {e.respuestaDada === 'igual' ? 'Igual relación' : 'Relación distinta'}
                  {e.ayuda !== 'independiente' ? ` (${e.ayuda})` : ''}
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
