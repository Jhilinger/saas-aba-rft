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

export async function crearTerapeuta(formData: FormData) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || !['superadmin', 'clinica_admin'].includes(perfilActual.rol)) {
    return { error: 'No autorizado' }
  }

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string

  const admin = createAdminClient()

  const { data: existente } = await admin.from('perfiles').select('id').eq('email', email).maybeSingle()
  if (existente) {
    return { error: `Ya existe una cuenta con el email "${email}".` }
  }

  const { data: authUser, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${URL_BASE}/login`,
  })

  if (authError || !authUser.user) {
    return { error: authError?.message ?? 'Error invitando al terapeuta' }
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