'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

// Crea varias sesiones de golpe, repitiendo en los días de la semana
// elegidos, durante el nº de semanas indicado. Todas comparten el mismo
// serie_id, para poder gestionarlas juntas más adelante.
export async function crearSesionesRecurrentes(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const alumnoId = formData.get('alumno_id') as string
  const terapeutaId = formData.get('terapeuta_id') as string
  const fechaInicio = formData.get('fecha_inicio') as string
  const hora = formData.get('hora') as string
  const duracionMinutos = parseInt(formData.get('duracion_minutos') as string) || 60
  const numeroSemanas = parseInt(formData.get('numero_semanas') as string) || 1
  const diasSemana = formData.getAll('dias_semana').map((d) => parseInt(d as string))

  if (!alumnoId || !terapeutaId || !fechaInicio || !hora || diasSemana.length === 0) {
    return { error: 'Faltan datos para crear las sesiones' }
  }

  const [hh, mm] = hora.split(':').map(Number)
  const inicio = new Date(fechaInicio + 'T00:00:00')

  const fechas: Date[] = []

  const finRango = new Date(inicio)
  finRango.setDate(finRango.getDate() + numeroSemanas * 7)

  const cursor = new Date(inicio)
  while (cursor < finRango) {
    if (diasSemana.includes(cursor.getDay())) {
      const fechaSesion = new Date(cursor)
      fechaSesion.setHours(hh, mm, 0, 0)
      fechas.push(new Date(fechaSesion))
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  if (fechas.length === 0) {
    return { error: 'No se generó ninguna sesión con esos días de la semana' }
  }

  const serieId = randomUUID()

  const { error } = await supabase.from('sesiones_programadas').insert(
    fechas.map((f) => ({
      alumno_id: alumnoId,
      terapeuta_id: terapeutaId,
      fecha_hora: f.toISOString(),
      duracion_minutos: duracionMinutos,
      creado_por: user.id,
      serie_id: serieId,
    }))
  )

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  return { success: true, creadas: fechas.length }
}

export async function crearSesionUnica(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const alumnoId = formData.get('alumno_id') as string
  const terapeutaId = formData.get('terapeuta_id') as string
  const fecha = formData.get('fecha') as string
  const hora = formData.get('hora') as string
  const duracionMinutos = parseInt(formData.get('duracion_minutos') as string) || 60

  if (!alumnoId || !terapeutaId || !fecha || !hora) {
    return { error: 'Faltan datos para crear la sesión' }
  }

  const fechaHora = new Date(`${fecha}T${hora}:00`)

  const { error } = await supabase.from('sesiones_programadas').insert({
    alumno_id: alumnoId,
    terapeuta_id: terapeutaId,
    fecha_hora: fechaHora.toISOString(),
    duracion_minutos: duracionMinutos,
    creado_por: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  return { success: true }
}

export async function marcarAsistencia(
  sesionId: string,
  estado: 'asistio' | 'cancelada' | 'no_asistio',
  canceladoPor?: 'terapeuta' | 'familia',
  notas?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sesiones_programadas')
    .update({
      estado,
      cancelado_por: estado === 'cancelada' ? canceladoPor ?? null : null,
      notas: notas || null,
      confirmada_familia: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sesionId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard/mi-hijo')
  return { success: true }
}

export async function confirmarAsistenciaFamilia(sesionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sesiones_programadas')
    .update({ confirmada_familia: true })
    .eq('id', sesionId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/mi-hijo')
  return { success: true }
}

export async function eliminarSesion(sesionId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('sesiones_programadas').delete().eq('id', sesionId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  return { success: true }
}

// --- GESTIÓN EN BLOQUE DE UNA SERIE (solo afecta a las sesiones FUTURAS
// todavía en estado "programada"; las ya pasadas/marcadas no se tocan) ---

export async function cancelarSerieFutura(serieId: string, canceladoPor: 'terapeuta' | 'familia' = 'terapeuta') {
  const supabase = await createClient()
  const ahora = new Date().toISOString()

  const { error } = await supabase
    .from('sesiones_programadas')
    .update({ estado: 'cancelada', cancelado_por: canceladoPor })
    .eq('serie_id', serieId)
    .eq('estado', 'programada')
    .gte('fecha_hora', ahora)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  return { success: true }
}

export async function eliminarSerieFutura(serieId: string) {
  const supabase = await createClient()
  const ahora = new Date().toISOString()

  const { error } = await supabase
    .from('sesiones_programadas')
    .delete()
    .eq('serie_id', serieId)
    .eq('estado', 'programada')
    .gte('fecha_hora', ahora)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  return { success: true }
}

export async function cambiarHoraSerie(serieId: string, nuevaHora: string) {
  const supabase = await createClient()
  const ahora = new Date().toISOString()

  const { data: sesiones, error: fetchError } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora')
    .eq('serie_id', serieId)
    .eq('estado', 'programada')
    .gte('fecha_hora', ahora)

  if (fetchError) return { error: fetchError.message }
  if (!sesiones || sesiones.length === 0) {
    return { error: 'No hay sesiones futuras en esta serie' }
  }

  const [hh, mm] = nuevaHora.split(':').map(Number)

  for (const s of sesiones) {
    const fecha = new Date(s.fecha_hora)
    fecha.setHours(hh, mm, 0, 0)
    const { error } = await supabase
      .from('sesiones_programadas')
      .update({ fecha_hora: fecha.toISOString() })
      .eq('id', s.id)
    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/agenda')
  return { success: true, actualizadas: sesiones.length }
}