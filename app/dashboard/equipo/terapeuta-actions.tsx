'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { desactivarTerapeuta, reactivarTerapeuta } from './actions'

export default function TerapeutaActions({ id, activo }: { id: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (activo) {
    return (
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm('¿Desactivar a este terapeuta? Perderá acceso, pero su historial se conserva.')) return
          startTransition(async () => {
            await desactivarTerapeuta(id)
            router.refresh()
          })
        }}
        className="text-xs font-medium text-rose-500 hover:text-rose-700"
      >
        Desactivar
      </button>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await reactivarTerapeuta(id)
          router.refresh()
        })
      }}
      className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
    >
      Reactivar
    </button>
  )
}