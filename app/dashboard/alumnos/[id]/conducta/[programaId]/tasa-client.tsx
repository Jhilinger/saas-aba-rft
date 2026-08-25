'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { guardarBloqueTasa, eliminarBloqueTasa } from './actions'
import { useConfirm } from '../../../../../providers/confirm-provider'
import { useToast } from '../../../../../providers/toast-provider'

type Bloque = {
  id: string
  fecha: string
  fase: 'linea_base' | 'intervencion'
  duracion_observacion_segundos: number
  numero_ocurrencias: number
  tasa_por_minuto: number
  notas: string | null
}

function formatearSegundos(s: number) {
  const m = Math.floor(s / 60)
  const seg = s % 60
  return `${m}:${seg.toString().padStart(2, '0')}`
}

export default function TasaClient({
  programaAlumnoId,
  bloquesIniciales,
}: {
  programaAlumnoId: string
  bloquesIniciales: Bloque[]
}) {
  const params = useParams()
  const alumnoId = params.id as string
  const [observando, setObservando] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [ocurrencias, setOcurrencias] = useState(0)
  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{ segundos: number; ocurrencias: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  useEffect(() => {
    if (observando) {
      intervalRef.current = setInterval(() => setSegundos((s) => s + 1), 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [observando])

  const empezar = () => {
    setSegundos(0)
    setOcurrencias(0)
    setResultado(null)
    setObservando(true)
  }

  const detener = () => {
    setObservando(false)
    setResultado({ segundos, ocurrencias })
  }

  const guardar = () => {
    if (!resultado) return
    startTransition(async () => {
      const res = await guardarBloqueTasa(programaAlumnoId, alumnoId, resultado.segundos, resultado.ocurrencias, notas)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque guardado', 'exito')
      setResultado(null)
      setNotas('')
      router.refresh()
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar bloque',
      mensaje: '¿Eliminar este bloque de tasa? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarBloqueTasa(id, alumnoId, programaAlumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque eliminado', 'exito')
      router.refresh()
    })
  }
    return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 text-center">
        {!observando && !resultado && (
          <button
            onClick={empezar}
            className="w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-500"
          >
            Iniciar observación
          </button>
        )}

        {observando && (
          <>
            <p className="text-4xl font-mono font-bold text-slate-800">{formatearSegundos(segundos)}</p>
            <p className="text-5xl font-bold text-indigo-600">{ocurrencias}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOcurrencias((o) => o + 1)}
                className="flex-1 rounded-lg bg-emerald-600 py-6 text-2xl font-bold text-white hover:bg-emerald-500 active:scale-95"
              >
                +1
              </button>
              <button
                onClick={() => setOcurrencias((o) => Math.max(0, o - 1))}
                className="rounded-lg bg-slate-100 px-5 text-lg font-semibold text-slate-600 hover:bg-slate-200"
              >
                −1
              </button>
            </div>
            <button
              onClick={detener}
              className="w-full rounded-lg bg-rose-600 py-3 text-base font-semibold text-white hover:bg-rose-500"
            >
              Detener observación
            </button>
          </>
        )}

        {resultado && (
          <div className="space-y-3">
            <p className="text-slate-600">
              {resultado.ocurrencias} ocurrencias en {formatearSegundos(resultado.segundos)} —{' '}
              <strong>{((resultado.ocurrencias / Math.max(resultado.segundos, 1)) * 60).toFixed(2)} / min</strong>
            </p>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas (opcional)"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={guardar}
                disabled={isPending}
                className="flex-1 rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Guardar bloque
              </button>
              <button
                onClick={() => setResultado(null)}
                className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Descartar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
        {bloquesIniciales.map((b) => (
          <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between text-sm">
            <div>
              <p className="text-slate-700">
                {new Date(b.fecha).toLocaleDateString('es-ES')} — {b.numero_ocurrencias} en{' '}
                {formatearSegundos(b.duracion_observacion_segundos)}
                {b.fase === 'linea_base' && ' · Línea base'}
              </p>
              <p className="text-xs text-slate-400">{b.tasa_por_minuto} / min</p>
            </div>
            <button onClick={() => borrar(b.id)} className="text-xs font-medium text-rose-500 hover:text-rose-700">
              Eliminar
            </button>
          </div>
        ))}
        {bloquesIniciales.length === 0 && <p className="text-center text-slate-400 py-4">Sin bloques todavía.</p>}
      </div>
    </div>
  )
}