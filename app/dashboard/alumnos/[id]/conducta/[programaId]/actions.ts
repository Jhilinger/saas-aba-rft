'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearRegistroAbc(
  programaAlumnoId: string,
  alumnoId: string,
  datos: { antecedente: string; conducta: string; consecuencia: string; notas?: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (!datos.antecedente.trim() || !datos.conducta.trim() || !datos.consecuencia.trim()) {
    return { error: 'Antecedente, conducta y consecuencia son obligatorios' }
  }

  const { error } = await supabase.from('registros_abc').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    antecedente: datos.antecedente.trim(),
    conducta: datos.conducta.trim(),
    consecuencia: datos.consecuencia.trim(),
    notas: datos.notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarRegistroAbc(registroId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('registros_abc').delete().eq('id', registroId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}

async function obtenerFase(supabase: any, programaAlumnoId: string) {
  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('estado')
    .eq('id', programaAlumnoId)
    .single()
  return programa?.estado === 'linea_base' ? 'linea_base' : 'intervencion'
}

export async function guardarBloqueTasa(
  programaAlumnoId: string,
  alumnoId: string,
  duracionObservacionSegundos: number,
  numeroOcurrencias: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_tasa').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    duracion_observacion_segundos: duracionObservacionSegundos,
    numero_ocurrencias: numeroOcurrencias,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarBloqueTasa(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_tasa').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}

export async function guardarBloqueDuracion(
  programaAlumnoId: string,
  alumnoId: string,
  duracionSesionSegundos: number,
  numeroEpisodios: number,
  duracionTotalConductaSegundos: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_duracion').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    duracion_sesion_segundos: duracionSesionSegundos,
    numero_episodios: numeroEpisodios,
    duracion_total_conducta_segundos: duracionTotalConductaSegundos,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarBloqueDuracion(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_duracion').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta/${programaAlumnoId}`)
  return { success: true }
}