'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTambienTerapeuta } from './actions'

export default function ToggleTambienTerapeuta({
  nombre,
  activo,
}: {
  nombre: string
  activo: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-slate-800">¿También eres terapeuta, {nombre}?</p>
        <p className="text-sm text-slate-500">
          Actívalo para poder tener alumnos propios asignados y tomar datos con ellos, sin necesitar una cuenta separada.
        </p>
      </div>
      <button
        onClick={() => {
          startTransition(async () => {
            await toggleTambienTerapeuta(activo)
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
    </div>
  )
}