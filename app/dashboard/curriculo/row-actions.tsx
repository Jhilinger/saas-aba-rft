'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarPrograma, togglePrograma, clonarPrograma } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

export default function ProgramaRowActions({
  id,
  activo,
}: {
  id: string
  activo: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <div className="flex gap-3">
      <button
        onClick={() => {
          startTransition(async () => {
            const res = await clonarPrograma(id)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            toast('Programa clonado', 'exito')
            router.refresh()
          })
        }}
        disabled={isPending}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
      >
        Clonar
      </button>
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
        onClick={async () => {
          const ok = await confirmar({
            titulo: 'Eliminar programa',
            mensaje: '¿Eliminar este programa? No se puede deshacer.',
            textoConfirmar: 'Eliminar',
            peligroso: true,
          })
          if (!ok) return
          startTransition(async () => {
            const res = await eliminarPrograma(id)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            toast('Programa eliminado', 'exito')
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