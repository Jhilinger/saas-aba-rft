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
// - Relacionar relaciones (razonamiento analógico): no usa clases ni
//   estímulos con posición — usa "analogías" (2 pares de términos, cada uno
//   con su propia relación) y un juicio igual/distinta relación. Por eso no
//   participa de MAX_MIEMBROS_POR_NIVEL/POSICIONES_POR_NIVEL/FASES_POR_NIVEL
//   (se documentan como no aplicables ahí), tiene su propio conjunto de
//   tablas (analogias_base/alumno, bloques_analogias) y sus propias
//   pantallas de autoría y toma de datos.

export const NIVELES_RFT = ['abstraccion', 'mutuo', 'combinatorio', 'relacion_relaciones'] as const
export type NivelRft = (typeof NIVELES_RFT)[number]

export const NOMBRE_NIVEL_RFT: Record<NivelRft, string> = {
  abstraccion: 'Abstracción de clave relacional',
  mutuo: 'Vínculo mutuo',
  combinatorio: 'Vínculo combinatorio',
  relacion_relaciones: 'Relacionar relaciones (razonamiento analógico)',
}

// No aplicable a relacion_relaciones (no usa clases/estímulos) — se deja en
// 0 y el código de clases/estímulos nunca se ejecuta para ese nivel.
export const MAX_MIEMBROS_POR_NIVEL: Record<NivelRft, number> = {
  abstraccion: 1,
  mutuo: 2,
  combinatorio: 5,
  relacion_relaciones: 0,
}

export const POSICIONES_POR_NIVEL: Record<NivelRft, string[]> = {
  abstraccion: ['A'],
  mutuo: ['A', 'B'],
  combinatorio: ['A', 'B', 'C', 'D', 'E'],
  relacion_relaciones: [],
}

// Fases de datos (bloques_ensayo_rft.fase) permitidas por nivel — no incluye
// "generalizacion"/"mantenimiento" (sondas), que se permiten siempre que la
// combinación ya esté dominada, independientemente del nivel: si se llegó a
// dominar, ya pasó por este filtro cuando se registró como test.
// relacion_relaciones no usa fase_rft en absoluto (usa su propio
// bloques_analogias.fase, con el mismo vocabulario que un registro de
// conducta: linea_base/intervencion/generalizacion/mantenimiento).
export const FASES_POR_NIVEL: Record<NivelRft, readonly string[]> = {
  abstraccion: ['entrenamiento'],
  mutuo: ['entrenamiento', 'test_mutuo', 'transformacion_funciones'],
  combinatorio: ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones'],
  relacion_relaciones: [],
}

export function coerceNivelRft(value: string | null | undefined): NivelRft {
  return (NIVELES_RFT as readonly string[]).includes(value ?? '') ? (value as NivelRft) : 'combinatorio'
}
