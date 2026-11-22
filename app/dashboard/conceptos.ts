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
// orden: ordenar series de ese número de elementos (si hay varios, uno al azar en cada ensayo)
export type NivelComparacion = { nombre: string; dimensiones: Dimension[]; proporcion: number; intermedio: boolean; orden?: number[] }
export type NivelOposicion = { nombre: string; opciones: number }
export type ParEspacial = 'encima_debajo' | 'dentro_fuera' | 'delante_detras'
export type NivelEspacial = { nombre: string; pares: ParEspacial[] }
// orden_presentacion: orden físico en que aparecen dos imágenes sin relación
// («¿Cuál salió antes?»; Neufeld, Stewart y McElwee, 2023)
export type NivelTemporal = { nombre: string; modo: 'orden_presentacion' | 'primero_despues' | 'antes_despues' }
// Clasificar por propiedades (Villarroel y Luciano: filtrado de lo común; O'Hora y Stewart, 2013:
// control contextual de la dimensión): «una» = cada opción comparte con la muestra una sola
// propiedad; «dos» = se alternan claves de dos propiedades y de una
export type NivelClasificacion = { nombre: string; modo: 'una' | 'dos' }
// Causa y efecto con viñetas: «¿Qué pasará?» (causa → efecto) y «¿Por qué ha pasado esto?» (efecto → causa)
export type NivelCausal = { nombre: string; opciones: number }
export type ActividadConceptos =
  | { tipo: 'causal'; niveles: NivelCausal[] }
  | { tipo: 'clasificacion'; niveles: NivelClasificacion[] }
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
// secuencia: imágenes que se presentan de una en una antes de las opciones;
// etiquetasSecuencia: su rótulo al corregir un error («Antes», «Después»)
export type EnsayoGenerado = {
  clave: string
  consigna: string
  muestra: EstimuloPantalla | null
  opciones: OpcionGenerada[]
  secuencia?: EstimuloPantalla[]
  etiquetasSecuencia?: string[]
  // Ordenar: las etiquetas de las opciones en el orden pedido (respuesta de tocar en orden)
  orden?: string[]
}
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
  salioAntes: '¿Cuál salió antes?',
  salioDespues: '¿Cuál salió después?',
  esteAntes: '¿Este salió antes?',
  esteDespues: '¿Este salió después?',
  tamano: ['¿Cuál es más grande?', '¿Cuál es más pequeño?'],
  cantidad: ['¿Dónde hay más?', '¿Dónde hay menos?'],
  longitud: ['¿Cuál es más largo?', '¿Cuál es más corto?'],
  altura: ['¿Cuál es más alto?', '¿Cuál es más bajo?'],
  // Ordenar series: [de menos a más, de más a menos]
  ordenarTamano: ['Toca del más pequeño al más grande', 'Toca del más grande al más pequeño'],
  ordenarCantidad: ['Toca de donde hay menos a donde hay más', 'Toca de donde hay más a donde hay menos'],
  ordenarLongitud: ['Toca del más corto al más largo', 'Toca del más largo al más corto'],
  ordenarAltura: ['Toca de la más baja a la más alta', 'Toca de la más alta a la más baja'],
  // Causa y efecto
  quePasara: '¿Qué pasará?',
  porQuePaso: '¿Por qué ha pasado esto?',
  // Clasificar por propiedades
  mismoColor: 'Toca el que es del mismo color',
  mismaForma: 'Toca el que tiene la misma forma',
  mismoTamano: 'Toca el que es del mismo tamaño',
  colorForma: 'Toca el que es del mismo color y tiene la misma forma',
  formaTamano: 'Toca el que tiene la misma forma y es del mismo tamaño',
  colorTamano: 'Toca el que es del mismo color y del mismo tamaño',
} as const

export function frasesConceptos(): string[] {
  const espaciales = ESCENAS.flatMap(([o, ao, r, ar, , sin]) =>
    Object.keys(NOMBRE_RELACION).filter((rel) => !sin.includes(rel)).map((rel) => fraseEspacial(o, ao, r, ar, rel))
  )
  return [...Object.values(CONSIGNAS).flat(), ...espaciales]
}

// Imágenes del banco que necesita una actividad (las que no salen de las categorías generales)
// Imágenes del banco que necesita una actividad: las suyas propias y, si
// trabaja con objetos de las categorías generales, también esas
export function imagenesNecesarias(actividad: ActividadConceptos, categorias: string[]): string[] {
  const propias = conceptosPropiosDe(actividad)
  const conCategorias = !propias || (actividad.tipo === 'temporal' && actividad.niveles.some((n) => n.modo === 'orden_presentacion'))
  return [...(propias ?? []), ...(conCategorias ? categorias : [])]
}

export function conceptosPropiosDe(actividad: ActividadConceptos): string[] | null {
  if (actividad.tipo === 'oposicion') return CONCEPTOS_OPUESTOS
  if (actividad.tipo === 'espacial') return CONCEPTOS_ESCENAS
  if (actividad.tipo === 'temporal') return CONCEPTOS_SECUENCIAS
  // Figuras geométricas dibujadas: sin imágenes del banco
  if (actividad.tipo === 'clasificacion') return []
  if (actividad.tipo === 'causal') return CONCEPTOS_CAUSALES
  return null
}

const DIMENSIONES: Dimension[] = ['tamano', 'cantidad', 'longitud', 'altura']
const MODOS: ModoDistincion[] = ['igual_diferente', 'intruso', 'sutil']

export function leerActividadConceptos(valor: Json | null | undefined): ActividadConceptos | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const o = valor as Record<string, unknown>
  const niveles = Array.isArray(o.niveles) ? (o.niveles as Record<string, unknown>[]) : []
  const nombre = (n: Record<string, unknown>, i: number) => (typeof n.nombre === 'string' && n.nombre.trim() ? n.nombre.trim() : `Nivel ${i + 1}`)
  if (o.tipo === 'causal') {
    const lista = niveles.map((n, i) => ({ nombre: nombre(n, i), opciones: typeof n.opciones === 'number' ? Math.min(4, Math.max(2, Math.round(n.opciones))) : 3 }))
    return lista.length ? { tipo: 'causal', niveles: lista } : null
  }
  if (o.tipo === 'clasificacion') {
    const lista = niveles.map((n, i) => ({ nombre: nombre(n, i), modo: n.modo === 'dos' ? ('dos' as const) : ('una' as const) }))
    return lista.length ? { tipo: 'clasificacion', niveles: lista } : null
  }
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
      modo: n.modo === 'antes_despues' ? ('antes_despues' as const) : n.modo === 'orden_presentacion' ? ('orden_presentacion' as const) : ('primero_despues' as const),
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
        orden: Array.isArray(n.orden) ? (n.orden as unknown[]).filter((k): k is number => typeof k === 'number' && k >= 3 && k <= 5) : undefined,
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

const ORDENAR: Record<Dimension, readonly [string, string]> = {
  tamano: CONSIGNAS.ordenarTamano,
  cantidad: CONSIGNAS.ordenarCantidad,
  longitud: CONSIGNAS.ordenarLongitud,
  altura: CONSIGNAS.ordenarAltura,
}

// Ordenar series de 3 a 5 elementos en una dimensión (Luciano et al., 2009, 6.4.1:
// el combinatorio no arbitrario de la comparación); el sentido se alterna
function ordenar(nivel: NivelComparacion, conceptos: Concepto[], n: number, azar: Azar): EnsayoGenerado[] {
  const sentidos = alternados<0 | 1>(0, 1, n, azar)
  let anterior: string[] = []
  return sentidos.map((sentido) => {
    const dimension = nivel.dimensiones[Math.floor(azar() * nivel.dimensiones.length)]
    const k = nivel.orden![Math.floor(azar() * nivel.orden!.length)]
    const x = elegir(conceptos, azar, anterior)
    anterior = [x.concepto]
    // De mayor a menor: magnitudes p^j (en cantidad, k…1 objetos)
    const elementos: OpcionGenerada[] = Array.from({ length: k }, (_, j) => {
      const m = nivel.proporcion ** j
      if (dimension === 'tamano') return { pantalla: { img: x.concepto, escala: m }, etiqueta: `${x.nombre} ${Math.round(m * 100)} %`, correcta: false }
      if (dimension === 'cantidad') return { pantalla: { img: x.concepto, n: k - j }, etiqueta: `${x.nombre} ×${k - j}`, correcta: false }
      if (dimension === 'longitud') return { pantalla: { forma: 'lapiz', valor: m }, etiqueta: `lápiz ${Math.round(m * 100)} %`, correcta: false }
      // Torres de alturas consecutivas (k + 1 … 2 bloques), todas distintas
      const bloques = k - j + 1
      return { pantalla: { forma: 'torre', valor: bloques }, etiqueta: `torre de ${bloques}`, correcta: false }
    })
    const enOrden = sentido === 0 ? [...elementos].reverse() : elementos
    return {
      clave: `${dimension}:${sentido === 0 ? 'asc' : 'desc'}`,
      consigna: ORDENAR[dimension][sentido],
      muestra: null,
      opciones: barajar(elementos, azar),
      orden: enOrden.map((e) => e.etiqueta),
    }
  })
}

// Parejas causa → efecto (scripts/imagenes/causas-efectos.mjs): [slug, uso, causa, efecto]
const CAUSALES: [string, 'entrenamiento' | 'generalizacion', string, string][] = [
  ['vela', 'entrenamiento', 'Le echan aire a la vela', 'La vela se apaga'],
  ['torre', 'entrenamiento', 'Empujan la torre', 'La torre se cae'],
  ['vaso', 'entrenamiento', 'Le dan un golpe al vaso', 'El vaso se cae y el agua se derrama'],
  ['globo', 'entrenamiento', 'Pinchan el globo', 'El globo explota'],
  ['huevo', 'entrenamiento', 'Sueltan el huevo', 'El huevo se rompe'],
  ['lampara', 'entrenamiento', 'Pulsan el interruptor', 'La lámpara se enciende'],
  ['papel', 'entrenamiento', 'Cortan el papel con las tijeras', 'El papel queda en dos trozos'],
]
export const CONCEPTOS_CAUSALES = CAUSALES.flatMap(([s]) => [`causales/${s}-causa`, `causales/${s}-efecto`])

// «¿Qué pasará?» con la causa a la vista y «¿Por qué ha pasado esto?» con el efecto,
// alternados: la respuesta depende de la clave (Hayes et al., 2001: marco causal)
function causal(nivel: NivelCausal, generalizacion: boolean, n: number, azar: Azar): EnsayoGenerado[] {
  const parejas = CAUSALES.filter(([, uso]) => uso === (generalizacion ? 'generalizacion' : 'entrenamiento'))
  if (parejas.length < nivel.opciones) return []
  const claves = alternados<'efecto' | 'causa'>('efecto', 'causa', n, azar)
  let anterior = -1
  return claves.map((clave) => {
    let i = Math.floor(azar() * parejas.length)
    if (i === anterior && parejas.length > 1) i = (i + 1) % parejas.length
    anterior = i
    const [slug] = parejas[i]
    const otras = barajar(parejas.filter((_, j) => j !== i), azar).slice(0, nivel.opciones - 1)
    const lado = clave === 'efecto' ? 'efecto' : 'causa'
    const opciones: OpcionGenerada[] = [
      { pantalla: { img: `causales/${slug}-${lado}` }, etiqueta: `${slug} ${lado}`, correcta: true },
      ...otras.map(([s]) => ({ pantalla: { img: `causales/${s}-${lado}` }, etiqueta: `${s} ${lado}`, correcta: false })),
    ]
    return {
      clave,
      consigna: clave === 'efecto' ? CONSIGNAS.quePasara : CONSIGNAS.porQuePaso,
      muestra: { img: `causales/${slug}-${clave === 'efecto' ? 'causa' : 'efecto'}` },
      opciones: barajar(opciones, azar),
    }
  })
}

type Propiedad = 'color' | 'forma' | 'tamano'
const PROPIEDADES: Propiedad[] = ['color', 'forma', 'tamano']
const FORMAS = { entrenamiento: ['circulo', 'cuadrado', 'triangulo', 'estrella', 'corazon', 'rombo'], generalizacion: ['hexagono', 'pentagono', 'ovalo', 'cruz', 'semicirculo', 'rectangulo'] }
const COLORES = { entrenamiento: [0, 1, 2, 3], generalizacion: [4, 5, 0, 1] }
const NOMBRE_COLOR = ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado']
const TAMANOS = [1, 0.55]
const CLAVE_UNA: Record<Propiedad, string> = { color: CONSIGNAS.mismoColor, forma: CONSIGNAS.mismaForma, tamano: CONSIGNAS.mismoTamano }
const CLAVE_DOS: [Propiedad, Propiedad, string][] = [
  ['color', 'forma', CONSIGNAS.colorForma],
  ['forma', 'tamano', CONSIGNAS.formaTamano],
  ['color', 'tamano', CONSIGNAS.colorTamano],
]
type Fig = { forma: string; color: number; tamano: number }

// Una figura que comparte con la muestra exactamente las propiedades indicadas
function figuraQueComparte(muestra: Fig, comunes: Propiedad[], formas: string[], colores: number[], azar: Azar): Fig {
  const otra = <T,>(lista: T[], valor: T) => {
    const resto = lista.filter((x) => x !== valor)
    return resto[Math.floor(azar() * resto.length)]
  }
  return {
    forma: comunes.includes('forma') ? muestra.forma : otra(formas, muestra.forma),
    color: comunes.includes('color') ? muestra.color : otra(colores, muestra.color),
    tamano: comunes.includes('tamano') ? muestra.tamano : otra(TAMANOS, muestra.tamano),
  }
}
const pantallaFig = (f: Fig): EstimuloPantalla => ({ fig: 'geometrica', s: f.forma, c: f.color, escala: f.tamano })
const etiquetaFig = (f: Fig, i: number) => `${f.forma} ${NOMBRE_COLOR[f.color]} ${f.tamano === 1 ? 'grande' : 'pequeño'} (${i + 1})`

function clasificacion(nivel: NivelClasificacion, generalizacion: boolean, n: number, azar: Azar): EnsayoGenerado[] {
  const uso = generalizacion ? 'generalizacion' : 'entrenamiento'
  const formas = FORMAS[uso], colores = COLORES[uso]
  // Claves alternadas: en «una», las tres propiedades; en «dos», pares y propiedades sueltas
  const claves: string[] = nivel.modo === 'una' ? [...PROPIEDADES] : [...CLAVE_DOS.map((c) => `${c[0]}+${c[1]}`), ...PROPIEDADES]
  let ultima = ''
  return Array.from({ length: n }, () => {
    let clave = claves[Math.floor(azar() * claves.length)]
    if (clave === ultima) clave = claves[(claves.indexOf(clave) + 1) % claves.length]
    ultima = clave
    const muestra: Fig = { forma: formas[Math.floor(azar() * formas.length)], color: colores[Math.floor(azar() * colores.length)], tamano: TAMANOS[Math.floor(azar() * 2)] }
    const pedidas = clave.split('+') as Propiedad[]
    // Opciones: la correcta comparte justo lo pedido; cada distractora comparte solo una
    // de las propiedades pedidas o la que no se pide (hay que atender a todas las pedidas)
    const resto = PROPIEDADES.filter((p) => !pedidas.includes(p))
    const distractoras: Propiedad[][] = pedidas.length === 2 ? [[pedidas[0]], [pedidas[1]], resto] : resto.map((p) => [p])
    if (nivel.modo === 'dos' && pedidas.length === 1) distractoras.push([])
    const figuras = [figuraQueComparte(muestra, pedidas, formas, colores, azar), ...distractoras.map((c) => figuraQueComparte(muestra, c, formas, colores, azar))]
    const opciones: OpcionGenerada[] = figuras.map((f, i) => ({ pantalla: pantallaFig(f), etiqueta: etiquetaFig(f, i), correcta: i === 0 }))
    const consigna = pedidas.length === 2 ? CLAVE_DOS.find((c) => c[0] === pedidas[0] && c[1] === pedidas[1])![2] : CLAVE_UNA[pedidas[0]]
    return { clave, consigna, muestra: pantallaFig(muestra), opciones: barajar(opciones, azar) }
  })
}

function comparacion(nivel: NivelComparacion, conceptos: Concepto[], n: number, azar: Azar): EnsayoGenerado[] {
  if (nivel.orden?.length) return ordenar(nivel, conceptos, n, azar)
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
  // «Toca el igual» y «Toca el contrario» alternados ante las mismas opciones (la
  // misma imagen que la muestra y su opuesto): la respuesta depende de la clave
  // y no de elegir «el que no es igual» (Luciano et al., 2009)
  const claves = alternados<'igual' | 'contrario'>('igual', 'contrario', n, azar)
  let anterior = -1
  return claves.map((clave) => {
    let i = Math.floor(azar() * pares.length)
    if (i === anterior && pares.length > 1) i = (i + 1) % pares.length
    anterior = i
    const [a, b] = pares[i]
    const [muestra, opuesto] = azar() < 0.5 ? [a, b] : [b, a]
    const otros = barajar(
      pares.filter((_, j) => j !== i).map(([x, y]) => (azar() < 0.5 ? x : y)),
      azar
    ).slice(0, Math.max(0, nivel.opciones - 2))
    const opciones: OpcionGenerada[] = [
      { pantalla: { img: `oposicion/${muestra}` }, etiqueta: `${nombre(muestra)} (igual)`, correcta: clave === 'igual' },
      { pantalla: { img: `oposicion/${opuesto}` }, etiqueta: nombre(opuesto), correcta: clave === 'contrario' },
      ...otros.map((o) => ({ pantalla: { img: `oposicion/${o}` }, etiqueta: nombre(o), correcta: false })),
    ]
    return { clave, consigna: CONSIGNAS[clave], muestra: { img: `oposicion/${muestra}` }, opciones: barajar(opciones, azar) }
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
function temporal(nivel: NivelTemporal, generalizacion: boolean, n: number, azar: Azar, conceptos: Concepto[] = []): EnsayoGenerado[] {
  if (nivel.modo === 'orden_presentacion') return ordenPresentacion(conceptos, n, azar)
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

// Orden físico de presentación: dos objetos sin relación entre sí aparecen uno
// tras otro en el centro; después salen los dos en posiciones al azar y se
// pregunta cuál salió antes o después (claves alternadas e impredecibles).
// Un tercio de los ensayos son de sí/no («¿Este salió antes?» con uno de los
// dos como muestra), la mitad con respuesta «sí»: varias formas de respuesta
// favorecen la generalización (Barry, Neufeld y Stewart, 2024)
function ordenPresentacion(conceptos: Concepto[], n: number, azar: Azar): EnsayoGenerado[] {
  if (conceptos.length < 2) return []
  const polos = alternados<0 | 1>(0, 1, n, azar)
  const nSiNo = Math.round(n / 3)
  const siNo = barajar(Array.from({ length: n }, (_, i) => i < nSiNo), azar)
  const respuestasSi = barajar(Array.from({ length: nSiNo }, (_, i) => i % 2 === 0), azar)
  return polos.map((polo, i) => {
    const [primero, segundo] = barajar(conceptos, azar).slice(0, 2)
    const comun = {
      clave: polo === 0 ? 'antes' : 'despues',
      secuencia: [{ img: primero.concepto }, { img: segundo.concepto }],
      etiquetasSecuencia: ['Antes', 'Después'],
    }
    if (siNo[i]) {
      const si = respuestasSi.pop() ?? true
      // La muestra es la que cumple la clave (respuesta «sí») o la otra («no»)
      const cumple = polo === 0 ? primero : segundo
      const muestra = si ? cumple : cumple === primero ? segundo : primero
      return {
        ...comun,
        consigna: polo === 0 ? CONSIGNAS.esteAntes : CONSIGNAS.esteDespues,
        muestra: { img: muestra.concepto },
        opciones: [
          { pantalla: { t: 'Sí' }, etiqueta: 'Sí', correcta: si },
          { pantalla: { t: 'No' }, etiqueta: 'No', correcta: !si },
        ],
      }
    }
    const opciones: OpcionGenerada[] = [
      { pantalla: { img: primero.concepto }, etiqueta: primero.nombre, correcta: polo === 0 },
      { pantalla: { img: segundo.concepto }, etiqueta: segundo.nombre, correcta: polo === 1 },
    ]
    return {
      ...comun,
      consigna: polo === 0 ? CONSIGNAS.salioAntes : CONSIGNAS.salioDespues,
      muestra: null,
      opciones: barajar(opciones, azar),
    }
  })
}

// --- Modo hablante ---
// El mismo ensayo, pero el alumno DICE la relación: ve los estímulos (con uno
// marcado cuando hace falta), el terapeuta hace la pregunta y marca si la
// respuesta es correcta. Luciano et al. (2009): entrenar como oyente y como hablante
// Cada nivel en modo hablante se registra aparte, como «<nivel> · hablante»
export const SUFIJO_HABLANTE = ' · hablante'

export type EnsayoHablante = {
  clave: string
  pregunta: string
  esperada: string
  estimulos: EstimuloPantalla[]
  // Estímulo que señala el terapeuta (se marca en la pantalla); null = ninguno
  marcada: number | null
  secuencia?: EstimuloPantalla[]
}

const PREGUNTA_COMPARACION: Record<Dimension, [string, string, string]> = {
  tamano: ['¿Este es más grande o más pequeño?', 'Más grande', 'Más pequeño'],
  cantidad: ['¿Aquí hay más o menos?', 'Más', 'Menos'],
  longitud: ['¿Este es más largo o más corto?', 'Más largo', 'Más corto'],
  altura: ['¿Este es más alto o más bajo?', 'Más alto', 'Más bajo'],
}
const PALABRA_TEMPORAL: Record<string, string> = { antes: 'Antes', despues: 'Después', primero: 'Primero' }

export function aHablante(tipo: ActividadConceptos['tipo'], e: EnsayoGenerado, azar: Azar = Math.random): EnsayoHablante {
  const correcta = e.opciones.findIndex((o) => o.correcta)
  const conMuestra = (pregunta: string, esperada: string): EnsayoHablante => ({
    clave: e.clave,
    pregunta,
    esperada,
    estimulos: [e.muestra!, e.opciones[correcta].pantalla],
    marcada: null,
  })
  if (tipo === 'causal') {
    // Ve la causa (o el efecto) y dice qué pasará (o por qué ha pasado)
    const slug = e.opciones.find((o) => o.correcta)!.etiqueta.split(' ')[0]
    const pareja = CAUSALES.find(([s]) => s === slug)!
    return { clave: e.clave, pregunta: e.consigna, esperada: e.clave === 'efecto' ? pareja[3] : pareja[2], estimulos: [e.muestra!], marcada: null }
  }
  if (tipo === 'clasificacion') {
    // La muestra marcada y las opciones; el alumno señala la que va con ella
    const correcta = e.opciones.findIndex((o) => o.correcta)
    return {
      clave: e.clave,
      pregunta: `${e.consigna.replace('Toca el que', '¿Cuál')} que la marcada?`,
      esperada: `La ${correcta + 2}.ª contando desde la izquierda`,
      estimulos: [e.muestra!, ...e.opciones.map((o) => o.pantalla)],
      marcada: 0,
    }
  }
  if (tipo === 'distincion') {
    if (e.clave === 'intruso')
      return { clave: e.clave, pregunta: '¿Cuál es diferente?', esperada: `Señala o nombra: ${e.opciones[correcta].etiqueta}`, estimulos: e.opciones.map((o) => o.pantalla), marcada: null }
    return conMuestra('¿Son iguales o diferentes?', e.clave === 'igual' ? 'Iguales' : 'Diferentes')
  }
  if (tipo === 'oposicion') return conMuestra('¿Son iguales o contrarios?', e.clave === 'igual' ? 'Iguales' : 'Contrarios')
  if (tipo === 'comparacion') {
    if (e.orden) {
      // Los señala en orden: la esperada, como posiciones en la pantalla
      const pos = e.orden.map((et) => `${e.opciones.findIndex((o) => o.etiqueta === et) + 1}.ª`)
      return { clave: e.clave, pregunta: e.consigna.replace('Toca', 'Señálalos en orden,'), esperada: `${pos.join(', ')} (contando desde la izquierda)`, estimulos: e.opciones.map((o) => o.pantalla), marcada: null }
    }
    const [dimension, polo] = e.clave.split(':') as [Dimension, string]
    const [pregunta, mas, menos] = PREGUNTA_COMPARACION[dimension]
    return { clave: e.clave, pregunta, esperada: polo === 'mas' ? mas : menos, estimulos: e.opciones.map((o) => o.pantalla), marcada: correcta }
  }
  if (tipo === 'espacial') {
    // «Toca donde la pelota está encima de la caja» → «¿Dónde está la pelota?» / «Encima de la caja»
    const m = e.consigna.match(/^Toca donde (.+?) está (.+)$/)
    const esperada = m ? m[2].charAt(0).toUpperCase() + m[2].slice(1) : e.clave
    return { clave: e.clave, pregunta: m ? `¿Dónde está ${m[1]}?` : '¿Dónde está?', esperada, estimulos: [e.opciones[correcta].pantalla], marcada: null }
  }
  // Temporales
  const esperada = PALABRA_TEMPORAL[e.clave] ?? e.clave
  if (e.secuencia) {
    // Orden en que aparecen: tras la secuencia, los dos en orden al azar y
    // marcado el que cumple la clave
    const objetivo = e.secuencia[e.clave === 'antes' ? 0 : 1]
    const estimulos = barajar(e.secuencia, azar)
    return { clave: e.clave, pregunta: '¿Este salió antes o después?', esperada, estimulos, marcada: estimulos.indexOf(objetivo), secuencia: e.secuencia }
  }
  if (e.muestra) return { ...conMuestra('¿Esto pasó antes o después de esto?', esperada), marcada: 1 }
  return { clave: e.clave, pregunta: '¿Esto pasó primero o después?', esperada, estimulos: e.opciones.map((o) => o.pantalla), marcada: correcta }
}

export function generarBloque(
  actividad: ActividadConceptos,
  indiceNivel: number,
  conceptos: Concepto[],
  n: number,
  generalizacion = false,
  azar: Azar = Math.random
): EnsayoGenerado[] {
  if (actividad.tipo === 'causal') return causal(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (actividad.tipo === 'clasificacion') return clasificacion(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (actividad.tipo === 'oposicion') return oposicion(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (actividad.tipo === 'espacial') return espacial(actividad.niveles[indiceNivel], generalizacion, n, azar)
  if (actividad.tipo === 'temporal') return temporal(actividad.niveles[indiceNivel], generalizacion, n, azar, conceptos)
  if (!conceptos.length) return []
  if (actividad.tipo === 'distincion') return distincion(actividad.niveles[indiceNivel], conceptos, n, azar)
  return comparacion(actividad.niveles[indiceNivel], conceptos, n, azar)
}
