import type { Json } from '@/database.types'
import { FASES_POR_NIVEL, POSICIONES_POR_NIVEL, type NivelRft } from './niveles-rft'

// Secuencia de bloques de un programa RFT (programas_base/alumno.secuencia_rft):
// lista ordenada de { fase, origen, destino }, tal como la describe el
// apartado «Registro en la app» de cada programa. La toma de datos recomienda
// el primer paso que no esté dominado en el grupo. Sin secuencia se usa una
// regla genérica: entrenamiento lineal (A→B, B→C…), tests mutuos de lo
// entrenado y tests combinatorios de lo no entrenado.

export const FASES_SECUENCIA = ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones'] as const
export type FaseSecuencia = (typeof FASES_SECUENCIA)[number]
export type PasoSecuencia = { fase: FaseSecuencia; origen: string; destino: string }

export const NOMBRE_FASE_SECUENCIA: Record<FaseSecuencia, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test mutuo',
  test_combinatorio: 'Test combinatorio',
  transformacion_funciones: 'Transformación',
}

const POSICIONES = ['A', 'B', 'C', 'D', 'E']

export function leerSecuencia(valor: Json | null | undefined): PasoSecuencia[] {
  if (!Array.isArray(valor)) return []
  return valor.flatMap((p) => {
    if (!p || typeof p !== 'object' || Array.isArray(p)) return []
    const { fase, origen, destino } = p as Record<string, unknown>
    if (!(FASES_SECUENCIA as readonly unknown[]).includes(fase)) return []
    if (typeof origen !== 'string' || typeof destino !== 'string' || !POSICIONES.includes(origen) || !POSICIONES.includes(destino)) return []
    return [{ fase: fase as FaseSecuencia, origen, destino }]
  })
}

export function secuenciaGenerica(nivel: NivelRft, posiciones: string[]): PasoSecuencia[] {
  if (nivel === 'abstraccion') return [{ fase: 'entrenamiento', origen: 'A', destino: 'A' }]
  const ordenadas = [...new Set(posiciones)].sort()
  const fases = FASES_POR_NIVEL[nivel]
  const entrenadas = ordenadas.slice(1).map((p, i) => [ordenadas[i], p] as const)
  const pasos: PasoSecuencia[] = entrenadas.map(([origen, destino]) => ({ fase: 'entrenamiento', origen, destino }))
  if (fases.includes('test_mutuo')) {
    pasos.push(...entrenadas.map(([origen, destino]) => ({ fase: 'test_mutuo' as const, origen: destino, destino: origen })))
  }
  if (fases.includes('test_combinatorio')) {
    const directas = new Set(entrenadas.flatMap(([o, d]) => [`${o}${d}`, `${d}${o}`]))
    for (let i = 0; i < ordenadas.length; i++) {
      for (let j = i + 1; j < ordenadas.length; j++) {
        const [x, y] = [ordenadas[i], ordenadas[j]]
        if (directas.has(`${x}${y}`)) continue
        pasos.push({ fase: 'test_combinatorio', origen: x, destino: y }, { fase: 'test_combinatorio', origen: y, destino: x })
      }
    }
  }
  return pasos
}

// Secuencia que se sigue en un grupo: los pasos del programa cuyas posiciones
// existen en el grupo o, si no queda ninguno, la regla genérica
export function secuenciaDelGrupo(valor: Json | null | undefined, nivel: NivelRft, posicionesGrupo: string[]): PasoSecuencia[] {
  const disponibles = new Set(posicionesGrupo)
  const delPrograma = leerSecuencia(valor).filter((p) => disponibles.has(p.origen) && disponibles.has(p.destino))
  return delPrograma.length ? delPrograma : secuenciaGenerica(nivel, posicionesGrupo)
}

// Texto del formulario, una línea por fase: "Entrenamiento: A→B, B→C"
export function formatearSecuencia(pasos: PasoSecuencia[]): string {
  const lineas: { fase: FaseSecuencia; relaciones: string[] }[] = []
  for (const p of pasos) {
    const ultima = lineas.at(-1)
    const relacion = `${p.origen}→${p.destino}`
    if (ultima && ultima.fase === p.fase) ultima.relaciones.push(relacion)
    else lineas.push({ fase: p.fase, relaciones: [relacion] })
  }
  return lineas.map((l) => `${NOMBRE_FASE_SECUENCIA[l.fase]}: ${l.relaciones.join(', ')}`).join('\n')
}

const FASE_POR_TEXTO: [RegExp, FaseSecuencia][] = [
  [/^entrenamiento$/, 'entrenamiento'],
  [/^test (de v[ií]nculo )?mutuo$/, 'test_mutuo'],
  [/^test (de v[ií]nculo )?combinatorio$/, 'test_combinatorio'],
  [/^transformaci[oó]n( de funciones)?$/, 'transformacion_funciones'],
]

export function parsearSecuencia(texto: string, nivel: NivelRft): { valor: PasoSecuencia[] | null } | { error: string } {
  if (nivel === 'abstraccion' || !texto.trim()) return { valor: null }
  const permitidas = POSICIONES_POR_NIVEL[nivel]
  const fasesNivel = FASES_POR_NIVEL[nivel]
  const pasos: PasoSecuencia[] = []
  for (const linea of texto.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const m = /^([^:]+):(.*)$/.exec(linea)
    if (!m) return { error: `Línea no válida: "${linea}" (usa "Fase: A→B, B→C")` }
    const fase = FASE_POR_TEXTO.find(([re]) => re.test(m[1].trim().toLowerCase()))?.[1]
    if (!fase) return { error: `Fase desconocida: "${m[1].trim()}" (Entrenamiento, Test mutuo, Test combinatorio o Transformación)` }
    if (!fasesNivel.includes(fase)) return { error: `${NOMBRE_FASE_SECUENCIA[fase]} no está disponible en este tipo de tarea` }
    for (const trozo of m[2].split(/[,;]+/).map((t) => t.trim()).filter(Boolean)) {
      const r = /^([A-Ea-e])\s*(?:→|->|-|>)\s*([A-Ea-e])$/.exec(trozo)
      if (!r) return { error: `Relación no válida: "${trozo}" (usa el formato A→B)` }
      const [origen, destino] = [r[1].toUpperCase(), r[2].toUpperCase()]
      if (origen === destino) return { error: `"${trozo}": origen y destino deben ser distintos` }
      if (!permitidas.includes(origen) || !permitidas.includes(destino)) {
        return { error: `"${trozo}": este tipo de tarea solo admite las posiciones ${permitidas.join(', ')}` }
      }
      if (!pasos.some((p) => p.fase === fase && p.origen === origen && p.destino === destino)) pasos.push({ fase, origen, destino })
    }
  }
  if (pasos.length && pasos[0].fase !== 'entrenamiento') return { error: 'La secuencia debe empezar por un entrenamiento' }
  return { valor: pasos.length ? pasos : null }
}

export type Dominado = { grupo: string; fase: string; posicion_origen: string; posicion_destino: string }

export type Recomendacion = { grupo: string; paso: PasoSecuencia; indice: number; total: number }

// Primer paso no dominado del primer grupo que tenga alguno pendiente; null si
// todo está dominado
export function recomendarBloque(
  valor: Json | null | undefined,
  nivel: NivelRft,
  grupos: { grupo: string; posiciones: string[] }[],
  dominados: Dominado[]
): Recomendacion | null {
  const hecho = new Set(dominados.map((d) => `${d.grupo}|${d.fase}|${d.posicion_origen}|${d.posicion_destino}`))
  for (const { grupo, posiciones } of grupos) {
    if (posiciones.length === 0) continue
    const pasos = secuenciaDelGrupo(valor, nivel, posiciones)
    const indice = pasos.findIndex((p) => !hecho.has(`${grupo}|${p.fase}|${p.origen}|${p.destino}`))
    if (indice >= 0) return { grupo, paso: pasos[indice], indice, total: pasos.length }
  }
  return null
}
