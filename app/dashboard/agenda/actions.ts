'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Crea varias sesiones de golpe, repitiendo en los días de la semana
// elegidos, durante el nº de semanas indicado (ej. "todos los lunes y
// jueves a las 10:00, durante 8 semanas")
export async function crearSesionesRecurrentes(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const alumnoId = formData.get('alumno_id') as string
  const terapeutaId = formData.get('terapeuta_id') as string
  const fechaInicio = formData.get('fecha_inicio') as string // YYYY-MM-DD
  const hora = formData.get('hora') as string // HH:MM
  const duracionMinutos = parseInt(formData.get('duracion_minutos') as string) || 60
  const numeroSemanas = parseInt(formData.get('numero_semanas') as string) || 1
  const diasSemana = formData.getAll('dias_semana').map((d) => parseInt(d as string)) // 0=domingo .. 6=sábado

  if (!alumnoId || !terapeutaId || !fechaInicio || !hora || diasSemana.length === 0) {
    return { error: 'Faltan datos para crear las sesiones' }
  }

  const [hh, mm] = hora.split(':').map(Number)
  const inicio = new Date(fechaInicio + 'T00:00:00')

  const fechas: Date[] = []

  // Recorremos día a día desde el inicio hasta cubrir "numeroSemanas"
  // semanas completas, quedándonos solo con los días de la semana elegidos
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

  const { error } = await supabase.from('sesiones_programadas').insert(
    fechas.map((f) => ({
      alumno_id: alumnoId,
      terapeuta_id: terapeutaId,
      fecha_hora: f.toISOString(),
      duracion_minutos: duracionMinutos,
      creado_por: user.id,
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

// El terapeuta (o clinica_admin) marca qué pasó con una sesión ya realizada
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
      confirmada_familia: false, // si se cambia el resultado, hace falta reconfirmar
      updated_at: new Date().toISOString(),
    })
    .eq('id', sesionId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard/mi-hijo')
  return { success: true }
}

// La familia confirma que el registro de asistencia es correcto
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