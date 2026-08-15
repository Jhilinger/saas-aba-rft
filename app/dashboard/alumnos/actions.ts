'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sincronizarAlumnosStripe } from '@/utils/stripe-sync'

async function getPerfilActual() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  return perfil
}

export async function crearAlumno(formData: FormData) {
  const supabase = await createClient()
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !perfilActual.clinica_id) {
    return { error: 'No autorizado' }
  }

  const nombre_anonimizado = formData.get('nombre_anonimizado') as string
  const fecha_nacimiento = formData.get('fecha_nacimiento') as string
  const terapeutaIds = formData.getAll('terapeuta_ids') as string[]
  const terapeutaPrincipalId = (formData.get('terapeuta_principal_id') as string) || null

  const { data: alumno, error } = await supabase
    .from('alumnos')
    .insert({
      clinica_id: perfilActual.clinica_id,
      nombre_anonimizado,
      fecha_nacimiento,
    })
    .select('id')
    .single()

  if (error || !alumno) return { error: error?.message ?? 'Error creando el alumno' }

  const idsFinal = new Set(terapeutaIds)
  if (terapeutaPrincipalId) idsFinal.add(terapeutaPrincipalId)

  const principalEfectivo = terapeutaPrincipalId || (idsFinal.size > 0 ? [...idsFinal][0] : null)

  if (idsFinal.size > 0) {
    await supabase.from('alumno_terapeuta').insert(
      [...idsFinal].map((tid) => ({
        alumno_id: alumno.id,
        terapeuta_id: tid,
        es_principal: tid === principalEfectivo,
      }))
    )
  }

  await sincronizarAlumnosStripe(perfilActual.clinica_id)

  revalidatePath('/dashboard/alumnos')
  return { success: true }
}

export async function archivarAlumno(id: string) {
  const supabase = await createClient()

  const { data: alumno, error } = await supabase
    .from('alumnos')
    .update({ activo: false })
    .eq('id', id)
    .select('clinica_id')
    .single()

  if (error) return { error: error.message }

  if (alumno) await sincronizarAlumnosStripe(alumno.clinica_id)

  revalidatePath('/dashboard/alumnos')
  return { success: true }
}

export async function reactivarAlumno(id: string) {
  const supabase = await createClient()

  const { data: alumno, error } = await supabase
    .from('alumnos')
    .update({ activo: true })
    .eq('id', id)
    .select('clinica_id')
    .single()

  if (error) return { error: error.message }

  if (alumno) await sincronizarAlumnosStripe(alumno.clinica_id)

  revalidatePath('/dashboard/alumnos')
  return { success: true }
}