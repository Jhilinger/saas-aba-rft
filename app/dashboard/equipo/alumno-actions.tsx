'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { archivarAlumno, reactivarAlumno } from './actions'

export default function AlumnoActions({ id, activo }: { id: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (activo) {
    return (
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm('¿Archivar este alumno? Se conservará todo su historial, pero dejará de aparecer como activo.')) return
          startTransition(async () => {
            await archivarAlumno(id)
            router.refresh()
          })
        }}
        className="text-xs font-medium text-rose-500 hover:text-rose-700"
      >
        Archivar
      </button>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await reactivarAlumno(id)
          router.refresh()
        })
      }}
      className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
    >
      Reactivar
    </button>
  )
}