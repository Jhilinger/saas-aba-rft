'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editarAlumno } from './actions'

type Alumno = {
  id: string
  nombre_anonimizado: string
  fecha_nacimiento: string
  diagnostico: string | null
  colegio: string | null
  notas_clinicas: string | null
  contacto_emergencia: string | null
  alergias: string | null
}

export default function EditarAlumnoForm({ alumno }: { alumno: Alumno }) {
  const [editando, setEditando] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!editando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Datos clínicos</h2>
          <button
            onClick={() => setEditando(true)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Editar datos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-slate-400">Diagnóstico / condición</span>
            <p className="text-slate-700">{alumno.diagnostico || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400">Colegio</span>
            <p className="text-slate-700">{alumno.colegio || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400">Contacto de emergencia</span>
            <p className="text-slate-700">{alumno.contacto_emergencia || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400">Alergias / condiciones médicas</span>
            <p className="text-slate-700">{alumno.alergias || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400">Notas clínicas</span>
            <p className="text-slate-700 whitespace-pre-wrap">{alumno.notas_clinicas || '—'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const res = await editarAlumno(alumno.id, fd)
          if (!res.error) {
            setEditando(false)
            router.refresh()
          }
        })
      }}
      className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5"
    >
      <h2 className="font-semibold text-slate-700">Editar datos del alumno</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Iniciales</label>
          <input
            name="nombre_anonimizado"
            defaultValue={alumno.nombre_anonimizado}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Fecha de nacimiento</label>
          <input
            name="fecha_nacimiento"
            type="date"
            defaultValue={alumno.fecha_nacimiento}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Diagnóstico / condición</label>
          <input
            name="diagnostico"
            defaultValue={alumno.diagnostico ?? ''}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Colegio</label>
          <input
            name="colegio"
            defaultValue={alumno.colegio ?? ''}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Contacto de emergencia</label>
          <input
            name="contacto_emergencia"
            placeholder="Nombre y teléfono"
            defaultValue={alumno.contacto_emergencia ?? ''}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Alergias / condiciones médicas</label>
          <input
            name="alergias"
            defaultValue={alumno.alergias ?? ''}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Notas clínicas</label>
          <textarea
            name="notas_clinicas"
            defaultValue={alumno.notas_clinicas ?? ''}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="rounded-lg bg-slate-100 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}