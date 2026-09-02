'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearPreferencia(
  alumnoId: string,
  nombre: string,
  tipo: string,
  fecha: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('preferencias_alumno').insert({
    alumno_id: alumnoId,
    nombre,
    tipo,
    fecha,
    creado_por: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function eliminarPreferencia(id: string, alumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('preferencias_alumno').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function listarPreferencias(alumnoId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('preferencias_alumno')
    .select('id, nombre, tipo, fecha, created_at')
    .eq('alumno_id', alumnoId)
    .order('fecha', { ascending: false })
  return data ?? []
}
// --- MSW / MSWO ---

type ResultadoMswo = { item: string; posicion: number }[]
type ResultadoMsw = { item: string; vecesElegido: number; porcentaje: number }[]

export async function guardarEvaluacionPreferencia(
  alumnoId: string,
  tipo: 'mswo' | 'msw',
  items: string[],
  resultado: ResultadoMswo | ResultadoMsw,
  numeroRondas: number | null,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data, error } = await supabase
    .from('evaluaciones_preferencia')
    .insert({
      alumno_id: alumnoId,
      terapeuta_id: user.id,
      tipo,
      items,
      resultado,
      numero_rondas: numeroRondas,
      notas: notas?.trim() || null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/preferencias`)
  return { success: true, id: data.id }
}

export async function listarEvaluacionesPreferencia(alumnoId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('evaluaciones_preferencia')
    .select('id, fecha, tipo, items, resultado, numero_rondas, notas')
    .eq('alumno_id', alumnoId)
    .order('fecha', { ascending: false })
  return data ?? []
}

export async function eliminarEvaluacionPreferencia(id: string, alumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('evaluaciones_preferencia').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/alumnos/${alumnoId}/preferencias`)
  return { success: true }
}

export async function anadirMasPreferidosAlRegistro(
  alumnoId: string,
  items: string[],
  tipo: string = 'otro'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fecha = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('preferencias_alumno').insert(
    items.map((nombre) => ({
      alumno_id: alumnoId,
      nombre,
      tipo,
      fecha,
      creado_por: user.id,
    }))
  )

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}/preferencias`)
  return { success: true }
}