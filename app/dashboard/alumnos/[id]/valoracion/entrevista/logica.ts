import { PREGUNTAS, nivelDe, type Pregunta } from './preguntas'

// Lógica de la entrevista inicial: qué pregunta toca, cuándo parar y qué nivel
// y dominio se recomiendan. Se usa en el cliente (para guiar la entrevista) y
// en el servidor (para guardar el resultado al finalizar).

export type Respuesta = 'si' | 'a_veces' | 'no' | 'no_se'
export type RespuestaGuardada = { r: Respuesta; comprobado?: { aciertos: number; total: number } }
export type Respuestas = Record<string, RespuestaGuardada>

export const ETIQUETA_RESPUESTA: Record<Respuesta, string> = { si: 'Sí', a_veces: 'A veces', no: 'No', no_se: 'No lo sé' }
export const RESPUESTAS: Respuesta[] = ['si', 'a_veces', 'no', 'no_se']

// Regla de parada (decidida por el usuario el 2026-11-27): 3 «No» seguidos, o
// 4 «No» o «A veces» entre las 5 últimas respuestas («No lo sé» no cuenta)
const SEGUIDOS = 3
const VENTANA = 5
const FALLOS_EN_VENTANA = 4

const falla = (r: Respuesta) => r === 'no' || r === 'a_veces'

export function leerRespuestas(valor: unknown): Respuestas {
  if (!valor || typeof valor !== 'object') return {}
  const salida: Respuestas = {}
  for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
    const r = (v as { r?: unknown })?.r
    if (r === 'si' || r === 'a_veces' || r === 'no' || r === 'no_se') salida[k] = v as RespuestaGuardada
  }
  return salida
}

// Preguntas de la entrevista según el nivel por el que se empieza (lo anterior
// se da por «Sí» salvo que se haya contestado)
export function preguntasDesde(nivelSalto: number | null): Pregunta[] {
  return PREGUNTAS.filter((p) => !nivelSalto || nivelDe(p.dominio) >= nivelSalto)
}

export type Estado = {
  siguiente: Pregunta | null
  parada: boolean
  contestadas: number
  total: number
  // Resultado (provisional mientras no se finaliza)
  nivel: number | null
  dominio: string | null
  lagunas: string[]
  pendientes: number[]
}

export function calcularEstado(respuestas: Respuestas, nivelSalto: number | null): Estado {
  const lista = preguntasDesde(nivelSalto)
  const respondidas = lista.filter((p) => respuestas[p.n]).map((p) => ({ p, r: respuestas[p.n].r }))
  const contadas = respondidas.filter((x) => x.r !== 'no_se')

  const ultimas = contadas.slice(-VENTANA)
  const seguidos = contadas.slice(-SEGUIDOS)
  const parada =
    (seguidos.length === SEGUIDOS && seguidos.every((x) => x.r === 'no')) ||
    ultimas.filter((x) => falla(x.r)).length >= FALLOS_EN_VENTANA

  // Dominio recomendado: el del primer fallo del tramo final (las últimas 5
  // respuestas contadas); los fallos anteriores son lagunas
  const fallos = contadas.filter((x) => falla(x.r))
  const tramo = ultimas.filter((x) => falla(x.r))
  const inicio = tramo[0] ?? fallos[fallos.length - 1] ?? null
  const dominio = inicio?.p.dominio ?? null
  const indiceInicio = inicio ? lista.indexOf(inicio.p) : lista.length
  const lagunas = [...new Set(fallos.filter((x) => lista.indexOf(x.p) < indiceInicio && x.p.dominio !== dominio).map((x) => x.p.dominio))]
  const pendientes = respondidas.filter((x) => x.r === 'no_se').map((x) => x.p.n)

  return {
    siguiente: parada ? null : (lista.find((p) => !respuestas[p.n]) ?? null),
    parada,
    contestadas: respondidas.length,
    total: lista.length,
    nivel: dominio ? nivelDe(dominio) : null,
    dominio,
    lagunas,
    pendientes,
  }
}

// Valoración por dominio para el punto de partida: todo «Sí» (o dado por «Sí»
// al saltar) → dominado; algún «No» → no; si no, con algún «A veces» → parcial.
// Los dominios sin respuestas (después de parar) no se valoran
export function valoracionPorDominio(respuestas: Respuestas, nivelSalto: number | null): Record<string, 'dominado' | 'parcial' | 'no'> {
  const salida: Record<string, 'dominado' | 'parcial' | 'no'> = {}
  const dominios = [...new Set(PREGUNTAS.map((p) => p.dominio))]
  for (const d of dominios) {
    const ps = PREGUNTAS.filter((p) => p.dominio === d)
    const rs = ps.map((p) => respuestas[p.n]?.r).filter((r): r is Respuesta => !!r && r !== 'no_se')
    if (rs.length === 0) {
      if (nivelSalto && nivelDe(d) < nivelSalto) salida[d] = 'dominado'
      continue
    }
    salida[d] = rs.includes('no') ? 'no' : rs.includes('a_veces') ? 'parcial' : 'dominado'
  }
  return salida
}

// «Comprobar ahora»: aciertos en los ensayos de tableta → respuesta sugerida
export function respuestaSugerida(aciertos: number, total: number): Respuesta {
  if (total === 0) return 'no_se'
  const p = aciertos / total
  return p >= 0.75 ? 'si' : p >= 0.5 ? 'a_veces' : 'no'
}
