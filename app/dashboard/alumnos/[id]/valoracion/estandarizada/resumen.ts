// Puntos por dominio y por nivel de una evaluación. Cuentan los ítems
// puntuados y los no aplicados por techo o requisito (como 0); los que no
// proceden o quedaron fuera de la ruta no cuentan.

import { ordenarItems, type ItemEvaluacion, type RespuestaEvaluacion } from './logica'

export type ResumenGrupo = { obtenidos: number; maximo: number; puntuados: number; total: number }
export type ResumenDominio = ResumenGrupo & { dominioId: string; codigo: string; nombre: string; nivel: number }

function cuenta(r: RespuestaEvaluacion | undefined) {
  if (!r) return null
  if (r.puntuacion !== null) return r.puntuacion
  return r.noAplicado === 'techo' || r.noAplicado === 'requisito' ? 0 : null
}

export function resumirPorDominio(items: ItemEvaluacion[], respuestas: Map<string, RespuestaEvaluacion>): ResumenDominio[] {
  const dominios = new Map<string, ResumenDominio>()
  for (const item of ordenarItems(items.filter((i) => i.tipo === 'item' && i.dominioId))) {
    const d =
      dominios.get(item.dominioId!) ??
      { dominioId: item.dominioId!, codigo: item.dominioCodigo ?? '', nombre: item.dominioNombre ?? '', nivel: item.nivel, obtenidos: 0, maximo: 0, puntuados: 0, total: 0 }
    d.total++
    const puntos = cuenta(respuestas.get(item.id))
    if (puntos !== null) {
      d.obtenidos += puntos
      d.maximo += 2
      if (respuestas.get(item.id)?.puntuacion !== null) d.puntuados++
    }
    dominios.set(item.dominioId!, d)
  }
  return [...dominios.values()]
}

export function resumirPorNivel(dominios: ResumenDominio[]) {
  const niveles = new Map<number, ResumenGrupo>()
  for (const d of dominios) {
    const n = niveles.get(d.nivel) ?? { obtenidos: 0, maximo: 0, puntuados: 0, total: 0 }
    n.obtenidos += d.obtenidos
    n.maximo += d.maximo
    n.puntuados += d.puntuados
    n.total += d.total
    niveles.set(d.nivel, n)
  }
  return niveles
}

export function porcentaje(g: { obtenidos: number; maximo: number }) {
  return g.maximo > 0 ? Math.round((g.obtenidos / g.maximo) * 100) : null
}
