'use client'

import { useEffect, useState } from 'react'

// Presentación de un ensayo en la tableta: pantalla vacía (pausa entre
// ensayos), después las comparaciones solas y, al cabo de un momento, la
// muestra (o la voz). La latencia se mide desde que aparece la muestra. El
// componente que la usa se monta de nuevo en cada ensayo (key), así que cada
// ensayo empieza en la pausa.

export type Etapa = 'pausa' | 'opciones' | 'muestra'

export const PAUSA_ENTRE_ENSAYOS = 1500
export const OPCIONES_ANTES_DE_LA_MUESTRA = 1000

export function useEtapasEnsayo(conOpciones: boolean, alMostrarMuestra?: () => void) {
  const [etapa, setEtapa] = useState<Etapa>('pausa')

  useEffect(() => {
    const temporizadores = [setTimeout(() => setEtapa(conOpciones ? 'opciones' : 'muestra'), PAUSA_ENTRE_ENSAYOS)]
    if (conOpciones) temporizadores.push(setTimeout(() => setEtapa('muestra'), PAUSA_ENTRE_ENSAYOS + OPCIONES_ANTES_DE_LA_MUESTRA))
    return () => temporizadores.forEach(clearTimeout)
  }, [conOpciones])

  useEffect(() => {
    if (etapa === 'muestra') alMostrarMuestra?.()
    // Solo al pasar a la muestra, no cuando cambie la función
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa])

  return etapa
}
