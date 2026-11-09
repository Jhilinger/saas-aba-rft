'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { AVATARES } from '../avatares'

// Alta de un niño en una cuenta de familia o de escuela
export async function crearNino(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesión caducada' }
  const { data: perfil } = await supabase.from('perfiles').select('clinica_id, clinicas(tipo)').eq('id', user.id).single()
  const tipo = (perfil?.clinicas as { tipo: string } | null)?.tipo
  if (!perfil?.clinica_id || (tipo !== 'familia' && tipo !== 'escuela')) return { error: 'No autorizado' }

  const nombre = String(formData.get('nombre') ?? '').trim().slice(0, 30)
  const fecha = String(formData.get('fecha_nacimiento') ?? '')
  const clave = String(formData.get('avatar') ?? '')
  if (!nombre) return { error: 'Escribe el nombre del niño o la niña.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { error: 'Indica la fecha de nacimiento.' }
  if (!AVATARES[clave]) return { error: 'Elige un animal.' }

  const { error } = await supabase
    .from('alumnos')
    .insert({ clinica_id: perfil.clinica_id, nombre_anonimizado: nombre, fecha_nacimiento: fecha, avatar: clave })
  if (error) return { error: error.message }
  revalidatePath('/app')
  revalidatePath('/app/adultos')
  return { success: true }
}
