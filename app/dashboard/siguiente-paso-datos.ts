import type { createClient } from '@/utils/supabase/server'
import { siguientesPasos, type BloquePaso, type DatosPaso, type DominioPaso, type Forma, type Paso } from './siguiente-paso'
import { secuenciaDelGrupo } from './secuencia-rft'
import { coerceNivelRft } from './niveles-rft'
import { leerActividadConceptos } from './conceptos'
import { leerSinError } from './sin-error'
import { claveTemporal, ordenMencion } from './claves-temporales'
import { etiquetaClave } from './etiqueta-clave'

type Supabase = Awaited<ReturnType<typeof createClient>>

const AVISO_PUNTOS = 20
const AVISO_MINIMO = 5

type Cuenta = { aciertos: number; total: number }
const pct = (c: Cuenta) => (c.aciertos / c.total) * 100

// Una cuenta por etiqueta; devuelve la etiqueta que queda ≥20 puntos por debajo de otra
function claveBaja(filas: { etiqueta: string; correcto: boolean }[]): string | null {
  const cuentas = new Map<string, Cuenta>()
  for (const f of filas) {
    const c = cuentas.get(f.etiqueta) ?? { aciertos: 0, total: 0 }
    c.total++
    if (f.correcto) c.aciertos++
    cuentas.set(f.etiqueta, c)
  }
  const fiables = [...cuentas.entries()].filter(([, c]) => c.total >= AVISO_MINIMO).sort(([, a], [, b]) => pct(a) - pct(b))
  if (fiables.length < 2) return null
  return pct(fiables.at(-1)![1]) - pct(fiables[0][1]) >= AVISO_PUNTOS ? fiables[0][0] : null
}

// Siguientes pasos de un programa RFT del alumno, calculados con sus datos
export async function cargarSiguientesPasos(supabase: Supabase, programaAlumnoId: string): Promise<Paso[]> {
  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, alumno_id, nivel_rft, secuencia_rft, porcentaje_dominio, sin_error, actividad_tablet, programa_base_id, programas_base(nombre, tipo_relacion, dominio_id, orden, dominios_curriculo(nivel))')
    .eq('id', programaAlumnoId)
    .single()
  if (!programa) return []

  const actividad = leerActividadConceptos(programa.actividad_tablet)
  const base = programa.programas_base
  const temporal = base?.tipo_relacion === 'temporal' && !actividad

  const [{ data: clases }, { data: bloques }, { data: dominio }, { data: requisitos }, { data: anteriores }] = await Promise.all([
    supabase.from('clases_rft').select('grupo, estimulos_rft(posicion)').eq('programa_alumno_id', programaAlumnoId),
    supabase
      .from('bloques_ensayo_rft')
      .select('fecha, fase, grupo, posicion_origen, posicion_destino, forma_respuesta, porcentaje, apoyo_visual, ensayos_rft_detalle(correcto, ayuda, tipo_ensayo, pregunta, generado)')
      .eq('programa_alumno_id', programaAlumnoId)
      .order('fecha', { ascending: true })
      .limit(500),
    supabase
      .from('dominio_rft_fases')
      .select('grupo, fase, posicion_origen, posicion_destino, forma_respuesta, dominado, via_entrenamiento')
      .eq('programa_alumno_id', programaAlumnoId),
    programa.programa_base_id
      ? supabase.from('requisitos_programa').select('requisito_id, programas_base!requisitos_programa_requisito_id_fkey(nombre)').eq('programa_base_id', programa.programa_base_id)
      : Promise.resolve({ data: [] as { requisito_id: string; programas_base: { nombre: string } | null }[] }),
    base?.dominio_id != null && base.orden != null
      ? supabase
          .from('programas_base')
          .select('nombre, orden')
          .eq('dominio_id', base.dominio_id)
          .eq('activo', true)
          .lt('orden', base.orden)
          .order('orden', { ascending: false })
          .limit(1)
      : Promise.resolve({ data: [] as { nombre: string; orden: number | null }[] }),
  ])

  // Requisitos sin dominar: los que el alumno no tiene en su PEI como dominados o en mantenimiento
  let requisitosPendientes: string[] = []
  if (requisitos?.length) {
    const { data: delAlumno } = await supabase
      .from('programas_alumno')
      .select('programa_base_id, estado')
      .eq('alumno_id', programa.alumno_id)
      .in(
        'programa_base_id',
        requisitos.map((r) => r.requisito_id)
      )
    const hechos = new Set((delAlumno ?? []).filter((p) => p.estado === 'dominado' || p.estado === 'mantenimiento').map((p) => p.programa_base_id))
    requisitosPendientes = requisitos.filter((r) => !hechos.has(r.requisito_id)).map((r) => r.programas_base?.nombre ?? '').filter(Boolean)
  }

  // Grupos y su secuencia
  const posiciones = new Map<string, string[]>()
  for (const c of clases ?? []) {
    if (!c.grupo) continue
    const lista = posiciones.get(c.grupo) ?? []
    lista.push(...c.estimulos_rft.flatMap((e) => (e.posicion ? [e.posicion] : [])))
    posiciones.set(c.grupo, lista)
  }
  const nivel = coerceNivelRft(programa.nivel_rft)
  const secuencias = actividad
    ? actividad.niveles.map((n) => ({ grupo: n.nombre, pasos: [{ fase: 'entrenamiento' as const, origen: 'A', destino: 'A' }] }))
    : [...posiciones.entries()].map(([grupo, pos]) => ({ grupo, pasos: secuenciaDelGrupo(programa.secuencia_rft, nivel, pos) }))

  const forma = (f: string): Forma => (f === 'hablante' ? 'hablante' : 'oyente')
  const conGrupo = (bloques ?? []).filter((b) => b.grupo && b.porcentaje !== null)
  const bloquesPaso: BloquePaso[] = conGrupo.map((b) => ({
    fecha: b.fecha,
    fase: b.fase,
    grupo: b.grupo as string,
    origen: b.posicion_origen ?? '',
    destino: b.posicion_destino ?? '',
    forma: forma(b.forma_respuesta),
    porcentaje: Math.round(Number(b.porcentaje)),
    apoyoVisual: b.apoyo_visual,
    conAyudas: b.ensayos_rft_detalle.some((e) => e.tipo_ensayo === 'principal' && e.correcto && e.ayuda !== 'independiente'),
  }))
  const dominioPaso: DominioPaso[] = (dominio ?? []).map((x) => ({
    grupo: x.grupo,
    fase: x.fase,
    origen: x.posicion_origen,
    destino: x.posicion_destino,
    forma: forma(x.forma_respuesta),
    dominado: x.dominado,
    viaEntrenamiento: x.via_entrenamiento,
  }))

  // Patrones de error: clave más baja (abstracción generada: por nivel; temporales:
  // antes/después por grupo) y orden de mención inverso en los temporales
  const clavesBajas: { grupo: string; clave: string }[] = []
  const ordenInversoBajo: string[] = []
  for (const { grupo } of secuencias) {
    for (const f of ['oyente', 'hablante'] as const) {
      const delGrupo = conGrupo.filter((b) => b.grupo === grupo && forma(b.forma_respuesta) === f && !b.apoyo_visual && b.fase !== 'generalizacion' && b.fase !== 'mantenimiento')
      const ensayos = delGrupo.flatMap((b) => b.ensayos_rft_detalle.filter((e) => e.tipo_ensayo === 'principal'))
      const sufijo = f === 'hablante' ? ' (como hablante)' : ''
      if (actividad) {
        const baja = claveBaja(ensayos.map((e) => ({ etiqueta: (e.generado as { clave?: string } | null)?.clave ?? '', correcto: e.correcto })).filter((x) => x.etiqueta))
        if (baja) clavesBajas.push({ grupo, clave: `«${etiquetaClave(baja)}»${sufijo}` })
      } else if (temporal) {
        const texto = (e: (typeof ensayos)[number]) => e.pregunta ?? (e.generado as { consigna?: string } | null)?.consigna
        const baja = claveBaja(ensayos.flatMap((e) => (claveTemporal(texto(e)) ? [{ etiqueta: claveTemporal(texto(e))!, correcto: e.correcto }] : [])))
        if (baja) clavesBajas.push({ grupo, clave: `«${baja === 'despues' ? 'después' : 'antes'}»${sufijo}` })
        const orden = claveBaja(ensayos.flatMap((e) => (ordenMencion(texto(e)) ? [{ etiqueta: ordenMencion(texto(e))!, correcto: e.correcto }] : [])))
        if (orden === 'inverso') ordenInversoBajo.push(grupo)
      }
    }
  }

  const datos: DatosPaso = {
    bloques: bloquesPaso,
    dominio: dominioPaso,
    secuencias,
    porcentajeDominio: programa.porcentaje_dominio,
    // Verbales del nivel 3 (no la abstracción generada): admiten fichas iguales
    conFichas: base?.dominios_curriculo?.nivel === 3 && !actividad && !(base?.nombre ?? '').startsWith('Abstraer Claves'),
    sinErrorActivo: !!leerSinError(programa.sin_error)?.activo,
    requisitosPendientes,
    programaAnterior: anteriores?.[0]?.nombre ?? null,
    clavesBajas,
    ordenInversoBajo: [...new Set(ordenInversoBajo)],
  }
  const pasos = siguientesPasos(datos)
  // En la abstracción generada el bloque se prepara en su propia pantalla
  return actividad ? pasos.map((p) => ({ ...p, accion: undefined })) : pasos
}
