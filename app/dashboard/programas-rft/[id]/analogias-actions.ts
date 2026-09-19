'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { calcularDistribucionAyudas, type DistribucionAyuda } from '../../ayuda-tipos'
import type { Enums } from '@/database.types'

const RELACIONES_VALIDAS = ['coordinacion', 'distincion', 'oposicion', 'comparacion', 'jerarquia', 'temporal', 'causal', 'deictica'] as const

function revalidarAnalogias(programaAlumnoId: string) {
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  revalidatePath(`/dashboard/mi-hijo/programa-rft/${programaAlumnoId}`)
  revalidatePath(`/dashboard/tomar-datos/rft/${programaAlumnoId}`)
}

function parseRelacion(value: string): Enums<'tipo_relacion_rft'> | null {
  return (RELACIONES_VALIDAS as readonly string[]).includes(value) ? (value as Enums<'tipo_relacion_rft'>) : null
}

// --- GESTIÓN DE ANALOGÍAS (contenido) ---

export async function crearAnalogiaAlumno(
  programaAlumnoId: string,
  datos: {
    par1TerminoA: string
    par1TerminoB: string
    par1Relacion: string
    par2TerminoA: string
    par2TerminoB: string
    par2Relacion: string
  }
) {
  const supabase = await createClient()

  const par1Relacion = parseRelacion(datos.par1Relacion)
  const par2Relacion = parseRelacion(datos.par2Relacion)
  if (
    !datos.par1TerminoA.trim() || !datos.par1TerminoB.trim() ||
    !datos.par2TerminoA.trim() || !datos.par2TerminoB.trim() ||
    !par1Relacion || !par2Relacion
  ) {
    return { error: 'Rellena los 4 términos y las 2 relaciones' }
  }

  const { count } = await supabase
    .from('analogias_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('programa_alumno_id', programaAlumnoId)

  const { error } = await supabase.from('analogias_alumno').insert({
    programa_alumno_id: programaAlumnoId,
    nombre: `Analogía ${(count ?? 0) + 1}`,
    par1_termino_a: datos.par1TerminoA.trim(),
    par1_termino_b: datos.par1TerminoB.trim(),
    par1_relacion: par1Relacion,
    par2_termino_a: datos.par2TerminoA.trim(),
    par2_termino_b: datos.par2TerminoB.trim(),
    par2_relacion: par2Relacion,
    orden: (count ?? 0) + 1,
  })
  if (error) return { error: error.message }
  revalidarAnalogias(programaAlumnoId)
  return { success: true }
}

export async function eliminarAnalogiaAlumno(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('analogias_alumno').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidarAnalogias(programaAlumnoId)
  return { success: true }
}

// --- TOMA DE DATOS ---

async function obtenerFase(supabase: Awaited<ReturnType<typeof createClient>>, programaAlumnoId: string) {
  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('estado')
    .eq('id', programaAlumnoId)
    .single()
  return programa?.estado === 'linea_base' ? 'linea_base' : 'intervencion'
}

export async function guardarBloqueAnalogias(
  programaAlumnoId: string,
  resultados: { analogiaId: string; respuestaDada: 'igual' | 'distinta'; correcto: boolean; ayuda: string }[],
  tipoSonda: 'normal' | 'generalizacion' | 'mantenimiento',
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (resultados.length === 0) return { error: 'No hay ensayos que guardar' }

  const fase = tipoSonda === 'normal' ? await obtenerFase(supabase, programaAlumnoId) : tipoSonda
  const aciertos = resultados.filter((r) => r.correcto).length

  const { data: bloque, error } = await supabase
    .from('bloques_analogias')
    .insert({
      programa_alumno_id: programaAlumnoId,
      terapeuta_id: user.id,
      fase,
      total_ensayos: resultados.length,
      aciertos,
      notas: notas?.trim() || null,
    })
    .select('id')
    .single()

  if (error || !bloque) return { error: error?.message ?? 'Error guardando el bloque' }

  const { error: detalleError } = await supabase.from('ensayos_analogias_detalle').insert(
    resultados.map((r) => ({
      bloque_id: bloque.id,
      analogia_id: r.analogiaId,
      respuesta_dada: r.respuestaDada,
      correcto: r.correcto,
      ayuda: r.ayuda as Enums<'tipo_ayuda'>,
    }))
  )
  if (detalleError) return { error: detalleError.message }

  revalidarAnalogias(programaAlumnoId)
  return { success: true, porcentaje: Math.round((aciertos / resultados.length) * 100) }
}

export async function obtenerEvolucionAnalogias(programaAlumnoId: string) {
  const supabase = await createClient()

  const { data: bloques } = await supabase
    .from('bloques_analogias')
    .select('fecha, fase, porcentaje, ensayos_analogias_detalle(ayuda)')
    .eq('programa_alumno_id', programaAlumnoId)
    .order('fecha', { ascending: true })

  const puntos = (bloques ?? [])
    .filter((b): b is typeof b & { fase: 'linea_base' | 'intervencion'; porcentaje: number } =>
      b.porcentaje !== null && ['linea_base', 'intervencion'].includes(b.fase)
    )
    .map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))

  const todosLosEnsayos = (bloques ?? []).flatMap((b) => b.ensayos_analogias_detalle)
  const distribucion: DistribucionAyuda[] = calcularDistribucionAyudas(
    todosLosEnsayos as { ayuda: Enums<'tipo_ayuda'> | null }[]
  )

  return { puntos, distribucion }
}
