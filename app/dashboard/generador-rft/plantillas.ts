// Generador de grupos para los programas verbales del nivel 3: cada plantilla
// crea un grupo de 3 clases con sus estímulos y las claves de todas las fases.
// La respuesta correcta sale de cómo se construye la red (la posición destino
// de cada fase), nunca de un modelo de lenguaje. Mismo formato y contrapesos que
// los grupos del currículo (migraciones del 10 y el 17 de noviembre de 2026), con
// la transformación de funciones al final (plan de fusión del 22 de noviembre).

import {
  ACCIONES,
  ACCIONES_CATEGORIA,
  CATEGORIAS,
  COLORES,
  RASGOS,
  CONTEXTOS_DISTINCION,
  DEICTICOS,
  DIMENSIONES,
  DISTINCION,
  LADO,
  MARCOS,
  NOMBRES,
  OBJETOS,
  OPOSICION,
  PAREJAS,
  PERSONAJES,
  SILABAS_DISTINCION,
} from './vocabulario'

export type EstimuloGenerado = { posicion: 'A' | 'B' | 'C' | 'D' | 'E'; nombre: string; concepto_imagen: string | null }
// respuestas_esperadas: solo cuando la respuesta no es elegir un estímulo (p. ej. ordenar)
export type ClaseGenerada = {
  numero: number
  estimulos: EstimuloGenerado[]
  consignas: Record<string, string>
  respuestas_esperadas?: Record<string, string>
  // Opciones propias de la clase en cada fase («fase:O→D»), en el orden en que se muestran
  opciones_por_fase?: Record<string, string[]>
}
// Lo que ya tiene el programa (para no repetir): nombres de estímulos y pares de
// miembros de una misma clase
export type Usados = { nombres: Set<string>; pares: Set<string> }
type Contexto = { azar: () => number; primerNumero: number; usados: Usados }
type Plantilla = (ctx: Contexto) => ClaseGenerada[] | null

const CLASES_POR_GRUPO = 3
const INTENTOS = 4000

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const de = (np: string) => (np.startsWith('el ') ? `del ${np.slice(3)}` : `de ${np}`)
export const clavePar = (a: string, b: string) => [a, b].sort().join('|')

// Semilla → generador pseudoaleatorio reproducible (mulberry32)
export function azarDesde(semilla: string) {
  let h = 1779033703 ^ semilla.length
  for (let i = 0; i < semilla.length; i++) {
    h = Math.imul(h ^ semilla.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function muestra<T>(lista: T[], n: number, azar: () => number): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia.slice(0, n)
}

// Contrapesos por número de clase (continuo entre grupos): polo, frase
// invertida, orden de las premisas y orden de los extremos en la pregunta
function factores(n: number) {
  const k = n - 1
  return { pol: k % 2, inv: Math.floor(k / 2) % 2, orden: Math.floor(k / 4) % 2, alt: (Math.floor(k / 2) + Math.floor(k / 8)) % 2 }
}

// Elige los miembros de las 3 clases: distintos dentro del grupo y, si se puede,
// nuevos para el programa (nombres no usados o pares de miembros que no se han
// relacionado nunca). Se busca clase a clase; si no hay suficientes, se permite
// repetir lo ya usado (sin repetir dentro del grupo)
function elegir(pool: string[], porClase: number, ctx: Contexto, porNombre: boolean, clases = CLASES_POR_GRUPO): string[][] | null {
  if (pool.length < porClase * clases) return null
  const nuevo = (t: string[]) =>
    porNombre
      ? t.every((x) => !ctx.usados.nombres.has(x))
      : t.every((x, i) => t.slice(i + 1).every((y) => !ctx.usados.pares.has(clavePar(x, y))))
  for (const estricto of [true, false]) {
    for (let intento = 0; intento < 200; intento++) {
      const trozos: string[][] = []
      const libres = new Set(pool)
      for (let j = 0; j < clases; j++) {
        let elegido: string[] | null = null
        for (let k = 0; k < INTENTOS / 4 && !elegido; k++) {
          const t = muestra([...libres], porClase, ctx.azar)
          if (!estricto || nuevo(t)) elegido = t
        }
        if (!elegido) break
        elegido.forEach((x) => libres.delete(x))
        trozos.push(elegido)
      }
      if (trozos.length === clases) return trozos
    }
  }
  return null
}

const numeros = (ctx: Contexto) => Array.from({ length: CLASES_POR_GRUPO }, (_, j) => ctx.primerNumero + j)

// ---------------------------------------------------------------- Comparación
const comparacionMutua: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 2, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [a, b] = trozos[j]
    const { pol, inv } = factores(n)
    const { sintagma, polos, pregunta, justo } = DIMENSIONES[(n - 1) % DIMENSIONES.length]
    const adj = polos[pol], contra = polos[1 - pol]
    const premisa = inv ? `Comparado con ${sintagma(b)}, ${sintagma(a)} es más ${adj}.` : `${cap(sintagma(a))} es más ${adj} que ${sintagma(b)}.`
    return {
      numero: n,
      estimulos: [{ posicion: 'A', nombre: a, concepto_imagen: null }, { posicion: 'B', nombre: b, concepto_imagen: null }],
      consignas: {
        'entrenamiento:B→A': `${premisa} ${pregunta} más ${adj}?`,
        'test_mutuo:A→B': `${premisa} ${pregunta} más ${contra}?`,
        // Umbral: nombra a uno y se elige al otro (A tiene el polo «pol»)
        'transformacion_funciones:A→B': `${premisa} ${justo[pol](a)}`,
        'transformacion_funciones:B→A': `${premisa} ${justo[1 - pol](b)}`,
      },
    }
  })
}

// Redes de comparación de 3, 4 o 5 miembros según el grupo (avanza como el
// currículo) y, en la mitad de las clases, ensayos no lineales (Berens y Hayes,
// 2007; Ming, Moran y Stewart, 2014): en el combinatorio y la transformación las
// frases C–B y E–D se dicen en la dirección contraria a la entrenada. Con más de
// 3 miembros, la transformación limita la elección a los dos que se comparan
const POSICIONES = ['A', 'B', 'C', 'D', 'E'] as const
const comparacionRed: Plantilla = (ctx) => {
  const miembros = 3 + (Math.floor((ctx.primerNumero - 1) / CLASES_POR_GRUPO) % 3)
  const trozos = elegir(NOMBRES, miembros, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const nombres = trozos[j]
    const { pol, inv, orden, alt } = factores(n)
    const noLineal = n % 2 === 0
    const { sintagma, polos, pregunta, mejor } = DIMENSIONES[(n - 1) % DIMENSIONES.length]
    const adj = polos[pol], contra = polos[1 - pol]
    const premisa = (x: string, y: string, a = adj) =>
      inv ? `Comparado con ${sintagma(y)}, ${sintagma(x)} es más ${a}.` : `${cap(sintagma(x))} es más ${a} que ${sintagma(y)}.`
    // Premisa i: relación entre la posición i (más «adj») y la i+1
    const entrenadas = nombres.slice(0, -1).map((x, i) => premisa(x, nombres[i + 1]))
    const enRed = nombres.slice(0, -1).map((x, i) => (noLineal && i % 2 === 1 ? premisa(nombres[i + 1], x, contra) : entrenadas[i]))
    const ambas = (orden ? [...enRed].reverse() : enRed).join(' ')
    const consignas: Record<string, string> = {}
    nombres.slice(0, -1).forEach((_, i) => {
      const [o, d] = [POSICIONES[i], POSICIONES[i + 1]]
      consignas[`entrenamiento:${d}→${o}`] = `${entrenadas[i]} ${pregunta} más ${adj}?`
      consignas[`test_mutuo:${o}→${d}`] = `${entrenadas[i]} ${pregunta} más ${contra}?`
    })
    const a = nombres[0]
    nombres.slice(2).forEach((x, k) => {
      const pos = POSICIONES[k + 2]
      const extremos = alt ? `${x} o ${a}` : `${a} o ${x}`
      consignas[`test_combinatorio:${pos}→A`] = `${ambas} ${pregunta} más ${adj}, ${extremos}?`
      consignas[`test_combinatorio:A→${pos}`] = `${ambas} ${pregunta} más ${contra}, ${extremos}?`
      // Situación que pide un extremo; con más de 3 miembros, solo entre A y este
      const situacion = (s: string) => {
        if (miembros === 3) return s
        const corte = s.indexOf('. ¿')
        return `${s.slice(0, corte)}. Solo pueden ir ${extremos}. ${s.slice(corte + 2)}`
      }
      consignas[`transformacion_funciones:A→${pos}`] = `${ambas} ${situacion(mejor[1 - pol])}`
      consignas[`transformacion_funciones:${pos}→A`] = `${ambas} ${situacion(mejor[pol])}`
    })
    return {
      numero: n,
      estimulos: nombres.map((x, i) => ({ posicion: POSICIONES[i] as EstimuloGenerado['posicion'], nombre: x, concepto_imagen: null })),
      consignas,
    }
  })
}

// ---------------------------------------------------------------- Espaciales
const objeto = (concepto: string): EstimuloGenerado['nombre'] => cap(OBJETOS[concepto])

const espacialMutua: Plantilla = (ctx) => {
  const trozos = elegir(Object.keys(OBJETOS), 2, ctx, false)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [ca, cb] = trozos[j]
    const { pol, inv } = factores(n)
    const marco = MARCOS[(n - 1) % MARCOS.length]
    const [rel] = marco[pol], [contra] = marco[1 - pol]
    const A = OBJETOS[ca], B = OBJETOS[cb]
    const premisa = inv ? `${cap(rel)} ${de(B)} está ${A}.` : `${cap(A)} está ${rel} ${de(B)}.`
    return {
      numero: n,
      estimulos: [{ posicion: 'A', nombre: objeto(ca), concepto_imagen: ca }, { posicion: 'B', nombre: objeto(cb), concepto_imagen: cb }],
      consignas: {
        'entrenamiento:B→A': `${premisa} ¿Qué está ${rel} ${de(B)}?`,
        'test_mutuo:A→B': `${premisa} ¿Qué está ${contra} ${de(A)}?`,
        // Se pinta desde un lado hasta justo uno: queda sin pintar el otro
        'transformacion_funciones:A→B': `${premisa} Empiezas a pintar por ${LADO[rel].lado} y la pintura llega justo hasta ${A}. ¿Qué queda sin pintar?`,
        'transformacion_funciones:B→A': `${premisa} Empiezas a pintar por ${LADO[contra].lado} y la pintura llega justo hasta ${B}. ¿Qué queda sin pintar?`,
      },
    }
  })
}

const espacialRed: Plantilla = (ctx) => {
  const trozos = elegir(Object.keys(OBJETOS), 3, ctx, false)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [ca, cb, cc] = trozos[j]
    const { pol, inv, orden, alt } = factores(n)
    const marco = MARCOS[(n - 1) % MARCOS.length]
    const [rel, extRel] = marco[pol], [contra, extContra] = marco[1 - pol]
    const A = OBJETOS[ca], B = OBJETOS[cb], C = OBJETOS[cc]
    const premisa = (x: string, y: string) => (inv ? `${cap(rel)} ${de(y)} está ${x}.` : `${cap(x)} está ${rel} ${de(y)}.`)
    const p1 = premisa(A, B), p2 = premisa(B, C)
    const ambas = orden ? `${p2} ${p1}` : `${p1} ${p2}`
    const extremos = alt ? `${C} o ${A}` : `${A} o ${C}`
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: objeto(ca), concepto_imagen: ca },
        { posicion: 'B', nombre: objeto(cb), concepto_imagen: cb },
        { posicion: 'C', nombre: objeto(cc), concepto_imagen: cc },
      ],
      consignas: {
        'entrenamiento:B→A': `${p1} ¿Qué está ${rel} ${de(B)}?`,
        'entrenamiento:C→B': `${p2} ¿Qué está ${rel} ${de(C)}?`,
        'test_mutuo:A→B': `${p1} ¿Qué está ${contra} ${de(A)}?`,
        'test_mutuo:B→C': `${p2} ¿Qué está ${contra} ${de(B)}?`,
        'test_combinatorio:C→A': `${ambas} ¿Qué está ${extRel}, ${extremos}?`,
        'test_combinatorio:A→C': `${ambas} ¿Qué está ${extContra}, ${extremos}?`,
        // Se pinta de un extremo al otro: lo último es el extremo contrario
        'transformacion_funciones:A→C': `${ambas} Empiezas a pintar por ${LADO[rel].lado} y ${LADO[rel].avance}. ¿Qué pintarás lo último?`,
        'transformacion_funciones:C→A': `${ambas} Empiezas a pintar por ${LADO[contra].lado} y ${LADO[contra].avance}. ¿Qué pintarás lo último?`,
      },
    }
  })
}

// ---------------------------------------------------------------- Temporales
// Las acciones se eligen por su concepto del banco («acciones/saltar»), que es
// como quedan guardadas, para reconocer los pares ya usados
const CONCEPTOS_ACCION = Object.keys(ACCIONES).map((a) => `acciones/${a}`)
const verbo = (concepto: string) => ACCIONES[concepto.replace('acciones/', '')]
const accion = (concepto: string): EstimuloGenerado => ({ posicion: 'A', nombre: cap(verbo(concepto)[0]), concepto_imagen: concepto })

const temporalMutua: Plantilla = (ctx) => {
  const trozos = elegir(CONCEPTOS_ACCION, 2, ctx, false)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [ca, cb] = trozos[j]
    const { pol, inv } = factores(n)
    const p = PERSONAJES[(n - 1) % PERSONAJES.length]
    const [rel, contra] = pol ? ['después', 'antes'] : ['antes', 'después']
    const A = verbo(ca), B = verbo(cb)
    const premisa = inv ? `${cap(rel)} de ${B[1]}, ${p} ${A[0]}.` : `${p} ${A[0]} ${rel} de ${B[1]}.`
    return {
      numero: n,
      estimulos: [{ ...accion(ca), posicion: 'A' }, { ...accion(cb), posicion: 'B' }],
      consignas: {
        'entrenamiento:B→A': `${premisa} ¿Qué hace ${p} ${rel} de ${B[1]}?`,
        'test_mutuo:A→B': `${premisa} ¿Qué hace ${p} ${contra} de ${A[1]}?`,
        // La noche llega al terminar la primera acción (queda la segunda) y el
        // día al empezar la segunda (la primera fue de noche)
        ...(pol
          ? {
              'transformacion_funciones:B→A': `${premisa} Se hace de noche justo cuando ${p} termina de ${B[1]}. ¿Qué hace ${p} de noche?`,
              'transformacion_funciones:A→B': `${premisa} Se hace de día justo cuando ${p} empieza a ${A[1]}. ¿Qué hace ${p} todavía de noche?`,
            }
          : {
              'transformacion_funciones:A→B': `${premisa} Se hace de noche justo cuando ${p} termina de ${A[1]}. ¿Qué hace ${p} de noche?`,
              'transformacion_funciones:B→A': `${premisa} Se hace de día justo cuando ${p} empieza a ${B[1]}. ¿Qué hace ${p} todavía de noche?`,
            }),
      },
    }
  })
}

const temporalRed: Plantilla = (ctx) => {
  const trozos = elegir(CONCEPTOS_ACCION, 3, ctx, false)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [ca, cb, cc] = trozos[j]
    const { pol, inv, orden, alt } = factores(n)
    const p = PERSONAJES[(n - 1) % PERSONAJES.length]
    const [rel, contra] = pol ? ['después', 'antes'] : ['antes', 'después']
    const A = verbo(ca), B = verbo(cb), C = verbo(cc)
    const premisa = (x: [string, string], y: [string, string]) => (inv ? `${cap(rel)} de ${y[1]}, ${p} ${x[0]}.` : `${p} ${x[0]} ${rel} de ${y[1]}.`)
    const p1 = premisa(A, B), p2 = premisa(B, C)
    const ambas = orden ? `${p2} ${p1}` : `${p1} ${p2}`
    const extremos = alt ? `${C[1]} o ${A[1]}` : `${A[1]} o ${C[1]}`
    return {
      numero: n,
      estimulos: [{ ...accion(ca), posicion: 'A' }, { ...accion(cb), posicion: 'B' }, { ...accion(cc), posicion: 'C' }],
      consignas: {
        'entrenamiento:B→A': `${p1} ¿Qué hace ${p} ${rel} de ${B[1]}?`,
        'entrenamiento:C→B': `${p2} ¿Qué hace ${p} ${rel} de ${C[1]}?`,
        'test_mutuo:A→B': `${p1} ¿Qué hace ${p} ${contra} de ${A[1]}?`,
        'test_mutuo:B→C': `${p2} ¿Qué hace ${p} ${contra} de ${B[1]}?`,
        'test_combinatorio:C→A': `${ambas} ¿Qué hace ${p} ${rel}, ${extremos}?`,
        'test_combinatorio:A→C': `${ambas} ¿Qué hace ${p} ${contra}, ${extremos}?`,
        'transformacion_funciones:A→C': `${ambas} Ahora hazlo tú como ${p}: toca las tres acciones en el orden en que las hace ${p}.`,
      },
      // Orden en que ocurren: A, B, C si es «antes»; al revés si es «después»
      respuestas_esperadas: {
        'transformacion_funciones:A→C': (pol ? [C, B, A] : [A, B, C]).map((x) => cap(x[0])).join(', '),
      },
    }
  })
}

// ---------------------------------------------------------------- Distinción
// Vínculo mutuo: un objeto conocido (A) y un nombre inventado (B) que sirve para
// lo mismo o para algo diferente, tiene el mismo color o uno diferente… Con
// opciones fijas «Lo mismo»/«Diferente» y, en la transformación, «Sí»/«No».
const femenino = (np: string) => np.startsWith('la ') || np.startsWith('las ')
const enFemenino = (adj: string) => (adj.endsWith('o') ? `${adj.slice(0, -1)}a` : adj)
const sinArticulo = (np: string) => np.replace(/^(el|la|los|las) /, '')

const distincionMutua: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 1, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const b = `el ${trozos[j][0].toLowerCase()}`
    const { dimension, objetos } = DISTINCION[(n - 1) % DISTINCION.length]
    const o = objetos[Math.floor(ctx.azar() * objetos.length)]
    const A = o.np
    // Mitad de las clases «lo mismo» y mitad «diferente», alternando entre grupos
    const igual = factores(n).pol === 0
    const sirve = o.plural ? 'sirven' : 'sirve'
    const frases = {
      funcion: {
        premisa: `${cap(b)} sirve para ${igual ? 'lo mismo' : 'algo diferente'} que ${A}.`,
        pregunta: (x: string, y: string, verbo = 'sirve') => `¿${cap(x)} ${verbo} para lo mismo que ${y} o para algo diferente?`,
        tof: `${cap(A)} ${sirve} para ${o.valor}. ${cap(b)} sirve para ${igual ? 'lo mismo' : 'algo diferente'} que ${A}. Quiero ${o.valor} y no tengo ${sinArticulo(A)}. ¿Me sirve ${b}?`,
      },
      color: {
        premisa: `${cap(b)} tiene ${igual ? 'el mismo color' : 'un color diferente'} que ${A}.`,
        pregunta: (x: string, y: string, verbo = 'tiene') => `¿${cap(x)} ${verbo} el mismo color que ${y} o un color diferente?`,
        tof: '',
      },
      forma: {
        premisa: `${cap(b)} tiene ${igual ? 'la misma forma' : 'una forma diferente'} que ${A}.`,
        pregunta: (x: string, y: string, verbo = 'tiene') => `¿${cap(x)} ${verbo} la misma forma que ${y} o una forma diferente?`,
        tof: '',
      },
      sabor: {
        premisa: `${cap(b)} sabe ${igual ? 'igual' : 'diferente'} que ${A}.`,
        pregunta: (x: string, y: string, verbo = 'sabe') => `¿${cap(x)} ${verbo} igual que ${y} o sabe diferente?`,
        tof: '',
      },
    }[dimension]
    const tof =
      dimension === 'funcion'
        ? frases.tof
        : `${cap(A)} es ${femenino(A) ? enFemenino(o.valor) : o.valor}. ${frases.premisa} ¿Es ${o.valor} ${b}?`
    // En plural («las tijeras») el verbo del mutuo concuerda con A
    const verboA = o.plural ? { funcion: 'sirven', color: 'tienen', forma: 'tienen', sabor: 'saben' }[dimension] : undefined
    const respuesta = igual ? 'Lo mismo' : 'Diferente'
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: cap(A), concepto_imagen: null },
        { posicion: 'B', nombre: cap(b), concepto_imagen: null },
      ],
      consignas: {
        'entrenamiento:B→A': `${frases.premisa} ${frases.pregunta(b, A)}`,
        'test_mutuo:A→B': `${frases.premisa} ${frases.pregunta(A, b, verboA)}`,
        'transformacion_funciones:A→B': tof,
      },
      respuestas_esperadas: { 'A→B': respuesta, 'B→A': respuesta, 'transformacion_funciones:A→B': igual ? 'Sí' : 'No' },
    }
  })
}

// Palabras sin sentido (CVC o CVCV) para las redes de distinción
function palabrasDistincion(ctx: Contexto, cuantas: number): string[] | null {
  const { consonantes: c, vocales: v } = SILABAS_DISTINCION
  const pick = <T,>(l: T[]) => l[Math.floor(ctx.azar() * l.length)]
  const elegidas = new Set<string>()
  for (let i = 0; i < INTENTOS && elegidas.size < cuantas; i++) {
    // CVC acabadas en consonante rara en español (no salen palabras reales) y
    // CVCV con K; sin repetir la consonante («DUD», «ZEZ»)
    const w = ctx.azar() < 0.6 ? pick(c) + pick(v) + pick(['B', 'F', 'G', 'K', 'P']) : pick(c) + pick(v) + pick(c) + pick(v)
    const consonantes = w.replace(/[AEIOU]/g, '')
    if (new Set(consonantes).size !== consonantes.length) continue
    if (w.length === 4 && !w.includes('K')) continue
    if (!ctx.usados.nombres.has(w)) elegidas.add(w)
  }
  return elegidas.size === cuantas ? [...elegidas] : null
}

// Red de distinción: A–B y B–C, cada una «igual» o «diferente». Igual+igual →
// igual; igual+diferente (en cualquier orden) → diferente; diferente+diferente →
// no se sabe. Los cuatro patrones rotan con el número de clase y el contexto de la
// transformación rota aparte, para que no anticipe la respuesta.
const PATRONES_DISTINCION: [boolean, boolean][] = [[true, true], [true, false], [false, true], [false, false]]
// Una clase de la red de distinción con sus tres palabras (también se usa para
// rehacer los grupos del currículo con el mismo reparto)
export function claseDistincionRed(n: number, a: string, b: string, c: string): ClaseGenerada {
  const { inv, orden } = factores(n)
  const [ab, bc] = PATRONES_DISTINCION[(n - 1) % 4]
  const contexto = CONTEXTOS_DISTINCION[(Math.floor((n - 1) / 4) + (n - 1)) % CONTEXTOS_DISTINCION.length]
  const rel = (x: string, y: string, igual: boolean) => `${x} es ${igual ? 'igual que' : 'diferente de'} ${y}.`
  const p1 = rel(a, b, ab), p2 = rel(b, c, bc)
  const ambas = orden ? `${p2} ${p1}` : `${p1} ${p2}`
  const pregunta = (x: string, y: string) => (inv ? `¿${x} es diferente de ${y} o igual?` : `¿${x} es igual que ${y} o diferente?`)
  const nombre = (igual: boolean) => (igual ? 'Igual' : 'Diferente')
  const ac = ab && bc ? 'Igual' : ab || bc ? 'Diferente' : 'No se sabe'
  const tof = ac === 'Igual' ? 'Sí' : ac === 'Diferente' ? 'No' : 'No se sabe'
  const { plural, dimension, np, propiedad } = contexto
  return {
    numero: n,
    estimulos: [
      { posicion: 'A', nombre: a, concepto_imagen: null },
      { posicion: 'B', nombre: b, concepto_imagen: null },
      { posicion: 'C', nombre: c, concepto_imagen: null },
    ],
    consignas: {
      'entrenamiento:A→B': `${p1} ${pregunta(a, b)}`,
      'entrenamiento:B→C': `${p2} ${pregunta(b, c)}`,
      'test_mutuo:B→A': `${p1} ${pregunta(b, a)}`,
      'test_mutuo:C→B': `${p2} ${pregunta(c, b)}`,
      'test_combinatorio:A→C': `${ambas} ¿${a} es igual que ${c}, diferente o no se sabe?`,
      'test_combinatorio:C→A': `${ambas} ¿${c} es igual que ${a}, diferente o no se sabe?`,
      'transformacion_funciones:A→C': `${a}, ${b} y ${c} son ${plural} que solo pueden diferenciarse en ${dimension}. ${ambas} ${cap(np)} ${a} es ${propiedad}. ¿Es ${propiedad} ${np} ${c}?`,
    },
    respuestas_esperadas: {
      'A→B': nombre(ab),
      'B→A': nombre(ab),
      'B→C': nombre(bc),
      'C→B': nombre(bc),
      'A→C': ac,
      'C→A': ac,
      'transformacion_funciones:A→C': tof,
    },
  }
}

const distincionRed: Plantilla = (ctx) => {
  const palabras = palabrasDistincion(ctx, CLASES_POR_GRUPO * 3)
  if (!palabras) return null
  return numeros(ctx).map((n, j) => {
    const [a, b, c] = palabras.slice(j * 3, j * 3 + 3)
    return claseDistincionRed(n, a, b, c)
  })
}

// ---------------------------------------------------------------- Oposición
// Aparatos o cosas con nombre inventado («el botón Kafi»). La respuesta es elegir
// uno de los miembros de la clase (opciones de la propia clase)
function oposicion(n: number) {
  const o = OPOSICION[(n - 1) % OPOSICION.length]
  const art = o.femenino ? 'la' : 'el'
  const np = (x: string) => `${art} ${o.sustantivo} ${x}`
  const de = (x: string) => (o.femenino ? `de la ${o.sustantivo} ${x}` : `del ${o.sustantivo} ${x}`)
  const contrario = (x: string, y: string) => (o.verbo === 'hace' ? `${cap(np(x))} hace lo contrario que ${np(y)}.` : `${cap(np(x))} es lo contrario ${de(y)}.`)
  const quien = (y: string) => (o.verbo === 'hace' ? `¿Qué ${o.sustantivo} hace lo contrario que ${np(y)}?` : `¿Qué ${o.sustantivo} es lo contrario ${de(y)}?`)
  const mismo = (y: string) => (o.verbo === 'hace' ? `¿Qué ${o.sustantivo} hace lo mismo que ${np(y)}?` : `¿Qué ${o.sustantivo} es igual que ${np(y)}?`)
  return { o, np, contrario, quien, mismo, otro: o.femenino ? 'otra' : 'otro' }
}

const oposicionMutua: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 2, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [a, b] = trozos[j]
    const { o, np, contrario, quien } = oposicion(n)
    const { pol, inv } = factores(n)
    const premisa = inv ? contrario(a, b) : contrario(b, a)
    const usar = `¿Qué ${o.sustantivo} ${o.elegir}?`
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: cap(np(a)), concepto_imagen: null },
        { posicion: 'B', nombre: cap(np(b)), concepto_imagen: null },
      ],
      consignas: {
        'entrenamiento:A→B': `${premisa} ${quien(a)}`,
        'test_mutuo:B→A': `${premisa} ${quien(b)}`,
        // A tiene el efecto «pol» y B el contrario: se pide el contrario del que se nombra
        'transformacion_funciones:A→B': `${cap(np(a))} ${o.efecto[pol]}. ${premisa} ${o.quiero[1 - pol]}. ${usar}`,
        'transformacion_funciones:B→A': `${cap(np(b))} ${o.efecto[1 - pol]}. ${premisa} ${o.quiero[pol]}. ${usar}`,
      },
    }
  })
}

// Redes de oposición mezcladas con igualdad (Luciano et al., 2009; currículo del
// 25 de noviembre): 4 redes por grupo, una de cada tipo (contrario+contrario,
// contrario+igual, igual+contrario, igual+igual), para que el combinatorio no se
// acierte respondiendo siempre «lo mismo». En entrenamiento y mutuo, las opciones
// son los dos nombres de la frase y uno de otra red (nunca dos respuestas válidas).
// Contrapesos: orden de cada frase, orden de las premisas y polo de la función de A
const TIPOS_OPOSICION: ['contrario' | 'igual', 'contrario' | 'igual'][] = [
  ['contrario', 'contrario'],
  ['contrario', 'igual'],
  ['igual', 'contrario'],
  ['igual', 'igual'],
]
const oposicionRed: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 3, ctx, true, 4)
  if (!trozos) return null
  const gi = Math.floor((ctx.primerNumero - 1) / 4)
  const o = OPOSICION[gi % OPOSICION.length]
  const art = o.femenino ? 'la' : 'el'
  const np = (x: string) => `${art} ${o.sustantivo} ${x}`
  const deNp = (x: string) => (o.femenino ? `de la ${o.sustantivo} ${x}` : `del ${o.sustantivo} ${x}`)
  const frase = (x: string, r: string, y: string) =>
    o.verbo === 'es'
      ? r === 'contrario' ? `${cap(np(x))} es lo contrario ${deNp(y)}.` : `${cap(np(x))} es igual que ${np(y)}.`
      : `${cap(np(x))} hace ${r === 'contrario' ? 'lo contrario' : 'lo mismo'} que ${np(y)}.`
  const pregunta = (r: string, y: string) =>
    o.verbo === 'es'
      ? r === 'contrario' ? `¿Qué ${o.sustantivo} es lo contrario ${deNp(y)}?` : `¿Qué ${o.sustantivo} es igual que ${np(y)}?`
      : `¿Qué ${o.sustantivo} hace ${r === 'contrario' ? 'lo contrario' : 'lo mismo'} que ${np(y)}?`
  const [mismo, contrario] = o.verbo === 'es' ? ['Igual', 'Lo contrario'] : ['Lo mismo', 'Lo contrario']
  const combinatorio = (x: string, y: string) =>
    o.verbo === 'es' ? `¿${cap(np(x))} es igual que ${np(y)} o lo contrario?` : `¿${cap(np(x))} hace lo mismo o lo contrario que ${np(y)}?`
  const [f1, f2] = o.efecto
  const redes = trozos.map(([a, b, c], k) => {
    const [r1, r2] = TIPOS_OPOSICION[k]
    const pab = (k + gi) % 2 === 0 ? frase(b, r1, a) : frase(a, r1, b)
    const pbc = (k + gi) % 2 === 1 ? frase(c, r2, b) : frase(b, r2, c)
    const premisas = (Math.floor(k / 2) + gi) % 2 === 0 ? `${pab} ${pbc}` : `${pbc} ${pab}`
    const fa = (k + Math.floor(gi / 2)) % 2 === 0 ? f1 : f2
    const igual = (r1 === 'contrario') === (r2 === 'contrario')
    const fc = igual ? fa : fa === f1 ? f2 : f1
    return { a, b, c, r1, r2, pab, pbc, premisas, fa, fc, igual }
  })
  const ordenadas = (xs: string[]) => [...xs].sort((x, y) => x.localeCompare(y, 'es'))
  return redes.map((r, k) => {
    const n = ctx.primerNumero + k
    const otras = redes.filter((_, j) => j !== k)
    const A = cap(np(r.a)), B = cap(np(r.b)), C = cap(np(r.c))
    const okComb = r.igual ? mismo : contrario
    const tof = `${A} ${r.fa}. ${r.premisas} ${cap(np(r.c))}, ¿${f1} o ${f2}?`
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: A, concepto_imagen: null },
        { posicion: 'B', nombre: B, concepto_imagen: null },
        { posicion: 'C', nombre: C, concepto_imagen: null },
      ],
      consignas: {
        'entrenamiento:A→B': `${r.pab} ${pregunta(r.r1, r.a)}`,
        'entrenamiento:B→C': `${r.pbc} ${pregunta(r.r2, r.b)}`,
        'test_mutuo:B→A': `${r.pab} ${pregunta(r.r1, r.b)}`,
        'test_combinatorio:A→C': `${r.premisas} ${combinatorio(r.c, r.a)}`,
        'test_combinatorio:C→A': `${r.premisas} ${combinatorio(r.a, r.c)}`,
        'transformacion_funciones:A→C': tof,
      },
      respuestas_esperadas: {
        'entrenamiento:A→B': B,
        'entrenamiento:B→C': C,
        'test_mutuo:B→A': A,
        'test_combinatorio:A→C': okComb,
        'test_combinatorio:C→A': okComb,
        'transformacion_funciones:A→C': cap(r.fc),
      },
      opciones_por_fase: {
        'entrenamiento:A→B': ordenadas([B, A, cap(np(otras[k % 3].b))]),
        'entrenamiento:B→C': ordenadas([C, B, cap(np(otras[(k + 1) % 3].c))]),
        'test_mutuo:B→A': ordenadas([A, B, cap(np(otras[(k + 2) % 3].a))]),
        'test_combinatorio:A→C': [mismo, contrario],
        'test_combinatorio:C→A': [mismo, contrario],
        'transformacion_funciones:A→C': [cap(f1), cap(f2)],
      },
    }
  })
}

// ---------------------------------------------------------------- Condicionales
// «Si Pim bebe, Tok baila»: la condición (A) la hace un personaje y la
// consecuencia (B), otro. Cuatro formas de decirlo, que rotan
const condicionalMutua: Plantilla = (ctx) => {
  const trozos = elegir(CONCEPTOS_ACCION, 2, ctx, false)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [ca, cb] = trozos[j]
    const [p, q] = PAREJAS[(n - 1) % PAREJAS.length]
    const A = verbo(ca), B = verbo(cb)
    const conector = (n - 1) % 4 < 2 ? 'si' : 'cuando'
    const premisa = (n - 1) % 2 === 0 ? `${cap(conector)} ${p} ${A[0]}, ${q} ${B[0]}.` : `${q} ${B[0]} ${conector} ${p} ${A[0]}.`
    // «¿Cuándo monta Dax en bici?»: el verbo delante del personaje
    const [v, ...resto] = B[0].startsWith('se ') ? [B[0]] : B[0].split(' ')
    const cuando = `¿Cuándo ${v} ${q}${resto.length ? ` ${resto.join(' ')}` : ''}?`
    return {
      numero: n,
      estimulos: [{ ...accion(ca), posicion: 'A' }, { ...accion(cb), posicion: 'B' }],
      consignas: {
        'entrenamiento:A→B': `${premisa} ¿Qué hace ${q} ${conector} ${p} ${A[0]}?`,
        'test_mutuo:B→A': `${premisa} ${cuando}`,
        'transformacion_funciones:B→A': `${premisa} Quieres ver a ${q} ${B[1]}. ¿Qué tiene que hacer ${p}?`,
      },
    }
  })
}

// ---------------------------------------------------------------- Jerarquía
// «Vincular Mutuamente Relaciones Jerárquicas»: categoría real y miembro («Toby
// es un perro»; «El BRIL es una fruta»). Transformación de arriba abajo (lo común
// de la categoría pasa al miembro; lo de otra categoría, no) y de abajo arriba
// (lo propio del miembro solo vale para «alguno», no para «todos»)
const jerarquiaMutua: Plantilla = (ctx) => {
  const cats = muestra(CATEGORIAS, CLASES_POR_GRUPO + 1, ctx.azar)
  const trozos = elegir(NOMBRES, 1, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const cat = cats[j], otra = cats[CLASES_POR_GRUPO]
    const nombre = cat.animal ? trozos[j][0] : `el ${trozos[j][0].toUpperCase()}`
    const Nombre = cap(nombre)
    const un = cat.femenino ? 'una' : 'un'
    const los = cat.femenino ? 'las' : 'los'
    const color = COLORES[(n - 1) % COLORES.length]
    // El color del miembro concuerda con él (un animal, con la categoría; «el BRIL», en masculino);
    // el de la pregunta, con la categoría
    const colorMiembro = cat.animal && cat.femenino ? color[1] : color[0]
    const [colorCat, colorPl] = cat.femenino ? [color[1], color[3]] : [color[0], color[2]]
    const deArriba = (n - 1) % 2 === 0
    const premisa = `${Nombre} es ${un} ${cat.sing}.`
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: cap(cat.sing), concepto_imagen: null },
        { posicion: 'B', nombre: Nombre, concepto_imagen: null },
      ],
      consignas: {
        'entrenamiento:B→A': `${premisa} ¿Qué es ${nombre}?`,
        'test_mutuo:A→B': `${premisa} ¿Cuál de estos es ${un} ${cat.sing}?`,
        'transformacion_funciones:A→B': deArriba
          ? `${cap(los)} ${cat.pl} ${cat.funcion[1]}. ${premisa} ¿${cap(cat.funcion[0])} ${nombre}?`
          : `${cap(los)} ${cat.pl} ${cat.funcion[1]} y ${otra.femenino ? 'las' : 'los'} ${otra.pl} ${otra.funcion[1]}. ${premisa} ¿${cap(otra.funcion[0])} ${nombre}?`,
        'transformacion_funciones:B→A': deArriba
          ? `${premisa} ${Nombre} es ${colorMiembro}. ¿${cat.femenino ? 'Todas' : 'Todos'} ${los} ${cat.pl} son ${colorPl}?`
          : `${premisa} ${Nombre} es ${colorMiembro}. ¿${cat.femenino ? 'Alguna' : 'Alguno'} de ${los} ${cat.pl} es ${colorCat}?`,
      },
      respuestas_esperadas: {
        'transformacion_funciones:A→B': deArriba ? 'Sí' : 'No',
        'transformacion_funciones:B→A': deArriba ? 'No' : 'Sí',
      },
    }
  })
}

// «Derivar Relaciones Jerárquicas en Redes Combinatorias»: red de Villarroel y
// Luciano de tres niveles y dos ramas (A arriba; B y C debajo; D en B y E en C),
// con nombres inventados y una función en cada nodo. Inclusión (Sí) y distinción
// entre ramas (No), transformación de arriba abajo (Sí), sin cruzar ramas (No),
// de abajo arriba («todos» No / «alguno» Sí) y lo común a dos ramas (la función
// de arriba, la dominante), con opciones propias de la clase
const jerarquiaRed: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 5, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [A, B, C, D, E] = trozos[j].map((x) => x.toUpperCase())
    const accion = ACCIONES_CATEGORIA[(n - 1) % ACCIONES_CATEGORIA.length]
    const [rB, rC, rD, rE] = muestra(RASGOS, 4, ctx.azar)
    const contexto = `Los ${B} y los ${C} son ${A}. El ${D} es un ${B} y el ${E} es un ${C}.`
    const todos = (n - 1) % 2 === 0
    const comun = `Que ${accion[0]}`
    const opcionesComun = muestra([comun, `Que son ${rB[1]}`, `Que son ${rC[1]}`, `Que son ${rD[1]}`], 4, ctx.azar)
    return {
      numero: n,
      estimulos: [
        { posicion: 'A', nombre: `Los ${A}`, concepto_imagen: null },
        { posicion: 'B', nombre: `Los ${B}`, concepto_imagen: null },
        { posicion: 'C', nombre: `Los ${C}`, concepto_imagen: null },
        { posicion: 'D', nombre: `El ${D}`, concepto_imagen: null },
        { posicion: 'E', nombre: `El ${E}`, concepto_imagen: null },
      ],
      consignas: {
        'entrenamiento:B→A': `Los ${B} son ${A}. ¿Qué son los ${B}?`,
        'entrenamiento:C→A': `Los ${C} son ${A}. ¿Qué son los ${C}?`,
        'entrenamiento:D→B': `El ${D} es un ${B}. ¿Qué es el ${D}, un ${B} o un ${C}?`,
        'entrenamiento:E→C': `El ${E} es un ${C}. ¿Qué es el ${E}, un ${C} o un ${B}?`,
        'test_mutuo:B→D': `El ${D} es un ${B}. ¿Cuál de estos es un ${B}?`,
        'test_mutuo:C→E': `El ${E} es un ${C}. ¿Cuál de estos es un ${C}?`,
        'test_combinatorio:D→A': `${contexto} ¿Es el ${D} un ${A}?`,
        'test_combinatorio:D→C': `${contexto} ¿Es el ${D} un ${C}?`,
        'transformacion_funciones:A→D': `${contexto} Los ${A} ${accion[0]}. ¿${cap(accion[1])} el ${D}?`,
        'transformacion_funciones:B→E': `${contexto} Los ${B} son ${rB[1]}. ¿Es ${rB[0]} el ${E}?`,
        'transformacion_funciones:D→A': todos
          ? `${contexto} El ${D} es ${rD[0]}. ¿Todos los ${A} son ${rD[1]}?`
          : `${contexto} El ${D} es ${rD[0]}. ¿Alguno de los ${A} es ${rD[0]}?`,
        'transformacion_funciones:D→E': `${contexto} Los ${A} ${accion[0]}. Los ${B} son ${rB[1]} y los ${C}, ${rC[1]}. El ${D} es ${rD[0]} y el ${E}, ${rE[0]}. ¿Qué tienen en común el ${D} y el ${E}?`,
      },
      respuestas_esperadas: {
        'test_combinatorio:D→A': 'Sí',
        'test_combinatorio:D→C': 'No',
        'transformacion_funciones:A→D': 'Sí',
        'transformacion_funciones:B→E': 'No',
        'transformacion_funciones:D→A': todos ? 'No' : 'Sí',
        'transformacion_funciones:D→E': comun,
      },
      opciones_por_fase: { 'transformacion_funciones:D→E': opcionesComun },
    }
  })
}

// ---------------------------------------------------------------- Deícticas (4.1)
// Protocolo de Barnes-Holmes y McHugh (Heagle y Rehfeldt, 2006) con
// transformación de funciones (PEAK-T): cada escena se pregunta por «yo» y por
// «tú» (o «ahora» y «antes»), los estímulos se intercambian en los grupos impares
// y la clave temporal alterna «ahora/antes» y «hoy/ayer». Opciones en orden fijo
// por estímulo (la correcta cambia de posición). El grupo recorre los juegos de
// estímulos de DEICTICOS a partir de los que ya tiene el programa (4 del currículo)
type ClaseDeictica = { consigna: string; ok: string; opciones: string[]; tof: boolean }
const TU_YO = 'Si yo fuera tú y tú fueras yo'
const AQUI = 'si aquí fuera allí y allí fuera aquí'
const TIEMPO: [string, string, string, string][] = [
  ['Antes', 'ahora', 'antes', 'si ahora fuera antes y antes fuera ahora'],
  ['Ayer', 'hoy', 'ayer', 'si hoy fuera ayer y ayer fuera hoy'],
]
const enLugar = (l: string) => (l.startsWith('el ') ? `en el ${l.slice(3)}` : `en ${l}`)
const objetoSinArticulo = (s: string) => cap(sinArticulo(s))
const alfabetico = (xs: string[]) => [...xs].sort((x, y) => x.localeCompare(y, 'es'))
function escenaDeictica(gi: number) {
  const g = DEICTICOS[gi % DEICTICOS.length]
  let [a, b] = g.obj, [la, lb] = g.lug, [A, B] = g.act
  let [s, x] = g.tof
  let [estado1, estado2] = [g.tof[3], g.tof[4]]
  if (gi % 2) {
    ;[a, b, la, lb, A, B, s, x] = [b, a, lb, la, B, A, x, s]
    ;[estado1, estado2] = [estado2, estado1]
  }
  const [Antes, ahora, antes, HOY] = TIEMPO[gi % 2]
  const O = alfabetico([objetoSinArticulo(a), objetoSinArticulo(b)])
  const L = alfabetico([objetoSinArticulo(la), objetoSinArticulo(lb)])
  const T = alfabetico([A[0], B[0]])
  const estados = alfabetico([g.tof[3], g.tof[4]])
  return { g, a, b, la, lb, A, B, s, x, estado1, estado2, Antes, ahora, antes, HOY, O, L, T, estados }
}
const deicticasSimples = (gi: number): ClaseDeictica[] => {
  const e = escenaDeictica(gi)
  return [
    { consigna: `Yo tengo ${e.a} y tú ${e.b}. ¿Cuál tengo yo?`, ok: objetoSinArticulo(e.a), opciones: e.O, tof: false },
    { consigna: `Yo tengo ${e.a} y tú ${e.b}. ¿Cuál tienes tú?`, ok: objetoSinArticulo(e.b), opciones: e.O, tof: false },
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ¿Dónde estoy yo?`, ok: objetoSinArticulo(e.la), opciones: e.L, tof: false },
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ¿Dónde estás tú?`, ok: objetoSinArticulo(e.lb), opciones: e.L, tof: false },
    { consigna: `${e.Antes} yo ${e.A[1]}; ${e.ahora} ${e.B[3]}. ¿Qué hago ${e.ahora}?`, ok: e.B[0], opciones: e.T, tof: false },
    { consigna: `${e.Antes} tú ${e.A[2]}; ${e.ahora} ${e.B[4]}. ¿Qué hacías ${e.antes}?`, ok: e.A[0], opciones: e.T, tof: false },
    { consigna: `Yo estoy aquí ${e.s} y tú allí ${e.x}. ${e.g.tof[5]}`, ok: e.estado1 === e.g.tof[3] ? 'Yo' : 'Tú', opciones: ['Tú', 'Yo'], tof: true },
  ]
}
const deicticasInvertidas = (gi: number): ClaseDeictica[] => {
  const e = escenaDeictica(gi)
  return [
    { consigna: `Yo tengo ${e.a} y tú ${e.b}. ${TU_YO}, ¿cuál tendría yo?`, ok: objetoSinArticulo(e.b), opciones: e.O, tof: false },
    { consigna: `Yo tengo ${e.a} y tú ${e.b}. ${TU_YO}, ¿cuál tendrías tú?`, ok: objetoSinArticulo(e.a), opciones: e.O, tof: false },
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ${cap(AQUI)}, ¿dónde estaría yo?`, ok: objetoSinArticulo(e.lb), opciones: e.L, tof: false },
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ${cap(AQUI)}, ¿dónde estarías tú?`, ok: objetoSinArticulo(e.la), opciones: e.L, tof: false },
    { consigna: `${e.Antes} yo ${e.A[1]}; ${e.ahora} ${e.B[3]}. ${cap(e.HOY)}, ¿qué estaría haciendo ${e.ahora}?`, ok: e.A[0], opciones: e.T, tof: false },
    { consigna: `${e.Antes} tú ${e.A[2]}; ${e.ahora} ${e.B[4]}. ${cap(e.HOY)}, ¿qué habrías hecho ${e.antes}?`, ok: e.B[0], opciones: e.T, tof: false },
    { consigna: `Yo estoy aquí ${e.s} y tú allí ${e.x}. ${TU_YO}, ${e.g.tof[2]}`, ok: e.estado2, opciones: e.estados, tof: true },
  ]
}
const deicticasDobles = (gi: number): ClaseDeictica[] => {
  const e = escenaDeictica(gi)
  return [
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ${TU_YO}, y ${AQUI}, ¿dónde estaría yo?`, ok: objetoSinArticulo(e.la), opciones: e.L, tof: false },
    { consigna: `Yo estoy aquí, ${enLugar(e.la)}, y tú allí, ${enLugar(e.lb)}. ${TU_YO}, y ${AQUI}, ¿dónde estarías tú?`, ok: objetoSinArticulo(e.lb), opciones: e.L, tof: false },
    { consigna: `${e.Antes} yo estaba allí, ${enLugar(e.la)}; ${e.ahora} estoy aquí, ${enLugar(e.lb)}. ${cap(AQUI)}, y ${e.HOY}, ¿dónde estaría ${e.ahora}?`, ok: objetoSinArticulo(e.lb), opciones: e.L, tof: false },
    { consigna: `${e.Antes} yo estaba allí, ${enLugar(e.la)}; ${e.ahora} estoy aquí, ${enLugar(e.lb)}. ${cap(AQUI)}, y ${e.HOY}, ¿dónde habría estado ${e.antes}?`, ok: objetoSinArticulo(e.la), opciones: e.L, tof: false },
    { consigna: `Yo estoy aquí ${e.s} y tú allí ${e.x}. ${TU_YO}, y ${AQUI}, ${e.g.tof[2]}`, ok: e.estado1, opciones: e.estados, tof: true },
  ]
}
// Escena (A) y respuesta (B en entrenamiento, C en la transformación)
const plantillaDeictica = (clasesDe: (gi: number) => ClaseDeictica[], porGrupo: number): Plantilla => (ctx) => {
  const gi = Math.floor((ctx.primerNumero - 1) / porGrupo)
  return clasesDe(gi).map((c, k) => {
    const clave = c.tof ? 'transformacion_funciones:A→C' : 'entrenamiento:A→B'
    const escena = c.consigna.slice(0, c.consigna.lastIndexOf('. ') + 1) || c.consigna
    return {
      numero: ctx.primerNumero + k,
      estimulos: [
        { posicion: 'A', nombre: escena, concepto_imagen: null },
        { posicion: c.tof ? 'C' : 'B', nombre: c.ok, concepto_imagen: null },
      ],
      consignas: { [clave]: c.consigna },
      respuestas_esperadas: { [clave]: c.ok },
      opciones_por_fase: { [clave]: c.opciones },
    }
  })
}

// Programas con generador (por nombre del programa del currículo)
const PLANTILLAS: Record<string, Plantilla> = {
  'Vincular Mutuamente Relaciones de Comparación': comparacionMutua,
  'Derivar Relaciones de Comparación en Redes Combinatorias': comparacionRed,
  'Vincular Mutuamente Relaciones Espaciales': espacialMutua,
  'Derivar Relaciones Espaciales en Redes Combinatorias': espacialRed,
  'Vincular Mutuamente Relaciones Temporales': temporalMutua,
  'Derivar Relaciones Temporales en Redes Combinatorias': temporalRed,
  'Vincular Mutuamente Relaciones de Distinción': distincionMutua,
  'Derivar Relaciones de Distinción en Redes Combinatorias': distincionRed,
  'Vincular Mutuamente Relaciones de Oposición': oposicionMutua,
  'Derivar Relaciones de Oposición en Redes Combinatorias': oposicionRed,
  'Vincular Mutuamente Relaciones Condicionales': condicionalMutua,
  'Vincular Mutuamente Relaciones Jerárquicas': jerarquiaMutua,
  'Derivar Relaciones Jerárquicas en Redes Combinatorias': jerarquiaRed,
  'Relaciones Deícticas Simples': plantillaDeictica(deicticasSimples, 7),
  'Relaciones Deícticas Invertidas': plantillaDeictica(deicticasInvertidas, 7),
  'Relaciones Deícticas Doblemente Invertidas': plantillaDeictica(deicticasDobles, 5),
}

export function tienePlantilla(nombrePrograma: string) {
  return nombrePrograma in PLANTILLAS
}

export function generarGrupo(nombrePrograma: string, semilla: string, primerNumero: number, usados: Usados): ClaseGenerada[] | null {
  const plantilla = PLANTILLAS[nombrePrograma]
  if (!plantilla) return null
  return plantilla({ azar: azarDesde(`${nombrePrograma}|${semilla}`), primerNumero, usados })
}
