'use client'

import { useState, useTransition } from 'react'
import { solicitarRecuperacion } from './actions'
import Link from 'next/link'

export default function RecuperarPasswordPage() {
  const [enviado, setEnviado] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl" />
      <div className="relative w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.10)] sm:p-8">
        <h1 className="text-xl font-bold text-slate-800">Recuperar contraseña</h1>

        {enviado ? (
          <p className="text-sm text-slate-600">
            Si ese email existe en nuestro sistema, te hemos enviado un enlace para restablecer tu
            contraseña. Revisa tu bandeja de entrada (y la carpeta de spam).
          </p>
        ) : (
          <form
            action={(formData) => {
              startTransition(async () => {
                await solicitarRecuperacion(formData)
                setEnviado(true)
              })
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPending ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <Link href="/login" className="block text-center text-sm text-indigo-600 hover:underline">
          ← Volver al login
        </Link>
      </div>
    </div>
  )
}