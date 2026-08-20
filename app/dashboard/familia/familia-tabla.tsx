'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearFamiliar, desvincularFamiliarAlumno, vincularFamiliarAlumno } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

type Alumno = { id: string; nombre_anonimizado: string }
type Familiar = { perfilId: string; nombre: string; email: string; alumnos: { id: string; nombre: string }[] }

export default function FamiliaTabla({
  alumnos,
  familiares,
}: {
  alumnos: Alumno[]
  familiares: Familiar[]
}) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [anadiendoA, setAnadiendoA] = useState<string | null>(null)
  const [nuevoAlumnoId, setNuevoAlumnoId] = useState('')
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const toggleAlumno = (id: string) => {
    setAlumnosSeleccionados((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const invitar = () => {
    if (!nombre.trim() || !email.trim() || alumnosSeleccionados.length === 0) return
    setError(null)
    startTransition(async () => {
      const res = await crearFamiliar(nombre.trim(), email.trim(), alumnosSeleccionados)
      if (res.error) {
        return
      }
      setNombre('')
      setEmail('')
      setAlumnosSeleccionados([])
      toast('Invitación enviada', 'exito')
      router.refresh()
    })
  }

  const desvincular = async (perfilId: string, alumnoId: string, nombreFamiliar: string, nombreAlumno: string) => {
    const ok = await confirmar({
      titulo: 'Desvincular',
      mensaje: `¿Desvincular a ${nombreFamiliar} de ${nombreAlumno}?`,
      textoConfirmar: 'Desvincular',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await desvincularFamiliarAlumno(perfilId, alumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Desvinculado', 'exito')
      router.refresh()
    })
  }

  const anadirAlumno = (perfilId: string) => {
    if (!nuevoAlumnoId) return
    startTransition(async () => {
      const res = await vincularFamiliarAlumno(perfilId, nuevoAlumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Alumno vinculado', 'exito')
      setAnadiendoA(null)
      setNuevoAlumnoId('')
      router.refresh()
    })
  }
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-slate-700">Invitar familiar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre (ej. Familia de M.S.)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">
            Alumno(s) a vincular <span className="text-slate-400">(varios si son hermanos)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {alumnos.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              >
                <input
                  type="checkbox"
                  checked={alumnosSeleccionados.includes(a.id)}
                  onChange={() => toggleAlumno(a.id)}
                />
                {a.nombre_anonimizado}
              </label>
            ))}
            {alumnos.length === 0 && (
              <p className="text-sm text-slate-400">No hay alumnos activos en esta clínica todavía.</p>
            )}
          </div>
        </div>

        <button
          onClick={invitar}
          disabled={isPending || !nombre.trim() || !email.trim() || alumnosSeleccionados.length === 0}
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Invitar familiar
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-slate-700">Familiares vinculados</h2>
        {familiares.map((f) => (
          <div key={f.perfilId} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800">{f.nombre}</p>
                <p className="text-xs text-slate-500">{f.email}</p>
              </div>
              <button
                onClick={() => setAnadiendoA(anadiendoA === f.perfilId ? null : f.perfilId)}
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                + Vincular otro alumno
              </button>
            </div>

            {anadiendoA === f.perfilId && (
              <div className="flex gap-2">
                <select
                  value={nuevoAlumnoId}
                  onChange={(e) => setNuevoAlumnoId(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  <option value="">Selecciona alumno...</option>
                  {alumnos
                    .filter((a) => !f.alumnos.some((fa) => fa.id === a.id))
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre_anonimizado}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => anadirAlumno(f.perfilId)}
                  disabled={!nuevoAlumnoId || isPending}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  Añadir
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {f.alumnos.map((a) => (
                <span
                  key={a.id}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                >
                  {a.nombre}
                  <button
                    onClick={() => desvincular(f.perfilId, a.id, f.nombre, a.nombre)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
        {familiares.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">Sin familiares vinculados todavía.</p>
        )}
      </div>
    </div>
  )
}