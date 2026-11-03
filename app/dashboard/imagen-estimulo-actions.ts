'use server'

import { createClient } from '@/utils/supabase/server'
import { puedeDisenar, SIN_PERMISO_DISENO } from './permisos'

// Imágenes propias que puede tener cada centro
const MAX_IMAGENES_CENTRO = 1000
const MAX_BYTES = 512000
const EXTENSION: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg' }

type Tabla = 'estimulos_rft' | 'estimulos_rft_base'

// Sube la imagen (ya comprimida en el navegador), la registra como concepto
// propio del centro y se la asigna al estímulo
export async function subirImagenEstimulo(formData: FormData) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }

  const tabla = formData.get('tabla') as Tabla
  const estimuloId = formData.get('estimulo_id') as string
  const archivo = formData.get('archivo') as File | null
  if (!['estimulos_rft', 'estimulos_rft_base'].includes(tabla) || !estimuloId) return { error: 'Datos incompletos' }
  if (!archivo || !EXTENSION[archivo.type]) return { error: 'Formato de imagen no admitido' }
  if (archivo.size > MAX_BYTES) return { error: 'La imagen es demasiado grande' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesión caducada' }
  const { data: perfil } = await supabase.from('perfiles').select('clinica_id').eq('id', user.id).single()
  const clinicaId = perfil?.clinica_id
  if (!clinicaId) return { error: 'Las imágenes propias pertenecen a un centro' }

  const { count } = await supabase
    .from('biblioteca_imagenes')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
  if ((count ?? 0) >= MAX_IMAGENES_CENTRO) return { error: `Tu centro ha llegado al máximo de ${MAX_IMAGENES_CENTRO} imágenes propias` }

  const { data: estimulo } = await supabase.from(tabla).select('nombre').eq('id', estimuloId).single()
  if (!estimulo) return { error: 'Estímulo no encontrado' }

  const id = crypto.randomUUID()
  const ruta = `${clinicaId}/${id}.${EXTENSION[archivo.type]}`
  const concepto = `propias/${id}`

  const { error: errorSubida } = await supabase.storage
    .from('imagenes-clinica')
    .upload(ruta, archivo, { contentType: archivo.type })
  if (errorSubida) return { error: errorSubida.message }

  const { error: errorRegistro } = await supabase.from('biblioteca_imagenes').insert({
    clinica_id: clinicaId,
    concepto,
    categoria: 'propias',
    nombre: estimulo.nombre,
    ejemplar: '1',
    uso: 'entrenamiento',
    ruta,
  })
  if (errorRegistro) {
    await supabase.storage.from('imagenes-clinica').remove([ruta])
    return { error: errorRegistro.message }
  }

  const { data: actualizado, error } = await supabase
    .from(tabla)
    .update({ concepto_imagen: concepto })
    .eq('id', estimuloId)
    .select('id')
  if (error) return { error: error.message }
  if (!actualizado?.length) return { error: 'No tienes permiso para editar este estímulo' }
  return { success: true }
}

// Quita la imagen del estímulo. El archivo se conserva: el mismo concepto
// puede estar en el programa de otros alumnos (copiado de la plantilla)
export async function quitarImagenEstimulo(tabla: Tabla, estimuloId: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  if (!['estimulos_rft', 'estimulos_rft_base'].includes(tabla)) return { error: 'Datos incompletos' }

  const { data: actualizado, error } = await supabase
    .from(tabla)
    .update({ concepto_imagen: null })
    .eq('id', estimuloId)
    .select('id')
  if (error) return { error: error.message }
  if (!actualizado?.length) return { error: 'No tienes permiso para editar este estímulo' }
  return { success: true }
}
