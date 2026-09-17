'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function confirmarObservacion(
  observacionId: string,
  conjuntoId: string,
  tipoSonda: 'generalizacion' | 'mantenimiento',
  resultado: boolean,
  programaAlumnoId: string,
  alumnoId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: obs } = await supabase
    .from('observaciones_familia')
    .select('texto, estado')
    .eq('id', observacionId)
    .single()

  if (!obs) return { error: 'Observación no encontrada' }
  if (obs.estado !== 'pendiente') return { error: 'Esta observación ya se revisó' }

  const { data: conjunto } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('estado, programa_alumno_id')
    .eq('id', conjuntoId)
    .single()

  if (!conjunto || conjunto.programa_alumno_id !== programaAlumnoId) {
    return { error: 'Conjunto no válido' }
  }
  if (conjunto.estado !== 'dominado' && conjunto.estado !== 'mantenimiento') {
    return { error: 'Solo se puede confirmar sobre un conjunto ya dominado' }
  }

  const { data: estimulo } = await supabase
    .from('estimulos_alumno')
    .select('id')
    .eq('conjunto_id', conjuntoId)
    .limit(1)
    .maybeSingle()

  if (!estimulo) return { error: 'Ese conjunto no tiene estímulos' }

  const { data: bloque, error: bloqueError } = await supabase
    .from('bloques_ensayo')
    .insert({
      conjunto_id: conjuntoId,
      terapeuta_id: user.id,
      total_ensayos: 1,
      aciertos: resultado ? 1 : 0,
      fase: tipoSonda,
      notas: `Contado por la familia: ${obs.texto}`,
    })
    .select('id')
    .single()

  if (bloqueError || !bloque) {
    return { error: bloqueError?.message ?? 'Error creando la sonda' }
  }

  const { error: detalleError } = await supabase.from('ensayos_aba_detalle').insert({
    bloque_id: bloque.id,
    estimulo_id: estimulo.id,
    correcto: resultado,
    ayuda: 'independiente',
  })

  if (detalleError) return { error: detalleError.message }

  const { error: updateError } = await supabase
    .from('observaciones_familia')
    .update({
      estado: 'confirmada',
      bloque_id: bloque.id,
      revisado_por: user.id,
      revisado_en: new Date().toISOString(),
    })
    .eq('id', observacionId)

  if (updateError) return { error: updateError.message }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/mi-hijo/programa/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function descartarObservacion(
  observacionId: string,
  programaAlumnoId: string,
  respuesta?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('observaciones_familia')
    .update({
      estado: 'descartada',
      respuesta_terapeuta: respuesta?.trim() || null,
      revisado_por: user.id,
      revisado_en: new Date().toISOString(),
    })
    .eq('id', observacionId)
    .eq('estado', 'pendiente')

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/mi-hijo/programa/${programaAlumnoId}`)
  return { success: true }
}
