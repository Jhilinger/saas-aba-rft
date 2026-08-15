'use client'

import { useState } from 'react'

const PESTAÑAS = [
  { key: 'pei', label: 'PEI' },
  { key: 'clinicos', label: 'Datos clínicos' },
  { key: 'terapeutas', label: 'Terapeutas' },
  { key: 'familia', label: 'Familia' },
  { key: 'informes', label: 'Informes' },
  { key: 'preferencias', label: 'Preferencias' },
] as const

type Clave = (typeof PESTAÑAS)[number]['key']

export default function AlumnoTabs({
  pei,
  clinicos,
  terapeutas,
  familia,
  informes,
  preferencias,
}: {
  pei: React.ReactNode
  clinicos: React.ReactNode
  terapeutas: React.ReactNode
  familia: React.ReactNode
  informes: React.ReactNode
  preferencias: React.ReactNode
}) {
  const [tab, setTab] = useState<Clave>('pei')

  const contenido: Record<Clave, React.ReactNode> = {
    pei,
    clinicos,
    terapeutas,
    familia,
    informes,
    preferencias,
  }

  return (
    <div className="space-y-4">
      <select
        value={tab}
        onChange={(e) => setTab(e.target.value as Clave)}
        className="w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-medium text-slate-700"
      >
        {PESTAÑAS.map((p) => (
          <option key={p.key} value={p.key}>
            {p.label}
          </option>
        ))}
      </select>

      {contenido[tab]}
    </div>
  )
}