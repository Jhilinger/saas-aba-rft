'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearClaseRftBase } from '../actions'

export default function NuevaClaseRftForm({ programaBaseId }: { programaBaseId: string }) {
  const [nombre, setNombre] = useState('')
  const [grupo, setGrupo] = useState('Grupo 1')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          await crearClaseRftBase(programaBaseId, nombre, grupo)
          setNombre('')
          router.refresh()
        })
      }}
      className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-slate-200 bg-white p-4"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la clase"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <input
        value={grupo}
        onChange={(e) => setGrupo(e.target.value)}
        placeholder="Grupo (ej. Grupo 1)"
        className="w-full sm:w-40 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Añadir clase
      </button>
    </form>
  )
}