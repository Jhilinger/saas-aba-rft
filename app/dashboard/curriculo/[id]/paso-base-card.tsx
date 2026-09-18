'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarPasoBase } from '../actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Paso = { id: string; nombre: string; descripcion: string | null; orden: number }

export default function PasoBaseCard({ paso, programaBaseId }: { paso: Paso; programaBaseId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div>
        <span className="text-xs font-semibold text-slate-400">Paso {paso.orden}</span>
        <p className="text-sm font-medium text-slate-800">{paso.nombre}</p>
        {paso.descripcion && <p className="text-xs text-slate-500">{paso.descripcion}</p>}
      </div>
      <button
        onClick={async () => {
          const ok = await confirmar({
            titulo: 'Eliminar paso',
            mensaje: `¿Eliminar "${paso.nombre}" de la plantilla? No se puede deshacer.`,
            textoConfirmar: 'Eliminar',
            peligroso: true,
          })
          if (!ok) return
          startTransition(async () => {
            const res = await eliminarPasoBase(paso.id, programaBaseId)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            router.refresh()
          })
        }}
        disabled={isPending}
        className="text-xs font-medium text-rose-700 hover:text-rose-800"
      >
        Eliminar
      </button>
    </div>
  )
}
