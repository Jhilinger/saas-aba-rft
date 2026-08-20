'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AlumnoRow from './alumno-row'

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
              <AlumnoRow key={a.id} alumno={a} terapeutas={terapeutas} />
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