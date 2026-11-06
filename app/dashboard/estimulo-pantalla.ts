// Cómo se ve un estímulo en la pantalla del alumno (guiones de la evaluación
// y columna estimulos_rft(_base).pantalla): emoji, texto, imagen del banco,
// color, figura SVG por semilla, material externo o una pareja.

export type EstimuloPantalla =
  | { e: string; etiqueta?: string }
  | { t: string }
  // Imagen del banco (biblioteca_imagenes); n copias para cantidades; escala
  // (0,2–1) para tamaños y tono (grados) para el mismo objeto en otro color
  | { img: string; n?: number; etiqueta?: string; escala?: number; tono?: number }
  | { color: string }
  // v: variante fija de la figura (ej. familia de forma de las abstractas);
  // c: color (índice de tono) para distinguir figuras de un mismo programa
  | { fig: string; s: string; v?: number; c?: number; etiqueta?: string }
  | { externo: string }
  // Formas dibujadas para comparar magnitudes: lápiz de longitud valor (0,2–1)
  // o torre de valor bloques
  | { forma: 'lapiz' | 'torre'; valor: number }
  | { par: [EstimuloPantalla, EstimuloPantalla] }

export function esEstimulo(v: unknown): v is EstimuloPantalla {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const o = v as Record<string, unknown>
  if (typeof o.e === 'string' || typeof o.t === 'string' || typeof o.color === 'string' || typeof o.externo === 'string') return true
  if (typeof o.img === 'string') return true
  if (typeof o.fig === 'string' && typeof o.s === 'string') return true
  if ((o.forma === 'lapiz' || o.forma === 'torre') && typeof o.valor === 'number') return true
  return Array.isArray(o.par) && o.par.length === 2 && o.par.every(esEstimulo)
}

export function parsearEstimuloPantalla(valor: unknown): EstimuloPantalla | null {
  return esEstimulo(valor) ? valor : null
}

// Conceptos del banco que necesita un estímulo (incluidos los de una pareja)
export function conceptosDePantalla(e: EstimuloPantalla | null): string[] {
  if (!e) return []
  if ('img' in e) return [e.img]
  if ('par' in e) return e.par.flatMap(conceptosDePantalla)
  return []
}
