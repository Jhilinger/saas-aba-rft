'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueAnalisisTareas } from './analisis-tareas-actions'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'

type Paso = { id: string; nombre: string; orden: number }
type Bloque = { id: string; fecha: string; notas: string | null; total: number; independientes: number }

export default function AnalisisTareasClient({
  programaAlumnoId,
  pasos,
  bloquesIniciales,
}: {
  programaAlumnoId: string
  pasos: Paso[]
  bloquesIniciales: Bloque[]
}) {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({})
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const toggle = (pasoId: string) => {
    setMarcados((m) => ({ ...m, [pasoId]: !m[pasoId] }))
  }

  const guardar = () => {
    const resultados = pasos.map((p) => ({ pasoId: p.id, independiente: !!marcados[p.id] }))
    startTransition(async () => {
      const res = await guardarBloqueAnalisisTareas(programaAlumnoId, resultados, notas)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Sondeo guardado', 'exito')
      setMarcados({})
      setNotas('')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <Panel className="p-4 sm:p-6 space-y-4">
        <p className="text-sm font-semibold text-slate-700">Nuevo sondeo de la cadena completa</p>
        <p className="text-xs text-slate-500">
          Marca los pasos que el alumno hizo de forma independiente en este sondeo.
        </p>
        <div className="space-y-2">
          {pasos.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={!!marcados[p.id]}
                onChange={() => toggle(p.id)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-slate-400 text-xs font-semibold">{p.orden}.</span>
              <span className="text-slate-800">{p.nombre}</span>
            </label>
          ))}
          {pasos.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-2">Añade pasos antes de registrar un sondeo.</p>
          )}
        </div>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas (opcional)"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <Button onClick={guardar} disabled={isPending || pasos.length === 0} className="w-full py-3 text-base">
          Guardar sondeo
        </Button>
      </Panel>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
        {bloquesIniciales.map((b) => (
          <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">{new Date(b.fecha).toLocaleDateString('es-ES')}</span>
              <span className="text-xs font-semibold text-slate-600">
                {b.independientes}/{b.total} pasos independientes (
                {b.total > 0 ? Math.round((b.independientes / b.total) * 100) : 0}%)
              </span>
            </div>
            {b.notas && <p className="mt-1 text-xs text-slate-500">{b.notas}</p>}
          </div>
        ))}
        {bloquesIniciales.length === 0 && <p className="text-center text-slate-500 py-4">Sin sondeos todavía.</p>}
      </div>
    </div>
  )
}
