'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

  const tipoRelacion = (programa?.programas_base as any)?.tipo_relacion ?? 'coordinacion'

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
  const supabase = await createClient()
  const { error } = await supabase.from('relaciones_entrenadas_rft').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  return { success: true }
}