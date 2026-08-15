'use client'

import { useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { crearClinica } from './actions'

export default function CrearClinicaForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  return (
    <form
      ref={formRef}
      action={(formData: FormData) => {
        setError(null)
        startTransition(async () => {
          const res = await crearClinica(formData)
          if (res.error) {
            setError(res.error)
            return
          }
          formRef.current?.reset()
          router.refresh()
        })
      }}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
    >
      <h2 className="font-semibold text-slate-700">Nueva clínica</h2>
      <p className="text-xs text-slate-400 -mt-2">
        Se crea sin pasar por Stripe (uso interno: tu propia clínica, cortesías, pruebas...).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Nombre</label>
          <input
            name="nombre"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Cuota fija mensual (€)</label>
          <input
            name="precio_fijo_mensual"
            type="number"
            step="0.01"
            defaultValue="0"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Precio por alumno (€)</label>
          <input
            name="precio_por_alumno"
            type="number"
            step="0.01"
            defaultValue="0"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600">Logo (opcional)</label>
        <input
          name="logo"
          type="file"
          accept="image/*"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm"
        />
      </div>

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <p className="text-sm font-medium text-slate-600">Primera cuenta de administrador</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            name="nombre_admin"
            placeholder="Nombre"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            name="email_admin"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            name="password_admin"
            type="password"
            placeholder="Contraseña provisional"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isPending ? 'Creando...' : 'Crear clínica'}
      </button>
    </form>
  )
}