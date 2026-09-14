'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        <h1 className="text-xl font-bold text-slate-800">Algo salió mal</h1>
        <p className="max-w-sm text-sm text-slate-500">
          Ha ocurrido un error inesperado. Ya quedó registrado — probá recargar la página.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#0F4C5C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B3A47]"
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
