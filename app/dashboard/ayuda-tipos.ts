import type { Enums } from '@/database.types'
import { NIVELES_MENOR_A_MAYOR } from './sin-error'

export const ETIQUETA_AYUDA: Record<Enums<'tipo_ayuda'>, string> = {
  independiente: 'Independiente (sin ayuda)',
  verbal: 'Verbal',
  verbal_parcial: 'Verbal parcial',
  gestual: 'Gestual',
  visual: 'Visual',
  modelado: 'Modelado',
  fisica_parcial: 'Física parcial',
  fisica_total: 'Física total',
  textual: 'Textual',
}

// De más a menos independiente, para que el color vaya de "objetivo" (teal)
// a "más apoyo" (coral) de forma intuitiva en el gráfico.
export const COLOR_AYUDA: Record<Enums<'tipo_ayuda'>, string> = {
  independiente: '#0f4c5c',
  verbal: '#2f7a8c',
  visual: '#5a9aa8',
  gestual: '#8abac0',
  modelado: '#c9a227',
  textual: '#d46d54',
  verbal_parcial: '#e07a5f',
  fisica_parcial: '#aa5541',
  fisica_total: '#813c2f',
}

// Los errores se guardan con ayuda «independiente» (la ayuda solo se anota en
// los aciertos), así que el donut los separa por el campo correcto. Con ayudas
// de menor a mayor, el ensayo es un error que acabó en acierto con un nivel de
// ayuda (nivel_ayuda), y se cuenta por ese nivel.
type NivelMenorAMayor = 'nivel_1' | 'nivel_2' | 'nivel_3' | 'nivel_4' | 'nivel_5'
export type CategoriaAyuda = Enums<'tipo_ayuda'> | 'error' | NivelMenorAMayor

const ETIQUETA_CATEGORIA: Record<'error' | NivelMenorAMayor, string> = {
  error: 'Error',
  nivel_1: `Tras error: ${NIVELES_MENOR_A_MAYOR[0].toLowerCase()}`,
  nivel_2: `Tras error: ${NIVELES_MENOR_A_MAYOR[1].toLowerCase()}`,
  nivel_3: `Tras error: ${NIVELES_MENOR_A_MAYOR[2].toLowerCase()}`,
  nivel_4: `Tras error: ${NIVELES_MENOR_A_MAYOR[3].toLowerCase()}`,
  nivel_5: `Tras error: ${NIVELES_MENOR_A_MAYOR[4].toLowerCase()}`,
}
const COLOR_CATEGORIA: Record<'error' | NivelMenorAMayor, string> = {
  error: '#94a3b8',
  nivel_1: '#e9c46a',
  nivel_2: '#e0a458',
  nivel_3: '#d4824a',
  nivel_4: '#c0613f',
  nivel_5: '#9c4334',
}

export type FilaConAyuda = { ayuda: Enums<'tipo_ayuda'> | null; correcto?: boolean | null; nivel_ayuda?: number | null }

function categoria(f: FilaConAyuda): CategoriaAyuda | null {
  if (f.nivel_ayuda && f.nivel_ayuda >= 1 && f.nivel_ayuda <= 5) return `nivel_${f.nivel_ayuda}` as NivelMenorAMayor
  if (f.correcto === false) return 'error'
  return f.ayuda
}

export type DistribucionAyuda = {
  tipo: CategoriaAyuda
  etiqueta: string
  color: string
  cantidad: number
  porcentaje: number
}

// Convierte una lista plana de ensayos (cada uno con su tipo de ayuda) en la
// distribución agregada que pinta el donut: cuántos ensayos de cada tipo y
// qué porcentaje representan sobre el total.
export function calcularDistribucionAyudas(filas: FilaConAyuda[]): DistribucionAyuda[] {
  const total = filas.length
  if (total === 0) return []

  const conteo = new Map<CategoriaAyuda, number>()
  for (const f of filas) {
    const c = categoria(f)
    if (!c) continue
    conteo.set(c, (conteo.get(c) ?? 0) + 1)
  }

  return [...conteo.entries()]
    .map(([tipo, cantidad]) => ({
      tipo,
      etiqueta: tipo in ETIQUETA_CATEGORIA ? ETIQUETA_CATEGORIA[tipo as keyof typeof ETIQUETA_CATEGORIA] : ETIQUETA_AYUDA[tipo as Enums<'tipo_ayuda'>],
      color: tipo in COLOR_CATEGORIA ? COLOR_CATEGORIA[tipo as keyof typeof COLOR_CATEGORIA] : COLOR_AYUDA[tipo as Enums<'tipo_ayuda'>],
      cantidad,
      porcentaje: Math.round((cantidad / total) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
}
