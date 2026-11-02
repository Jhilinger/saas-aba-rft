'use client'

import { useState, useTransition } from 'react'
import { iniciarRegistro } from './actions'
import AbacontextIcon from '../abacontext-icon'
import { Button, Panel } from '../ui'
import { formatearImporte, MAX_ALUMNOS_INDEPENDIENTE, type Plan, type TarifaVisible } from '@/utils/tarifas'

export default function RegistroForm({
  paises,
  tarifas,
}: {
  paises: { codigo: string; nombre: string }[]
  // país → plan → importes leídos de Stripe
  tarifas: Record<string, Partial<Record<Plan, TarifaVisible>>>
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [pais, setPais] = useState('ES')
  const [planElegido, setPlan] = useState<Plan>('clinica')
  const delPais = tarifas[pais] ?? {}
  const plan: Plan = delPais[planElegido] ? planElegido : 'clinica'
  const tarifa = delPais[plan]

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-100/80 blur-3xl" />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <AbacontextIcon className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Crea tu centro</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tarifa
              ? `${tarifa.cuota !== null ? `${formatearImporte(tarifa.cuota, tarifa.moneda)}/mes de cuota fija + ` : ''}${formatearImporte(tarifa.alumno, tarifa.moneda)}/mes por cada alumno activo. Cancela cuando quieras.`
              : 'Cancela cuando quieras.'}
          </p>
        </div>

        <Panel
          as="form"
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
          className="relative space-y-4 p-6 shadow-[0_20px_60px_rgba(30,41,59,0.10)] sm:p-8"
        >
          <div className="space-y-1">
            <label htmlFor="nombre_clinica" className="text-sm text-slate-600">Nombre de la clínica</label>
            <input
              id="nombre_clinica"
              name="nombre_clinica"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="nombre_admin" className="text-sm text-slate-600">Tu nombre</label>
            <input
              id="nombre_admin"
              name="nombre_admin"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email_admin" className="text-sm text-slate-600">Tu email</label>
            <input
              id="email_admin"
              name="email_admin"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="telefono" className="text-sm text-slate-600">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </div>
                    <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="ciudad" className="text-sm text-slate-600">Ciudad</label>
              <input
                id="ciudad"
                name="ciudad"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="pais" className="text-sm text-slate-600">País</label>
              <select
                id="pais"
                name="pais_codigo"
                required
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base"
              >
                {paises.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {delPais.independiente && (
            <fieldset className="space-y-2">
              <legend className="text-sm text-slate-600">Tipo de cuenta</legend>
              <input type="hidden" name="plan" value={plan} />
              {(['clinica', 'independiente'] as Plan[]).map((p) => (
                <label key={p} className="flex items-start gap-2 text-sm text-slate-700">
                  <input type="radio" checked={plan === p} onChange={() => setPlan(p)} className="mt-1" />
                  <span>
                    {p === 'clinica' ? 'Centro o clínica' : `Terapeuta independiente (hasta ${MAX_ALUMNOS_INDEPENDIENTE} alumnos, sin cuota fija)`}
                  </span>
                </label>
              ))}
            </fieldset>
          )}

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

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-3 text-base"
          >
            {isPending ? 'Redirigiendo a pago...' : 'Continuar al pago'}
          </Button>
          <p className="text-center text-xs text-slate-500">
            Serás redirigido a Stripe para completar el pago de forma segura.
          </p>
        </Panel>
        </div>
      </div>
  )
}