'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { Tables } from '@/database.types'

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

// --- CLASES ---

export async function crearClase(programaAlumnoId: string, nombre: string, grupo: string) {
  const supabase = await createClient()

  // El tipo de relación se hereda del programa (currículo base). Si el
  // programa es 100% personalizado (sin plantilla), usamos 'coordinacion'
  // como valor por defecto razonable.
  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('programa_base_id, programas_base(tipo_relacion)')
    .eq('id', programaAlumnoId)
    .single()

  const programaBase = programa?.programas_base as unknown as Pick<
    Tables<'programas_base'>,
    'tipo_relacion'
  > | null

  const tipoRelacion = programaBase?.tipo_relacion ?? 'coordinacion'

  const { error } = await supabase.from('clases_rft').insert({
    programa_alumno_id: programaAlumnoId,
    nombre,
    grupo,
    tipo_relacion: tipoRelacion,
  })

  if (error) {
    // 23505 = violación de restricción única (nombre repetido en el mismo grupo)
    if (error.code === '23505') {
      return { error: `Ya existe una clase llamada "${nombre}" en "${grupo}". Elige otro nombre.` }
    }
    return { error: error.message }
  }

  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarClase(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('clases_rft').delete().eq('id', id)
  if (error) {
    // 23503 = violación de clave foránea: la clase tiene ensayos o
    // relaciones entrenadas registradas
    if (error.code === '23503') {
      return { error: 'tiene_datos' }
    }
    return { error: error.message }
  }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarClaseForzado(id: string, programaAlumnoId: string) {
  if (!(await puedeAccederPrograma(programaAlumnoId))) return { error: 'No autorizado' }

  // Los ensayos, relaciones entrenadas y bloques ya registrados son datos
  // históricos de solo lectura para el terapeuta (no hay política RLS de
  // borrado sobre ellos), así que el borrado forzado usa el cliente admin.
  const admin = createAdminClient()

  const { error: detalleError } = await admin.from('ensayos_rft_detalle').delete().eq('clase_id', id)
  if (detalleError) return { error: detalleError.message }

  const { error: relacionesError } = await admin.from('relaciones_entrenadas_rft').delete().eq('clase_id', id)
  if (relacionesError) return { error: relacionesError.message }

  const { error: estimulosError } = await admin.from('estimulos_rft').delete().eq('clase_id', id)
  if (estimulosError) return { error: estimulosError.message }

  const supabase = await createClient()
  const { error } = await supabase.from('clases_rft').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

// --- ESTÍMULOS DE LA CLASE ---

export async function crearEstimuloRft(
  claseId: string,
  programaAlumnoId: string,
  nombre: string,
  descripcion: string,
  posicion: string
) {
  const supabase = await createClient()

  // La etiqueta se genera sola: posición + número que lleve el nombre de la clase
  // (ej. clase "Clase 1" + posición A → etiqueta "A1")
  const { data: clase } = await supabase
    .from('clases_rft')
    .select('nombre')
    .eq('id', claseId)
    .single()

  const numero = clase?.nombre.match(/(\d+)\s*$/)?.[1] ?? ''
  const etiqueta = posicion + numero

  const { error } = await supabase
    .from('estimulos_rft')
    .insert({ clase_id: claseId, etiqueta, nombre, descripcion, posicion })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarEstimuloRft(id: string, programaAlumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('estimulos_rft').delete().eq('id', id)
  if (error) {
    // 23503 = violación de clave foránea: el estímulo se usó en ensayos o
    // en una relación entrenada
    if (error.code === '23503') {
      return { error: 'tiene_datos' }
    }
    return { error: error.message }
  }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarEstimuloRftForzado(id: string, programaAlumnoId: string) {
  if (!(await puedeAccederPrograma(programaAlumnoId))) return { error: 'No autorizado' }

  const admin = createAdminClient()

  const { error: detalleOrigenError } = await admin
    .from('ensayos_rft_detalle')
    .delete()
    .eq('estimulo_origen_id', id)
  if (detalleOrigenError) return { error: detalleOrigenError.message }

  const { error: detalleDestinoError } = await admin
    .from('ensayos_rft_detalle')
    .delete()
    .eq('estimulo_destino_id', id)
  if (detalleDestinoError) return { error: detalleDestinoError.message }

  const { error: relOrigenError } = await admin
    .from('relaciones_entrenadas_rft')
    .delete()
    .eq('estimulo_origen_id', id)
  if (relOrigenError) return { error: relOrigenError.message }

  const { error: relDestinoError } = await admin
    .from('relaciones_entrenadas_rft')
    .delete()
    .eq('estimulo_destino_id', id)
  if (relDestinoError) return { error: relDestinoError.message }

  const supabase = await createClient()
  const { error } = await supabase.from('estimulos_rft').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

// --- RELACIONES ENTRENADAS ---

export async function crearRelacionEntrenada(
  claseId: string,
  programaAlumnoId: string,
  estimuloOrigenId: string,
  estimuloDestinoId: string
) {
  const supabase = await createClient()
  const { error } = await supabase.from('relaciones_entrenadas_rft').insert({
    clase_id: claseId,
    estimulo_origen_id: estimuloOrigenId,
    estimulo_destino_id: estimuloDestinoId,
  })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}

export async function eliminarRelacionEntrenada(id: string, programaAlumnoId: string) {
  if (!(await puedeAccederPrograma(programaAlumnoId))) return { error: 'No autorizado' }

  // Igual que los ensayos y bloques: no hay política RLS de borrado sobre
  // esta tabla, así que se usa el cliente admin.
  const admin = createAdminClient()
  const { error } = await admin.from('relaciones_entrenadas_rft').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}