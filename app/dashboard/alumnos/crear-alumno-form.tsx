'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearAlumno } from './actions'
import { Button, Panel } from '../../ui'
import { useToast } from '../../providers/toast-provider'

type Terapeuta = { id: string; nombre: string; email: string; activo: boolean }

export default function CrearAlumnoForm({ terapeutas }: { terapeutas: Terapeuta[] }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <Panel
      as="form"
      action={(formData) => {
        startTransition(async () => {
          const res = await crearAlumno(formData)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          router.refresh()
        })
      }}
      className="space-y-4 p-4 sm:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="nombre_anonimizado"
          placeholder="Iniciales (ej. M.S.)"
          required
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:text-sm"
        />
        <input
          name="fecha_nacimiento"
          type="date"
          required
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:text-sm"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-slate-600">
          Terapeutas asignados <span className="text-slate-400">(marca &quot;Principal&quot; en uno)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {terapeutas?.filter((t) => t.activo).map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              <label className="flex items-center gap-1.5">
                <input type="checkbox" name="terapeuta_ids" value={t.id} />
                {t.nombre}
              </label>
              <label className="flex items-center gap-1 text-xs text-indigo-600 border-l border-slate-200 pl-2">
                <input type="radio" name="terapeuta_principal_id" value={t.id} />
                Principal
              </label>
            </div>
          ))}
          {(!terapeutas || terapeutas.filter((t) => t.activo).length === 0) && (
            <p className="text-sm text-slate-400">
              Todavía no hay terapeutas activos creados en esta clínica.
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full py-3 text-base sm:py-2 sm:text-sm">
        Registrar alumno
      </Button>
    </Panel>
  )
}
