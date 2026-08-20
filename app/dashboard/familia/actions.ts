'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

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

// Invita a un familiar nuevo por email, vinculándolo a uno o varios alumnos
// de golpe (ej. hermanos que comparten familia)
export async function crearFamiliar(nombre: string, email: string, alumnoIds: string[]) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  if (alumnoIds.length === 0) {
    return { error: 'Selecciona al menos un alumno' }
  }

  const admin = createAdminClient()

  const { data: existente } = await admin.from('perfiles').select('id').eq('email', email).maybeSingle()
  if (existente) {
    return { error: `Ya existe una cuenta con el email "${email}".` }
  }

 const { data: authUser, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${URL_BASE}/login`,
  })

  if (authError || !authUser.user) {
    return { error: authError?.message ?? 'Error invitando al familiar' }
  }

  const { error: perfilError } = await admin.from('perfiles').insert({
    id: authUser.user.id,
    clinica_id: perfilActual.clinica_id,
    rol: 'familia',
    nombre,
    email,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return { error: perfilError.message || JSON.stringify(perfilError) }
  }

  const { error: vinculoError } = await admin.from('alumno_familia').insert(
    alumnoIds.map((alumnoId) => ({ alumno_id: alumnoId, perfil_id: authUser.user.id }))
  )

  if (vinculoError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return { error: vinculoError.message || JSON.stringify(vinculoError) }
  }

  revalidatePath('/dashboard/familia')
  return { success: true }
}

// Vincula a un alumno más a un familiar ya existente
export async function vincularFamiliarAlumno(perfilId: string, alumnoId: string) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const { error } = await createAdminClient()
    .from('alumno_familia')
    .insert({ alumno_id: alumnoId, perfil_id: perfilId })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/familia')
  return { success: true }
}

export async function desvincularFamiliarAlumno(perfilId: string, alumnoId: string) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('alumno_familia')
    .delete()
    .eq('perfil_id', perfilId)
    .eq('alumno_id', alumnoId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/familia')
  return { success: true }
}