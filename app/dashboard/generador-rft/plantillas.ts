// Generador de grupos para los programas verbales del nivel 3: cada plantilla
// crea un grupo de 3 clases con sus estímulos y las claves de todas las fases.
// La respuesta correcta sale de cómo se construye la red (la posición destino
// de cada fase), nunca de un modelo de lenguaje. Mismo formato y contrapesos que
// los grupos del currículo (migraciones del 10 y el 17 de noviembre de 2026), con
// la transformación de funciones al final (plan de fusión del 22 de noviembre).

import { ACCIONES, DIMENSIONES, LADO, MARCOS, NOMBRES, OBJETOS, PERSONAJES } from './vocabulario'

export type EstimuloGenerado = { posicion: 'A' | 'B' | 'C'; nombre: string; concepto_imagen: string | null }
// respuestas_esperadas: solo cuando la respuesta no es elegir un estímulo (p. ej. ordenar)
export type ClaseGenerada = {
  numero: number
  estimulos: EstimuloGenerado[]
  consignas: Record<string, string>
  respuestas_esperadas?: Record<string, string>
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
function elegir(pool: string[], porClase: number, ctx: Contexto, porNombre: boolean): string[][] | null {
  if (pool.length < porClase * CLASES_POR_GRUPO) return null
  const nuevo = (t: string[]) =>
    porNombre
      ? t.every((x) => !ctx.usados.nombres.has(x))
      : t.every((x, i) => t.slice(i + 1).every((y) => !ctx.usados.pares.has(clavePar(x, y))))
  for (const estricto of [true, false]) {
    for (let intento = 0; intento < 200; intento++) {
      const trozos: string[][] = []
      const libres = new Set(pool)
      for (let j = 0; j < CLASES_POR_GRUPO; j++) {
        let elegido: string[] | null = null
        for (let k = 0; k < INTENTOS / 4 && !elegido; k++) {
          const t = muestra([...libres], porClase, ctx.azar)
          if (!estricto || nuevo(t)) elegido = t
        }
        if (!elegido) break
        elegido.forEach((x) => libres.delete(x))
        trozos.push(elegido)
      }
      if (trozos.length === CLASES_POR_GRUPO) return trozos
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

const comparacionRed: Plantilla = (ctx) => {
  const trozos = elegir(NOMBRES, 3, ctx, true)
  if (!trozos) return null
  return numeros(ctx).map((n, j) => {
    const [a, b, c] = trozos[j]
    const { pol, inv, orden, alt } = factores(n)
    const { sintagma, polos, pregunta, mejor } = DIMENSIONES[(n - 1) % DIMENSIONES.length]
    const adj = polos[pol], contra = polos[1 - pol]
    const premisa = (x: string, y: string) => (inv ? `Comparado con ${sintagma(y)}, ${sintagma(x)} es más ${adj}.` : `${cap(sintagma(x))} es más ${adj} que ${sintagma(y)}.`)
    const p1 = premisa(a, b), p2 = premisa(b, c)
    const ambas = orden ? `${p2} ${p1}` : `${p1} ${p2}`
    const extremos = alt ? `${c} o ${a}` : `${a} o ${c}`
    return {
      numero: n,
      estimulos: [{ posicion: 'A', nombre: a, concepto_imagen: null }, { posicion: 'B', nombre: b, concepto_imagen: null }, { posicion: 'C', nombre: c, concepto_imagen: null }],
      consignas: {
        'entrenamiento:B→A': `${p1} ${pregunta} más ${adj}?`,
        'entrenamiento:C→B': `${p2} ${pregunta} más ${adj}?`,
        'test_mutuo:A→B': `${p1} ${pregunta} más ${contra}?`,
        'test_mutuo:B→C': `${p2} ${pregunta} más ${contra}?`,
        'test_combinatorio:C→A': `${ambas} ${pregunta} más ${adj}, ${extremos}?`,
        'test_combinatorio:A→C': `${ambas} ${pregunta} más ${contra}, ${extremos}?`,
        // Situación que pide un extremo: A es el más «pol», C el del otro polo
        'transformacion_funciones:A→C': `${ambas} ${mejor[1 - pol]}`,
        'transformacion_funciones:C→A': `${ambas} ${mejor[pol]}`,
      },
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

// Programas con generador (por nombre del programa del currículo)
const PLANTILLAS: Record<string, Plantilla> = {
  'Vincular Mutuamente Relaciones de Comparación': comparacionMutua,
  'Derivar Relaciones de Comparación en Redes Combinatorias': comparacionRed,
  'Vincular Mutuamente Relaciones Espaciales': espacialMutua,
  'Derivar Relaciones Espaciales en Redes Combinatorias': espacialRed,
  'Vincular Mutuamente Relaciones Temporales': temporalMutua,
  'Derivar Relaciones Temporales en Redes Combinatorias': temporalRed,
}

export function tienePlantilla(nombrePrograma: string) {
  return nombrePrograma in PLANTILLAS
}

export function generarGrupo(nombrePrograma: string, semilla: string, primerNumero: number, usados: Usados): ClaseGenerada[] | null {
  const plantilla = PLANTILLAS[nombrePrograma]
  if (!plantilla) return null
  return plantilla({ azar: azarDesde(`${nombrePrograma}|${semilla}`), primerNumero, usados })
}
