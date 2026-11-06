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
export type ParEspacial = 'encima_debajo' | 'dentro_fuera' | 'delante_detras'
export type NivelEspacial = { nombre: string; pares: ParEspacial[] }
export type NivelTemporal = { nombre: string; modo: 'primero_despues' | 'antes_despues' }
export type ActividadConceptos =
  | { tipo: 'distincion'; niveles: NivelDistincion[] }
  | { tipo: 'comparacion'; niveles: NivelComparacion[] }
  | { tipo: 'oposicion'; niveles: NivelOposicion[] }
  | { tipo: 'espacial'; niveles: NivelEspacial[] }
  | { tipo: 'temporal'; niveles: NivelTemporal[] }

// Escenas espaciales (scripts/imagenes/escenas-conceptos.mjs): el mismo par
// de objetos en cada relación. [objeto, artículo, referencia, artículo, uso, relaciones que faltan]
const ESCENAS: [string, string, string, string, 'entrenamiento' | 'generalizacion', string[]][] = [
  ['pelota', 'la', 'caja', 'la', 'entrenamiento', []],
  ['osito', 'el', 'cesta', 'la', 'entrenamiento', []],
  ['manzana', 'la', 'bol', 'el', 'entrenamiento', []],
  ['coche', 'el', 'cubo', 'el', 'entrenamiento', []],
  ['gato', 'el', 'caja-zapatos', 'la', 'generalizacion', []],
  ['perro', 'el', 'caseta', 'la', 'generalizacion', ['debajo']],
]
const PARES_ESPACIALES: Record<ParEspacial, [string, string]> = {
  encima_debajo: ['encima', 'debajo'],
  dentro_fuera: ['dentro', 'fuera'],
  delante_detras: ['delante', 'detras'],
}
const NOMBRE_RELACION: Record<string, string> = { encima: 'encima', debajo: 'debajo', dentro: 'dentro', fuera: 'fuera', delante: 'delante', detras: 'detrás' }

function fraseEspacial(objeto: string, artObjeto: string, referencia: string, artReferencia: string, relacion: string) {
  const ref = referencia.replace('caja-zapatos', 'caja de zapatos')
  const de = artReferencia === 'el' ? 'del' : `de ${artReferencia}`
  return `Toca donde ${artObjeto} ${objeto} está ${NOMBRE_RELACION[relacion]} ${de} ${ref}`
}

// Secuencias de viñetas: [conceptos en orden, uso]
const SECUENCIAS: [string[], 'entrenamiento' | 'generalizacion'][] = [
  ...['globo', 'hielo', 'vela', 'manzana', 'torre', 'vaso', 'dibujo'].map(
    (s) => [[1, 2, 3].map((i) => `secuencias/${s}-${i}`), 'entrenamiento'] as [string[], 'entrenamiento']
  ),
  [['evaluacion-secuencias/semilla', 'evaluacion-secuencias/riego', 'evaluacion-secuencias/flor'], 'entrenamiento'],
  [[1, 2, 3].map((i) => `secuencias/tostada-${i}`), 'generalizacion'],
  [[1, 2, 3].map((i) => `secuencias/planta-${i}`), 'generalizacion'],
  [['evaluacion-secuencias/huevo', 'evaluacion-secuencias/huevo-rompiendose', 'evaluacion-secuencias/pollito-nacido'], 'generalizacion'],
]

export const CONCEPTOS_ESCENAS = ESCENAS.flatMap(([o, , r, , , sin]) =>
  Object.keys(NOMBRE_RELACION)
    .filter((rel) => !sin.includes(rel))
    .map((rel) => `espaciales/${o}-${rel}-${r}`)
)
export const CONCEPTOS_SECUENCIAS = SECUENCIAS.flatMap(([c]) => c)

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
  primero: '¿Qué pasó primero?',
  despues: '¿Qué pasó después?',
  antes: '¿Qué pasó antes?',
  tamano: ['¿Cuál es más grande?', '¿Cuál es más pequeño?'],
  cantidad: ['¿Dónde hay más?', '¿Dónde hay menos?'],
  longitud: ['¿Cuál es más largo?', '¿Cuál es más corto?'],
  altura: ['¿Cuál es más alto?', '¿Cuál es más bajo?'],
} as const

export function frasesConceptos(): string[] {
  const espaciales = ESCENAS.flatMap(([o, ao, r, ar, , sin]) =>
    Object.keys(NOMBRE_RELACION).filter((rel) => !sin.includes(rel)).map((rel) => fraseEspacial(o, ao, r, ar, rel))
  )
  return [...Object.values(CONSIGNAS).flat(), ...espaciales]
}

// Imágenes del banco que necesita una actividad (las que no salen de las categorías generales)
export function conceptosPropiosDe(actividad: ActividadConceptos): string[] | null {
  if (actividad.tipo === 'oposicion') return CONCEPTOS_OPUESTOS
  if (actividad.tipo === 'espacial') return CONCEPTOS_ESCENAS
  if (actividad.tipo === 'temporal') return CONCEPTOS_SECUENCIAS
  return null
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
  if (o.tipo === 'espacial') {
    const validos = Object.keys(PARES_ESPACIALES) as ParEspacial[]
    const lista = niveles.map((n, i) => {
      const pares = Array.isArray(n.pares) ? (n.pares as unknown[]).filter((p): p is ParEspacial => validos.includes(p as ParEspacial)) : []
      return { nombre: nombre(n, i), pares: pares.length ? pares : (['encima_debajo'] as ParEspacial[]) }
    })
    return lista.length ? { tipo: 'espacial', niveles: lista } : null
  }
  if (o.tipo === 'temporal') {
    const lista = niveles.map((n, i) => ({
      nombre: nombre(n, i),
      modo: n.modo === 'antes_despues' ? ('antes_despues' as const) : ('primero_despues' as const),
    }))
    return lista.length ? { tipo: 'temporal', niveles: lista } : null
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

// Espaciales: dos escenas con los dos polos de un par y los mismos objetos;
// la clave nombra la relación («Toca donde la pelota está encima de la caja»)
function espacial(nivel: NivelEspacial, generalizacion: boolean, n: number, azar: Azar): EnsayoGenerado[] {
  const escenas = ESCENAS.filter(([, , , , uso]) => uso === (generalizacion ? 'generalizacion' : 'entrenamiento'))
  const polos = alternados<0 | 1>(0, 1, n, azar)
  return polos.map((polo, i) => {
    const par = PARES_ESPACIALES[nivel.pares[i % nivel.pares.length]]
    const posibles = escenas.filter(([, , , , , sin]) => !par.some((r) => sin.includes(r)))
    const [o, ao, r, ar] = posibles[Math.floor(azar() * posibles.length)]
    const pedida = par[polo]
    const opciones: OpcionGenerada[] = par.map((rel) => ({
      pantalla: { img: `espaciales/${o}-${rel}-${r}` },
      etiqueta: `${o} ${NOMBRE_RELACION[rel]} ${r}`,
      correcta: rel === pedida,
    }))
    return { clave: pedida, consigna: fraseEspacial(o, ao, r, ar, pedida), muestra: null, opciones: barajar(opciones, azar) }
  })
}

// Temporales: «¿Qué pasó primero / después?» entre dos viñetas seguidas, o una
// viñeta como muestra y «¿Qué pasó antes / después?» entre la anterior y la siguiente
function temporal(nivel: NivelTemporal, generalizacion: boolean, n: number, azar: Azar): EnsayoGenerado[] {
  const secuencias = SECUENCIAS.filter(([, uso]) => uso === (generalizacion ? 'generalizacion' : 'entrenamiento')).map(([c]) => c)
  const polos = alternados<0 | 1>(0, 1, n, azar)
  const nombre = (c: string) => c.split('/')[1]
  return polos.map((polo) => {
    const s = secuencias[Math.floor(azar() * secuencias.length)]
    if (nivel.modo === 'antes_despues') {
      const [antes, muestra, despues] = s
      const opciones: OpcionGenerada[] = [
        { pantalla: { img: antes }, etiqueta: nombre(antes), correcta: polo === 0 },
        { pantalla: { img: despues }, etiqueta: nombre(despues), correcta: polo === 1 },
      ]
      return { clave: polo === 0 ? 'antes' : 'despues', consigna: polo === 0 ? CONSIGNAS.antes : CONSIGNAS.despues, muestra: { img: muestra }, opciones: barajar(opciones, azar) }
    }
    const k = Math.floor(azar() * (s.length - 1))
    const [primera, segunda] = [s[k], s[k + 1]]
    const opciones: OpcionGenerada[] = [
      { pantalla: { img: primera }, etiqueta: nombre(primera), correcta: polo === 0 },
      { pantalla: { img: segunda }, etiqueta: nombre(segunda), correcta: polo === 1 },
    ]
    return { clave: polo === 0 ? 'primero' : 'despues', consigna: polo === 0 ? CONSIGNAS.primero : CONSIGNAS.despues, muestra: null, opciones: barajar(opciones, azar) }
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
  if (actividad.tipo === 'espacial') return espacial(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (actividad.tipo === 'temporal') return temporal(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (!conceptos.length) return []
  if (actividad.tipo === 'distincion') return distincion(actividad.niveles[indiceNivel], conceptos, n, azar)
  return comparacion(actividad.niveles[indiceNivel], conceptos, n, azar)
}
