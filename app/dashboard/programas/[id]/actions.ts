'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// Confirma (con el cliente normal, sujeto a RLS) que el usuario autenticado
// puede ver este programa antes de usar el cliente admin para el borrado en
// cascada — así el admin client nunca actúa sobre un programa al que el
// usuario no tendría acceso.
async function puedeAccederPrograma(programaAlumnoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('programas_alumno').select('id').eq('id', programaAlumnoId).maybeSingle()
  return !!data
}

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
  if (error) {
    // 23503 = violación de clave foránea: el conjunto (o alguno de sus
    // estímulos) tiene bloques/ensayos registrados
    if (error.code === '23503') {
      return { error: 'tiene_datos' }
    }
    return { error: error.message }
  }
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarConjuntoAlumnoForzado(id: string, programaAlumnoId: string) {
  if (!(await puedeAccederPrograma(programaAlumnoId))) return { error: 'No autorizado' }

  // Los ensayos y bloques ya registrados son datos históricos de solo
  // lectura para el terapeuta (no hay política RLS de borrado sobre ellos),
  // así que el borrado forzado usa el cliente admin para esa limpieza.
  const admin = createAdminClient()

  const { data: estimulos } = await admin.from('estimulos_alumno').select('id').eq('conjunto_id', id)
  const estimuloIds = (estimulos ?? []).map((e) => e.id)
  if (estimuloIds.length > 0) {
    const { error: detalleError } = await admin
      .from('ensayos_aba_detalle')
      .delete()
      .in('estimulo_id', estimuloIds)
    if (detalleError) return { error: detalleError.message }
  }

  const { error: bloquesError } = await admin.from('bloques_ensayo').delete().eq('conjunto_id', id)
  if (bloquesError) return { error: bloquesError.message }

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
  if (!(await puedeAccederPrograma(programaAlumnoId))) return { error: 'No autorizado' }

  const admin = createAdminClient()
  const { error: detalleError } = await admin
    .from('ensayos_aba_detalle')
    .delete()
    .eq('estimulo_id', id)
  if (detalleError) return { error: detalleError.message }

  const supabase = await createClient()
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
export async function actualizarEstadoPrograma(
  programaAlumnoId: string,
  alumnoId: string,
  estado: 'adquisicion' | 'mantenimiento' | 'dominado' | 'pausado'
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('programas_alumno')
    .update({ estado })
    .eq('id', programaAlumnoId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}/progreso`)
  return { success: true }
}