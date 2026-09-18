'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearPasoAlumno, eliminarPasoAlumno, cambiarEstadoPaso } from './analisis-tareas-actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'
import type { Enums } from '@/database.types'

type Paso = {
  id: string
  nombre: string
  descripcion: string | null
  orden: number
  estado: Enums<'estado_programa_alumno'>
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  linea_base: { label: 'Línea base', color: 'bg-sky-50 text-sky-700' },
  adquisicion: { label: 'En enseñanza', color: 'bg-amber-50 text-amber-700' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-blue-50 text-blue-700' },
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700' },
  pausado: { label: 'Pausado', color: 'bg-slate-100 text-slate-500' },
}

export default function PasosTareaPanel({
  pasos,
  programaAlumnoId,
  pasoObjetivoId,
}: {
  pasos: Paso[]
  programaAlumnoId: string
  pasoObjetivoId: string | null
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <Panel className="p-4 sm:p-5 space-y-4">
      <h2 className="text-sm font-semibold text-slate-700">Pasos de la cadena</h2>

      <div className="space-y-2">
        {pasos.map((p) => {
          const info = ETIQUETA_ESTADO[p.estado] ?? { label: p.estado, color: 'bg-slate-100 text-slate-500' }
          const esObjetivo = p.id === pasoObjetivoId
          return (
            <div
              key={p.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                esObjetivo ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400">Paso {p.orden}</span>
                  <span className="text-sm font-medium text-slate-800">{p.nombre}</span>
                  {esObjetivo && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                      Objetivo actual
                    </span>
                  )}
                </div>
                {p.descripcion && <p className="text-xs text-slate-500">{p.descripcion}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={p.estado}
                  onChange={(e) => {
                    startTransition(async () => {
                      const res = await cambiarEstadoPaso(
                        p.id,
                        programaAlumnoId,
                        e.target.value as Enums<'estado_programa_alumno'>
                      )
                      if (res?.error) {
                        toast(res.error, 'error')
                        return
                      }
                      router.refresh()
                    })
                  }}
                  disabled={isPending}
                  aria-label={`Estado del paso ${p.nombre}`}
                  className={`rounded-lg border px-2 py-1 text-xs font-medium ${info.color} disabled:opacity-50`}
                >
                  {Object.entries(ETIQUETA_ESTADO).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={async () => {
                    const ok = await confirmar({
                      titulo: 'Eliminar paso',
                      mensaje: `¿Eliminar "${p.nombre}"? Se perderán también los resultados registrados de este paso. No se puede deshacer.`,
                      textoConfirmar: 'Eliminar',
                      peligroso: true,
                    })
                    if (!ok) return
                    startTransition(async () => {
                      const res = await eliminarPasoAlumno(p.id, programaAlumnoId)
                      if (res?.error) {
                        toast(res.error, 'error')
                        return
                      }
                      router.refresh()
                    })
                  }}
                  disabled={isPending}
                  className="text-xs font-medium text-rose-700 hover:text-rose-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}
        {pasos.length === 0 && <p className="text-sm text-slate-500 text-center py-2">Sin pasos todavía.</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombre.trim()) return
          startTransition(async () => {
            const res = await crearPasoAlumno(programaAlumnoId, nombre, descripcion)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            setNombre('')
            setDescripcion('')
            router.refresh()
          })
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del paso"
          className="w-full flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
          className="w-full flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <Button type="submit" disabled={isPending} className="py-3 sm:py-2 text-base sm:text-sm">
          Añadir paso
        </Button>
      </form>
    </Panel>
  )
}
