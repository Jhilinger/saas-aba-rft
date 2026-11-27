'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../../../ui'
import { useToast } from '../../../../../providers/toast-provider'
import { crearEntrevista } from './actions'

// Empezar una entrevista: desde el principio o, si es evidente, desde un nivel
// más alto (lo anterior se da por «Sí» salvo que se conteste)
export default function NuevaEntrevista({ alumnoId }: { alumnoId: string }) {
  const [nivel, setNivel] = useState(1)
  const [modalidad, setModalidad] = useState<'vocal' | 'no_vocal'>('vocal')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()
  const empezar = () =>
    startTransition(async () => {
      const r = await crearEntrevista(alumnoId, nivel, modalidad)
      if ('error' in r) {
        toast(r.error ?? 'No se ha podido crear la entrevista', 'error')
        return
      }
      router.push(`/dashboard/alumnos/${alumnoId}/valoracion/entrevista/${r.id}`)
    })
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Empezar por</span>
          <select value={nivel} onChange={(e) => setNivel(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value={1}>El principio (nivel 1)</option>
            <option value={2}>El nivel 2 (se da por adquirido el 1)</option>
            <option value={3}>El nivel 3 (se dan por adquiridos el 1 y el 2)</option>
            <option value={4}>El nivel 4 (se dan por adquiridos del 1 al 3)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Lenguaje</span>
          <select value={modalidad} onChange={(e) => setModalidad(e.target.value as 'vocal' | 'no_vocal')} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="vocal">Con lenguaje vocal</option>
            <option value="no_vocal">Sin lenguaje vocal (comprobaciones por selección)</option>
          </select>
        </label>
      </div>
      <p className="text-xs text-slate-500">
        Empiece por un nivel más alto solo si es evidente (por ejemplo, un niño de 8 años que conversa con fluidez puede empezar en el nivel 3).
      </p>
      <Button onClick={empezar} disabled={isPending}>
        {isPending ? 'Creando…' : 'Empezar la entrevista'}
      </Button>
    </div>
  )
}
