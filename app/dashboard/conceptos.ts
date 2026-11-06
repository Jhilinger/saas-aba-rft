import type { Json } from '@/database.types'
import type { EstimuloPantalla } from './estimulo-pantalla'

// Conceptos básicos en la tableta (programas_*.actividad_tablet): los programas
// de abstracción de claves generan los ensayos a partir del banco de imágenes
// en lugar de usar clases fijas, así que el alumno no puede memorizar imágenes
// concretas. Las claves se alternan dentro del bloque desde el principio,
// como indica el currículo, para que la respuesta quede bajo control de la
// clave relacional. Cada nivel se registra como un grupo (A → A).

export type ModoDistincion = 'igual_diferente' | 'intruso' | 'sutil'
export type Dimension = 'tamano' | 'cantidad' | 'longitud' | 'altura'
export type NivelDistincion = { nombre: string; modo: ModoDistincion; opciones: number }
export type NivelComparacion = { nombre: string; dimensiones: Dimension[]; proporcion: number; intermedio: boolean }
export type NivelOposicion = { nombre: string; opciones: number }
export type ActividadConceptos =
  | { tipo: 'distincion'; niveles: NivelDistincion[] }
  | { tipo: 'comparacion'; niveles: NivelComparacion[] }
  | { tipo: 'oposicion'; niveles: NivelOposicion[] }

// Pares de opuestos del banco (scripts/imagenes/pares-oposicion.mjs): el mismo
// objeto en los dos polos. Se entrena con unas dimensiones y se generaliza con
// otras no entrenadas, como indica el currículo
const OPUESTOS: [string, string, 'entrenamiento' | 'generalizacion'][] = [
  ['caja-abierta', 'caja-cerrada', 'entrenamiento'],
  ['puerta-abierta', 'puerta-cerrada', 'entrenamiento'],
  ['libro-abierto', 'libro-cerrado', 'entrenamiento'],
  ['paraguas-abierto', 'paraguas-cerrado', 'entrenamiento'],
  ['vaso-lleno', 'vaso-vacio', 'entrenamiento'],
  ['cesta-llena', 'cesta-vacia', 'entrenamiento'],
  ['bote-lleno', 'bote-vacio', 'entrenamiento'],
  ['bol-lleno', 'bol-vacio', 'entrenamiento'],
  ['lampara-encendida', 'lampara-apagada', 'entrenamiento'],
  ['linterna-encendida', 'linterna-apagada', 'entrenamiento'],
  ['television-encendida', 'television-apagada', 'entrenamiento'],
  ['bombilla-encendida', 'bombilla-apagada', 'entrenamiento'],
  ['toalla-mojada', 'toalla-seca', 'generalizacion'],
  ['camiseta-mojada', 'camiseta-seca', 'generalizacion'],
  ['perro-mojado', 'perro-seco', 'generalizacion'],
  ['plato-limpio', 'plato-sucio', 'generalizacion'],
  ['zapatilla-limpia', 'zapatilla-sucia', 'generalizacion'],
  ['camiseta-limpia', 'camiseta-sucia', 'generalizacion'],
  ['taza-caliente', 'taza-fria', 'generalizacion'],
  ['olla-caliente', 'olla-fria', 'generalizacion'],
]
export const CONCEPTOS_OPUESTOS = OPUESTOS.flatMap(([a, b]) => [`oposicion/${a}`, `oposicion/${b}`])

export type OpcionGenerada = { pantalla: EstimuloPantalla; etiqueta: string; correcta: boolean }
export type EnsayoGenerado = { clave: string; consigna: string; muestra: EstimuloPantalla | null; opciones: OpcionGenerada[] }
export type Concepto = { concepto: string; nombre: string }

// Categorías del banco para entrenar y, aparte, para las sondas de
// generalización (objetos que no han salido en el entrenamiento)
export const CATEGORIAS_ENTRENAMIENTO = ['alimentos', 'animales-de-granja', 'objetos', 'vehiculos', 'prendas-de-vestir', 'utensilios-de-cocina', 'muebles']
export const CATEGORIAS_GENERALIZACION = ['animales-salvajes', 'animales-marinos', 'instrumentos-musicales', 'herramientas', 'material-escolar', 'electrodomesticos']

// Frases que puede decir la tableta (se graban con la voz de las claves)
export const CONSIGNAS = {
  igual: 'Toca el igual',
  diferente: 'Toca el diferente',
  intruso: '¿Cuál es diferente?',
  contrario: 'Toca el contrario',
  tamano: ['¿Cuál es más grande?', '¿Cuál es más pequeño?'],
  cantidad: ['¿Dónde hay más?', '¿Dónde hay menos?'],
  longitud: ['¿Cuál es más largo?', '¿Cuál es más corto?'],
  altura: ['¿Cuál es más alto?', '¿Cuál es más bajo?'],
} as const

export function frasesConceptos(): string[] {
  return Object.values(CONSIGNAS).flat()
}

const DIMENSIONES: Dimension[] = ['tamano', 'cantidad', 'longitud', 'altura']
const MODOS: ModoDistincion[] = ['igual_diferente', 'intruso', 'sutil']

export function leerActividadConceptos(valor: Json | null | undefined): ActividadConceptos | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const o = valor as Record<string, unknown>
  const niveles = Array.isArray(o.niveles) ? (o.niveles as Record<string, unknown>[]) : []
  const nombre = (n: Record<string, unknown>, i: number) => (typeof n.nombre === 'string' && n.nombre.trim() ? n.nombre.trim() : `Nivel ${i + 1}`)
  if (o.tipo === 'distincion') {
    const lista = niveles.map((n, i) => ({
      nombre: nombre(n, i),
      modo: MODOS.includes(n.modo as ModoDistincion) ? (n.modo as ModoDistincion) : 'igual_diferente',
      opciones: typeof n.opciones === 'number' ? Math.min(5, Math.max(2, Math.round(n.opciones))) : 2,
    }))
    return lista.length ? { tipo: 'distincion', niveles: lista } : null
  }
  if (o.tipo === 'oposicion') {
    const lista = niveles.map((n, i) => ({
      nombre: nombre(n, i),
      opciones: typeof n.opciones === 'number' ? Math.min(4, Math.max(2, Math.round(n.opciones))) : 3,
    }))
    return lista.length ? { tipo: 'oposicion', niveles: lista } : null
  }
  if (o.tipo === 'comparacion') {
    const lista = niveles.map((n, i) => {
      const dims = Array.isArray(n.dimensiones) ? (n.dimensiones as unknown[]).filter((d): d is Dimension => DIMENSIONES.includes(d as Dimension)) : []
      return {
        nombre: nombre(n, i),
        dimensiones: dims.length ? dims : (['tamano'] as Dimension[]),
        proporcion: typeof n.proporcion === 'number' ? Math.min(0.9, Math.max(0.3, n.proporcion)) : 0.5,
        intermedio: n.intermedio === true,
      }
    })
    return lista.length ? { tipo: 'comparacion', niveles: lista } : null
  }
  return null
}

type Azar = () => number

function barajar<T>(lista: T[], azar: Azar): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// n valores alternando a y b a partes iguales, sin más de 2 seguidos iguales
function alternados<T>(a: T, b: T, n: number, azar: Azar): T[] {
  for (let intento = 0; intento < 50; intento++) {
    const lista = barajar(Array.from({ length: n }, (_, i) => (i % 2 ? a : b)), azar)
    if (lista.every((v, i) => i < 2 || v !== lista[i - 1] || v !== lista[i - 2])) return lista
  }
  return Array.from({ length: n }, (_, i) => (i % 2 ? a : b))
}

// Conceptos al azar sin repetir el del ensayo anterior
function elegir(conceptos: Concepto[], azar: Azar, excluir: string[] = []): Concepto {
  const posibles = conceptos.filter((c) => !excluir.includes(c.concepto))
  const lista = posibles.length ? posibles : conceptos
  return lista[Math.floor(azar() * lista.length)]
}

function distincion(nivel: NivelDistincion, conceptos: Concepto[], n: number, azar: Azar): EnsayoGenerado[] {
  const claves = nivel.modo === 'intruso' ? Array<'intruso'>(n).fill('intruso') : alternados<'igual' | 'diferente'>('igual', 'diferente', n, azar)
  let anterior: string[] = []
  return claves.map((clave) => {
    const x = elegir(conceptos, azar, anterior)
    const y = elegir(conceptos, azar, [x.concepto, ...anterior])
    anterior = [x.concepto, y.concepto]
    if (clave === 'intruso') {
      const opciones: OpcionGenerada[] = [
        ...Array.from({ length: nivel.opciones - 1 }, () => ({ pantalla: { img: x.concepto }, etiqueta: x.nombre, correcta: false })),
        { pantalla: { img: y.concepto }, etiqueta: y.nombre, correcta: true },
      ]
      return { clave, consigna: CONSIGNAS.intruso, muestra: null, opciones: barajar(opciones, azar) }
    }
    // Diferencia sutil: el mismo objeto en otro color
    const tono = 90 + Math.floor(azar() * 180)
    const distinta: OpcionGenerada =
      nivel.modo === 'sutil'
        ? { pantalla: { img: x.concepto, tono }, etiqueta: `${x.nombre} (otro color)`, correcta: clave === 'diferente' }
        : { pantalla: { img: y.concepto }, etiqueta: y.nombre, correcta: clave === 'diferente' }
    const opciones: OpcionGenerada[] = [{ pantalla: { img: x.concepto }, etiqueta: x.nombre, correcta: clave === 'igual' }, distinta]
    return { clave, consigna: CONSIGNAS[clave], muestra: { img: x.concepto }, opciones: barajar(opciones, azar) }
  })
}

function comparacion(nivel: NivelComparacion, conceptos: Concepto[], n: number, azar: Azar): EnsayoGenerado[] {
  const polos = alternados<0 | 1>(0, 1, n, azar)
  let anterior: string[] = []
  return polos.map((polo, i) => {
    const dimension = nivel.dimensiones[Math.floor(azar() * nivel.dimensiones.length)]
    const p = nivel.proporcion
    // Con intermedio, tres magnitudes y pares contiguos: la del medio es la
    // mayor en unos ensayos y la menor en otros
    const magnitudes = nivel.intermedio ? [1, p, p * p] : [1, p]
    const inicio = nivel.intermedio ? (i % 2 === 0 ? 0 : 1) : 0
    const [mayor, menor] = [magnitudes[inicio], magnitudes[inicio + 1]]
    const x = elegir(conceptos, azar, anterior)
    anterior = [x.concepto]
    const opcion = (m: number): OpcionGenerada => {
      const correcta = polo === 0 ? m === mayor : m === menor
      if (dimension === 'tamano') return { pantalla: { img: x.concepto, escala: m }, etiqueta: `${x.nombre} ${Math.round(m * 100)} %`, correcta }
      if (dimension === 'cantidad') {
        const cuantos = Math.max(1, Math.round(6 * m))
        return { pantalla: { img: x.concepto, n: cuantos }, etiqueta: `${x.nombre} ×${cuantos}`, correcta }
      }
      if (dimension === 'longitud') return { pantalla: { forma: 'lapiz', valor: m }, etiqueta: `lápiz ${Math.round(m * 100)} %`, correcta }
      const bloques = Math.max(1, Math.round(8 * m))
      return { pantalla: { forma: 'torre', valor: bloques }, etiqueta: `torre de ${bloques}`, correcta }
    }
    return {
      clave: `${dimension}:${polo === 0 ? 'mas' : 'menos'}`,
      consigna: CONSIGNAS[dimension][polo],
      muestra: null,
      opciones: barajar([opcion(mayor), opcion(menor)], azar),
    }
  })
}

// Oposición: un polo como muestra; el polo opuesto del mismo objeto y, como
// distractores, objetos de otros pares (diferentes, no opuestos). Solo la
// clave «contrario», en las dos direcciones de cada par, sin nombrar las
// propiedades
function oposicion(nivel: NivelOposicion, generalizacion: boolean, n: number, azar: Azar): EnsayoGenerado[] {
  const pares = OPUESTOS.filter(([, , uso]) => uso === (generalizacion ? 'generalizacion' : 'entrenamiento'))
  const nombre = (slug: string) => slug.replace(/-/g, ' ')
  let anterior = -1
  return Array.from({ length: n }, () => {
    let i = Math.floor(azar() * pares.length)
    if (i === anterior && pares.length > 1) i = (i + 1) % pares.length
    anterior = i
    const [a, b] = pares[i]
    const [muestra, opuesto] = azar() < 0.5 ? [a, b] : [b, a]
    const otros = barajar(
      pares.filter((_, j) => j !== i).map(([x, y]) => (azar() < 0.5 ? x : y)),
      azar
    ).slice(0, nivel.opciones - 1)
    const opciones: OpcionGenerada[] = [
      { pantalla: { img: `oposicion/${opuesto}` }, etiqueta: nombre(opuesto), correcta: true },
      ...otros.map((o) => ({ pantalla: { img: `oposicion/${o}` }, etiqueta: nombre(o), correcta: false })),
    ]
    return { clave: 'contrario', consigna: CONSIGNAS.contrario, muestra: { img: `oposicion/${muestra}` }, opciones: barajar(opciones, azar) }
  })
}

export function generarBloque(
  actividad: ActividadConceptos,
  indiceNivel: number,
  conceptos: Concepto[],
  n: number,
  generalizacion = false,
  azar: Azar = Math.random
): EnsayoGenerado[] {
  if (actividad.tipo === 'oposicion') return oposicion(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (!conceptos.length) return []
  if (actividad.tipo === 'distincion') return distincion(actividad.niveles[indiceNivel], conceptos, n, azar)
  return comparacion(actividad.niveles[indiceNivel], conceptos, n, azar)
}
