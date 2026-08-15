'use client'

import { useState } from 'react'

export default function MiHijoTabs({
  progreso,
  asistencia,
  informes,
}: {
  progreso: React.ReactNode
  asistencia: React.ReactNode
  informes: React.ReactNode
}) {
  const [tab, setTab] = useState<'progreso' | 'asistencia' | 'informes'>('progreso')

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setTab('progreso')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            tab === 'progreso'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Progreso
        </button>
        <button
          onClick={() => setTab('asistencia')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            tab === 'asistencia'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Asistencia
        </button>
        <button
          onClick={() => setTab('informes')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            tab === 'informes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Informes
        </button>
      </div>

      {tab === 'progreso' && progreso}
      {tab === 'asistencia' && asistencia}
      {tab === 'informes' && informes}
    </div>
  )
}