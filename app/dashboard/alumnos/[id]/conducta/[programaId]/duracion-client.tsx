'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { guardarBloqueDuracion, eliminarBloqueDuracion } from './actions'
import { useConfirm } from '../../../../../providers/confirm-provider'
import { useToast } from '../../../../../providers/toast-provider'

type Bloque = {
  id: string
  fecha: string
  fase: 'linea_base' | 'intervencion'
  duracion_sesion_segundos: number
  numero_episodios: number
  duracion_total_conducta_segundos: number
  porcentaje: number
  notas: string | null
}

function formatearSegundos(s: number) {
  const m = Math.floor(s / 60)
  const seg = s % 60
  return `${m}:${seg.toString().padStart(2, '0')}`
}

export default function DuracionClient({
  programaAlumnoId,
  bloquesIniciales,
}: {
  programaAlumnoId: string
  bloquesIniciales: Bloque[]
}) {
  const params = useParams()
  const alumnoId = params.id as string

  const [sesionActiva, setSesionActiva] = useState(false)
  const [segundosSesion, setSegundosSesion] = useState(0)
  const [episodioActivo, setEpisodioActivo] = useState(false)
  const [segundosEpisodio, setSegundosEpisodio] = useState(0)
  const [numeroEpisodios, setNumeroEpisodios] = useState(0)
  const [duracionTotalConducta, setDuracionTotalConducta] = useState(0)
  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{
    segundosSesion: number
    numeroEpisodios: number
    duracionTotalConducta: number
  } | null>(null)
  const [isPending, startTransition] = useTransition()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  useEffect(() => {
    if (sesionActiva) {
      intervalRef.current = setInterval(() => {
        setSegundosSesion((s) => s + 1)
        if (episodioActivo) setSegundosEpisodio((s) => s + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sesionActiva, episodioActivo])

  const iniciarSesion = () => {
    setSegundosSesion(0)
    setNumeroEpisodios(0)
    setDuracionTotalConducta(0)
    setResultado(null)
    setSesionActiva(true)
  }

  const iniciarEpisodio = () => {
    setSegundosEpisodio(0)
    setEpisodioActivo(true)
  }

  const detenerEpisodio = () => {
    setEpisodioActivo(false)
    setDuracionTotalConducta((d) => d + segundosEpisodio)
    setNumeroEpisodios((n) => n + 1)
  }

  const finalizarSesion = () => {
    if (episodioActivo) detenerEpisodio()
    setSesionActiva(false)
    setResultado({
      segundosSesion,
      numeroEpisodios: episodioActivo ? numeroEpisodios + 1 : numeroEpisodios,
      duracionTotalConducta: episodioActivo ? duracionTotalConducta + segundosEpisodio : duracionTotalConducta,
    })
  }
    const guardar = () => {
    if (!resultado) return
    startTransition(async () => {
      const res = await guardarBloqueDuracion(
        programaAlumnoId,
        alumnoId,
        resultado.segundosSesion,
        resultado.numeroEpisodios,
        resultado.duracionTotalConducta,
        notas
      )
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
      mensaje: '¿Eliminar este bloque de duración? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarBloqueDuracion(id, alumnoId, programaAlumnoId)
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
        {!sesionActiva && !resultado && (
          <button
            onClick={iniciarSesion}
            className="w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-500"
          >
            Iniciar sesión
          </button>
        )}

        {sesionActiva && (
          <>
            <div className="flex justify-around text-sm text-slate-500">
              <div>
                <p className="text-xs">Sesión</p>
                <p className="text-2xl font-mono font-bold text-slate-800">{formatearSegundos(segundosSesion)}</p>
              </div>
              <div>
                <p className="text-xs">Episodios</p>
                <p className="text-2xl font-bold text-indigo-600">{numeroEpisodios}</p>
              </div>
              <div>
                <p className="text-xs">Conducta acumulada</p>
                <p className="text-2xl font-mono font-bold text-slate-800">{formatearSegundos(duracionTotalConducta)}</p>
              </div>
            </div>

            {episodioActivo ? (
              <>
                <p className="text-4xl font-mono font-bold text-rose-600">{formatearSegundos(segundosEpisodio)}</p>
                <button
                  onClick={detenerEpisodio}
                  className="w-full rounded-lg bg-rose-600 py-5 text-xl font-bold text-white hover:bg-rose-500 active:scale-95"
                >
                  Detener episodio
                </button>
              </>
            ) : (
              <button
                onClick={iniciarEpisodio}
                className="w-full rounded-lg bg-amber-500 py-5 text-xl font-bold text-white hover:bg-amber-400 active:scale-95"
              >
                Iniciar episodio de conducta
              </button>
            )}

            <button
              onClick={finalizarSesion}
              className="w-full rounded-lg bg-slate-700 py-3 text-base font-semibold text-white hover:bg-slate-600"
            >
              Finalizar sesión
            </button>
          </>
        )}
                {resultado && (
          <div className="space-y-3">
            <p className="text-slate-600">
              {resultado.numeroEpisodios} episodio{resultado.numeroEpisodios !== 1 ? 's' : ''}, con{' '}
              {formatearSegundos(resultado.duracionTotalConducta)} de conducta en una sesión de{' '}
              {formatearSegundos(resultado.segundosSesion)} —{' '}
              <strong>
                {Math.round((resultado.duracionTotalConducta / Math.max(resultado.segundosSesion, 1)) * 100)}%
              </strong>{' '}
              del tiempo
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
                {new Date(b.fecha).toLocaleDateString('es-ES')} — {b.numero_episodios} episodio
                {b.numero_episodios !== 1 ? 's' : ''}, {formatearSegundos(b.duracion_total_conducta_segundos)} de{' '}
                {formatearSegundos(b.duracion_sesion_segundos)}
                {b.fase === 'linea_base' && ' · Línea base'}
              </p>
              <p className="text-xs text-slate-400">{b.porcentaje}% del tiempo</p>
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