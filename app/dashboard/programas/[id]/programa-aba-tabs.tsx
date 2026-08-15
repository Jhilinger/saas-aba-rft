'use client'

import { useState } from 'react'

export default function ProgramaAbaTabs({
  evolucion,
  conjuntos,
}: {
  evolucion: React.ReactNode
  conjuntos: React.ReactNode
}) {
  const [tab, setTab] = useState<'evolucion' | 'conjuntos'>('evolucion')

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
          onClick={() => setTab('conjuntos')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'conjuntos'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Conjuntos de estímulos
        </button>
      </div>

      {tab === 'evolucion' ? evolucion : conjuntos}
    </div>
  )
}