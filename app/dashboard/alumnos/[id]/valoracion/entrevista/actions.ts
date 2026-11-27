'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import type { Json } from '@/database.types'
import { puedeDisenar } from '../../../../permisos'
import { calcularEstado, leerRespuestas, valoracionPorDominio, type Respuesta } from './logica'
import { PREGUNTAS } from './preguntas'

// La entrevista la puede hacer cualquier terapeuta con acceso al alumno; el
// traslado al punto de partida, solo quien diseña el PEI

const PREFIJO_NOTA = 'Entrevista inicial'

export async function crearEntrevista(alumnoId: string, nivelSalto: number | null, modalidad: 'vocal' | 'no_vocal') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('entrevistas_iniciales')
    .insert({ alumno_id: alumnoId, nivel_salto: nivelSalto && nivelSalto > 1 ? nivelSalto : null, modalidad })
    .select('id')
    .single()
  if (error || !data) return { error: error?.message ?? 'No se ha podido crear la entrevista' }
  revalidatePath(`/dashboard/alumnos/${alumnoId}`, 'layout')
  return { id: data.id }
}

export async function responder(
  entrevistaId: string,
  n: number,
  respuesta: Respuesta | null,
  comprobado?: { aciertos: number; total: number }
) {
  if (!PREGUNTAS.some((p) => p.n === n)) return { error: 'Pregunta no válida' }
  const supabase = await createClient()
  const { data: e } = await supabase.from('entrevistas_iniciales').select('respuestas, estado').eq('id', entrevistaId).single()
  if (!e) return { error: 'Entrevista no encontrada' }
  if (e.estado !== 'en_curso') return { error: 'La entrevista ya está cerrada' }
  const respuestas = leerRespuestas(e.respuestas)
  if (respuesta) respuestas[n] = { r: respuesta, ...(comprobado ? { comprobado } : {}) }
  else delete respuestas[n]
  const { error } = await supabase.from('entrevistas_iniciales').update({ respuestas: respuestas as Json }).eq('id', entrevistaId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function finalizarEntrevista(entrevistaId: string, notas: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  const { data: e } = await supabase.from('entrevistas_iniciales').select('alumno_id, respuestas, nivel_salto, estado').eq('id', entrevistaId).single()
  if (!e) return { error: 'Entrevista no encontrada' }
  if (e.estado !== 'en_curso') return { error: 'La entrevista ya está cerrada' }
  const respuestas = leerRespuestas(e.respuestas)
  const estado = calcularEstado(respuestas, e.nivel_salto)
  const ahora = new Date()
  const { error } = await supabase
    .from('entrevistas_iniciales')
    .update({
      estado: 'finalizada',
      finalizada_at: ahora.toISOString(),
      nivel_recomendado: estado.nivel,
      dominio_recomendado: estado.dominio,
      lagunas: estado.lagunas,
      pendientes: estado.pendientes,
      notas: notas.trim().slice(0, 2000) || null,
    })
    .eq('id', entrevistaId)
  if (error) return { error: error.message }

  // Punto de partida por dominio: no se toca lo valorado a mano ni en bloque
  let trasladados = 0
  if (await puedeDisenar(supabase)) {
    const porDominio = valoracionPorDominio(respuestas, e.nivel_salto)
    const { data: dominios } = await supabase.from('dominios_curriculo').select('id, codigo')
    const idDominio = new Map((dominios ?? []).map((d) => [d.codigo, d.id]))
    const ids = Object.keys(porDominio).map((c) => idDominio.get(c)).filter((x): x is string => !!x)
    const { data: programas } = await supabase
      .from('programas_base')
      .select('id, dominio_id')
      .is('clinica_id', null)
      .eq('activo', true)
      .in('dominio_id', ids)
    const { data: previas } = await supabase.from('evaluaciones_iniciales').select('programa_base_id, notas').eq('alumno_id', e.alumno_id)
    const manuales = new Set(
      (previas ?? [])
        .filter((v) => !(v.notas ?? '').startsWith(PREFIJO_NOTA) && !(v.notas ?? '').startsWith('Evaluación estandarizada'))
        .map((v) => v.programa_base_id)
    )
    const codigoDe = new Map((dominios ?? []).map((d) => [d.id, d.codigo]))
    const nota = `${PREFIJO_NOTA} del ${ahora.toLocaleDateString('es-ES')}`
    const filas = (programas ?? [])
      .filter((p) => !manuales.has(p.id) && p.dominio_id)
      .map((p) => ({
        alumno_id: e.alumno_id,
        programa_base_id: p.id,
        valoracion: porDominio[codigoDe.get(p.dominio_id!)!],
        notas: nota,
        evaluado_por: user.id,
        updated_at: ahora.toISOString(),
      }))
    if (filas.length) {
      const { error: errorValoracion } = await supabase.from('evaluaciones_iniciales').upsert(filas, { onConflict: 'alumno_id,programa_base_id' })
      if (errorValoracion) return { error: `Entrevista guardada, pero no el punto de partida: ${errorValoracion.message}` }
      trasladados = filas.length
    }
  }
  revalidatePath(`/dashboard/alumnos/${e.alumno_id}`, 'layout')
  return { success: true, trasladados }
}

export async function anularEntrevista(entrevistaId: string) {
  const supabase = await createClient()
  const { data: e, error } = await supabase
    .from('entrevistas_iniciales')
    .update({ estado: 'anulada' })
    .eq('id', entrevistaId)
    .select('alumno_id')
    .single()
  if (error || !e) return { error: error?.message ?? 'No se ha podido anular' }
  revalidatePath(`/dashboard/alumnos/${e.alumno_id}`, 'layout')
  return { success: true }
}
