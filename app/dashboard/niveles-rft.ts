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
// - Relacionar relaciones: mecánicamente idéntico a vínculo mutuo (clases de
//   2 miembros, mismo mecanismo de toma de datos, misma comprobación de
//   conexión y de dominio) — la diferencia es solo de fases (sin
//   transformación de funciones) y de uso: el contenido de cada estímulo lo
//   diseña libremente el terapeuta (ej. "frío-calor" como texto de un solo
//   estímulo) para representar la relación que quiera enseñar/probar entre
//   clases — el sistema no interpreta ni calcula nada sobre esa relación,
//   es el terapeuta quien decide qué combina con qué y lo documenta en las
//   instrucciones del programa.

export const NIVELES_RFT = ['abstraccion', 'mutuo', 'combinatorio', 'relacion_relaciones'] as const
export type NivelRft = (typeof NIVELES_RFT)[number]

export const NOMBRE_NIVEL_RFT: Record<NivelRft, string> = {
  abstraccion: 'Abstracción de clave relacional',
  mutuo: 'Vínculo mutuo',
  combinatorio: 'Vínculo combinatorio',
  relacion_relaciones: 'Relacionar relaciones',
}

export const MAX_MIEMBROS_POR_NIVEL: Record<NivelRft, number> = {
  abstraccion: 1,
  mutuo: 2,
  combinatorio: 5,
  relacion_relaciones: 2,
}

export const POSICIONES_POR_NIVEL: Record<NivelRft, string[]> = {
  abstraccion: ['A'],
  mutuo: ['A', 'B'],
  combinatorio: ['A', 'B', 'C', 'D', 'E'],
  relacion_relaciones: ['A', 'B'],
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
