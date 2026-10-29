'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearEvaluacion } from './actions'
import { useToast } from '../../../../../providers/toast-provider'
import { Button } from '../../../../../ui'

export default function NuevaEvaluacion({ alumnoId }: { alumnoId: string }) {
  const [modalidad, setModalidad] = useState<'vocal' | 'no_vocal'>('vocal')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const crear = () =>
    startTransition(async () => {
      const res = await crearEvaluacion(alumnoId, modalidad)
      if ('error' in res) {
        toast(res.error ?? 'No se pudo crear la evaluación', 'error')
        return
      }
      router.push(`/dashboard/alumnos/${alumnoId}/valoracion/estandarizada/${res.id}`)
    })

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <select
        value={modalidad}
        onChange={(e) => setModalidad(e.target.value as 'vocal' | 'no_vocal')}
        className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      >
        <option value="vocal">Alumno con lenguaje vocal</option>
        <option value="no_vocal">Sin lenguaje vocal (variantes por selección)</option>
      </select>
      <Button onClick={crear} disabled={isPending}>
        Nueva evaluación
      </Button>
    </div>
  )
}
