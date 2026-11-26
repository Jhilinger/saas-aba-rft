'use client'

import { useEffect, useRef, useState } from 'react'

// Segundos del escalón a partir del nombre del conjunto («Esperar 5 s»,
// «Sentado 1 min», «Mirar 2 segundos»); null si el nombre no lleva tiempo
export function segundosDelConjunto(nombre: string): number | null {
  const m = nombre.match(/(\d+(?:[.,]\d+)?)\s*(s|seg|segundos?|min|minutos?)\b/i)
  if (!m) return null
  const n = parseFloat(m[1].replace(',', '.'))
  return /^m/i.test(m[2]) ? Math.round(n * 60) : Math.round(n)
}

const formato = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s} s`)

// Cronómetro del escalón: se pone en marcha al dar la instrucción y avisa
// (color y vibración) cuando se cumple el tiempo. Se monta de nuevo en cada ensayo
export default function CronometroEscalon({ objetivo }: { objetivo: number }) {
  const [inicio, setInicio] = useState<number | null>(null)
  const [ahora, setAhora] = useState(0)
  const avisado = useRef(false)
  useEffect(() => {
    if (inicio === null) return
    const t = setInterval(() => setAhora(Date.now()), 200)
    return () => clearInterval(t)
  }, [inicio])
  const transcurrido = inicio === null ? 0 : Math.max(0, Math.floor((ahora - inicio) / 1000))
  const cumplido = inicio !== null && transcurrido >= objetivo
  useEffect(() => {
    if (cumplido && !avisado.current) {
      avisado.current = true
      navigator.vibrate?.(300)
    }
  }, [cumplido])

  if (inicio === null)
    return (
      <button
        type="button"
        onClick={() => {
          const t = Date.now()
          setInicio(t)
          setAhora(t)
        }}
        className="w-full rounded-xl border-2 border-indigo-300 bg-white px-4 py-3 text-base font-semibold text-indigo-700 active:scale-[0.98]"
      >
        ⏱ Empezar a contar ({formato(objetivo)}) al dar la instrucción
      </button>
    )
  return (
    <div className={`space-y-2 rounded-xl border-2 px-4 py-3 ${cumplido ? 'border-emerald-400 bg-emerald-50' : 'border-indigo-200 bg-white'}`}>
      <p className={`text-2xl font-bold tabular-nums ${cumplido ? 'text-emerald-700' : 'text-slate-800'}`}>
        {cumplido ? `✓ ${formato(objetivo)} cumplidos` : `${formato(transcurrido)} de ${formato(objetivo)}`}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
        <div className={`h-full ${cumplido ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (transcurrido / objetivo) * 100)}%` }} />
      </div>
      <button
        type="button"
        onClick={() => {
          avisado.current = false
          setInicio(null)
        }}
        className="text-sm text-slate-500"
      >
        Volver a empezar
      </button>
    </div>
  )
}
