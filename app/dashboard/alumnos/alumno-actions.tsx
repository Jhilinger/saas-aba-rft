'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { archivarAlumno, reactivarAlumno, eliminarAlumno } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

export default function AlumnoActions({ id, activo }: { id: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  // Solo funciona si el alumno no tiene ningún dato (creado por error); si lo
  // tiene, el servidor lo impide y lo explica
  const eliminar = async () => {
    const ok = await confirmar({
      titulo: 'Eliminar alumno',
      mensaje:
        'Se borrará por completo. Solo es posible si todavía no tiene ningún dato (programas, valoración, informes...), por ejemplo si se creó por error. Si ya tiene datos, archívalo.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarAlumno(id)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Alumno eliminado', 'exito')
      router.refresh()
    })
  }

  return (
    <>
      {activo ? (
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
          className="text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          Archivar
        </button>
      ) : (
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
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          Reactivar
        </button>
      )}
      <button disabled={isPending} onClick={eliminar} className="text-xs font-medium text-rose-700 hover:text-rose-800">
        Eliminar
      </button>
    </>
  )
}
