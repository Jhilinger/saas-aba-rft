import { useEffect, useRef } from 'react'

// Latencia de cada ensayo: desde que aparece en pantalla hasta que el
// terapeuta registra la respuesta. Es aproximada (depende de cuándo pulsa el
// terapeuta), pero permite seguir la fluidez del alumno entre bloques.
export function useCronometroEnsayo(indiceEnsayo: number | null) {
  const inicio = useRef<number | null>(null)
  const capturada = useRef<number | null>(null)

  useEffect(() => {
    inicio.current = indiceEnsayo === null ? null : Date.now()
    capturada.current = null
  }, [indiceEnsayo])

  return {
    // Fija la latencia en la primera pulsación (ej. "Correcto con ayuda", antes
    // de elegir el tipo de ayuda)
    capturar() {
      if (capturada.current === null && inicio.current !== null) capturada.current = Date.now() - inicio.current
    },
    // Latencia del ensayo actual (la capturada, o la de este momento)
    leer(): number | null {
      if (capturada.current !== null) return capturada.current
      return inicio.current === null ? null : Date.now() - inicio.current
    },
    // Vuelve a empezar a contar (ej. mientras el terapeuta escribe la pregunta)
    reiniciar() {
      inicio.current = Date.now()
      capturada.current = null
    },
  }
}

// Segundos transcurridos desde el inicio del bloque (null si no se conoce)
export function segundosDesde(inicio: number | null): number | null {
  return inicio === null ? null : Math.round((Date.now() - inicio) / 1000)
}
