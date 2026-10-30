'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { GLOSARIO_RFT, type ClaveGlosario } from './glosario-rft'

// Botón «?» junto a un término RFT: al tocarlo muestra su definición del
// glosario; se cierra al tocar fuera o con Escape.
export default function AyudaTermino({ clave }: { clave: ClaveGlosario }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLSpanElement>(null)
  const id = useId()
  const entrada = GLOSARIO_RFT[clave]

  useEffect(() => {
    if (!abierto) return
    const cerrarFuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    const cerrarEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', cerrarFuera)
    document.addEventListener('keydown', cerrarEscape)
    return () => {
      document.removeEventListener('pointerdown', cerrarFuera)
      document.removeEventListener('keydown', cerrarEscape)
    }
  }, [abierto])

  return (
    <span ref={caja} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setAbierto((v) => !v)
        }}
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={`Qué es: ${entrada.termino}`}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold leading-none text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
      >
        ?
      </button>
      {abierto && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-6 z-40 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs font-normal normal-case tracking-normal text-slate-600 shadow-lg"
        >
          <span className="mb-1 block font-semibold text-slate-800">{entrada.termino}</span>
          {entrada.definicion}
        </span>
      )}
    </span>
  )
}
