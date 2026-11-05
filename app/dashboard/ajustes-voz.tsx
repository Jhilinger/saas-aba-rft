'use client'

import { useEffect, useState } from 'react'
import { decir, guardarAjustesVoz, leerAjustesVoz, vocesEspanol, type AjustesVoz as Ajustes } from './voz'

// Elegir la voz y la velocidad de la voz sintética en este dispositivo
export default function AjustesVoz() {
  const [voces, setVoces] = useState<SpeechSynthesisVoice[]>(() => vocesEspanol())
  const [ajustes, setAjustes] = useState<Ajustes>(() => leerAjustesVoz())

  // Algunos navegadores cargan las voces después
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const cargar = () => setVoces(vocesEspanol())
    window.speechSynthesis.addEventListener('voiceschanged', cargar)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', cargar)
  }, [])

  const cambiar = (nuevos: Ajustes) => {
    setAjustes(nuevos)
    guardarAjustesVoz(nuevos)
  }

  return (
    <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
      <p className="font-medium text-slate-700">Voz en este dispositivo</p>
      {voces.length === 0 ? (
        <p className="text-xs text-slate-500">No hay voces en español instaladas en este dispositivo.</p>
      ) : (
        <select
          value={ajustes.voz ?? ''}
          onChange={(e) => cambiar({ ...ajustes, voz: e.target.value || null })}
          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5"
        >
          <option value="">Por defecto del dispositivo</option>
          {voces.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      )}
      <label className="flex items-center gap-2 text-xs text-slate-600">
        Velocidad
        <input
          type="range"
          min={0.4}
          max={1.2}
          step={0.05}
          value={ajustes.velocidad}
          onChange={(e) => cambiar({ ...ajustes, velocidad: Number(e.target.value) })}
          className="flex-1"
        />
        <span className="w-10 text-right tabular-nums">{ajustes.velocidad.toFixed(2)}</span>
      </label>
      <button onClick={() => decir('Toca el plátano', ajustes)} className="rounded-lg bg-white px-3 py-1.5 text-indigo-600 shadow-sm">
        ▶ Probar
      </button>
      <p className="text-[11px] text-slate-500">
        En iPad hay voces de más calidad en Ajustes → Accesibilidad → Contenido leído → Voces → Español.
      </p>
    </div>
  )
}
