'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarTerapeuta } from './actions'

export default function DeleteTerapeutaButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (!confirm('¿Eliminar este terapeuta? Perderá acceso al sistema.')) return
        startTransition(async () => {
          await eliminarTerapeuta(id)
          router.refresh()
        })
      }}
      disabled={isPending}
      className="text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}