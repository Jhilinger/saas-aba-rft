import type { NivelProgreso } from '../alumnos/[id]/progreso/progreso-curriculo'

// Secuencia del currículo en el PEI: no se asignan programas de un dominio si
// - el nivel anterior no alcanza UMBRAL_NIVEL (media de sus dominios), o
// - el dominio anterior del mismo nivel no alcanza UMBRAL_DOMINIO.
// Los porcentajes son los mismos de la página de progreso. Los niveles y
// dominios sin programas se saltan (cuenta el anterior que sí tenga).
// El clinica_admin puede saltarse la regla con una justificación.
export const UMBRAL_NIVEL = 80
export const UMBRAL_DOMINIO = 80

export const ROLES_EXCEPCION_SECUENCIA = ['clinica_admin', 'superadmin']

// dominio_id → motivo del bloqueo (los dominios sin bloqueo no aparecen)
export function calcularBloqueos(niveles: NivelProgreso[]): Map<string, string> {
  const bloqueos = new Map<string, string>()

  niveles.forEach((nivel, i) => {
    const nivelPrevio = niveles.slice(0, i).reverse().find((n) => n.porcentaje !== null)
    const motivoNivel =
      nivelPrevio && nivelPrevio.porcentaje! < UMBRAL_NIVEL
        ? `Requiere el Nivel ${nivelPrevio.numero} al ${UMBRAL_NIVEL}% (ahora ${nivelPrevio.porcentaje}%)`
        : null

    nivel.dominios.forEach((dominio, j) => {
      if (motivoNivel) {
        bloqueos.set(dominio.id, motivoNivel)
        return
      }
      const dominioPrevio = nivel.dominios.slice(0, j).reverse().find((d) => d.porcentaje !== null)
      if (dominioPrevio && dominioPrevio.porcentaje! < UMBRAL_DOMINIO) {
        bloqueos.set(
          dominio.id,
          `Requiere el dominio ${dominioPrevio.codigo} al ${UMBRAL_DOMINIO}% (ahora ${dominioPrevio.porcentaje}%)`
        )
      }
    })
  })

  return bloqueos
}
