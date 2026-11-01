'use client'

import { useRef, useState } from 'react'

const PULSACION_LARGA = 600

// Botón que solo se activa al mantenerlo pulsado: controles del adulto en las
// pantallas que usa el alumno, para que un toque suyo no los dispare
export default function BotonLargo({
  children,
  onActivar,
  className = '',
}: {
  children: React.ReactNode
  onActivar: () => void
  className?: string
}) {
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pulsando, setPulsando] = useState(false)
  const soltar = () => {
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = null
    setPulsando(false)
  }
  return (
    <button
      type="button"
      onPointerDown={() => {
        setPulsando(true)
        temporizador.current = setTimeout(() => {
          soltar()
          onActivar()
        }, PULSACION_LARGA)
      }}
      onPointerUp={soltar}
      onPointerLeave={soltar}
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none rounded-lg px-3 py-2 text-xs font-medium transition-colors ${pulsando ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-400'} ${className}`}
    >
      {children}
    </button>
  )
}
