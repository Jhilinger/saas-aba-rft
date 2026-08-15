'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { archivarAlumno, reactivarAlumno } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

export default function AlumnoActions({ id, activo }: { id: string; activo: boolean }) {
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
            titulo: 'Archivar alumno',
            mensaje: 'Se conservará todo su historial, pero dejará de aparecer como activo.',
            textoConfirmar: 'Archivar',
            peligroso: true,
          })
          if (!ok) return
          startTransition(async () => {
            const res = await archivarAlumno(id)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            toast('Alumno archivado', 'exito')
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
          const res = await reactivarAlumno(id)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          toast('Alumno reactivado', 'exito')
          router.refresh()
        })
      }}
      className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
    >
      Reactivar
    </button>
  )
}