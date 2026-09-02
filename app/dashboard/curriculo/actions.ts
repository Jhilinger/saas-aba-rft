'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

function parseOrden(formData: FormData): number | null {
  const raw = formData.get('orden') as string
  if (!raw || raw.trim() === '') return null
  const n = parseInt(raw, 10)
  return Number.isNaN(n) ? null : n
}

export async function crearPrograma(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil) return { error: 'Perfil no encontrado' }

  const esGlobal = perfil.rol === 'superadmin'
  const tipo = formData.get('tipo') as string
  const orden = parseOrden(formData)
  const visibilidad = esGlobal ? 'clinica' : ((formData.get('visibilidad') as string) || 'clinica')

  const { data, error } = await supabase
    .from('programas_base')
    .insert({
      nombre: formData.get('nombre') as string,
      tipo,
      tipo_relacion: tipo === 'rft' ? (formData.get('tipo_relacion') as string) : null,
      area: formData.get('area') as string,
      objetivo: formData.get('objetivo') as string,
      materiales: formData.get('materiales') as string,
      instrucciones_terapeuta: formData.get('instrucciones_terapeuta') as string,
      ayudas_posibles: formData.get('ayudas_posibles') as string,
      ensayos_por_bloque: parseInt(formData.get('ensayos_por_bloque') as string) || 10,
      bloques_para_dominio: parseInt(formData.get('bloques_para_dominio') as string) || 3,
      porcentaje_dominio: parseFloat(formData.get('porcentaje_dominio') as string) || 90,
      creado_por: user.id,
      clinica_id: esGlobal ? null : perfil.clinica_id,
      visibilidad,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  if (orden !== null && data) {
    const { error: rpcError } = await supabase.rpc('asignar_orden_curriculo', {
      p_id: data.id,
      p_nuevo_orden: orden,
      p_orden_anterior: null,
    })
    if (rpcError) return { error: rpcError.message }
  }

  revalidatePath('/dashboard/curriculo')
  return { success: true, id: data.id }
}

export async function eliminarPrograma(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('programas_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/curriculo')
  return { success: true }
}

export async function togglePrograma(id: string, activo: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('programas_base')
    .update({ activo: !activo })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/curriculo')
  return { success: true }
}

// --- CONJUNTOS DE ESTÍMULOS BASE (solo programas ABA) ---

export async function crearConjuntoBase(programaBaseId: string, nombre: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('conjuntos_estimulos_base')
    .insert({ programa_base_id: programaBaseId, nombre })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true, id: data.id }
}

export async function eliminarConjuntoBase(id: string, programaBaseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('conjuntos_estimulos_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function crearEstimuloBase(
  conjuntoId: string,
  programaBaseId: string,
  nombre: string,
  descripcion: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('estimulos_base')
    .insert({ conjunto_id: conjuntoId, nombre, descripcion })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function eliminarEstimuloBase(id: string, programaBaseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('estimulos_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function editarPrograma(id: string, formData: FormData) {
  const supabase = await createClient()

  const tipo = formData.get('tipo') as string
  const nuevoOrden = parseOrden(formData)
  const visibilidadForm = formData.get('visibilidad') as string | null

  const { data: programaActual } = await supabase
    .from('programas_base')
    .select('orden, clinica_id')
    .eq('id', id)
    .single()

  const ordenAnterior = programaActual?.orden ?? null

  const updateData: Record<string, any> = {
    nombre: formData.get('nombre') as string,
    area: formData.get('area') as string,
    objetivo: formData.get('objetivo') as string,
    materiales: formData.get('materiales') as string,
    instrucciones_terapeuta: formData.get('instrucciones_terapeuta') as string,
    ayudas_posibles: formData.get('ayudas_posibles') as string,
    ensayos_por_bloque: parseInt(formData.get('ensayos_por_bloque') as string) || 10,
    bloques_para_dominio: parseInt(formData.get('bloques_para_dominio') as string) || 3,
    porcentaje_dominio: parseFloat(formData.get('porcentaje_dominio') as string) || 90,
    tipo_relacion: tipo === 'rft' ? (formData.get('tipo_relacion') as string) : null,
  }

  // La visibilidad solo tiene sentido en programas propios de una clínica
  if (programaActual?.clinica_id && visibilidadForm) {
    updateData.visibilidad = visibilidadForm
  }

  const { error } = await supabase
    .from('programas_base')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  if (nuevoOrden !== ordenAnterior) {
    const { error: rpcError } = await supabase.rpc('asignar_orden_curriculo', {
      p_id: id,
      p_nuevo_orden: nuevoOrden,
      p_orden_anterior: ordenAnterior,
    })
    if (rpcError) return { error: rpcError.message }
  }

  revalidatePath('/dashboard/curriculo')
  revalidatePath(`/dashboard/curriculo/${id}`)
  return { success: true }
}
export async function clonarPrograma(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: original, error: fetchError } = await supabase
    .from('programas_base')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !original) return { error: 'Programa no encontrado' }

  const { data: nuevo, error: insertError } = await supabase
    .from('programas_base')
    .insert({
      nombre: `${original.nombre} (copia)`,
      tipo: original.tipo,
      tipo_relacion: original.tipo_relacion,
      area: original.area,
      objetivo: original.objetivo,
      materiales: original.materiales,
      instrucciones_terapeuta: original.instrucciones_terapeuta,
      ayudas_posibles: original.ayudas_posibles,
      ensayos_por_bloque: original.ensayos_por_bloque,
      bloques_para_dominio: original.bloques_para_dominio,
      porcentaje_dominio: original.porcentaje_dominio,
      video_url: original.video_url,
      orden: null,
      clinica_id: original.clinica_id,
      visibilidad: original.visibilidad,
      creado_por: user.id,
      activo: true,
    })
    .select('id')
    .single()

  if (insertError || !nuevo) {
    return { error: insertError?.message ?? 'Error clonando el programa' }
  }

  if (original.tipo === 'aba_clasico') {
    const { data: conjuntos } = await supabase
      .from('conjuntos_estimulos_base')
      .select('nombre, orden, estimulos_base(nombre, descripcion, orden)')
      .eq('programa_base_id', id)
      .order('orden')

    for (const conjunto of conjuntos ?? []) {
      const { data: nuevoConjunto } = await supabase
        .from('conjuntos_estimulos_base')
        .insert({ programa_base_id: nuevo.id, nombre: conjunto.nombre, orden: conjunto.orden })
        .select('id')
        .single()

      if (nuevoConjunto && conjunto.estimulos_base?.length) {
        await supabase.from('estimulos_base').insert(
          conjunto.estimulos_base.map((e: any) => ({
            conjunto_id: nuevoConjunto.id,
            nombre: e.nombre,
            descripcion: e.descripcion,
            orden: e.orden,
          }))
        )
      }
    }
  }

  revalidatePath('/dashboard/curriculo')
  revalidatePath('/dashboard/mis-programas')
  return { success: true, id: nuevo.id }
}