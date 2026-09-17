'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Enums } from '@/database.types'

const TIPOS_PROGRAMA = ['aba_clasico', 'rft', 'conducta'] as const satisfies readonly Enums<'tipo_programa'>[]
const TIPOS_RELACION = ['coordinacion', 'distincion', 'oposicion', 'comparacion', 'jerarquia', 'temporal', 'causal', 'deictica'] as const satisfies readonly Enums<'tipo_relacion_rft'>[]
const VISIBILIDADES = ['privado', 'clinica'] as const satisfies readonly Enums<'visibilidad_programa'>[]
const FORMATOS_RECOGIDA = ['ensayo_discreto', 'intervalo', 'duracion', 'tasa', 'abc', 'latencia'] as const
const DIRECCIONES_OBJETIVO = ['aumentar', 'reducir'] as const

function parseFormatoRecogida(tipo: Enums<'tipo_programa'>, value: FormDataEntryValue | null): string {
  if (tipo !== 'aba_clasico') return 'ensayo_discreto'
  return typeof value === 'string' && (FORMATOS_RECOGIDA as readonly string[]).includes(value)
    ? value
    : 'ensayo_discreto'
}

function parseDireccionObjetivo(
  formatoRecogida: string,
  value: FormDataEntryValue | null
): 'aumentar' | 'reducir' | null {
  if (formatoRecogida === 'ensayo_discreto' || formatoRecogida === 'abc') return null
  return typeof value === 'string' && (DIRECCIONES_OBJETIVO as readonly string[]).includes(value)
    ? (value as 'aumentar' | 'reducir')
    : 'aumentar'
}

function parseTipoPrograma(value: FormDataEntryValue | null): Enums<'tipo_programa'> | null {
  return typeof value === 'string' && TIPOS_PROGRAMA.includes(value as Enums<'tipo_programa'>)
    ? value as Enums<'tipo_programa'>
    : null
}

function parseTipoRelacion(value: FormDataEntryValue | null): Enums<'tipo_relacion_rft'> | null {
  return typeof value === 'string' && TIPOS_RELACION.includes(value as Enums<'tipo_relacion_rft'>)
    ? value as Enums<'tipo_relacion_rft'>
    : null
}

function parseVisibilidad(value: FormDataEntryValue | null): Enums<'visibilidad_programa'> {
  return typeof value === 'string' && VISIBILIDADES.includes(value as Enums<'visibilidad_programa'>)
    ? value as Enums<'visibilidad_programa'>
    : 'clinica'
}

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
  const tipo = parseTipoPrograma(formData.get('tipo'))
  if (!tipo) return { error: 'Tipo de programa no válido' }
  const orden = parseOrden(formData)
  const visibilidad = esGlobal ? 'clinica' : parseVisibilidad(formData.get('visibilidad'))
  const formatoRecogida = parseFormatoRecogida(tipo, formData.get('formato_recogida'))
  const direccionObjetivo = parseDireccionObjetivo(formatoRecogida, formData.get('direccion_objetivo'))

  const { data, error } = await supabase
    .from('programas_base')
    .insert({
      nombre: formData.get('nombre') as string,
      tipo,
      tipo_relacion: tipo === 'rft' ? parseTipoRelacion(formData.get('tipo_relacion')) : null,
      area: formData.get('area') as string,
      objetivo: formData.get('objetivo') as string,
      materiales: formData.get('materiales') as string,
      instrucciones_terapeuta: formData.get('instrucciones_terapeuta') as string,
      ayudas_posibles: formData.get('ayudas_posibles') as string,
      ensayos_por_bloque: parseInt(formData.get('ensayos_por_bloque') as string) || 10,
      bloques_para_dominio: parseInt(formData.get('bloques_para_dominio') as string) || 3,
      porcentaje_dominio: parseFloat(formData.get('porcentaje_dominio') as string) || 90,
      video_url: (formData.get('video_url') as string)?.trim() || null,
      formato_recogida: formatoRecogida,
      direccion_objetivo: direccionObjetivo,
      creado_por: user.id,
      clinica_id: esGlobal ? null : perfil.clinica_id,
      visibilidad,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  if (orden !== null && data) {
    // p_orden_anterior debe ir null (no 0): un programa recién creado nunca
    // tuvo un orden previo, y la función SQL solo entra en la rama de
    // "insertar y hacer hueco" cuando ve null — con 0 entra en la rama de
    // "mover", que resta 1 a los que ya estaban entre 1 y el nuevo orden.
    const { error: rpcError } = await supabase.rpc('asignar_orden_curriculo', {
      p_id: data.id,
      p_nuevo_orden: orden,
      p_orden_anterior: null,
    } as unknown as { p_id: string; p_nuevo_orden: number; p_orden_anterior: number })
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

  const tipo = parseTipoPrograma(formData.get('tipo'))
  if (!tipo) return { error: 'Tipo de programa no válido' }
  const nuevoOrden = parseOrden(formData)
  const visibilidadForm = formData.get('visibilidad') as string | null

  const { data: programaActual } = await supabase
    .from('programas_base')
    .select('orden, clinica_id')
    .eq('id', id)
    .single()

  const ordenAnterior = programaActual?.orden ?? null
  const formatoRecogida = parseFormatoRecogida(tipo, formData.get('formato_recogida'))
  const direccionObjetivo = parseDireccionObjetivo(formatoRecogida, formData.get('direccion_objetivo'))

  const updateData: {
    nombre: string
    area: string
    objetivo: string
    materiales: string
    instrucciones_terapeuta: string
    ayudas_posibles: string
    ensayos_por_bloque: number
    bloques_para_dominio: number
    porcentaje_dominio: number
    video_url: string | null
    tipo_relacion: Enums<'tipo_relacion_rft'> | null
    formato_recogida: string
    direccion_objetivo: string | null
    visibilidad?: Enums<'visibilidad_programa'>
  } = {
    nombre: formData.get('nombre') as string,
    area: formData.get('area') as string,
    objetivo: formData.get('objetivo') as string,
    materiales: formData.get('materiales') as string,
    instrucciones_terapeuta: formData.get('instrucciones_terapeuta') as string,
    ayudas_posibles: formData.get('ayudas_posibles') as string,
    ensayos_por_bloque: parseInt(formData.get('ensayos_por_bloque') as string) || 10,
    bloques_para_dominio: parseInt(formData.get('bloques_para_dominio') as string) || 3,
    porcentaje_dominio: parseFloat(formData.get('porcentaje_dominio') as string) || 90,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    tipo_relacion: tipo === 'rft' ? parseTipoRelacion(formData.get('tipo_relacion')) : null,
    formato_recogida: formatoRecogida,
    direccion_objetivo: direccionObjetivo,
  }

  // La visibilidad solo tiene sentido en programas propios de una clínica
  if (programaActual?.clinica_id && visibilidadForm) {
    updateData.visibilidad = parseVisibilidad(visibilidadForm)
  }

  const { error } = await supabase
    .from('programas_base')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  if (nuevoOrden !== ordenAnterior) {
    // Igual que en crearPrograma: null hay que dejarlo tal cual, no
    // convertirlo en 0 — si no, "quitar el orden" (nuevoOrden null) se trata
    // como "mover a la posición 0" y el programa se queda con orden = 0 en
    // vez de sin orden.
    const { error: rpcError } = await supabase.rpc('asignar_orden_curriculo', {
      p_id: id,
      p_nuevo_orden: nuevoOrden,
      p_orden_anterior: ordenAnterior,
    } as unknown as { p_id: string; p_nuevo_orden: number; p_orden_anterior: number })
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
      formato_recogida: original.formato_recogida,
      direccion_objetivo: original.direccion_objetivo,
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
          conjunto.estimulos_base.map((e) => ({
            conjunto_id: nuevoConjunto.id,
            nombre: e.nombre,
            descripcion: e.descripcion,
            orden: e.orden,
          }))
        )
      }
    }
  } else if (original.tipo === 'rft') {
    const { data: clases } = await supabase
      .from('clases_rft_base')
      .select('nombre, grupo, orden, estimulos_rft_base(etiqueta, nombre, posicion, orden)')
      .eq('programa_base_id', id)
      .order('orden')

    for (const clase of clases ?? []) {
      const { data: nuevaClase } = await supabase
        .from('clases_rft_base')
        .insert({ programa_base_id: nuevo.id, nombre: clase.nombre, grupo: clase.grupo, orden: clase.orden })
        .select('id')
        .single()

      if (nuevaClase && clase.estimulos_rft_base?.length) {
        await supabase.from('estimulos_rft_base').insert(
          clase.estimulos_rft_base.map((e) => ({
            clase_base_id: nuevaClase.id,
            etiqueta: e.etiqueta,
            nombre: e.nombre,
            posicion: e.posicion,
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

// --- CLASES RFT BASE (solo programas RFT) ---

export async function crearClaseRftBase(programaBaseId: string, nombre: string, grupo: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clases_rft_base')
    .insert({ programa_base_id: programaBaseId, nombre, grupo })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true, id: data.id }
}

export async function eliminarClaseRftBase(id: string, programaBaseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('clases_rft_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function crearEstimuloRftBase(
  claseBaseId: string,
  programaBaseId: string,
  nombre: string,
  posicion: string
) {
  const supabase = await createClient()

  // La etiqueta se genera sola: posición + número que lleve el nombre de la
  // clase (ej. clase "Clase 1" + posición A → etiqueta "A1"), igual que al
  // crear un estímulo RFT ya asignado a un alumno.
  const { data: clase } = await supabase
    .from('clases_rft_base')
    .select('nombre')
    .eq('id', claseBaseId)
    .single()

  const numero = clase?.nombre.match(/(\d+)\s*$/)?.[1] ?? ''
  const etiqueta = posicion + numero

  const { error } = await supabase
    .from('estimulos_rft_base')
    .insert({ clase_base_id: claseBaseId, etiqueta, nombre, posicion })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function eliminarEstimuloRftBase(id: string, programaBaseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('estimulos_rft_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}