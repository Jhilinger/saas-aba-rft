'use client'

import { useState, useTransition } from 'react'
import { confirmarAsistenciaFamilia } from '../agenda/actions'

type Sesion = {
  id: string
  fecha_hora: string
  estado: 'asistio' | 'cancelada' | 'no_asistio'
  cancelado_por: string | null
  alumno_nombre: string
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  asistio: { label: 'Asistió', color: 'bg-emerald-50 text-emerald-700' },
  cancelada: { label: 'Cancelada', color: 'bg-amber-50 text-amber-700' },
  no_asistio: { label: 'No asistió', color: 'bg-rose-50 text-rose-700' },
}

export default function ConfirmarAsistencia({ sesionesIniciales }: { sesionesIniciales: Sesion[] }) {
  const [sesiones, setSesiones] = useState(sesionesIniciales)
  const [isPending, startTransition] = useTransition()

  if (sesiones.length === 0) return null

  const confirmar = (id: string) => {
    startTransition(async () => {
      await confirmarAsistenciaFamilia(id)
      setSesiones((prev) => prev.filter((s) => s.id !== id))
    })
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5 space-y-3">
      <h2 className="font-semibold text-indigo-900">
        Confirmar asistencia ({sesiones.length})
      </h2>
      <p className="text-sm text-indigo-700">
        Revisa y confirma que estos registros son correctos — la clínica los usa para facturar.
      </p>
      <div className="space-y-2">
        {sesiones.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-sm"
          >
            <div>
              <p className="font-medium text-slate-800">{s.alumno_nombre}</p>
              <p className="text-slate-500">
                {new Date(s.fecha_hora).toLocaleString('es-ES', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[s.estado].color}`}>
                {ETIQUETA_ESTADO[s.estado].label}
                {s.cancelado_por && ` (${s.cancelado_por})`}
              </span>
              <button
                disabled={isPending}
                onClick={() => confirmar(s.id)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}