'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  obtenerHistorialBloques,
  obtenerDetalleBloque,
  editarBloqueAba,
} from '../../tomar-datos/aba/[conjuntoId]/actions'
import { useToast } from '../../../providers/toast-provider'

type Bloque = {
  id: string
  total_ensayos: number
  aciertos: number
  porcentaje: number
  notas: string | null
  fase: 'linea_base' | 'intervencion'
  fecha: string
}

type EnsayoDetalle = {
  id: string
  estimuloId: string
  estimuloNombre: string
  correcto: boolean
  ayuda: string
}

const AYUDAS = [
  { value: 'independiente', label: 'Sin ayuda' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'verbal_parcial', label: 'Verbal parcial' },
  { value: 'gestual', label: 'Gestual' },
  { value: 'visual', label: 'Visual' },
  { value: 'modelado', label: 'Modelado' },
  { value: 'fisica_parcial', label: 'Física parcial' },
  { value: 'fisica_total', label: 'Física total' },
  { value: 'textual', label: 'Textual' },
]

export default function HistorialBloques({
  conjuntoId,
  programaAlumnoId,
  alumnoId,
}: {
  conjuntoId: string
  programaAlumnoId: string
  alumnoId: string
}) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [bloques, setBloques] = useState<Bloque[] | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<EnsayoDetalle[]>([])
  const [notasEditando, setNotasEditando] = useState('')
  const [faseEditando, setFaseEditando] = useState<'linea_base' | 'intervencion'>('intervencion')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const cargarHistorial = () => {
    setAbierto((v) => !v)
    if (bloques === null) {
      setCargando(true)
      obtenerHistorialBloques(conjuntoId).then((res) => {
        setBloques(res as any)
        setCargando(false)
      })
    }
  }

  const empezarEdicion = (bloque: Bloque) => {
    setEditandoId(bloque.id)
    setNotasEditando(bloque.notas ?? '')
    setFaseEditando(bloque.fase)
    obtenerDetalleBloque(bloque.id).then((res) => setDetalle(res as any))
  }

  const cambiarEnsayo = (id: string, cambios: Partial<EnsayoDetalle>) => {
    setDetalle((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e)))
  }

  const guardar = () => {
    startTransition(async () => {
      const res = await editarBloqueAba(
        editandoId!,
        conjuntoId,
        programaAlumnoId,
        alumnoId,
        detalle.map((e) => ({ id: e.id, correcto: e.correcto, ayuda: e.ayuda })),
        notasEditando
      )
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque corregido', 'exito')
      setEditandoId(null)
      setBloques(null)
      router.refresh()
    })
  }
  return (
    <div className="pt-2 border-t border-slate-100">
      <button
        onClick={cargarHistorial}
        className="text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        {abierto ? 'Ocultar' : 'Ver'} historial de bloques
      </button>

      {abierto && (
        <div className="mt-2 space-y-2">
          {cargando && <p className="text-xs text-slate-400">Cargando...</p>}

          {bloques?.map((b) => (
            <div key={b.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  {new Date(b.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                  {' · '}
                  {b.porcentaje}% ({b.aciertos}/{b.total_ensayos})
                  {b.fase === 'linea_base' && ' · Línea base'}
                </span>
                <button
                  onClick={() => (editandoId === b.id ? setEditandoId(null) : empezarEdicion(b))}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {editandoId === b.id ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {editandoId === b.id && (
                <div className="space-y-2 border-t border-slate-200 pt-2">
                  {detalle.length === 0 && <p className="text-slate-400">Cargando ensayos...</p>}
                  {detalle.map((e, i) => (
                    <div key={e.id} className="flex flex-wrap items-center gap-2 rounded bg-white px-2 py-1.5">
                      <span className="w-6 text-slate-400">{i + 1}.</span>
                      <span className="flex-1 min-w-[80px] font-medium text-slate-700">{e.estimuloNombre}</span>
                      <button
                        onClick={() => cambiarEnsayo(e.id, { correcto: true, ayuda: faseEditando === 'linea_base' ? 'independiente' : e.ayuda })}
                        className={`rounded px-2 py-1 ${e.correcto ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => cambiarEnsayo(e.id, { correcto: false, ayuda: 'independiente' })}
                        className={`rounded px-2 py-1 ${!e.correcto ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                      >
                        ✗
                      </button>
                      {faseEditando !== 'linea_base' && (
                        <select
                          value={e.ayuda}
                          onChange={(ev) => cambiarEnsayo(e.id, { ayuda: ev.target.value })}
                          disabled={!e.correcto}
                          className="rounded border border-slate-300 px-1 py-1 text-xs disabled:opacity-40"
                        >
                          {AYUDAS.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}

                  <textarea
                    value={notasEditando}
                    onChange={(e) => setNotasEditando(e.target.value)}
                    placeholder="Notas (opcional)"
                    rows={2}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />

                  <button
                    onClick={guardar}
                    disabled={isPending || detalle.length === 0}
                    className="w-full rounded bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isPending ? 'Guardando...' : 'Guardar corrección'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {bloques?.length === 0 && <p className="text-xs text-slate-400">Sin bloques registrados todavía.</p>}
        </div>
      )}
    </div>
  )
}