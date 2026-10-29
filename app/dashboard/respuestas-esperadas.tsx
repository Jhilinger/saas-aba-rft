'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Json } from '@/database.types'
import { claveCombinacion, leerRespuestasEsperadas } from './respuestas-rft'
import { useToast } from '../providers/toast-provider'
import { Button } from '../ui'

// Respuesta esperada de una clase para cada combinación de posiciones (ej.
// A→C: "No se sabe"). Con ella la toma de datos corrige sola las respuestas de
// opciones fijas; sin ella, el terapeuta marca ✓/✗.
export default function RespuestasEsperadas({
  respuestas,
  posiciones,
  soloLectura = false,
  guardar,
}: {
  respuestas: Json
  posiciones: string[]
  soloLectura?: boolean
  guardar: (respuestas: Record<string, string>) => Promise<{ error?: string }>
}) {
  const actuales = leerRespuestasEsperadas(respuestas)
  const [origen, setOrigen] = useState(posiciones[0] ?? 'A')
  const [destino, setDestino] = useState(posiciones[1] ?? posiciones[0] ?? 'B')
  const [respuesta, setRespuesta] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const enviar = (nuevas: Record<string, string>) =>
    startTransition(async () => {
      const res = await guardar(nuevas)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setRespuesta('')
      router.refresh()
    })

  const entradas = Object.entries(actuales)
  if (soloLectura && entradas.length === 0) return null

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 p-3 text-sm">
      <p className="font-medium text-slate-700">Respuestas esperadas</p>
      {entradas.length > 0 ? (
        <ul className="space-y-1">
          {entradas.map(([clave, valor]) => (
            <li key={clave} className="flex items-center justify-between gap-2 rounded bg-slate-50 px-2 py-1">
              <span>
                <strong>{clave}</strong>: {valor}
              </span>
              {!soloLectura && (
                <button
                  onClick={() => {
                    const resto = { ...actuales }
                    delete resto[clave]
                    enviar(resto)
                  }}
                  disabled={isPending}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">
          Sin respuestas esperadas: en las respuestas con opciones, el terapeuta marcará si son correctas.
        </p>
      )}
      {!soloLectura && (
        <div className="flex flex-wrap items-center gap-2">
          <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="rounded border border-slate-300 px-2 py-1">
            {posiciones.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <span>→</span>
          <select value={destino} onChange={(e) => setDestino(e.target.value)} className="rounded border border-slate-300 px-2 py-1">
            {posiciones.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <input
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Respuesta (ej. No se sabe)"
            className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1"
          />
          <Button
            variant="secondary"
            onClick={() => enviar({ ...actuales, [claveCombinacion(origen, destino)]: respuesta.trim() })}
            disabled={!respuesta.trim() || isPending}
            className="px-3 py-1 text-xs"
          >
            Guardar
          </Button>
        </div>
      )}
    </div>
  )
}
