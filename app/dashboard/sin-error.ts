import type { Json } from '@/database.types'

// Ayudas y presentación en la tableta (programas_alumno.sin_error). Dos
// formas de ayuda en el entrenamiento, a elegir por programa:
// - De mayor a menor (aprendizaje sin error): una
// escalera de grados de apoyo que se recorre bloque a bloque. Cada
// escalón fija cuántas comparaciones se presentan, con qué opacidad se ven los
// distractores y a los cuántos segundos se resalta la correcta. El último
// escalón («Sin apoyo») es el único que cuenta para el dominio. El escalón de
// cada grupo y relación se deduce del último bloque hecho con el procedimiento
// (bloques_ensayo_rft.sin_error guarda una copia del escalón usado).
// - De menor a mayor dentro del ensayo: el ensayo empieza sin ayuda y, tras
// cada error, se repite con la ayuda siguiente (NIVELES_MENOR_A_MAYOR); tras
// acertar con ayuda se presenta el mismo ensayo sin ayuda (transferencia).
// Además, opcionalmente, respuesta de observación: el alumno toca la muestra
// para que aparezcan las comparaciones.

// comparaciones: número, o null = todas las clases del grupo
// opacidad: de los distractores (0–1); demora: segundos hasta la ayuda en
// pantalla, null = sin ayuda
export type Escalon = { nombre: string; comparaciones: number | null; opacidad: number; demora: number | null }
export type ModoAyuda = 'mayor_a_menor' | 'menor_a_mayor'
export type ConfigSinError = {
  activo: boolean
  modo: ModoAyuda
  // Respuesta de observación (independiente de que haya ayudas activas)
  observacion: boolean
  // Tests con respuesta oral: el alumno elige entre palabras oídas y se puntúa solo
  seleccionOida: boolean
  escalones: Escalon[]
  // % de aciertos (con o sin la ayuda en pantalla) para subir / por debajo del cual se baja
  subir: number
  bajar: number
  // Desvanecer también el tamaño de los distractores (por defecto, solo la opacidad)
  tamano: boolean
}
export type Procedimientos = { campo: boolean; desvanecimiento: boolean; demora: boolean }

// Copia del escalón con que se hizo un bloque
export type EscalonBloque = Escalon & { indice: number; total: number; final: boolean; aciertos_con_apoyo: number }

export const MAX_COMPARACIONES = 6
export const SUBIR_DEFECTO = 90
export const BAJAR_DEFECTO = 70

export function nombresPorDefecto(escalones: Pick<Escalon, 'comparaciones'>[]): string[] {
  const n = escalones.length
  const conTotal = n > 1 && escalones[0].comparaciones === 1
  const intermedios = n - 1 - (conTotal ? 1 : 0)
  const medios =
    intermedios <= 0
      ? []
      : intermedios === 1
        ? ['Apoyo medio']
        : intermedios === 2
          ? ['Apoyo alto', 'Apoyo bajo']
          : ['Apoyo alto', ...Array(intermedios - 2).fill('Apoyo medio'), 'Apoyo bajo']
  return [...(conTotal ? ['Apoyo total'] : []), ...medios, 'Sin apoyo']
}

// Escalera propuesta según los procedimientos elegidos
export function escaleraPorDefecto(p: Procedimientos): Escalon[] {
  const pasos: Omit<Escalon, 'nombre'>[] = []
  if (p.campo) pasos.push({ comparaciones: 1, opacidad: 1, demora: null })
  const opacidades = [0.2, 0.5, 0.8]
  const demoras = [0, 2, 4]
  const campos = [2, 2, null]
  for (let i = 0; i < 3; i++) {
    pasos.push({
      comparaciones: p.campo ? campos[i] : null,
      opacidad: p.desvanecimiento ? opacidades[i] : 1,
      demora: p.demora ? demoras[i] : null,
    })
  }
  pasos.push({ comparaciones: null, opacidad: 1, demora: null })
  const unicos = pasos.filter((s, i) => i === 0 || JSON.stringify(s) !== JSON.stringify(pasos[i - 1]))
  const nombres = nombresPorDefecto(unicos)
  return unicos.map((s, i) => ({ ...s, nombre: nombres[i] }))
}

function numero(v: unknown, min: number, max: number): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null
}

function leerEscalon(v: unknown): Escalon | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const o = v as Record<string, unknown>
  const nombre = typeof o.nombre === 'string' && o.nombre.trim() ? o.nombre.trim().slice(0, 40) : null
  if (!nombre) return null
  const comparaciones = o.comparaciones === null ? null : numero(o.comparaciones, 1, MAX_COMPARACIONES)
  if (comparaciones !== null) {
    if (!Number.isInteger(comparaciones)) return null
  } else if (o.comparaciones !== null) return null
  return {
    nombre,
    comparaciones,
    opacidad: numero(o.opacidad, 0.05, 1) ?? 1,
    demora: o.demora === null || o.demora === undefined ? null : numero(o.demora, 0, 30),
  }
}

export function leerSinError(valor: Json | null | undefined): ConfigSinError | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const o = valor as Record<string, unknown>
  const escalones = Array.isArray(o.escalones) ? o.escalones.map(leerEscalon) : []
  if (escalones.length < 2 || escalones.some((e) => !e)) return null
  const subir = numero(o.subir, 1, 100) ?? SUBIR_DEFECTO
  const bajar = Math.min(numero(o.bajar, 0, 100) ?? BAJAR_DEFECTO, subir)
  return {
    activo: o.activo === true,
    modo: o.modo === 'menor_a_mayor' ? 'menor_a_mayor' : 'mayor_a_menor',
    observacion: o.observacion === true,
    seleccionOida: o.seleccionOida === true,
    escalones: escalones as Escalon[],
    subir,
    bajar,
    tamano: o.tamano === true,
  }
}

// El último escalón tiene que ser el de sin apoyo: campo completo, distractores
// al 100 % y sin ayuda (si no, el dominio nunca se alcanzaría sin apoyo)
export function errorConfig(c: ConfigSinError): string | null {
  if (c.modo === 'menor_a_mayor') return null
  const final = c.escalones[c.escalones.length - 1]
  if (final.comparaciones !== null || final.opacidad < 1 || final.demora !== null) {
    return 'El último escalón debe ser sin apoyo: todas las opciones, distractores al 100 % y sin ayuda.'
  }
  if (c.bajar >= c.subir) return 'El umbral para bajar tiene que ser menor que el de subir.'
  return null
}

export function leerEscalonBloque(valor: Json | null | undefined): EscalonBloque | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const o = valor as Record<string, unknown>
  const base = leerEscalon(o)
  if (!base || typeof o.indice !== 'number' || typeof o.aciertos_con_apoyo !== 'number') return null
  return { ...base, indice: o.indice, total: Number(o.total) || 0, final: o.final === true, aciertos_con_apoyo: o.aciertos_con_apoyo }
}

export type Movimiento = 'sube' | 'repite' | 'baja'

// Escalón del siguiente bloque a partir del último hecho con el procedimiento
export function siguienteEscalon(c: ConfigSinError, ultimo: EscalonBloque | null): { indice: number; movimiento: Movimiento | null } {
  const max = c.escalones.length - 1
  if (!ultimo) return { indice: 0, movimiento: null }
  const actual = Math.min(Math.max(ultimo.indice, 0), max)
  if (ultimo.aciertos_con_apoyo >= c.subir) return { indice: Math.min(actual + 1, max), movimiento: actual < max ? 'sube' : 'repite' }
  if (ultimo.aciertos_con_apoyo < c.bajar) return { indice: Math.max(actual - 1, 0), movimiento: actual > 0 ? 'baja' : 'repite' }
  return { indice: actual, movimiento: 'repite' }
}

const pct = (x: number) => `${Math.round(x * 100)} %`

export function describirEscalon(e: Escalon): string {
  if (e.comparaciones === 1) return 'solo la opción correcta'
  const partes = [
    e.comparaciones === null ? 'todas las opciones' : e.comparaciones === 1 ? 'solo la correcta' : `${e.comparaciones} opciones`,
  ]
  if (e.comparaciones !== 1 && e.opacidad < 1) partes.push(`distractores al ${pct(e.opacidad)}`)
  partes.push(e.demora === null ? 'sin ayuda' : e.demora === 0 ? 'ayuda inmediata' : `ayuda a ${e.demora} s`)
  return partes.join(' · ')
}

export function textoMovimiento(m: Movimiento, siguiente: Escalon): string {
  if (m === 'sube') return `Sube a «${siguiente.nombre}»`
  if (m === 'baja') return `Baja a «${siguiente.nombre}»`
  return `Repite «${siguiente.nombre}»`
}

// --- De menor a mayor dentro del ensayo ---

export const NIVELES_MENOR_A_MAYOR = [
  'Repetir la muestra',
  'Quitar un distractor',
  'Atenuar los distractores',
  'Resaltar la correcta',
  'Solo la correcta',
] as const
export const OPACIDAD_ATENUADA = 0.3

// Cómo se presenta un ensayo con d distractores en el nivel n (0 = sin ayuda)
export function presentacionNivel(n: number, d: number) {
  return {
    distractoresVisibles: n >= 5 ? 0 : n >= 2 ? Math.max(d - 1, 0) : d,
    opacidad: n >= 3 ? OPACIDAD_ATENUADA : 1,
    resaltar: n >= 4,
  }
}

// Nivel tras un error: el siguiente, saltando los que ya no cambian nada (si
// al quitar un distractor solo queda la correcta, se pasa a «Solo la correcta»)
export function siguienteNivel(n: number, d: number): number {
  const m = Math.min(n + 1, 5)
  return m < 5 && presentacionNivel(m, d).distractoresVisibles === 0 ? 5 : m
}
