'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sincronizarAlumnosStripe } from '@/utils/stripe-sync'
import { MAX_ALUMNOS_INDEPENDIENTE } from '@/utils/tarifas'

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

// Plan de terapeuta independiente: como mucho MAX_ALUMNOS_INDEPENDIENTE activos
async function superaLimitePlan(supabase: Awaited<ReturnType<typeof createClient>>, clinicaId: string) {
  const { data: clinica } = await supabase.from('clinicas').select('plan').eq('id', clinicaId).single()
  if (clinica?.plan !== 'independiente') return false
  const { count } = await supabase
    .from('alumnos')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
    .eq('activo', true)
  return (count ?? 0) >= MAX_ALUMNOS_INDEPENDIENTE
}

const AVISO_LIMITE = `El plan de terapeuta independiente admite hasta ${MAX_ALUMNOS_INDEPENDIENTE} alumnos activos. Archiva alguno o pasa al plan de clínica.`

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

  if (await superaLimitePlan(supabase, perfilActual.clinica_id)) return { error: AVISO_LIMITE }

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

  const { data: actual } = await supabase.from('alumnos').select('clinica_id').eq('id', id).single()
  if (actual && (await superaLimitePlan(supabase, actual.clinica_id))) return { error: AVISO_LIMITE }

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
export async function actualizarTerapeutasAlumno(
  alumnoId: string,
  terapeutaIds: string[],
  terapeutaPrincipalId: string | null
) {
  const supabase = await createClient()

  // Sustitución completa: borramos los vínculos actuales y creamos los nuevos
  const { error: deleteError } = await supabase
    .from('alumno_terapeuta')
    .delete()
    .eq('alumno_id', alumnoId)

  if (deleteError) return { error: deleteError.message }

  const idsFinal = new Set(terapeutaIds)
  if (terapeutaPrincipalId) idsFinal.add(terapeutaPrincipalId)

  if (idsFinal.size > 0) {
    const { error: insertError } = await supabase.from('alumno_terapeuta').insert(
      [...idsFinal].map((tid) => ({
        alumno_id: alumnoId,
        terapeuta_id: tid,
        es_principal: tid === terapeutaPrincipalId,
      }))
    )

    if (insertError) return { error: insertError.message }
  }

  revalidatePath('/dashboard/alumnos')
  return { success: true }
}
// Elimina un alumno creado por error. Solo si no tiene ningún dato clínico
// (lo comprueba la función SQL); si los tiene, hay que archivarlo.
export async function eliminarAlumno(id: string) {
  const supabase = await createClient()

  const { data: alumno } = await supabase.from('alumnos').select('clinica_id').eq('id', id).single()

  const { error } = await supabase.rpc('eliminar_alumno_sin_datos', { p_alumno_id: id })
  if (error) return { error: error.message }

  if (alumno) await sincronizarAlumnosStripe(alumno.clinica_id)

  revalidatePath('/dashboard/alumnos')
  return { success: true }
}
