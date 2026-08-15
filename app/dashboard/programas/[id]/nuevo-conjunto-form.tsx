'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearConjuntoAlumno } from './actions'

export default function NuevoConjuntoForm({ programaAlumnoId }: { programaAlumnoId: string }) {
  const [nombre, setNombre] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          await crearConjuntoAlumno(programaAlumnoId, nombre)
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
        className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Añadir conjunto
      </button>
    </form>
  )
}