import type { NivelProgreso } from '../alumnos/[id]/progreso/progreso-curriculo'

// Secuencia del currículo en el PEI: AVISA (no bloquea) cuando se asigna un
// programa de un dominio y
// - el nivel anterior no alcanza UMBRAL_NIVEL (media de sus dominios), o
// - el dominio anterior del mismo nivel no alcanza UMBRAL_DOMINIO.
// Los porcentajes son los mismos de la página de progreso. Los niveles y
// dominios sin programas se saltan (cuenta el anterior que sí tenga).
// Antes era un bloqueo; desde el 2026-11-26 es solo un aviso: la app es para
// cualquier niño (también con desarrollo típico, que puede empezar en el nivel 3)
export const UMBRAL_NIVEL = 80
export const UMBRAL_DOMINIO = 80

// dominio_id → aviso (los dominios sin aviso no aparecen)
export function calcularAvisosSecuencia(niveles: NivelProgreso[]): Map<string, string> {
  const avisos = new Map<string, string>()

  niveles.forEach((nivel, i) => {
    const nivelPrevio = niveles.slice(0, i).reverse().find((n) => n.porcentaje !== null)
    const avisoNivel =
      nivelPrevio && nivelPrevio.porcentaje! < UMBRAL_NIVEL
        ? `El Nivel ${nivelPrevio.numero} está al ${nivelPrevio.porcentaje}%: se recomienda consolidarlo antes (${UMBRAL_NIVEL}%)`
        : null

    nivel.dominios.forEach((dominio, j) => {
      if (avisoNivel) {
        avisos.set(dominio.id, avisoNivel)
        return
      }
      const dominioPrevio = nivel.dominios.slice(0, j).reverse().find((d) => d.porcentaje !== null)
      if (dominioPrevio && dominioPrevio.porcentaje! < UMBRAL_DOMINIO) {
        avisos.set(
          dominio.id,
          `El dominio ${dominioPrevio.codigo} está al ${dominioPrevio.porcentaje}%: se recomienda consolidarlo antes (${UMBRAL_DOMINIO}%)`
        )
      }
    })
  })

  return avisos
}
