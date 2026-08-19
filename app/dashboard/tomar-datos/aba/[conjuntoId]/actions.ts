'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type EnsayoInput = {
  estimuloId: string
  correcto: boolean
  ayuda: string
}

export async function guardarBloqueAba(
  conjuntoId: string,
  programaAlumnoId: string,
  alumnoId: string,
  ensayos: EnsayoInput[],
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (ensayos.length === 0) return { error: 'No hay ensayos que guardar' }

  // Estado del conjunto ANTES de guardar, para saber en qué fase se toma
  // este bloque y si el dominio se logra justo con él (celebración)
  const { data: conjuntoAntes } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('estado')
    .eq('id', conjuntoId)
    .single()

  const enLineaBase = conjuntoAntes?.estado === 'linea_base'
  const fase = enLineaBase ? 'linea_base' : 'intervencion'

  const totalEnsayos = ensayos.length
  // Solo cuenta como acierto si fue correcto Y sin ayuda (independiente).
  // Un acierto con ayuda se guarda igualmente en el detalle, pero no suma al %.
  const aciertos = ensayos.filter((e) => e.correcto && e.ayuda === 'independiente').length

  const { data: bloque, error: bloqueError } = await supabase
    .from('bloques_ensayo')
    .insert({
      conjunto_id: conjuntoId,
      terapeuta_id: user.id,
      total_ensayos: totalEnsayos,
      aciertos,
      notas: notas?.trim() || null,
      fase,
    })
    .select('id')
    .single()

  if (bloqueError || !bloque) {
    return { error: bloqueError?.message ?? 'Error creando el bloque' }
  }

  const { error: detalleError } = await supabase.from('ensayos_aba_detalle').insert(
    ensayos.map((e) => ({
      bloque_id: bloque.id,
      estimulo_id: e.estimuloId,
      correcto: e.correcto,
      ayuda: e.ayuda,
    }))
  )

  if (detalleError) return { error: detalleError.message }

  let dominioLogrado = false

  if (enLineaBase) {
    // En línea base no se evalúa el criterio de dominio. El trigger de la
    // base de datos no distingue esto, así que si ha tocado el estado del
    // conjunto, lo devolvemos a "línea base" para que no se dispare
    // ninguna celebración ni transición no deseada.
    await supabase
      .from('conjuntos_estimulos_alumno')
      .update({ estado: 'linea_base' })
      .eq('id', conjuntoId)
  } else {
    // El trigger de la base de datos ya actualizó el estado del conjunto si
    // corresponde (se ejecuta automáticamente al insertar el bloque). Lo
    // comprobamos para saber si el dominio se acaba de lograr justo ahora.
    const { data: conjuntoDespues } = await supabase
      .from('conjuntos_estimulos_alumno')
      .select('estado')
      .eq('id', conjuntoId)
      .single()

    dominioLogrado =
      conjuntoAntes?.estado !== 'dominado' && conjuntoDespues?.estado === 'dominado'
  }

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return {
    success: true,
    porcentaje: Math.round((aciertos / totalEnsayos) * 100),
    dominioLogrado,
  }
}