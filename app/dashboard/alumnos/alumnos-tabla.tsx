'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AlumnoActions from './alumno-actions'

type Alumno = {
  id: string
  nombre_anonimizado: string
  fecha_nacimiento: string
  activo: boolean
  alumno_terapeuta: { terapeuta_id: string; es_principal: boolean }[]
}

type Terapeuta = { id: string; nombre: string }

export default function AlumnosTabla({
  alumnos,
  terapeutas,
}: {
  alumnos: Alumno[]
  terapeutas: Terapeuta[]
}) {
  const [busqueda, setBusqueda] = useState('')

  const nombreTerapeuta = (id: string) => terapeutas.find((t) => t.id === id)?.nombre ?? '—'

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return alumnos
    return alumnos.filter((a) => a.nombre_anonimizado.toLowerCase().includes(q))
  }, [alumnos, busqueda])

  return (
    <div className="space-y-2">
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar alumno por iniciales..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Alumno</th>
              <th className="p-3">Fecha nacimiento</th>
              <th className="p-3">Terapeutas</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a) => (
              <tr key={a.id} className={`border-b border-slate-100 last:border-0 ${!a.activo ? 'opacity-50' : ''}`}>
                <td className="p-3 font-medium text-slate-800">
                  <Link href={`/dashboard/alumnos/${a.id}`} className="hover:underline">
                    {a.nombre_anonimizado}
                  </Link>
                  {!a.activo && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                      Archivado
                    </span>
                  )}
                </td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{a.fecha_nacimiento}</td>
                <td className="p-3 text-slate-600">
                  {a.alumno_terapeuta.length === 0
                    ? '—'
                    : a.alumno_terapeuta
                        .map((at) => nombreTerapeuta(at.terapeuta_id) + (at.es_principal ? ' (principal)' : ''))
                        .join(', ')}
                </td>
                <td className="p-3">
                  <AlumnoActions id={a.id} activo={a.activo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            {alumnos.length === 0 ? 'Sin alumnos todavía.' : 'Ningún alumno coincide con la búsqueda.'}
          </p>
        )}
      </div>
    </div>
  )
}