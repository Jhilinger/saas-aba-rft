'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Enums } from '@/database.types'

function revalidarAnalisisTareas(programaAlumnoId: string) {
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/mi-hijo/programa/${programaAlumnoId}`)
}

export async function crearPasoAlumno(programaAlumnoId: string, nombre: string, descripcion: string) {
  const supabase = await createClient()
  if (!nombre.trim()) return { error: 'El nombre del paso es obligatorio' }

  const { count } = await supabase
    .from('pasos_tarea_alumno')
    .select('id', { count: 'exact', head: true })
    .eq('programa_alumno_id', programaAlumnoId)

  const { error } = await supabase.from('pasos_tarea_alumno').insert({
    programa_alumno_id: programaAlumnoId,
    nombre: nombre.trim(),
    descripcion: descripcion.trim() || null,
    orden: (count ?? 0) + 1,
  })
  if (error) return { error: error.message }
  revalidarAnalisisTareas(programaAlumnoId)
  return { success: true }
}

export async function eliminarPasoAlumno(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pasos_tarea_alumno').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidarAnalisisTareas(programaAlumnoId)
  return { success: true }
}

export async function cambiarEstadoPaso(
  id: string,
  programaAlumnoId: string,
  estado: Enums<'estado_programa_alumno'>
) {
  const supabase = await createClient()
  const { error } = await supabase.from('pasos_tarea_alumno').update({ estado }).eq('id', id)
  if (error) return { error: error.message }
  revalidarAnalisisTareas(programaAlumnoId)
  return { success: true }
}

export async function guardarBloqueAnalisisTareas(
  programaAlumnoId: string,
  resultados: { pasoId: string; independiente: boolean }[],
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (resultados.length === 0) return { error: 'No hay pasos que registrar' }

  const { data: bloque, error } = await supabase
    .from('bloques_analisis_tareas')
    .insert({ programa_alumno_id: programaAlumnoId, terapeuta_id: user.id, notas: notas?.trim() || null })
    .select('id')
    .single()

  if (error) return { error: error.message }

  const { error: errorResultados } = await supabase.from('resultados_paso_bloque').insert(
    resultados.map((r) => ({ bloque_id: bloque.id, paso_id: r.pasoId, independiente: r.independiente }))
  )
  if (errorResultados) return { error: errorResultados.message }

  revalidarAnalisisTareas(programaAlumnoId)
  return { success: true }
}
