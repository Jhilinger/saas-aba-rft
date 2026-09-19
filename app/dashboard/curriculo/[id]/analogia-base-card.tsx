'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarAnalogiaBase } from '../actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

const ETIQUETA_RELACION: Record<string, string> = {
  coordinacion: 'Coordinación',
  distincion: 'Distinción',
  oposicion: 'Oposición',
  comparacion: 'Comparación',
  jerarquia: 'Jerarquía',
  temporal: 'Temporal',
  causal: 'Causal',
  deictica: 'Deíctico',
}

type Analogia = {
  id: string
  nombre: string
  par1_termino_a: string
  par1_termino_b: string
  par1_relacion: string
  par2_termino_a: string
  par2_termino_b: string
  par2_relacion: string
}

export default function AnalogiaBaseCard({ analogia, programaBaseId }: { analogia: Analogia; programaBaseId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const misma = analogia.par1_relacion === analogia.par2_relacion

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm">
        <p className="text-slate-800">
          <strong>{analogia.par1_termino_a}</strong> — <strong>{analogia.par1_termino_b}</strong>{' '}
          <span className="text-xs text-slate-500">({ETIQUETA_RELACION[analogia.par1_relacion] ?? analogia.par1_relacion})</span>
          {'  vs.  '}
          <strong>{analogia.par2_termino_a}</strong> — <strong>{analogia.par2_termino_b}</strong>{' '}
          <span className="text-xs text-slate-500">({ETIQUETA_RELACION[analogia.par2_relacion] ?? analogia.par2_relacion})</span>
        </p>
        <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold ${misma ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {misma ? 'Igual relación' : 'Relación distinta'}
        </span>
      </div>
      <button
        onClick={async () => {
          const ok = await confirmar({
            titulo: 'Eliminar analogía',
            mensaje: `¿Eliminar esta analogía de la plantilla? No se puede deshacer.`,
            textoConfirmar: 'Eliminar',
            peligroso: true,
          })
          if (!ok) return
          startTransition(async () => {
            const res = await eliminarAnalogiaBase(analogia.id, programaBaseId)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            router.refresh()
          })
        }}
        disabled={isPending}
        className="text-xs font-medium text-rose-700 hover:text-rose-800 shrink-0"
      >
        Eliminar
      </button>
    </div>
  )
}
