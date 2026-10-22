'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { desactivarTerapeuta, reactivarTerapeuta, eliminarPerfil } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

export default function TerapeutaActions({ id, activo }: { id: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  // Solo funciona si no tiene actividad registrada (creado por error, email
  // mal escrito...); si la tiene, el servidor lo impide y lo explica
  const eliminar = async () => {
    const ok = await confirmar({
      titulo: 'Eliminar terapeuta',
      mensaje:
        'Se borrará su cuenta por completo. Solo es posible si no ha registrado ninguna actividad (por ejemplo, si se creó por error o con el email mal escrito). Si ya ha trabajado con alumnos, desactívalo.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarPerfil(id)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Terapeuta eliminado', 'exito')
      router.refresh()
    })
  }

  return (
    <div className="flex gap-3">
      {activo ? (
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
          className="text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          Desactivar
        </button>
      ) : (
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
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          Reactivar
        </button>
      )}
      <button disabled={isPending} onClick={eliminar} className="text-xs font-medium text-rose-700 hover:text-rose-800">
        Eliminar
      </button>
    </div>
  )
}
