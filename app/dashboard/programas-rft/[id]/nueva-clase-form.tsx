'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearClase } from './actions'
import { Button, Panel } from '../../../ui'

export default function NuevaClaseForm({
  programaAlumnoId,
  grupoActual,
}: {
  programaAlumnoId: string
  grupoActual: string
}) {
  const [nombre, setNombre] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          const res = await crearClase(programaAlumnoId, nombre, grupoActual)
          if (res.error) {
            setError(res.error)
            return
          }
          setError(null)
          setNombre('')
          router.refresh()
        })
      }}
      className="space-y-2"
    >
      <Panel className="flex gap-2 p-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={`Nombre de la nueva clase en "${grupoActual}" (ej. Clase 1)`}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={isPending}>
          Crear clase
        </Button>
      </Panel>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  )
}