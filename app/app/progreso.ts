import type { createClient } from '@/utils/supabase/server'
import { MODULOS, type ClaveModulo } from './modulos'

// Progreso de un niño en la app infantil, en lenguaje para familias: qué
// reconoce en cada módulo (contando los elementos de los grupos cuyo
// entrenamiento domina), los conceptos básicos por niveles y cuántas
// relaciones ha descubierto solo (derivadas en un test sin ayudas) frente a
// las que ha aprendido practicando.

type Supabase = Awaited<ReturnType<typeof createClient>>

const CONCEPTOS: Record<string, string> = {
  'Abstraer Claves de Distinción': 'Igual y diferente',
  'Abstraer Claves de Comparación': 'Más y menos',
  'Abstraer Claves de Oposición': 'El contrario',
  'Abstraer Claves Espaciales': 'Encima, debajo, dentro…',
  'Abstraer Claves Temporales': 'Antes y después',
}

// Qué cuenta cada programa en el resumen (los que repiten elementos, como
// letras con su nombre y con su grafía, se cuentan una vez: el máximo)
function categoria(nombre: string): string | null {
  if (/Letras/.test(nombre)) return 'letras'
  if (/Sílabas/.test(nombre)) return 'sílabas'
  if (/Oraciones/.test(nombre)) return 'oraciones'
  if (/Palabras/.test(nombre)) return 'palabras escritas'
  if (/Números/.test(nombre)) return 'números'
  if (/^Vincular Mutuamente/.test(nombre)) return 'palabras'
  if (/^Responder a Preguntas/.test(nombre)) return 'preguntas'
  if (nombre === 'Igualar Imágenes') return 'imágenes iguales'
  return null
}

function frase(cat: string, n: number) {
  if (cat === 'imágenes iguales') return `Empareja imágenes iguales (${n})`
  if (cat === 'preguntas') return `Responde a ${n} preguntas`
  if (cat === 'oraciones') return `Lee ${n} oraciones`
  return `Reconoce ${n} ${cat}`
}

export type ProgresoModulo = { clave: ClaveModulo; nombre: string; emoji: string; sesiones: number; logros: string[]; conceptos: { nombre: string; dominados: number; total: number }[] }
export type ProgresoNino = { modulos: ProgresoModulo[]; descubiertas: number; practicadas: number; minutosSemana: number; sesionesPorModulo: Record<string, number> }

export async function progresoNino(supabase: Supabase, alumnoId: string): Promise<ProgresoNino> {
  const nombres = MODULOS.flatMap((m) => m.programas)
  const [{ data: bases }, { data: copias }] = await Promise.all([
    supabase.from('programas_base').select('id, nombre').is('clinica_id', null).in('nombre', nombres),
    supabase.from('programas_alumno').select('id, programa_base_id, actividad_tablet').eq('alumno_id', alumnoId),
  ])
  const nombreBase = new Map((bases ?? []).map((b) => [b.id, b.nombre]))
  const lista = (copias ?? []).filter((c) => c.programa_base_id && nombreBase.has(c.programa_base_id))
  const ids = lista.map((c) => c.id)
  const vacio = ids.length === 0
  const [{ data: clases }, { data: dominio }, { data: bloques }] = await Promise.all([
    vacio ? Promise.resolve({ data: [] }) : supabase.from('clases_rft').select('programa_alumno_id, grupo').in('programa_alumno_id', ids),
    vacio
      ? Promise.resolve({ data: [] })
      : supabase.from('dominio_rft_fases').select('programa_alumno_id, grupo, fase, via_entrenamiento').in('programa_alumno_id', ids).eq('dominado', true),
    vacio ? Promise.resolve({ data: [] }) : supabase.from('bloques_ensayo_rft').select('programa_alumno_id, fecha, duracion_segundos').in('programa_alumno_id', ids),
  ])

  const haceUnaSemana = Date.now() - 7 * 24 * 3600 * 1000
  const minutosSemana = Math.round(
    (bloques ?? []).filter((b) => new Date(b.fecha).getTime() >= haceUnaSemana).reduce((s, b) => s + (b.duracion_segundos ?? 0), 0) / 60
  )
  const tests = (dominio ?? []).filter((d) => d.fase !== 'entrenamiento')

  const sesionesPorModulo: Record<string, number> = {}
  const modulos = MODULOS.map((m) => {
    const copiasModulo = lista.filter((c) => m.programas.includes(nombreBase.get(c.programa_base_id!)!))
    const idsModulo = new Set(copiasModulo.map((c) => c.id))
    const sesiones = (bloques ?? []).filter((b) => idsModulo.has(b.programa_alumno_id)).length
    sesionesPorModulo[m.clave] = sesiones

    const porCategoria = new Map<string, number>()
    const conceptos: ProgresoModulo['conceptos'] = []
    for (const c of copiasModulo) {
      const nombre = nombreBase.get(c.programa_base_id!)!
      const dominados = (dominio ?? []).filter((d) => d.programa_alumno_id === c.id && d.fase === 'entrenamiento')
      if (CONCEPTOS[nombre]) {
        const niveles = Array.isArray((c.actividad_tablet as { niveles?: unknown[] } | null)?.niveles) ? (c.actividad_tablet as { niveles: unknown[] }).niveles.length : 0
        conceptos.push({ nombre: CONCEPTOS[nombre], dominados: new Set(dominados.map((d) => d.grupo)).size, total: niveles })
        continue
      }
      const cat = categoria(nombre)
      if (!cat) continue
      const gruposDominados = new Set(dominados.map((d) => d.grupo))
      const elementos = (clases ?? []).filter((k) => k.programa_alumno_id === c.id && gruposDominados.has(k.grupo)).length
      porCategoria.set(cat, Math.max(porCategoria.get(cat) ?? 0, elementos))
    }
    // Las palabras de vocabulario se suman entre programas (animales, alimentos…)
    const palabras = copiasModulo
      .filter((c) => categoria(nombreBase.get(c.programa_base_id!)!) === 'palabras')
      .reduce((s, c) => {
        const grupos = new Set((dominio ?? []).filter((d) => d.programa_alumno_id === c.id && d.fase === 'entrenamiento').map((d) => d.grupo))
        return s + (clases ?? []).filter((k) => k.programa_alumno_id === c.id && grupos.has(k.grupo)).length
      }, 0)
    if (palabras) porCategoria.set('palabras', palabras)

    const logros = [...porCategoria].filter(([, n]) => n > 0).map(([cat, n]) => frase(cat, n))
    return { clave: m.clave, nombre: m.nombre, emoji: m.emoji, sesiones, logros, conceptos }
  })

  return {
    modulos,
    descubiertas: tests.filter((d) => !d.via_entrenamiento).length,
    practicadas: tests.filter((d) => d.via_entrenamiento).length,
    minutosSemana,
    sesionesPorModulo,
  }
}
