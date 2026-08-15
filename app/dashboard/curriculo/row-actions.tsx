'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarPrograma, togglePrograma } from './actions'

export default function ProgramaRowActions({
  id,
  activo,
}: {
  id: string
  activo: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className="flex gap-3">
      <button
        onClick={() => {
          startTransition(async () => {
            await togglePrograma(id, activo)
            router.refresh()
          })
        }}
        disabled={isPending}
        className="text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50"
      >
        {activo ? 'Desactivar' : 'Activar'}
      </button>
      <button
        onClick={() => {
          if (!confirm('¿Eliminar este programa del currículo base?')) return
          startTransition(async () => {
            await eliminarPrograma(id)
            router.refresh()
          })
        }}
        disabled={isPending}
        className="text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  )
}