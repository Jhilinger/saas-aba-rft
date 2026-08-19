'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearConjuntoAlumno(programaAlumnoId: string, nombre: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('conjuntos_estimulos_alumno')
    .insert({ programa_alumno_id: programaAlumnoId, nombre })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarConjuntoAlumno(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('conjuntos_estimulos_alumno').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}

export async function crearEstimuloAlumno(
  conjuntoId: string,
  programaAlumnoId: string,
  nombre: string,
  descripcion: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('estimulos_alumno')
    .insert({ conjunto_id: conjuntoId, nombre, descripcion })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarEstimuloAlumno(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('estimulos_alumno').delete().eq('id', id)
  if (error) {
    // 23503 = violación de clave foránea: el estímulo tiene ensayos registrados
    if (error.code === '23503') {
      return { error: 'tiene_datos' }
    }
    return { error: error.message }
  }
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarEstimuloAlumnoForzado(id: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error: detalleError } = await supabase
    .from('ensayos_aba_detalle')
    .delete()
    .eq('estimulo_id', id)
  if (detalleError) return { error: detalleError.message }

  const { error } = await supabase.from('estimulos_alumno').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}
export async function iniciarIntervencion(conjuntoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('conjuntos_estimulos_alumno')
    .update({ estado: 'adquisicion' })
    .eq('id', conjuntoId)
    .eq('estado', 'linea_base')

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}