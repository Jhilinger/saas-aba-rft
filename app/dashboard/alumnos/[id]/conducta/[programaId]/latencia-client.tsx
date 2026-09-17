'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { guardarBloqueLatencia, editarBloqueLatencia, eliminarBloqueLatencia } from './actions'
import { useConfirm } from '../../../../../providers/confirm-provider'
import { useToast } from '../../../../../providers/toast-provider'
import { Button, Panel } from '../../../../../ui'

type Bloque = {
  id: string
  fecha: string
  fase: 'linea_base' | 'intervencion'
  numero_ensayos: number
  latencia_total_segundos: number
  latencia_media_segundos: number
  notas: string | null
}

function formatearSegundos(s: number) {
  const m = Math.floor(s / 60)
  const seg = (s % 60).toFixed(1)
  return m > 0 ? `${m}:${seg.padStart(4, '0')}` : `${seg}s`
}

export default function LatenciaClient({
  programaAlumnoId,
  bloquesIniciales,
  alumnoId: alumnoIdProp,
}: {
  programaAlumnoId: string
  bloquesIniciales: Bloque[]
  alumnoId?: string
}) {
  const params = useParams()
  const alumnoId = alumnoIdProp ?? (params.id as string)

  const [bloqueActivo, setBloqueActivo] = useState(false)
  const [ensayoActivo, setEnsayoActivo] = useState(false)
  const [segundosEnsayo, setSegundosEnsayo] = useState(0)
  const [numeroEnsayos, setNumeroEnsayos] = useState(0)
  const [latenciaTotal, setLatenciaTotal] = useState(0)
  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{ numeroEnsayos: number; latenciaTotal: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editEnsayos, setEditEnsayos] = useState(0)
  const [editLatencia, setEditLatencia] = useState(0)
  const [editNotas, setEditNotas] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  useEffect(() => {
    if (ensayoActivo) {
      intervalRef.current = setInterval(() => setSegundosEnsayo((s) => s + 0.1), 100)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [ensayoActivo])

  const iniciarBloque = () => {
    setNumeroEnsayos(0)
    setLatenciaTotal(0)
    setResultado(null)
    setBloqueActivo(true)
  }

  const iniciarEnsayo = () => {
    setSegundosEnsayo(0)
    setEnsayoActivo(true)
  }

  const registrarRespuesta = () => {
    setEnsayoActivo(false)
    setLatenciaTotal((l) => l + segundosEnsayo)
    setNumeroEnsayos((n) => n + 1)
  }

  const finalizarBloque = () => {
    setEnsayoActivo(false)
    setBloqueActivo(false)
    setResultado({ numeroEnsayos, latenciaTotal })
  }

  const guardar = () => {
    if (!resultado || resultado.numeroEnsayos === 0) return
    startTransition(async () => {
      const res = await guardarBloqueLatencia(
        programaAlumnoId,
        alumnoId,
        resultado.numeroEnsayos,
        Math.round(resultado.latenciaTotal * 10) / 10,
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

  const empezarEdicion = (b: Bloque) => {
    setEditandoId(b.id)
    setEditEnsayos(b.numero_ensayos)
    setEditLatencia(b.latencia_total_segundos)
    setEditNotas(b.notas ?? '')
  }

  const guardarEdicion = () => {
    startTransition(async () => {
      const res = await editarBloqueLatencia(editandoId!, alumnoId, programaAlumnoId, editEnsayos, editLatencia, editNotas)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque actualizado', 'exito')
      setEditandoId(null)
      router.refresh()
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar bloque',
      mensaje: '¿Eliminar este bloque de latencia? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarBloqueLatencia(id, alumnoId, programaAlumnoId)
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
      <Panel className="p-4 sm:p-6 space-y-4 text-center">
        {!bloqueActivo && !resultado && (
          <Button onClick={iniciarBloque} className="w-full py-4 text-lg">
            Iniciar bloque
          </Button>
        )}

        {bloqueActivo && (
          <>
            <div className="flex justify-around text-sm text-slate-500">
              <div>
                <p className="text-xs">Ensayos</p>
                <p className="text-2xl font-bold text-indigo-600">{numeroEnsayos}</p>
              </div>
              <div>
                <p className="text-xs">Latencia acumulada</p>
                <p className="text-2xl font-mono font-bold text-slate-800">{formatearSegundos(latenciaTotal)}</p>
              </div>
            </div>

            {ensayoActivo ? (
              <>
                <p className="text-4xl font-mono font-bold text-rose-600">{formatearSegundos(segundosEnsayo)}</p>
                <Button
                  variant="danger"
                  onClick={registrarRespuesta}
                  className="w-full py-5 text-xl font-bold active:scale-95"
                >
                  Respondió
                </Button>
              </>
            ) : (
              <Button
                variant="warning"
                onClick={iniciarEnsayo}
                className="w-full py-5 text-xl font-bold active:scale-95"
              >
                Dar instrucción / iniciar ensayo
              </Button>
            )}

            <button
              onClick={finalizarBloque}
              disabled={ensayoActivo}
              className="w-full rounded-lg bg-slate-700 py-3 text-base font-semibold text-white hover:bg-slate-600 disabled:opacity-50"
            >
              Finalizar bloque
            </button>
          </>
        )}

        {resultado && (
          <div className="space-y-3">
            <p className="text-slate-600">
              {resultado.numeroEnsayos} ensayo{resultado.numeroEnsayos !== 1 ? 's' : ''}
              {resultado.numeroEnsayos > 0 && (
                <>
                  {' '}— latencia media:{' '}
                  <strong>{formatearSegundos(resultado.latenciaTotal / resultado.numeroEnsayos)}</strong>
                </>
              )}
            </p>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas (opcional)"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <Button onClick={guardar} disabled={isPending || resultado.numeroEnsayos === 0} className="flex-1 py-3 text-base">
                Guardar bloque
              </Button>
              <Button
                variant="secondary"
                onClick={() => setResultado(null)}
                className="px-4 py-3 text-sm font-medium"
              >
                Descartar
              </Button>
            </div>
          </div>
        )}
      </Panel>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
        {bloquesIniciales.map((b) => (
          <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm space-y-2">
            {editandoId === b.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Nº ensayos</label>
                    <input
                      type="number"
                      value={editEnsayos}
                      onChange={(e) => setEditEnsayos(parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Latencia total (seg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editLatencia}
                      onChange={(e) => setEditLatencia(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <textarea
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  placeholder="Notas"
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
                />
                <div className="flex gap-3">
                  <button onClick={guardarEdicion} disabled={isPending} className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
                    Guardar
                  </button>
                  <button onClick={() => setEditandoId(null)} className="text-xs text-slate-500 hover:text-slate-700">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700">
                    {new Date(b.fecha).toLocaleDateString('es-ES')} — {b.numero_ensayos} ensayo
                    {b.numero_ensayos !== 1 ? 's' : ''}
                    {b.fase === 'linea_base' && ' · Línea base'}
                  </p>
                  <p className="text-xs text-slate-500">Latencia media: {formatearSegundos(b.latencia_media_segundos)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => empezarEdicion(b)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                    Editar
                  </button>
                  <button onClick={() => borrar(b.id)} className="text-xs font-medium text-rose-700 hover:text-rose-800">
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {bloquesIniciales.length === 0 && <p className="text-center text-slate-500 py-4">Sin bloques todavía.</p>}
      </div>
    </div>
  )
}
