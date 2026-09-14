'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTambienTerapeuta } from './actions'
import { useToast } from '../../providers/toast-provider'
import { Panel } from '../../ui'

export default function ToggleTambienTerapeuta({
  nombre,
  activo,
}: {
  nombre: string
  activo: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <Panel className="p-4 sm:p-5 flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-slate-800">¿También eres terapeuta, {nombre}?</p>
        <p className="text-sm text-slate-500">
          Actívalo para poder tener alumnos propios asignados y tomar datos con ellos, sin necesitar una cuenta separada.
        </p>
      </div>
      <button
        onClick={() => {
          startTransition(async () => {
            const res = await toggleTambienTerapeuta(activo)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            router.refresh()
          })
        }}
        disabled={isPending}
        className={`relative shrink-0 h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
          activo ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
            activo ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </Panel>
  )
}