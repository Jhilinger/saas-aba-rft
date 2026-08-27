'use client'

import { useState, useTransition } from 'react'
import { iniciarRegistro } from './actions'
import AbacontextIcon from '../abacontext-icon'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <AbacontextIcon className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Crea tu centro</h1>
          <p className="mt-1 text-sm text-slate-500">
            30€/mes de cuota fija + 4€/mes por cada alumno activo. Cancela cuando quieras.
          </p>
        </div>

        <form
          action={(formData: FormData) => {
            setError(null)
            startTransition(async () => {
              const res = await iniciarRegistro(formData)
              if (res.error) {
                setError(res.error)
                return
              }
              if (res.url) window.location.href = res.url
            })
          }}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Nombre de la clínica</label>
            <input
              name="nombre_clinica"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Tu nombre</label>
            <input
              name="nombre_admin"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Tu email</label>
            <input
              name="email_admin"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Teléfono</label>
            <input
              name="telefono"
              type="tel"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
                    <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Ciudad</label>
              <input
                name="ciudad"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">País</label>
              <input
                name="pais"
                required
                defaultValue="España"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          )}

                    <label className="flex items-start gap-2 text-xs text-slate-500">
            <input type="checkbox" name="acepta_terminos" required className="mt-0.5" />
            <span>
              He leído y acepto los{' '}
              <a href="/legal/terminos" target="_blank" className="text-indigo-600 hover:underline">
                Términos de Uso
              </a>{' '}
              y la{' '}
              <a href="/legal/privacidad" target="_blank" className="text-indigo-600 hover:underline">
                Política de Privacidad
              </a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending ? 'Redirigiendo a pago...' : 'Continuar al pago'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Serás redirigido a Stripe para completar el pago de forma segura.
          </p>
        </form>
      </div>
    </div>
  )
}