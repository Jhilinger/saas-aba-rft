'use client'

import { useState } from 'react'

export default function ProgramaTabs({
  gestion,
  evolucion,
}: {
  gestion: React.ReactNode
  evolucion: React.ReactNode
}) {
  const [tab, setTab] = useState<'gestion' | 'evolucion'>('evolucion')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('evolucion')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'evolucion'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Evolución
        </button>
        <button
          onClick={() => setTab('gestion')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'gestion'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Gestión de clases
        </button>
      </div>

      {tab === 'evolucion' ? evolucion : gestion}
    </div>
  )
}