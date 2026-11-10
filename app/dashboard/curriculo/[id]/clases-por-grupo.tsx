'use client'

import { useState, type ComponentProps } from 'react'
import ClaseRftBaseCard from './clase-rft-base-card'

type PropsTarjeta = Omit<ComponentProps<typeof ClaseRftBaseCard>, 'clase'>
type Clase = ComponentProps<typeof ClaseRftBaseCard>['clase']

// Clases de la plantilla con una pestaña por grupo (como en la ficha del
// programa del PEI). Grupos en orden natural y clases por número.
export default function ClasesPorGrupo({ clases, ...props }: PropsTarjeta & { clases: Clase[] }) {
  const natural = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true })
  const grupos = [...new Set(clases.map((c) => c.grupo))].sort(natural)
  const [grupo, setGrupo] = useState(grupos[0] ?? '')
  const delGrupo = clases.filter((c) => c.grupo === grupo).sort((a, b) => natural(a.nombre, b.nombre))

  return (
    <div className="space-y-4">
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
        {delGrupo.map((c) => (
          <ClaseRftBaseCard key={c.id} clase={c} {...props} />
        ))}
      </div>
    </div>
  )
}
