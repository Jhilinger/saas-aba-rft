'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearProgramaConducta(
  alumnoId: string,
  datos: {
    nombre: string
    formatoRecogida: 'intervalo' | 'duracion' | 'tasa' | 'abc'
    direccionObjetivo?: 'aumentar' | 'reducir'
    objetivo?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (!datos.nombre.trim()) return { error: 'El nombre es obligatorio' }
  if (datos.formatoRecogida !== 'abc' && !datos.direccionObjetivo) {
    return { error: 'Indica si el objetivo es aumentar o reducir la conducta' }
  }

  const { data: programa, error } = await supabase
    .from('programas_alumno')
    .insert({
      alumno_id: alumnoId,
      nombre: datos.nombre.trim(),
      tipo: 'conducta',
      formato_recogida: datos.formatoRecogida,
      direccion_objetivo: datos.formatoRecogida === 'abc' ? null : datos.direccionObjetivo,
      objetivo: datos.objetivo?.trim() || null,
      terapeuta_id: user.id,
      estado: 'linea_base',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta`)
  return { success: true, id: programa.id }
}

export async function toggleVisibleFamilia(programaId: string, alumnoId: string, valor: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('programas_alumno')
    .update({ visible_familia: valor })
    .eq('id', programaId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/conducta`)
  return { success: true }
}