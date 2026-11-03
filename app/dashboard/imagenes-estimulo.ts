import type { createClient } from '@/utils/supabase/server'
import type { ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

type Supabase = Awaited<ReturnType<typeof createClient>>

// Las del banco común son públicas; las propias del centro están en un bucket
// privado y se sirven con URLs firmadas (duran una jornada de sesiones)
const DURACION_FIRMA = 60 * 60 * 12

export async function cargarImagenes(supabase: Supabase, conceptos: (string | null | undefined)[]): Promise<ImagenesBanco> {
  const unicos = [...new Set(conceptos.filter((c): c is string => !!c))]
  if (!unicos.length) return {}

  const { data: filas } = await supabase
    .from('biblioteca_imagenes')
    .select('concepto, ejemplar, ruta, clinica_id')
    .in('concepto', unicos)

  const propias = (filas ?? []).filter((f) => f.clinica_id)
  const firmadas = new Map<string, string>()
  if (propias.length) {
    const { data } = await supabase.storage.from('imagenes-clinica').createSignedUrls(propias.map((f) => f.ruta), DURACION_FIRMA)
    for (const d of data ?? []) if (d.path && d.signedUrl) firmadas.set(d.path, d.signedUrl)
  }

  const imagenes: ImagenesBanco = {}
  for (const f of filas ?? []) {
    const url = f.clinica_id ? firmadas.get(f.ruta) : supabase.storage.from('biblioteca').getPublicUrl(f.ruta).data.publicUrl
    if (url) imagenes[f.concepto] = { ...imagenes[f.concepto], [f.ejemplar]: url }
  }
  return imagenes
}
