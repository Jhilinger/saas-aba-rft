'use server'

import { createClient } from '@/utils/supabase/server'
import { puedeDisenar, SIN_PERMISO_DISENO } from '../../../permisos'
import { revalidatePath } from 'next/cache'

export async function guardarValoracion(
  alumnoId: string,
  programaBaseId: string,
  valoracion: 'dominado' | 'parcial' | 'no',
  notas?: string
) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('evaluaciones_iniciales').upsert(
    {
      alumno_id: alumnoId,
      programa_base_id: programaBaseId,
      valoracion,
      notas: notas?.trim() || null,
      evaluado_por: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'alumno_id,programa_base_id' }
  )

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function borrarValoracion(alumnoId: string, programaBaseId: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }

  const { error } = await supabase
    .from('evaluaciones_iniciales')
    .delete()
    .eq('alumno_id', alumnoId)
    .eq('programa_base_id', programaBaseId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// Marca como dominados, de una vez, los programas indicados que aún no tienen
// valoración (ej. los de los niveles por debajo del de inicio de la
// evaluación). No toca los ya valorados.
export async function marcarDominadosEnBloque(alumnoId: string, programaBaseIds: string[], motivo: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const texto = motivo.trim().slice(0, 200)
  if (!texto) return { error: 'Indica el motivo' }
  const ids = [...new Set(programaBaseIds)].slice(0, 300)
  if (ids.length === 0) return { success: true, marcados: 0 }

  const { data: yaValorados } = await supabase
    .from('evaluaciones_iniciales')
    .select('programa_base_id')
    .eq('alumno_id', alumnoId)
    .in('programa_base_id', ids)
  const valorados = new Set((yaValorados ?? []).map((v) => v.programa_base_id))
  const ahora = new Date().toISOString()
  const filas = ids
    .filter((id) => !valorados.has(id))
    .map((id) => ({
      alumno_id: alumnoId,
      programa_base_id: id,
      valoracion: 'dominado',
      notas: `Marcado en bloque: ${texto}`,
      evaluado_por: user.id,
      updated_at: ahora,
    }))

  if (filas.length) {
    const { error } = await supabase.from('evaluaciones_iniciales').insert(filas)
    if (error) return { error: error.message }
  }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`, 'layout')
  return { success: true, marcados: filas.length }
}
