'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function crearClinica(formData: FormData) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const nombre = formData.get('nombre') as string
  const precio_fijo_mensual = parseFloat(formData.get('precio_fijo_mensual') as string) || 0
  const precio_por_alumno = parseFloat(formData.get('precio_por_alumno') as string) || 0
  const nombre_admin = formData.get('nombre_admin') as string
  const email_admin = formData.get('email_admin') as string
  const password_admin = formData.get('password_admin') as string
  const logo = formData.get('logo') as File | null

  // 1. Creamos la clínica (sin_facturacion=true: la ha dado de alta el
  // superadmin a mano, sin pasar por el checkout de Stripe)
  const { data: clinica, error: clinicaError } = await supabase
    .from('clinicas')
    .insert({
      nombre,
      precio_fijo_mensual,
      precio_por_alumno,
      sin_facturacion: true,
      estado_suscripcion: 'active',
    })
    .select('id')
    .single()


  if (clinicaError || !clinica) {
    return { error: clinicaError?.message ?? 'Error creando la clínica' }
  }

  // 2. Si hay logo, lo subimos y guardamos su URL
  if (logo && logo.size > 0) {
    const extension = logo.name.split('.').pop()
    const ruta = `${clinica.id}/logo.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('logos-clinicas')
      .upload(ruta, logo, { upsert: true })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('logos-clinicas').getPublicUrl(ruta)
      await supabase.from('clinicas').update({ logo_url: urlData.publicUrl }).eq('id', clinica.id)
    }
    // Si falla la subida del logo, no bloqueamos la creación de la clínica
    // por algo tan secundario — simplemente se queda sin logo.
  }

  // 3. Creamos la cuenta del primer clinica_admin
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: email_admin,
    password: password_admin,
    email_confirm: true,
  })


  if (authError || !authUser.user) {
    // Si falla la creación del admin, deshacemos también la clínica para
    // no dejar clínicas "huérfanas" sin nadie que pueda gestionarlas
    await supabase.from('clinicas').delete().eq('id', clinica.id)

    if (authError?.code === 'email_exists') {
      return { error: `Ya existe una cuenta con el email "${email_admin}". Usa otro email para el administrador.` }
    }

    return { error: authError?.message ?? 'Error creando la cuenta de administrador' }
  }

  const { error: perfilError } = await admin.from('perfiles').insert({
    id: authUser.user.id,
    clinica_id: clinica.id,
    rol: 'clinica_admin',
    nombre: nombre_admin,
    email: email_admin,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    await supabase.from('clinicas').delete().eq('id', clinica.id)
    return { error: perfilError.message }
  }

  revalidatePath('/dashboard/clinicas')
  return { success: true }
}

export async function archivarClinica(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('clinicas')
    .update({ activa: false, estado_suscripcion: 'canceled' })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clinicas')
  return { success: true }
}

export async function reactivarClinica(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('clinicas')
    .update({ activa: true, estado_suscripcion: 'active' })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clinicas')
  return { success: true }
}

export async function editarClinica(id: string, formData: FormData) {
  const supabase = await createClient()

  const nombre = formData.get('nombre') as string
  const precio_fijo_mensual = parseFloat(formData.get('precio_fijo_mensual') as string) || 0
  const precio_por_alumno = parseFloat(formData.get('precio_por_alumno') as string) || 0
  const logo = formData.get('logo') as File | null

  const updateData: Record<string, any> = { nombre, precio_fijo_mensual, precio_por_alumno }

  if (logo && logo.size > 0) {
    const extension = logo.name.split('.').pop()
    const ruta = `${id}/logo.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('logos-clinicas')
      .upload(ruta, logo, { upsert: true })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('logos-clinicas').getPublicUrl(ruta)
      updateData.logo_url = urlData.publicUrl
    }
  }

  const { error } = await supabase.from('clinicas').update(updateData).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clinicas')
  return { success: true }
}