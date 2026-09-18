'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleVisibleFamiliaPrograma } from '../../alumnos/[id]/conducta/[programaId]/actions'
import { useToast } from '../../../providers/toast-provider'

export default function ToggleVisibleFamilia({
  programaAlumnoId,
  alumnoId,
  visibleFamilia,
}: {
  programaAlumnoId: string
  alumnoId: string
  visibleFamilia: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
      <input
        type="checkbox"
        checked={visibleFamilia}
        disabled={isPending}
        onChange={(e) => {
          const valor = e.target.checked
          startTransition(async () => {
            const res = await toggleVisibleFamiliaPrograma(programaAlumnoId, alumnoId, valor)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            router.refresh()
          })
        }}
        className="h-4 w-4 rounded border-slate-300"
      />
      Visible para la familia
    </label>
  )
}
