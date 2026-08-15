'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { desactivarTerapeuta, reactivarTerapeuta } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

export default function TerapeutaActions({ id, activo }: { id: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  if (activo) {
    return (
      <button
        disabled={isPending}
        onClick={async () => {
          const ok = await confirmar({
            titulo: 'Desactivar terapeuta',
            mensaje: '¿Desactivar a este terapeuta? Perderá acceso, pero su historial se conserva.',
            textoConfirmar: 'Desactivar',
            peligroso: true,
          })
          if (!ok) return
          startTransition(async () => {
            const res = await desactivarTerapeuta(id)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            toast('Terapeuta desactivado', 'exito')
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
          const res = await reactivarTerapeuta(id)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          toast('Terapeuta reactivado', 'exito')
          router.refresh()
        })
      }}
      className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
    >
      Reactivar
    </button>
  )
}