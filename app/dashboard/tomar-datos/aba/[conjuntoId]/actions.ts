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

  const { data: conjuntoAntes } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('estado')
    .eq('id', conjuntoId)
    .single()

  const enLineaBase = conjuntoAntes?.estado === 'linea_base'
  const fase = enLineaBase ? 'linea_base' : 'intervencion'

  const totalEnsayos = ensayos.length
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
    await supabase
      .from('conjuntos_estimulos_alumno')
      .update({ estado: 'linea_base' })
      .eq('id', conjuntoId)
  } else {
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

// Revisa TODO el historial de bloques de un conjunto y decide si cumple
// el criterio de dominio ahora mismo (N bloques consecutivos, solo en fase
// de intervención, al X% o más). Se usa tras editar un bloque, ya que la
// edición puede alterar rachas que el trigger automático no reconsidera.
async function recalcularDominioConjunto(conjuntoId: string) {
  const supabase = await createClient()

  const { data: conjunto } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('estado, programa_alumno_id')
    .eq('id', conjuntoId)
    .single()

  if (!conjunto) return

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('bloques_para_dominio, porcentaje_dominio')
    .eq('id', conjunto.programa_alumno_id)
    .single()

  if (!programa) return

  const { data: bloques } = await supabase
    .from('bloques_ensayo')
    .select('id, porcentaje, fase, fecha')
    .eq('conjunto_id', conjuntoId)
    .order('fecha', { ascending: true })

  if (!bloques) return

  const soloIntervencion = bloques.filter((b) => b.fase === 'intervencion')

  let dominado = false
  for (let i = 0; i <= soloIntervencion.length - programa.bloques_para_dominio; i++) {
    const tramo = soloIntervencion.slice(i, i + programa.bloques_para_dominio)
    const cumpleTodos = tramo.every((b) => b.porcentaje >= programa.porcentaje_dominio)
    if (cumpleTodos) {
      dominado = true
      break
    }
  }

  const nuevoEstado = dominado ? 'dominado' : conjunto.estado === 'dominado' ? 'adquisicion' : conjunto.estado

  if (nuevoEstado !== conjunto.estado) {
    await supabase.from('conjuntos_estimulos_alumno').update({ estado: nuevoEstado }).eq('id', conjuntoId)
  }
}

export async function obtenerHistorialBloques(conjuntoId: string) {
  const supabase = await createClient()

  const { data: bloques } = await supabase
    .from('bloques_ensayo')
    .select('id, total_ensayos, aciertos, porcentaje, notas, fase, fecha')
    .eq('conjunto_id', conjuntoId)
    .order('fecha', { ascending: false })

  return bloques ?? []
}

export async function obtenerDetalleBloque(bloqueId: string) {
  const supabase = await createClient()

  // Nota: ensayos_aba_detalle no guarda ningún campo de orden/fecha propio,
  // así que no podemos garantizar que el orden mostrado aquí coincida
  // exactamente con el orden real en que se administraron los ensayos.
  const { data: detalle } = await supabase
    .from('ensayos_aba_detalle')
    .select('id, estimulo_id, correcto, ayuda, estimulos_alumno(nombre)')
    .eq('bloque_id', bloqueId)

  return (detalle ?? []).map((d: any) => ({
    id: d.id,
    estimuloId: d.estimulo_id,
    estimuloNombre: d.estimulos_alumno?.nombre ?? '—',
    correcto: d.correcto,
    ayuda: d.ayuda,
  }))
}

export async function editarBloqueAba(
  bloqueId: string,
  conjuntoId: string,
  programaAlumnoId: string,
  alumnoId: string,
  ensayos: { id: string; correcto: boolean; ayuda: string }[],
  notas?: string
) {
  const supabase = await createClient()

  if (ensayos.length === 0) return { error: 'No hay ensayos que guardar' }

  const totalEnsayos = ensayos.length
  const aciertos = ensayos.filter((e) => e.correcto && e.ayuda === 'independiente').length
  const porcentaje = Math.round((aciertos / totalEnsayos) * 100)

  for (const e of ensayos) {
    const { error } = await supabase
      .from('ensayos_aba_detalle')
      .update({ correcto: e.correcto, ayuda: e.ayuda })
      .eq('id', e.id)

    if (error) return { error: error.message }
  }

  const { error: bloqueError } = await supabase
    .from('bloques_ensayo')
    .update({
      total_ensayos: totalEnsayos,
      aciertos,
      notas: notas?.trim() || null,
    })
    .eq('id', bloqueId)

  if (bloqueError) return { error: bloqueError.message }

  await recalcularDominioConjunto(conjuntoId)

  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true, porcentaje }
}