// Guion de ensayos de un ítem para la pantalla del alumno (columna
// evaluacion_items.guion). Cada paso es un enunciado (se muestran tarjetas
// mientras el evaluador dice las relaciones), una comprobación previa, un
// ensayo de entrenamiento o uno de test.
//
// Respuesta 'unica': si el paso trae `correcta`, las opciones se muestran tal
// cual (botones fijos); si no, la correcta es la primera y se barajan con una
// permutación fija. 'multiple': cuadrícula fija y `correctas`. 'ordenar': las
// opciones vienen en el orden correcto y se barajan. Sin opciones, el ensayo
// lo puntúa el evaluador.

import { aleatorio } from '../../../../aleatorio'
import { esEstimulo, type EstimuloPantalla as Estimulo } from '../../../../estimulo-pantalla'

export type { Estimulo }

export type FasePaso = 'enunciado' | 'comprobacion' | 'entrenamiento' | 'test'

export type Paso = {
  fase: FasePaso
  consigna: string
  modelo?: Estimulo | Estimulo[]
  opciones?: Estimulo[]
  respuesta?: 'unica' | 'multiple' | 'ordenar'
  correcta?: number
  correctas?: number[]
  control?: boolean
  variante?: 'vocal' | 'no_vocal'
}

const FASES: FasePaso[] = ['enunciado', 'comprobacion', 'entrenamiento', 'test']

export function parsearGuion(valor: unknown): Paso[] {
  if (!Array.isArray(valor)) return []
  return valor.flatMap((p): Paso[] => {
    if (!p || typeof p !== 'object') return []
    const o = p as Record<string, unknown>
    if (!FASES.includes(o.fase as FasePaso) || typeof o.consigna !== 'string') return []
    const modelo = Array.isArray(o.modelo) ? o.modelo.filter(esEstimulo) : esEstimulo(o.modelo) ? o.modelo : undefined
    const opciones = Array.isArray(o.opciones) ? o.opciones.filter(esEstimulo) : undefined
    const respuesta = o.respuesta === 'multiple' || o.respuesta === 'ordenar' ? o.respuesta : 'unica'
    return [
      {
        fase: o.fase as FasePaso,
        consigna: o.consigna,
        modelo,
        opciones: opciones?.length ? opciones : undefined,
        respuesta,
        correcta: typeof o.correcta === 'number' ? o.correcta : undefined,
        correctas: Array.isArray(o.correctas) ? o.correctas.filter((n): n is number => typeof n === 'number') : undefined,
        control: o.control === true,
        variante: o.variante === 'vocal' || o.variante === 'no_vocal' ? o.variante : undefined,
      },
    ]
  })
}

export function pasosParaModalidad(pasos: Paso[], modalidad: 'vocal' | 'no_vocal') {
  return pasos.filter((p) => !p.variante || p.variante === modalidad)
}

function barajar<T>(xs: T[], rnd: () => number) {
  const r = [...xs]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

// Orden de presentación de las opciones de cada paso (índices del guion),
// fijo para todas las aplicaciones. En las de respuesta única barajadas, la
// correcta no cae más de dos veces seguidas en la misma posición.
export function ordenesDeOpciones(codigo: string, pasos: Paso[]): number[][] {
  const rnd = aleatorio(codigo)
  const posiciones: number[] = []
  return pasos.map((p) => {
    const n = p.opciones?.length ?? 0
    const identidad = Array.from({ length: n }, (_, i) => i)
    if (n < 2 || p.respuesta === 'multiple' || p.correcta !== undefined) return identidad
    if (p.respuesta === 'ordenar') {
      let orden = barajar(identidad, rnd)
      if (orden.every((v, i) => v === i)) orden = [...orden.slice(1), orden[0]]
      return orden
    }
    let orden = barajar(identidad, rnd)
    const repetida = () => {
      const pos = orden.indexOf(0)
      return posiciones.length >= 2 && posiciones.at(-1) === pos && posiciones.at(-2) === pos
    }
    if (repetida()) orden = [...orden.slice(1), orden[0]]
    posiciones.push(orden.indexOf(0))
    return orden
  })
}

export function indiceCorrecto(p: Paso) {
  return p.correcta ?? 0
}

export function esCorrecta(p: Paso, respuesta: number | number[]) {
  if (p.respuesta === 'multiple') {
    const elegidas = new Set(Array.isArray(respuesta) ? respuesta : [respuesta])
    const correctas = new Set(p.correctas ?? [])
    return elegidas.size === correctas.size && [...correctas].every((c) => elegidas.has(c))
  }
  if (p.respuesta === 'ordenar') {
    return Array.isArray(respuesta) && respuesta.length === (p.opciones?.length ?? 0) && respuesta.every((v, i) => v === i)
  }
  return respuesta === indiceCorrecto(p)
}
