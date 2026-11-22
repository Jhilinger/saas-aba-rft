'use client'

import { useState, useSyncExternalStore } from 'react'
import AjustesVoz from './ajustes-voz'
import { guardarElogios, leerElogios } from './voz'
import { guardarRefuerzo, leerRefuerzo, type PreferenciasRefuerzo } from './refuerzo-tablet'

// «Voz y refuerzo» de la tableta del terapeuta: voz, elogio hablado, estrellas
// (economía de fichas) y sonido al acertar. Se recuerda en el dispositivo. Plegado
// en la pantalla previa al bloque y desplegado en el menú de la propia tableta.
export default function AjustesRefuerzo({
  plegable = false,
  onCambio,
}: {
  plegable?: boolean
  onCambio?: (cambio: { elogios: boolean; refuerzo: PreferenciasRefuerzo }) => void
}) {
  // Lo guardado en el dispositivo (en el servidor, los valores por defecto: así la
  // primera pintura coincide y no hay desajuste al hidratar)
  const guardado = useSyncExternalStore(
    () => () => {},
    () => JSON.stringify({ elogios: leerElogios(), refuerzo: leerRefuerzo() }),
    () => JSON.stringify({ elogios: true, refuerzo: { fichas: true, sonido: true } })
  )
  const [cambiado, setCambiado] = useState<{ elogios: boolean; refuerzo: PreferenciasRefuerzo } | null>(null)
  const { elogios, refuerzo } = cambiado ?? (JSON.parse(guardado) as { elogios: boolean; refuerzo: PreferenciasRefuerzo })

  const cambiar = (nuevoElogio: boolean, nuevoRefuerzo: PreferenciasRefuerzo) => {
    setCambiado({ elogios: nuevoElogio, refuerzo: nuevoRefuerzo })
    guardarElogios(nuevoElogio)
    guardarRefuerzo(nuevoRefuerzo)
    onCambio?.({ elogios: nuevoElogio, refuerzo: nuevoRefuerzo })
  }

  const contenido = (
    <div className="space-y-2 text-sm">
      <AjustesVoz />
      <label className="flex items-center gap-2 text-slate-700">
        <input type="checkbox" checked={elogios} onChange={(e) => cambiar(e.target.checked, refuerzo)} className="h-4 w-4" />
        Elogio hablado al acertar en entrenamiento («¡Muy bien!»)
      </label>
      <label className="flex items-center gap-2 text-slate-700">
        <input type="checkbox" checked={refuerzo.fichas} onChange={(e) => cambiar(elogios, { ...refuerzo, fichas: e.target.checked })} className="h-4 w-4" />
        Estrellas por acierto y premio al acabar el bloque (entrenamiento)
      </label>
      <label className="flex items-center gap-2 text-slate-700">
        <input type="checkbox" checked={refuerzo.sonido} onChange={(e) => cambiar(elogios, { ...refuerzo, sonido: e.target.checked })} className="h-4 w-4" />
        Sonido breve al acertar (entrenamiento)
      </label>
      <p className="text-xs text-slate-500">
        En los tests no hay refuerzo diferencial: ni estrellas ni sonido. Al acabar el bloque, dé usted el reforzador de respaldo.
      </p>
    </div>
  )

  if (!plegable) return contenido
  const resumen = [elogios && 'elogio', refuerzo.fichas && 'estrellas', refuerzo.sonido && 'sonido'].filter(Boolean).join(', ') || 'sin refuerzo en la tableta'
  return (
    <details className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <summary className="cursor-pointer text-sm font-medium text-slate-600">
        Voz y refuerzo <span className="font-normal text-slate-400">· {resumen}</span>
      </summary>
      <div className="pt-2">{contenido}</div>
    </details>
  )
}
