'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearPreferencia(
  alumnoId: string,
  nombre: string,
  tipo: string,
  fecha: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('preferencias_alumno').insert({
    alumno_id: alumnoId,
    nombre,
    tipo,
    fecha,
    creado_por: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function eliminarPreferencia(id: string, alumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('preferencias_alumno').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function listarPreferencias(alumnoId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('preferencias_alumno')
    .select('id, nombre, tipo, fecha, created_at')
    .eq('alumno_id', alumnoId)
    .order('fecha', { ascending: false })
  return data ?? []
}