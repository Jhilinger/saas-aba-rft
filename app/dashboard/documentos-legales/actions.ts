'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function crearTipoDocumento(titulo: string, contenido: string) {
  const perfil = await getPerfilActual()
  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('tipos_documento_clinica').insert({
    clinica_id: perfil.clinica_id,
    titulo,
    contenido,
    creado_por: (await supabase.auth.getUser()).data.user?.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/documentos-legales')
  return { success: true }
}

export async function editarTipoDocumento(id: string, titulo: string, contenido: string) {
  const perfil = await getPerfilActual()
  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('tipos_documento_clinica')
    .update({ titulo, contenido, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/documentos-legales')
  return { success: true }
}

export async function toggleTipoDocumento(id: string, activo: boolean) {
  const perfil = await getPerfilActual()
  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    return { error: 'No autorizado' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('tipos_documento_clinica').update({ activo: !activo }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/documentos-legales')
  return { success: true }
}

export async function listarFirmasDeTipo(tipoDocumentoId: string) {
  const supabase = await createClient()

  const { data: firmas } = await supabase
    .from('documentos_firmados')
    .select('id, alumno_id, firmado_por, fecha_firma, pdf_url, alumnos(nombre_anonimizado), perfiles:firmado_por(nombre)')
    .eq('tipo_documento_id', tipoDocumentoId)
    .order('fecha_firma', { ascending: false })

  const conUrl = await Promise.all(
    (firmas ?? []).map(async (f: any) => {
      const { data } = await supabase.storage.from('documentos-firmados').createSignedUrl(f.pdf_url, 60 * 10)
      return {
        id: f.id,
        alumnoNombre: f.alumnos?.nombre_anonimizado ?? '—',
        firmadoPorNombre: f.perfiles?.nombre ?? '—',
        fechaFirma: f.fecha_firma,
        pdfUrl: data?.signedUrl ?? null,
      }
    })
  )

  return conUrl
}