'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function guardarDatosFacturacion(
  alumnoId: string,
  datos: {
    nombreRazonSocial: string
    nif: string
    direccion: string
    codigoPostal: string
    ciudad: string
    pais: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('datos_facturacion_familia').upsert(
    {
      alumno_id: alumnoId,
      nombre_razon_social: datos.nombreRazonSocial,
      nif: datos.nif,
      direccion: datos.direccion,
      codigo_postal: datos.codigoPostal,
      ciudad: datos.ciudad,
      pais: datos.pais,
      actualizado_por: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'alumno_id' }
  )

  if (error) return { error: error.message }

  revalidatePath('/dashboard/mi-hijo/facturacion')
  return { success: true }
}