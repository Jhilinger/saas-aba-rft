'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cargarItems, cargarRespuestas, cargarVinculos } from './cargar'
import { calcularColocacion, notaColocacion } from './colocacion'
import { importarPrograma } from '../../actions'
import { calcularRuta, estadoEntrenamiento, leerEnsayos, type Ensayo, type Fuente } from './logica'

const MAX_ENSAYOS = 60

function rutaLista(alumnoId: string) {
  return `/dashboard/alumnos/${alumnoId}/valoracion/estandarizada`
}

async function evaluacionEditable(supabase: Awaited<ReturnType<typeof createClient>>, evaluacionId: string) {
  const { data } = await supabase.from('evaluaciones').select('id, alumno_id, estado').eq('id', evaluacionId).single()
  return data
}

export async function crearEvaluacion(alumnoId: string, modalidad: 'vocal' | 'no_vocal') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (modalidad !== 'vocal' && modalidad !== 'no_vocal') return { error: 'Modalidad no válida' }

  const { data: enCurso } = await supabase
    .from('evaluaciones')
    .select('id')
    .eq('alumno_id', alumnoId)
    .eq('estado', 'en_curso')
    .limit(1)
  if (enCurso?.length) return { error: 'Ya hay una evaluación en curso para este alumno' }

  const { data, error } = await supabase
    .from('evaluaciones')
    .insert({ alumno_id: alumnoId, evaluador_id: user.id, modalidad })
    .select('id')
    .single()
  if (error || !data) return { error: error?.message ?? 'No se pudo crear la evaluación' }

  revalidatePath(rutaLista(alumnoId))
  return { id: data.id }
}

export async function guardarRespuesta(
  evaluacionId: string,
  itemId: string,
  datos: { puntuacion: number | null; noProcede: boolean; fuente: Fuente; ensayos: Ensayo[]; notas: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const evaluacion = await evaluacionEditable(supabase, evaluacionId)
  if (!evaluacion) return { error: 'Evaluación no encontrada' }
  if (evaluacion.estado !== 'en_curso') return { error: 'La evaluación no está en curso' }

  const puntuacion = datos.noProcede ? null : datos.puntuacion
  if (puntuacion !== null && ![0, 1, 2].includes(puntuacion)) return { error: 'Puntuación no válida' }
  if (!datos.noProcede && puntuacion === null) return { error: 'Falta la puntuación' }
  if (datos.fuente !== 'observado' && datos.fuente !== 'informado') return { error: 'Fuente no válida' }
  const ensayos = leerEnsayos(datos.ensayos).slice(0, MAX_ENSAYOS)
  const entrenamiento = estadoEntrenamiento(ensayos)

  const { error } = await supabase.from('evaluacion_respuestas').upsert(
    {
      evaluacion_id: evaluacionId,
      item_id: itemId,
      puntuacion,
      no_aplicado: datos.noProcede ? 'no_procede' : null,
      fuente: datos.fuente,
      ensayos,
      bloques_entrenamiento: entrenamiento.bloques.length || null,
      entrenamiento_superado: entrenamiento.bloques.length ? entrenamiento.superado : null,
      notas: datos.notas.trim().slice(0, 1000) || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'evaluacion_id,item_id' }
  )
  if (error) return { error: error.message }

  await supabase.from('evaluaciones').update({ updated_at: new Date().toISOString() }).eq('id', evaluacionId)
  return { success: true }
}

export async function borrarRespuesta(evaluacionId: string, itemId: string) {
  const supabase = await createClient()
  const evaluacion = await evaluacionEditable(supabase, evaluacionId)
  if (!evaluacion || evaluacion.estado !== 'en_curso') return { error: 'La evaluación no está en curso' }

  const { error } = await supabase
    .from('evaluacion_respuestas')
    .delete()
    .eq('evaluacion_id', evaluacionId)
    .eq('item_id', itemId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function fijarNivelInicio(evaluacionId: string, nivel: number) {
  const supabase = await createClient()
  const evaluacion = await evaluacionEditable(supabase, evaluacionId)
  if (!evaluacion || evaluacion.estado !== 'en_curso') return { error: 'La evaluación no está en curso' }
  if (![1, 2, 3, 4].includes(nivel)) return { error: 'Nivel no válido' }

  const { error } = await supabase
    .from('evaluaciones')
    .update({ nivel_inicio: nivel, updated_at: new Date().toISOString() })
    .eq('id', evaluacionId)
  if (error) return { error: error.message }

  revalidatePath(`${rutaLista(evaluacion.alumno_id)}/${evaluacionId}`)
  return { success: true }
}

// Deja constancia de los ítems que la ruta no aplicó (techo o requisito) y
// cierra la evaluación
export async function finalizarEvaluacion(evaluacionId: string) {
  const supabase = await createClient()
  const { data: evaluacion } = await supabase
    .from('evaluaciones')
    .select('id, alumno_id, estado, nivel_inicio')
    .eq('id', evaluacionId)
    .single()
  if (!evaluacion || evaluacion.estado !== 'en_curso') return { error: 'La evaluación no está en curso' }
  if (evaluacion.nivel_inicio === null) return { error: 'Falta completar el cribado' }

  const [items, respuestas] = await Promise.all([cargarItems(supabase), cargarRespuestas(supabase, evaluacionId)])
  const ruta = calcularRuta(items, new Map(respuestas.map((r) => [r.itemId, r])), evaluacion.nivel_inicio)
  const saltados = [...ruta.estados].filter(([, estado]) => estado === 'techo' || estado === 'requisito')

  if (saltados.length) {
    const { error } = await supabase.from('evaluacion_respuestas').upsert(
      saltados.map(([itemId, estado]) => ({
        evaluacion_id: evaluacionId,
        item_id: itemId,
        puntuacion: null,
        no_aplicado: estado,
      })),
      { onConflict: 'evaluacion_id,item_id' }
    )
    if (error) return { error: error.message }
  }

  const ahora = new Date().toISOString()
  const { error } = await supabase
    .from('evaluaciones')
    .update({ estado: 'finalizada', finalizada_at: ahora, updated_at: ahora })
    .eq('id', evaluacionId)
  if (error) return { error: error.message }

  revalidatePath(rutaLista(evaluacion.alumno_id), 'layout')
  return { success: true }
}

export async function cambiarEstadoEvaluacion(evaluacionId: string, estado: 'en_curso' | 'anulada') {
  const supabase = await createClient()
  const evaluacion = await evaluacionEditable(supabase, evaluacionId)
  if (!evaluacion) return { error: 'Evaluación no encontrada' }
  if (estado !== 'en_curso' && estado !== 'anulada') return { error: 'Estado no válido' }
  if (evaluacion.estado === estado) return { success: true }

  // Solo puede haber una en curso por alumno
  if (estado === 'en_curso') {
    const { data: otra } = await supabase
      .from('evaluaciones')
      .select('id')
      .eq('alumno_id', evaluacion.alumno_id)
      .eq('estado', 'en_curso')
      .neq('id', evaluacionId)
      .limit(1)
    if (otra?.length) return { error: 'Ya hay otra evaluación en curso para este alumno' }
  }

  const { error } = await supabase
    .from('evaluaciones')
    .update({ estado, finalizada_at: null, updated_at: new Date().toISOString() })
    .eq('id', evaluacionId)
  if (error) return { error: error.message }

  revalidatePath(rutaLista(evaluacion.alumno_id), 'layout')
  return { success: true }
}

// Traslada la evaluación finalizada a la valoración por programas. Los
// programas de `mantener` conservan su valoración manual.
export async function aplicarColocacion(evaluacionId: string, mantener: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: evaluacion } = await supabase
    .from('evaluaciones')
    .select('id, alumno_id, estado, finalizada_at')
    .eq('id', evaluacionId)
    .single()
  if (!evaluacion || evaluacion.estado !== 'finalizada') return { error: 'Solo se puede colocar una evaluación finalizada' }

  const [items, respuestas, vinculos, { data: dominadosPei }] = await Promise.all([
    cargarItems(supabase),
    cargarRespuestas(supabase, evaluacionId),
    cargarVinculos(supabase),
    supabase
      .from('programas_alumno')
      .select('programa_base_id')
      .eq('alumno_id', evaluacion.alumno_id)
      .in('estado', ['dominado', 'mantenimiento'])
      .not('programa_base_id', 'is', null),
  ])
  const colocacion = calcularColocacion(items, new Map(respuestas.map((r) => [r.itemId, r])), vinculos)
  const fecha = new Date(evaluacion.finalizada_at ?? Date.now()).toLocaleDateString('es-ES')
  // Lo ya dominado en el PEI no se vuelve a valorar
  const conservar = new Set([...mantener, ...(dominadosPei ?? []).map((p) => p.programa_base_id!)])
  const ahora = new Date().toISOString()

  const filas = colocacion
    .filter((c) => !conservar.has(c.programaBaseId))
    .map((c) => ({
      alumno_id: evaluacion.alumno_id,
      programa_base_id: c.programaBaseId,
      valoracion: c.valoracion,
      notas: notaColocacion(fecha, c.evidencias),
      evaluado_por: user.id,
      updated_at: ahora,
    }))

  if (filas.length) {
    const { error } = await supabase.from('evaluaciones_iniciales').upsert(filas, { onConflict: 'alumno_id,programa_base_id' })
    if (error) return { error: error.message }
  }

  const { error } = await supabase
    .from('evaluaciones')
    .update({ colocacion_aplicada_at: ahora, updated_at: ahora })
    .eq('id', evaluacionId)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${evaluacion.alumno_id}`, 'layout')
  return { success: true, aplicados: filas.length }
}

// Añade al PEI los programas elegidos de la propuesta (con el importador
// habitual, que vuelve a comprobar la secuencia del currículo)
export async function anadirPropuestaAlPei(alumnoId: string, programaBaseIds: string[]) {
  const errores: string[] = []
  let importados = 0
  for (const id of programaBaseIds.slice(0, 20)) {
    const res = await importarPrograma(alumnoId, id)
    if ('error' in res && res.error) errores.push(res.error)
    else importados++
  }
  revalidatePath(`/dashboard/alumnos/${alumnoId}`, 'layout')
  return { importados, errores }
}
