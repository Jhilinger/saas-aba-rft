'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Enums } from '@/database.types'
import {
  NIVELES_RFT,
  coerceNivelRft,
  POSICIONES_POR_NIVEL,
  MAX_MIEMBROS_POR_NIVEL,
  NOMBRE_NIVEL_RFT,
  type NivelRft,
} from '../niveles-rft'

const TIPOS_PROGRAMA = ['aba_clasico', 'rft'] as const satisfies readonly Enums<'tipo_programa'>[]
const TIPOS_RELACION = ['coordinacion', 'distincion', 'oposicion', 'comparacion', 'jerarquia', 'temporal', 'causal', 'deictica'] as const satisfies readonly Enums<'tipo_relacion_rft'>[]
const VISIBILIDADES = ['privado', 'clinica'] as const satisfies readonly Enums<'visibilidad_programa'>[]
const FORMATOS_RECOGIDA = ['ensayo_discreto', 'intervalo', 'duracion', 'tasa', 'abc', 'latencia', 'analisis_tareas'] as const
const DIRECCIONES_OBJETIVO = ['aumentar', 'reducir'] as const
const DIRECCIONES_CADENA = ['adelante', 'atras'] as const

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
  if (formatoRecogida === 'ensayo_discreto' || formatoRecogida === 'abc' || formatoRecogida === 'analisis_tareas') return null
  return typeof value === 'string' && (DIRECCIONES_OBJETIVO as readonly string[]).includes(value)
    ? (value as 'aumentar' | 'reducir')
    : 'aumentar'
}

function parseDireccionCadena(
  formatoRecogida: string,
  value: FormDataEntryValue | null
): 'adelante' | 'atras' | null {
  if (formatoRecogida !== 'analisis_tareas') return null
  return typeof value === 'string' && (DIRECCIONES_CADENA as readonly string[]).includes(value)
    ? (value as 'adelante' | 'atras')
    : 'adelante'
}

function parseTipoPrograma(value: FormDataEntryValue | null): Enums<'tipo_programa'> | null {
  return typeof value === 'string' && (TIPOS_PROGRAMA as readonly string[]).includes(value)
    ? value as Enums<'tipo_programa'>
    : null
}

function parseNivelRft(tipo: Enums<'tipo_programa'>, value: FormDataEntryValue | null): NivelRft | null {
  if (tipo !== 'rft') return null
  return typeof value === 'string' && (NIVELES_RFT as readonly string[]).includes(value)
    ? (value as NivelRft)
    : 'combinatorio'
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

// Posición dentro del dominio (1-based). Vacío = al final del dominio.
function parsePosicion(formData: FormData): number | null {
  const raw = formData.get('posicion') as string
  if (!raw || raw.trim() === '') return null
  const n = parseInt(raw, 10)
  return Number.isNaN(n) ? null : n
}

function parseDominio(formData: FormData): string | null {
  const raw = formData.get('dominio_id')
  return typeof raw === 'string' && raw.trim() !== '' ? raw : null
}

// Área de texto libre de los programas complementarios (los del currículo
// la reciben del dominio, por trigger)
function parseArea(formData: FormData): string {
  return ((formData.get('area') as string) ?? '').trim()
}

// Coloca el programa en su dominio/posición (renumera el resto del dominio)
async function colocarEnCurriculo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string,
  dominioId: string | null,
  posicion: number | null
) {
  const { error } = await supabase.rpc('colocar_programa_curriculo', {
    p_id: id,
    p_dominio_id: dominioId,
    p_posicion: posicion,
  } as unknown as { p_id: string; p_dominio_id: string; p_posicion: number })
  return error
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

  // Global (superadmin) = currículo, con dominio; clínica/terapeuta =
  // complementario, sin dominio y con área libre
  const esGlobal = perfil.rol === 'superadmin'
  const tipo = parseTipoPrograma(formData.get('tipo'))
  if (!tipo) return { error: 'Tipo de programa no válido' }
  const dominioId = esGlobal ? parseDominio(formData) : null
  if (esGlobal && !dominioId) return { error: 'Elige el dominio del programa' }
  const area = parseArea(formData)
  if (!esGlobal && !area) return { error: 'Indica el área del programa' }
  const posicion = parsePosicion(formData)
  const visibilidad = esGlobal ? 'clinica' : parseVisibilidad(formData.get('visibilidad'))
  const formatoRecogida = parseFormatoRecogida(tipo, formData.get('formato_recogida'))
  const direccionObjetivo = parseDireccionObjetivo(formatoRecogida, formData.get('direccion_objetivo'))
  const direccionCadena = parseDireccionCadena(formatoRecogida, formData.get('direccion_cadena'))
  const nivelRft = parseNivelRft(tipo, formData.get('nivel_rft'))

  const { data, error } = await supabase
    .from('programas_base')
    .insert({
      nombre: formData.get('nombre') as string,
      tipo,
      tipo_relacion: tipo === 'rft' ? parseTipoRelacion(formData.get('tipo_relacion')) : null,
      nivel_rft: nivelRft,
      dominio_id: dominioId,
      area, // en los del currículo lo sobrescribe el trigger a partir del dominio
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
      direccion_cadena: direccionCadena,
      creado_por: user.id,
      clinica_id: esGlobal ? null : perfil.clinica_id,
      visibilidad,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  if (dominioId) {
    const rpcError = await colocarEnCurriculo(supabase, data.id, dominioId, posicion)
    if (rpcError) return { error: rpcError.message }
  }

  revalidatePath('/dashboard/curriculo')
  return { success: true, id: data.id }
}

// Sube (-1) o baja (+1) un programa una posición dentro de su dominio
export async function moverPrograma(id: string, direccion: -1 | 1) {
  const supabase = await createClient()
  const { data: programa } = await supabase
    .from('programas_base')
    .select('dominio_id, orden')
    .eq('id', id)
    .single()

  if (!programa?.dominio_id || programa.orden === null) return { error: 'Este programa no tiene posición en el currículo' }

  const nuevaPosicion = programa.orden + direccion
  if (nuevaPosicion < 1) return { success: true }

  const rpcError = await colocarEnCurriculo(supabase, id, programa.dominio_id, nuevaPosicion)
  if (rpcError) return { error: rpcError.message }

  revalidatePath('/dashboard/curriculo')
  return { success: true }
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
  const posicion = parsePosicion(formData)
  const visibilidadForm = formData.get('visibilidad') as string | null

  const { data: programaActual } = await supabase
    .from('programas_base')
    .select('orden, clinica_id, dominio_id')
    .eq('id', id)
    .single()

  if (!programaActual) return { error: 'Programa no encontrado' }

  // Del currículo (global): dominio + posición. Complementario: área libre.
  const esDelCurriculo = programaActual.clinica_id === null
  const dominioId = esDelCurriculo ? parseDominio(formData) : null
  if (esDelCurriculo && !dominioId) return { error: 'Elige el dominio del programa' }
  const area = parseArea(formData)
  if (!esDelCurriculo && !area) return { error: 'Indica el área del programa' }
  const formatoRecogida = parseFormatoRecogida(tipo, formData.get('formato_recogida'))
  const direccionObjetivo = parseDireccionObjetivo(formatoRecogida, formData.get('direccion_objetivo'))
  const direccionCadena = parseDireccionCadena(formatoRecogida, formData.get('direccion_cadena'))
  const nivelRft = parseNivelRft(tipo, formData.get('nivel_rft'))

  const updateData: {
    nombre: string
    objetivo: string
    materiales: string
    instrucciones_terapeuta: string
    ayudas_posibles: string
    ensayos_por_bloque: number
    bloques_para_dominio: number
    porcentaje_dominio: number
    video_url: string | null
    tipo_relacion: Enums<'tipo_relacion_rft'> | null
    nivel_rft: string | null
    formato_recogida: string
    direccion_objetivo: string | null
    direccion_cadena: string | null
    visibilidad?: Enums<'visibilidad_programa'>
    area?: string
  } = {
    nombre: formData.get('nombre') as string,
    objetivo: formData.get('objetivo') as string,
    materiales: formData.get('materiales') as string,
    instrucciones_terapeuta: formData.get('instrucciones_terapeuta') as string,
    ayudas_posibles: formData.get('ayudas_posibles') as string,
    ensayos_por_bloque: parseInt(formData.get('ensayos_por_bloque') as string) || 10,
    bloques_para_dominio: parseInt(formData.get('bloques_para_dominio') as string) || 3,
    porcentaje_dominio: parseFloat(formData.get('porcentaje_dominio') as string) || 90,
    video_url: (formData.get('video_url') as string)?.trim() || null,
    tipo_relacion: tipo === 'rft' ? parseTipoRelacion(formData.get('tipo_relacion')) : null,
    nivel_rft: nivelRft,
    formato_recogida: formatoRecogida,
    direccion_objetivo: direccionObjetivo,
    direccion_cadena: direccionCadena,
  }

  // La visibilidad y el área libre solo existen en los complementarios
  if (!esDelCurriculo) {
    updateData.area = area
    if (visibilidadForm) updateData.visibilidad = parseVisibilidad(visibilidadForm)
  }

  const { error } = await supabase
    .from('programas_base')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  const cambiaDominio = dominioId !== programaActual.dominio_id
  const cambiaPosicion = posicion !== null && posicion !== programaActual.orden
  if (dominioId && (cambiaDominio || cambiaPosicion)) {
    // Si cambia de dominio sin posición indicada, va al final del nuevo dominio
    const destino = posicion ?? (cambiaDominio ? null : programaActual.orden)
    const rpcError = await colocarEnCurriculo(supabase, id, dominioId, destino)
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
      nivel_rft: original.nivel_rft,
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
      direccion_cadena: original.direccion_cadena,
      orden: null,
      dominio_id: original.dominio_id,
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

  // La copia queda justo detrás del original en su dominio
  if (original.dominio_id && original.orden !== null) {
    const rpcError = await colocarEnCurriculo(supabase, nuevo.id, original.dominio_id, original.orden + 1)
    if (rpcError) return { error: rpcError.message }
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

    if (original.formato_recogida === 'analisis_tareas') {
      const { data: pasos } = await supabase
        .from('pasos_tarea_base')
        .select('nombre, descripcion, orden')
        .eq('programa_base_id', id)
        .order('orden')

      if (pasos?.length) {
        await supabase.from('pasos_tarea_base').insert(
          pasos.map((p) => ({
            programa_base_id: nuevo.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            orden: p.orden,
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

  const { data: programaBase } = await supabase
    .from('programas_base')
    .select('nivel_rft')
    .eq('id', programaBaseId)
    .single()
  const nivel = coerceNivelRft(programaBase?.nivel_rft)

  if (!POSICIONES_POR_NIVEL[nivel].includes(posicion)) {
    return { error: `En ${NOMBRE_NIVEL_RFT[nivel]} solo se admiten las posiciones: ${POSICIONES_POR_NIVEL[nivel].join(', ')}` }
  }

  const { count } = await supabase
    .from('estimulos_rft_base')
    .select('id', { count: 'exact', head: true })
    .eq('clase_base_id', claseBaseId)

  if ((count ?? 0) >= MAX_MIEMBROS_POR_NIVEL[nivel]) {
    return { error: `${NOMBRE_NIVEL_RFT[nivel]} admite como máximo ${MAX_MIEMBROS_POR_NIVEL[nivel]} miembro(s) por clase` }
  }

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

// --- PASOS DE ANÁLISIS DE TAREAS (plantilla, solo programas aba_clasico con formato_recogida = analisis_tareas) ---

export async function crearPasoBase(programaBaseId: string, nombre: string, descripcion: string) {
  const supabase = await createClient()

  if (!nombre.trim()) return { error: 'El nombre del paso es obligatorio' }

  const { count } = await supabase
    .from('pasos_tarea_base')
    .select('id', { count: 'exact', head: true })
    .eq('programa_base_id', programaBaseId)

  const { error } = await supabase.from('pasos_tarea_base').insert({
    programa_base_id: programaBaseId,
    nombre: nombre.trim(),
    descripcion: descripcion.trim() || null,
    orden: (count ?? 0) + 1,
  })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function eliminarPasoBase(id: string, programaBaseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pasos_tarea_base').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

