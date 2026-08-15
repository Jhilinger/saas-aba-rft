'use client'

import { useState, useTransition } from 'react'
import { crearSesionPortal } from './actions'

export default function BotonPortal() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          setError(null)
          startTransition(async () => {
            const res = await crearSesionPortal()
            if (res.error) {
              setError(res.error)
              return
            }
            if (res.url) window.location.href = res.url
          })
        }}
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isPending ? 'Abriendo portal...' : 'Gestionar facturación'}
      </button>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}