'use client'

import { useState } from 'react'

export default function ValoracionTabs({
  aba,
  rft,
}: {
  aba: React.ReactNode
  rft: React.ReactNode
}) {
  const [tab, setTab] = useState<'aba' | 'rft'>('aba')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setTab('aba')}
          className={`rounded-lg px-3 py-1.5 font-medium ${
            tab === 'aba' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Aprendizaje Directo
        </button>
        <button
          onClick={() => setTab('rft')}
          className={`rounded-lg px-3 py-1.5 font-medium ${
            tab === 'rft' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Aprendizaje Relacional
        </button>
      </div>

      {tab === 'aba' ? aba : rft}
    </div>
  )
}