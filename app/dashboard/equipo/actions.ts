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

  // Tope de terapeutas por clínica: 2 base (principal + otro) + 1 más por
  // cada 5 alumnos activos, para que el nº de asientos gratuitos crezca con
  // el tamaño real (de pago) de la clínica en vez de quedar ilimitado.
  // El superadmin (la propia plataforma) queda exento.
  if (perfilActual.rol === 'clinica_admin' && perfilActual.clinica_id) {
    const clinicaId = perfilActual.clinica_id
    const [{ count: terapeutasActivos }, { count: alumnosActivos }] = await Promise.all([
      admin
        .from('perfiles')
        .select('id', { count: 'exact', head: true })
        .eq('clinica_id', clinicaId)
        .eq('rol', 'terapeuta')
        .eq('activo', true),
      admin
        .from('alumnos')
        .select('id', { count: 'exact', head: true })
        .eq('clinica_id', clinicaId)
        .eq('activo', true),
    ])

    const limite = 2 + Math.floor((alumnosActivos ?? 0) / 5)
    if ((terapeutasActivos ?? 0) >= limite) {
      return {
        error: `Has alcanzado el límite de terapeutas para tu número de alumnos (${limite}). Contacta con soporte para ampliarlo.`,
      }
    }
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
// --- Corregir / eliminar perfiles (terapeutas y familias) ---

// Corrige el nombre de un terapeuta o familiar de la clínica (RLS + trigger
// perfiles_proteger_campos limitan qué perfiles y campos puede tocar)
export async function editarNombrePerfil(id: string, nombre: string) {
  const perfilActual = await getPerfilActual()
  if (!perfilActual || perfilActual.rol !== 'clinica_admin') return { error: 'No autorizado' }

  const limpio = nombre.trim()
  if (!limpio) return { error: 'El nombre no puede quedar vacío' }

  const supabase = await createClient()
  const { data, error } = await supabase.from('perfiles').update({ nombre: limpio }).eq('id', id).select('id')
  if (error) return { error: error.message }
  if (!data?.length) return { error: 'No se ha podido actualizar el perfil' }

  revalidatePath('/dashboard/equipo')
  revalidatePath('/dashboard/familia')
  return { success: true }
}

// Elimina del todo (cuenta de acceso incluida) un terapeuta o familiar creado
// por error. Si ya tiene actividad registrada, la función SQL lo impide y
// devuelve el motivo: en ese caso hay que desactivarlo.
export async function eliminarPerfil(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('eliminar_perfil_sin_actividad', { p_perfil_id: id })
  if (error) return { error: error.message }

  revalidatePath('/dashboard/equipo')
  revalidatePath('/dashboard/familia')
  revalidatePath('/dashboard/alumnos')
  return { success: true }
}

// --- Quién diseña la intervención ---

export async function cambiarDisenoPei(valor: 'supervisores' | 'terapeutas') {
  const supabase = await createClient()
  const { error } = await supabase.rpc('fijar_diseno_pei', { p_valor: valor })
  if (error) return { error: error.message }
  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

// Marca o desmarca a un terapeuta como supervisor (solo el clinica_admin; el
// trigger de perfiles lo impide a cualquier otro)
export async function cambiarSupervisor(terapeutaId: string, valor: boolean) {
  const supabase = await createClient()
  const perfilActual = await getPerfilActual()
  if (!perfilActual || perfilActual.rol !== 'clinica_admin') {
    return { error: 'Solo el administrador de la clínica puede cambiar esto' }
  }

  const { data, error } = await supabase
    .from('perfiles')
    .update({ es_supervisor: valor })
    .eq('id', terapeutaId)
    .eq('rol', 'terapeuta')
    .eq('clinica_id', perfilActual.clinica_id!)
    .select('id')
  if (error) return { error: error.message }
  if (!data?.length) return { error: 'Terapeuta no encontrado' }

  revalidatePath('/dashboard/equipo')
  return { success: true }
}
