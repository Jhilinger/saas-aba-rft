'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearConjuntoAlumno } from './actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

export default function NuevoConjuntoForm({ programaAlumnoId }: { programaAlumnoId: string }) {
  const [nombre, setNombre] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          const res = await crearConjuntoAlumno(programaAlumnoId, nombre)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          setNombre('')
          router.refresh()
        })
      }}
      className="flex flex-col sm:flex-row gap-2"
    >
            <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del conjunto (ej. Conjunto 2: colores secundarios)"
        className="w-full flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <Button type="submit" disabled={isPending} className="py-3 sm:py-2 text-base sm:text-sm">
        Añadir conjunto
      </Button>
    </form>
  )
}