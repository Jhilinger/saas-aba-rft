'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import type { Enums } from '@/database.types'
import { puedeDisenar, SIN_PERMISO_DISENO } from '../permisos'
import { clavePar, generarGrupo, tienePlantilla, type ClaseGenerada, type Usados } from './plantillas'

export type Destino = 'curriculo' | 'pei'
type Existente = { nombre: string; grupo: string; estimulos: { nombre: string; concepto_imagen: string | null }[] }

// Lo que ya tiene el programa: numeración de clases y grupos, y nombres y pares
// de miembros ya usados (para no repetirlos)
function analizar(clases: Existente[]) {
  const numero = (texto: string, prefijo: string) => {
    const m = texto.match(new RegExp(`^${prefijo}\\s+(\\d+)`))
    return m ? Number(m[1]) : 0
  }
  const primerNumero = Math.max(clases.length, ...clases.map((c) => numero(c.nombre, 'Clase'))) + 1
  const grupo = `Grupo ${Math.max(0, ...clases.map((c) => numero(c.grupo, 'Grupo'))) + 1}`
  const usados: Usados = { nombres: new Set(), pares: new Set() }
  for (const c of clases) {
    const claves = c.estimulos.map((e) => e.concepto_imagen ?? e.nombre)
    for (const e of c.estimulos) usados.nombres.add(e.nombre)
    claves.forEach((x, i) => claves.slice(i + 1).forEach((y) => usados.pares.add(clavePar(x, y))))
  }
  return { primerNumero, grupo, usados }
}

async function cargar(destino: Destino, programaId: string) {
  const supabase = await createClient()
  if (destino === 'curriculo') {
    const { data: programa } = await supabase.from('programas_base').select('id, nombre').eq('id', programaId).single()
    if (!programa) return null
    const { data } = await supabase
      .from('clases_rft_base')
      .select('nombre, grupo, estimulos_rft_base(nombre, concepto_imagen)')
      .eq('programa_base_id', programaId)
    const clases = (data ?? []).map((c) => ({ nombre: c.nombre, grupo: c.grupo, estimulos: c.estimulos_rft_base }))
    return { supabase, nombre: programa.nombre, tipoRelacion: null as Enums<'tipo_relacion_rft'> | null, clases }
  }
  const { data: copia } = await supabase.from('programas_alumno').select('id, nombre, programa_base_id').eq('id', programaId).single()
  if (!copia) return null
  const { data: base } = copia.programa_base_id
    ? await supabase.from('programas_base').select('nombre, tipo_relacion').eq('id', copia.programa_base_id).single()
    : { data: null }
  const { data } = await supabase.from('clases_rft').select('nombre, grupo, estimulos_rft(nombre, concepto_imagen)').eq('programa_alumno_id', programaId)
  const clases = (data ?? []).map((c) => ({ nombre: c.nombre, grupo: c.grupo, estimulos: c.estimulos_rft }))
  // La plantilla se busca por el nombre del programa del currículo (la copia puede haberse renombrado)
  return { supabase, nombre: base?.nombre ?? copia.nombre, tipoRelacion: base?.tipo_relacion ?? null, clases }
}

export async function proponerGrupo(
  destino: Destino,
  programaId: string,
  semilla: string
): Promise<{ error: string } | { grupo: string; clases: ClaseGenerada[] }> {
  if (!(await puedeDisenar(await createClient()))) return { error: SIN_PERMISO_DISENO }
  const datos = await cargar(destino, programaId)
  if (!datos) return { error: 'Programa no encontrado' }
  if (!tienePlantilla(datos.nombre)) return { error: 'Este programa todavía no tiene generador de grupos' }
  const { primerNumero, grupo, usados } = analizar(datos.clases)
  const clases = generarGrupo(datos.nombre, semilla, primerNumero, usados)
  if (!clases) return { error: 'No se ha podido generar un grupo con el vocabulario disponible' }
  return { grupo, clases }
}

// Vuelve a generar con la misma semilla (lo mismo que se vio en la vista previa)
// y lo guarda como un grupo nuevo del programa
export async function guardarGrupoGenerado(destino: Destino, programaId: string, semilla: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  const datos = await cargar(destino, programaId)
  if (!datos) return { error: 'Programa no encontrado' }
  const { primerNumero, grupo, usados } = analizar(datos.clases)
  const clases = generarGrupo(datos.nombre, semilla, primerNumero, usados)
  if (!clases) return { error: 'No se ha podido generar el grupo' }
  const generado = { plantilla: datos.nombre, semilla, fecha: new Date().toISOString() }

  for (const c of clases) {
    const fila = { nombre: `Clase ${c.numero}`, grupo, consignas: c.consignas, generado }
    const { data: clase, error } =
      destino === 'curriculo'
        ? await supabase.from('clases_rft_base').insert({ ...fila, programa_base_id: programaId }).select('id').single()
        : await supabase
            .from('clases_rft')
            .insert({ ...fila, programa_alumno_id: programaId, tipo_relacion: datos.tipoRelacion ?? 'coordinacion' })
            .select('id')
            .single()
    if (error || !clase) return { error: error?.message ?? 'No se ha podido crear la clase' }
    const estimulos = c.estimulos.map((e) => ({
      clase_id: clase.id,
      etiqueta: `${e.posicion}${c.numero}`,
      posicion: e.posicion,
      nombre: e.nombre,
      concepto_imagen: e.concepto_imagen,
    }))
    const { error: errorEstimulos } =
      destino === 'curriculo'
        ? await supabase.from('estimulos_rft_base').insert(estimulos.map(({ clase_id, ...e }) => ({ ...e, clase_base_id: clase_id })))
        : await supabase.from('estimulos_rft').insert(estimulos)
    if (errorEstimulos) return { error: errorEstimulos.message }
  }

  revalidatePath(destino === 'curriculo' ? `/dashboard/curriculo/${programaId}` : `/dashboard/programas-rft/${programaId}`)
  return { success: true, grupo }
}
