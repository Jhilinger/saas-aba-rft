// Traducción de una evaluación estandarizada a la valoración por programas
// (evaluaciones_iniciales) y propuesta de programas para empezar el PEI.

import type { ItemEvaluacion, RespuestaEvaluacion } from './logica'

export type Valoracion = 'dominado' | 'parcial' | 'no'

export const VALORACION_POR_PUNTUACION: Record<number, Valoracion> = { 2: 'dominado', 1: 'parcial', 0: 'no' }

export type Evidencia = { codigo: string; puntuacion: number | null; motivo: string | null }

export type ColocacionPrograma = {
  programaBaseId: string
  valoracion: Valoracion
  evidencias: Evidencia[]
}

// Un programa toma la puntuación más baja de los ítems que lo evalúan (ej. un
// vocabulario necesita la parte receptiva y la expresiva). Los ítems que la
// ruta no aplicó por techo o requisito cuentan como 0; los indicadores, los
// que no proceden y los que quedaron fuera de la ruta no marcan nada.
export function calcularColocacion(
  items: ItemEvaluacion[],
  respuestas: Map<string, RespuestaEvaluacion>,
  vinculos: { itemId: string; programaBaseId: string }[]
): ColocacionPrograma[] {
  const porId = new Map(items.map((i) => [i.id, i]))
  const porPrograma = new Map<string, { minima: number; evidencias: Evidencia[] }>()

  for (const v of vinculos) {
    const item = porId.get(v.itemId)
    const r = respuestas.get(v.itemId)
    if (!item || item.indicador || !r) continue
    const presunto = r.puntuacion === null && (r.noAplicado === 'techo' || r.noAplicado === 'requisito')
    const puntuacion = r.puntuacion ?? (presunto ? 0 : null)
    if (puntuacion === null) continue

    const actual = porPrograma.get(v.programaBaseId) ?? { minima: 2, evidencias: [] }
    actual.minima = Math.min(actual.minima, puntuacion)
    actual.evidencias.push({ codigo: item.codigo, puntuacion: r.puntuacion, motivo: presunto ? r.noAplicado : null })
    porPrograma.set(v.programaBaseId, actual)
  }

  return [...porPrograma].map(([programaBaseId, { minima, evidencias }]) => ({
    programaBaseId,
    valoracion: VALORACION_POR_PUNTUACION[minima],
    evidencias: evidencias.sort((a, b) => a.codigo.localeCompare(b.codigo, 'es', { numeric: true })),
  }))
}

export function notaColocacion(fecha: string, evidencias: Evidencia[]) {
  const detalle = evidencias
    .map((e) => `${e.codigo} = ${e.puntuacion ?? (e.motivo === 'techo' ? '0 (techo)' : '0 (sin requisito)')}`)
    .join('; ')
  return `Evaluación estandarizada del ${fecha}: ${detalle}`
}

export const MAX_PROPUESTA = 8

// Programas para empezar: primero los emergentes (parcial), después los no
// adquiridos, en el orden del currículo; solo de dominios desbloqueados, con
// los requisitos dominados y que no estén ya en el PEI
export function proponerProgramas(
  programas: { id: string; ordenGlobal: number | null; dominioId: string | null }[],
  valoraciones: Map<string, Valoracion>,
  opciones: { enPei: Set<string>; dominados: Set<string>; bloqueos: Map<string, string>; requisitosDe: Map<string, string[]> }
): string[] {
  const prioridad = (v: Valoracion | undefined) => (v === 'parcial' ? 0 : v === 'no' ? 1 : null)
  return programas
    .filter((p) => {
      if (prioridad(valoraciones.get(p.id)) === null || p.ordenGlobal === null) return false
      if (opciones.enPei.has(p.id) || opciones.dominados.has(p.id)) return false
      if (p.dominioId && opciones.bloqueos.has(p.dominioId)) return false
      return (opciones.requisitosDe.get(p.id) ?? []).every((r) => opciones.dominados.has(r))
    })
    .sort(
      (a, b) =>
        prioridad(valoraciones.get(a.id))! - prioridad(valoraciones.get(b.id))! || a.ordenGlobal! - b.ordenGlobal!
    )
    .slice(0, MAX_PROPUESTA)
    .map((p) => p.id)
}
