'use client'

import { useState } from 'react'

type Pregunta = { pregunta: string; respuesta: string }

export default function FaqAcordeon({ preguntas }: { preguntas: Pregunta[] }) {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {preguntas.map((p, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setAbierta(abierta === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-medium text-slate-800">{p.pregunta}</span>
            <span className={`ml-4 shrink-0 text-slate-400 transition-transform ${abierta === i ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          {abierta === i && (
            <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{p.respuesta}</div>
          )}
        </div>
      ))}
    </div>
  )
}
