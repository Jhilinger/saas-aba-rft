'use client'

import { useState, useMemo } from 'react'
import AlumnoRow from './alumno-row'
import { descargarCSV } from '@/utils/csv'
import { Button, Panel } from '../../ui'

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

  const exportar = () => {
    const filas = filtrados.map((a) => ({
      Alumno: a.nombre_anonimizado,
      'Fecha de nacimiento': a.fecha_nacimiento
        ? new Date(a.fecha_nacimiento).toLocaleDateString('es-ES')
        : '—',
      Terapeutas: (a.alumno_terapeuta ?? [])
        .map((at) => nombreTerapeuta(at.terapeuta_id) + (at.es_principal ? ' (principal)' : ''))
        .join('; ') || '—',
      Estado: a.activo ? 'Activo' : 'Archivado',
    }))
    descargarCSV(`alumnos-${new Date().toISOString().split('T')[0]}.csv`, filas)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar alumno por iniciales..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:text-sm"
        />
        <Button
          variant="secondary"
          onClick={exportar}
          disabled={filtrados.length === 0}
          className="px-3 py-2.5 font-medium disabled:opacity-40 sm:py-2"
        >
          Exportar CSV
        </Button>
      </div>

      <Panel className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr className="whitespace-nowrap">
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
          <p className="p-6 text-center text-slate-500">
            {alumnos.length === 0 ? 'Sin alumnos todavía.' : 'Ningún alumno coincide con la búsqueda.'}
          </p>
        )}
      </Panel>
    </div>
  )
}