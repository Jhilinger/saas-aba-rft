'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sincronizarAlumnosStripe } from '@/utils/stripe-sync'

// Devuelve el perfil (con rol y clinica_id) del usuario logueado, o null.
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

// --- TERAPEUTAS ---

export async function crearTerapeuta(formData: FormData) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const admin = createAdminClient()

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authUser.user) {
    return { error: authError?.message ?? 'Error creando el usuario' }
  }

  const { error: perfilError } = await admin.from('perfiles').insert({
    id: authUser.user.id,
    clinica_id: perfilActual.clinica_id,
    rol: 'terapeuta',
    nombre,
    email,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return { error: perfilError.message }
  }

  revalidatePath('/dashboard/equipo')
  return { success: true }
}

export async function desactivarTerapeuta(id: string) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('perfiles').update({ activo: false }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/equipo')
  return { success: true }
}

export async function reactivarTerapeuta(id: string) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('perfiles').update({ activo: true }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/equipo')
  return { success: true }
}

// El propio clinica_admin activa/desactiva su capacidad de actuar también
// como terapeuta (sin necesitar una cuenta separada)
export async function toggleTambienTerapeuta(valorActual: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const perfilActual = await getPerfilActual()
  if (!perfilActual || perfilActual.rol !== 'clinica_admin') {
    return { error: 'Solo el administrador de la clínica puede activar esto' }
  }

  const { error } = await supabase
    .from('perfiles')
    .update({ tambien_terapeuta: !valorActual })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/equipo')
  return { success: true }
}

// --- ALUMNOS ---

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

  // El terapeuta marcado como "Principal" se incluye siempre, aunque no
  // hayas marcado también su casilla de asignado (es obvio que si es
  // principal, está asignado). El resto son los que hayas marcado a mano.
  const idsFinal = new Set(terapeutaIds)
  if (terapeutaPrincipalId) idsFinal.add(terapeutaPrincipalId)

  // Si no elegiste explícitamente un principal pero sí marcaste alguno,
  // mantenemos el comportamiento anterior como red de seguridad: el primero.
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

  revalidatePath('/dashboard/equipo')
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

  revalidatePath('/dashboard/equipo')
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

  revalidatePath('/dashboard/equipo')
  return { success: true }
}