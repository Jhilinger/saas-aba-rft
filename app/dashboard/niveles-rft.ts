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
//
// "Relacionar relaciones" (razonamiento analógico) se dejó fuera a
// propósito: no encaja en este modelo de clases/miembros/posiciones, hace
// falta una estructura de datos distinta.

export const NIVELES_RFT = ['abstraccion', 'mutuo', 'combinatorio'] as const
export type NivelRft = (typeof NIVELES_RFT)[number]

export const NOMBRE_NIVEL_RFT: Record<NivelRft, string> = {
  abstraccion: 'Abstracción de clave relacional',
  mutuo: 'Vínculo mutuo',
  combinatorio: 'Vínculo combinatorio',
}

export const MAX_MIEMBROS_POR_NIVEL: Record<NivelRft, number> = {
  abstraccion: 1,
  mutuo: 2,
  combinatorio: 5,
}

export const POSICIONES_POR_NIVEL: Record<NivelRft, string[]> = {
  abstraccion: ['A'],
  mutuo: ['A', 'B'],
  combinatorio: ['A', 'B', 'C', 'D', 'E'],
}

// Fases de datos (bloques_ensayo_rft.fase) permitidas por nivel — no incluye
// "generalizacion"/"mantenimiento" (sondas), que se permiten siempre que la
// combinación ya esté dominada, independientemente del nivel: si se llegó a
// dominar, ya pasó por este filtro cuando se registró como test.
export const FASES_POR_NIVEL: Record<NivelRft, readonly string[]> = {
  abstraccion: ['entrenamiento'],
  mutuo: ['entrenamiento', 'test_mutuo', 'transformacion_funciones'],
  combinatorio: ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones'],
}

export function coerceNivelRft(value: string | null | undefined): NivelRft {
  return (NIVELES_RFT as readonly string[]).includes(value ?? '') ? (value as NivelRft) : 'combinatorio'
}
