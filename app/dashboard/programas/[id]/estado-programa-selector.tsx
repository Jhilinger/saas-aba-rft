'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { actualizarEstadoPrograma } from './actions'
import { useToast } from '../../../providers/toast-provider'

const OPCIONES = [
  { value: 'adquisicion', label: 'En adquisición' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'dominado', label: 'Dominado' },
  { value: 'pausado', label: 'Pausado' },
]

const COLOR: Record<string, string> = {
  adquisicion: 'text-amber-700 bg-amber-50 border-amber-200',
  mantenimiento: 'text-blue-700 bg-blue-50 border-blue-200',
  dominado: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  pausado: 'text-slate-500 bg-slate-100 border-slate-200',
}

export default function EstadoProgramaSelector({
  programaAlumnoId,
  alumnoId,
  estadoActual,
}: {
  programaAlumnoId: string
  alumnoId: string
  estadoActual: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const cambiar = (nuevoEstado: string) => {
    if (nuevoEstado === estadoActual) return
    startTransition(async () => {
      const res = await actualizarEstadoPrograma(programaAlumnoId, alumnoId, nuevoEstado as any)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Estado del programa actualizado', 'exito')
      router.refresh()
    })
  }

  return (
    <select
      value={estadoActual}
      onChange={(e) => cambiar(e.target.value)}
      disabled={isPending}
      className={`rounded-lg border px-2 py-1 text-xs font-medium ${COLOR[estadoActual] ?? 'text-slate-600 bg-slate-50 border-slate-200'} disabled:opacity-50`}
    >
      {!OPCIONES.some((o) => o.value === estadoActual) && (
        <option value={estadoActual}>{estadoActual}</option>
      )}
      {OPCIONES.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}