'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Puerta para adultos: mantener pulsado y resolver una suma, para que el niño
// no salga de la actividad ni entre en los ajustes por accidente
export default function ControlAdultos({ destino, texto = 'Adultos' }: { destino: string; texto?: string }) {
  const [pregunta, setPregunta] = useState<{ a: number; b: number } | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [pulsando, setPulsando] = useState<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const empezar = () =>
    setPulsando(
      setTimeout(() => {
        setPregunta({ a: 3 + Math.floor(Math.random() * 6), b: 4 + Math.floor(Math.random() * 6) })
        setPulsando(null)
      }, 1500)
    )
  const soltar = () => {
    if (pulsando) clearTimeout(pulsando)
    setPulsando(null)
  }

  return (
    <>
      <button
        type="button"
        onPointerDown={empezar}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        className={`rounded-full border px-4 py-2 text-sm text-slate-400 ${pulsando ? 'border-slate-400 bg-slate-100' : 'border-slate-200'}`}
      >
        {pulsando ? 'Mantén pulsado…' : texto}
      </button>
      {pregunta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (Number(respuesta) === pregunta.a + pregunta.b) router.push(destino)
              setPregunta(null)
              setRespuesta('')
            }}
            className="w-full max-w-xs space-y-3 rounded-2xl bg-white p-5 text-center"
          >
            <p className="text-sm text-slate-500">Solo para adultos</p>
            <p className="text-2xl font-bold">
              ¿Cuánto es {pregunta.a} + {pregunta.b}?
            </p>
            <input
              autoFocus
              inputMode="numeric"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center text-xl"
            />
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => setPregunta(null)} className="rounded-lg px-4 py-2 text-slate-500">
                Cancelar
              </button>
              <button type="submit" className="rounded-lg bg-[#0F4C5C] px-4 py-2 font-semibold text-white">
                Entrar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
