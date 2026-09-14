'use client'

import { useState, useTransition } from 'react'
import { crearSesionPortal } from './actions'
import { Button } from '../../ui'

export default function BotonPortal() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <Button
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
        className="px-4 py-3 sm:py-2 text-base sm:text-sm"
      >
        {isPending ? 'Abriendo portal...' : 'Gestionar facturación'}
      </Button>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}