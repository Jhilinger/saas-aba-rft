'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AlumnoActions from './alumno-actions'
import { actualizarTerapeutasAlumno } from './actions'
import { useToast } from '../../providers/toast-provider'

type Alumno = {
  id: string
  nombre_anonimizado: string
  fecha_nacimiento: string
  activo: boolean
  alumno_terapeuta: { terapeuta_id: string; es_principal: boolean }[]
}
type Terapeuta = { id: string; nombre: string }

export default function AlumnoRow({
  alumno,
  terapeutas,
}: {
  alumno: Alumno
  terapeutas: Terapeuta[]
}) {
  const [editando, setEditando] = useState(false)
  const [seleccionados, setSeleccionados] = useState<string[]>(
    alumno.alumno_terapeuta.map((at) => at.terapeuta_id)
  )
  const [principal, setPrincipal] = useState<string | null>(
    alumno.alumno_terapeuta.find((at) => at.es_principal)?.terapeuta_id ?? null
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const nombreTerapeuta = (id: string) => terapeutas.find((t) => t.id === id)?.nombre ?? '—'

  const toggle = (id: string) => {
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const guardar = () => {
    startTransition(async () => {
      const res = await actualizarTerapeutasAlumno(alumno.id, seleccionados, principal)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Terapeutas actualizados', 'exito')
      setEditando(false)
      router.refresh()
    })
  }

  const cancelar = () => {
    setSeleccionados(alumno.alumno_terapeuta.map((at) => at.terapeuta_id))
    setPrincipal(alumno.alumno_terapeuta.find((at) => at.es_principal)?.terapeuta_id ?? null)
    setEditando(false)
  }

  if (editando) {
    return (
      <tr className="border-b border-slate-100 last:border-0 bg-slate-50">
        <td className="p-3 font-medium text-slate-800">{alumno.nombre_anonimizado}</td>
        <td className="p-3 text-slate-600 whitespace-nowrap">{alumno.fecha_nacimiento}</td>
        <td className="p-3" colSpan={2}>
          <div className="flex flex-wrap gap-2">
            {terapeutas.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1 text-xs"
              >
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={seleccionados.includes(t.id)} onChange={() => toggle(t.id)} />
                  {t.nombre}
                </label>
                <label className="flex items-center gap-1 text-indigo-600 border-l border-slate-200 pl-1.5">
                  <input
                    type="radio"
                    name={`principal-${alumno.id}`}
                    checked={principal === t.id}
                    onChange={() => setPrincipal(t.id)}
                  />
                  Principal
                </label>
              </div>
            ))}
            {terapeutas.length === 0 && (
              <p className="text-xs text-slate-400">No hay terapeutas en esta clínica todavía.</p>
            )}
          </div>
          <div className="mt-2 flex gap-3">
            <button
              onClick={guardar}
              disabled={isPending}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
            >
              Guardar
            </button>
            <button onClick={cancelar} className="text-xs text-slate-500 hover:text-slate-700">
              Cancelar
            </button>
          </div>
        </td>
      </tr>
    )
  }
  return (
    <tr className={`border-b border-slate-100 last:border-0 ${!alumno.activo ? 'opacity-50' : ''}`}>
      <td className="p-3 font-medium text-slate-800">
        <Link href={`/dashboard/alumnos/${alumno.id}`} className="hover:underline">
          {alumno.nombre_anonimizado}
        </Link>
        {!alumno.activo && (
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
            Archivado
          </span>
        )}
      </td>
      <td className="p-3 text-slate-600 whitespace-nowrap">{alumno.fecha_nacimiento}</td>
      <td className="p-3 text-slate-600">
        {alumno.alumno_terapeuta.length === 0
          ? '—'
          : alumno.alumno_terapeuta
              .map((at) => nombreTerapeuta(at.terapeuta_id) + (at.es_principal ? ' (principal)' : ''))
              .join(', ')}
      </td>
      <td className="p-3 flex gap-3">
        <button
          onClick={() => setEditando(true)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          Editar
        </button>
        <AlumnoActions id={alumno.id} activo={alumno.activo} />
      </td>
    </tr>
  )
}