'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearConjuntoBase } from '../actions'

export default function NuevoConjuntoForm({ programaBaseId }: { programaBaseId: string }) {
  const [nombre, setNombre] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          await crearConjuntoBase(programaBaseId, nombre)
          setNombre('')
          router.refresh()
        })
      }}
      className="flex gap-2"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del conjunto (ej. Conjunto 1: colores primarios)"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Añadir conjunto
      </button>
    </form>
  )
}