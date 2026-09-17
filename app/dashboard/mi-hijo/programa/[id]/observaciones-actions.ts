'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearObservacion(
  programaAlumnoId: string,
  texto: string,
  consiguio: boolean | null,
  fechaEvento: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (!texto.trim()) return { error: 'Cuenta un poco qué pasó' }

  const { error } = await supabase.from('observaciones_familia').insert({
    programa_alumno_id: programaAlumnoId,
    perfil_id: user.id,
    texto: texto.trim(),
    consiguio,
    fecha_evento: fechaEvento || new Date().toISOString().split('T')[0],
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/mi-hijo/programa/${programaAlumnoId}`)
  return { success: true }
}
