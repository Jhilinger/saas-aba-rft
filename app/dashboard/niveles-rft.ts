// Un programa RFT tiene, además de su tipo_relacion (QUÉ relación: coordinación,
// oposición...), un nivel estructural que dice cuántos miembros puede tener
// cada clase y qué fases tiene sentido trabajar en ella:
//
// - Abstracción de clave relacional: clases de 1 solo miembro (posición A),
//   entrenadas contra sí mismas entre distractores de otras clases. Es un
//   entrenamiento de discriminación directa (equivalente a un DTT de ABA),
//   sin ningún test — no hay nada emergente que probar con un solo miembro.
// - Vínculo mutuo: clases de 2 miembros (A y B). Se entrena una dirección y
//   se prueba la inversa (test de vínculo mutuo) y la transformación de
//   funciones. No hay vínculo combinatorio posible con solo 2 miembros.
// - Vínculo combinatorio: clases de 3 o más miembros (A-E). Todas las fases
//   están disponibles.
// - Relacionar relaciones (razonamiento analógico — igualación a la muestra
//   relacional): también usa clases_rft/estimulos_rft (hasta 5 miembros,
//   posiciones A-E), pero cada estímulo lleva además un "elemento" — dos
//   estímulos de la misma clase con el mismo elemento cuentan como "el
//   mismo" para calcular el patrón de la clase (cuántos coinciden entre sí,
//   ver patron-rft.ts). Dos clases "combinan" cuando tienen el mismo patrón,
//   sea cual sea el contenido concreto. Solo entrenamiento y test de vínculo
//   mutuo tienen sentido aquí (la relación "mismo patrón" es simétrica por
//   construcción, no hay una fase combinatoria ni de transformación).
//   La toma de datos es distinta al resto de RFT (se compara la clase
//   entera, no un estímulo por posición), así que tiene su propia pantalla,
//   pero reutiliza guardarBloqueRft sin cambios: fase = entrenamiento |
//   test_mutuo, posición origen = "igual" | "diferente" (qué se pregunta),
//   posición destino = "na" (no aplica).

export const NIVELES_RFT = ['abstraccion', 'mutuo', 'combinatorio', 'relacion_relaciones'] as const
export type NivelRft = (typeof NIVELES_RFT)[number]

export const NOMBRE_NIVEL_RFT: Record<NivelRft, string> = {
  abstraccion: 'Abstracción de clave relacional',
  mutuo: 'Vínculo mutuo',
  combinatorio: 'Vínculo combinatorio',
  relacion_relaciones: 'Relacionar relaciones (igualación a la muestra relacional)',
}

export const MAX_MIEMBROS_POR_NIVEL: Record<NivelRft, number> = {
  abstraccion: 1,
  mutuo: 2,
  combinatorio: 5,
  relacion_relaciones: 5,
}

export const POSICIONES_POR_NIVEL: Record<NivelRft, string[]> = {
  abstraccion: ['A'],
  mutuo: ['A', 'B'],
  combinatorio: ['A', 'B', 'C', 'D', 'E'],
  relacion_relaciones: ['A', 'B', 'C', 'D', 'E'],
}

// Fases de datos (bloques_ensayo_rft.fase) permitidas por nivel — no incluye
// "generalizacion"/"mantenimiento" (sondas), que se permiten siempre que la
// combinación ya esté dominada, independientemente del nivel: si se llegó a
// dominar, ya pasó por este filtro cuando se registró como test.
export const FASES_POR_NIVEL: Record<NivelRft, readonly string[]> = {
  abstraccion: ['entrenamiento'],
  mutuo: ['entrenamiento', 'test_mutuo', 'transformacion_funciones'],
  combinatorio: ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones'],
  relacion_relaciones: ['entrenamiento', 'test_mutuo'],
}

export function coerceNivelRft(value: string | null | undefined): NivelRft {
  return (NIVELES_RFT as readonly string[]).includes(value ?? '') ? (value as NivelRft) : 'combinatorio'
}

// Etiqueta legible para una combinación fase+posiciones ya guardada (se usa
// en los listados de "dominio por fase" y en el historial de tests). Para
// relacion_relaciones, posición destino siempre es "na" (no aplica) y la
// origen es "igual"/"diferente" — se muestra sin la flecha en ese caso.
export function etiquetaCombinacionRft(posicionOrigen: string, posicionDestino: string): string {
  if (posicionDestino === 'na') {
    return posicionOrigen === 'igual' ? '¿Cuál es igual?' : posicionOrigen === 'diferente' ? '¿Cuál es diferente?' : posicionOrigen
  }
  return `${posicionOrigen}→${posicionDestino}`
}
