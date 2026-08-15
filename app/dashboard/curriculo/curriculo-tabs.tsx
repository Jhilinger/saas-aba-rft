'use client'

import { useState } from 'react'

export default function CurriculoTabs({
  tabla,
  formulario,
}: {
  tabla: React.ReactNode
  formulario: React.ReactNode
}) {
  const [tab, setTab] = useState<'tabla' | 'crear'>('tabla')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('tabla')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'tabla'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Currículo
        </button>
        <button
          onClick={() => setTab('crear')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'crear'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Crear programa
        </button>
      </div>

      {tab === 'tabla' ? tabla : formulario}
    </div>
  )
}