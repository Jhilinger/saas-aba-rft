'use client'

import { useState } from 'react'

export default function ValoracionTabs({
  aba,
}: {
  aba: React.ReactNode
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

      {tab === 'aba' ? (
        aba
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-400">
            La evaluación inicial para Aprendizaje Relacional (RFT) todavía no está disponible.
            Próximamente.
          </p>
        </div>
      )}
    </div>
  )
}