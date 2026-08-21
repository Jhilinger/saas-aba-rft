'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function guardarFirmaDocumento(
  alumnoId: string,
  tipoDocumentoId: string,
  contenidoFirmado: string,
  firmaImagenPath: string,
  pdfPath: string,
  nombreFirmante: string,
  dniFirmante: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('documentos_firmados').insert({
    alumno_id: alumnoId,
    tipo_documento_id: tipoDocumentoId,
    firmado_por: user.id,
    contenido_firmado: contenidoFirmado,
    firma_imagen_url: firmaImagenPath,
    pdf_url: pdfPath,
    nombre_firmante: nombreFirmante,
    dni_firmante: dniFirmante,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/mi-hijo/documentos')
  return { success: true }
}