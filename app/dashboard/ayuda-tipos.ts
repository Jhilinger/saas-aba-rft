import type { Enums } from '@/database.types'

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

export type FilaConAyuda = { ayuda: Enums<'tipo_ayuda'> | null }

export type DistribucionAyuda = {
  tipo: Enums<'tipo_ayuda'>
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

  const conteo = new Map<Enums<'tipo_ayuda'>, number>()
  for (const f of filas) {
    if (!f.ayuda) continue
    conteo.set(f.ayuda, (conteo.get(f.ayuda) ?? 0) + 1)
  }

  return [...conteo.entries()]
    .map(([tipo, cantidad]) => ({
      tipo,
      etiqueta: ETIQUETA_AYUDA[tipo],
      color: COLOR_AYUDA[tipo],
      cantidad,
      porcentaje: Math.round((cantidad / total) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
}
