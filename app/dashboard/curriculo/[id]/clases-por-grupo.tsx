'use client'

import { useState, type ComponentProps } from 'react'
import ClaseRftBaseCard from './clase-rft-base-card'
import TablaGruposClases from '../../tabla-grupos-clases'

type PropsTarjeta = Omit<ComponentProps<typeof ClaseRftBaseCard>, 'clase'>
type Clase = ComponentProps<typeof ClaseRftBaseCard>['clase']

const natural = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true })

// Clases de la plantilla en dos vistas:
// - Revisión: todos los grupos a la vista, cada uno en una tabla (TablaGruposClases).
// - Editar: una pestaña por grupo con las tarjetas de edición.
export default function ClasesPorGrupo({ clases, ...props }: PropsTarjeta & { clases: Clase[] }) {
  const grupos = [...new Set(clases.map((c) => c.grupo))].sort(natural)
  const [vista, setVista] = useState<'revision' | 'editar'>('revision')
  const [grupo, setGrupo] = useState(grupos[0] ?? '')
  const delGrupo = (g: string) => clases.filter((c) => c.grupo === g).sort((a, b) => natural(a.nombre, b.nombre))

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-sm">
        {(
          [
            ['revision', 'Revisión'],
            ['editar', 'Editar clases'],
          ] as const
        ).map(([v, texto]) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`rounded-md px-3 py-1.5 font-medium ${vista === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {texto}
          </button>
        ))}
      </div>

      {vista === 'revision' ? (
        <TablaGruposClases clases={clases.map((c) => ({ id: c.id, nombre: c.nombre, grupo: c.grupo, estimulos: c.estimulos_rft_base }))} imagenes={props.imagenes ?? {}} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {grupos.map((g) => (
              <button
                key={g}
                onClick={() => setGrupo(g)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${g === grupo ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {delGrupo(grupo).map((c) => (
              <ClaseRftBaseCard key={c.id} clase={c} {...props} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
