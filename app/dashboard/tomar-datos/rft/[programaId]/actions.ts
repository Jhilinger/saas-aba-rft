'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type EnsayoInput = {
  claseId: string
  estimuloOrigenId: string
  estimuloDestinoId: string
  pregunta?: string
  correcto: boolean
  ayuda: string
}

// Fases donde tiene sentido reevaluar el dominio del grupo
// (entrenamiento no cuenta como criterio de dominio, es donde se enseña)
const FASES_QUE_EVALUAN_DOMINIO = [
  'entrenamiento',
  'test_mutuo',
  'test_combinatorio',
  'transformacion_funciones',
]

export async function guardarBloqueRft(
  programaAlumnoId: string,
  alumnoId: string,
  grupo: string,
  fase: string,
  posicionOrigen: string,
  posicionDestino: string,
  numComparativos: number,
  ensayos: EnsayoInput[],
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (ensayos.length === 0) return { error: 'No hay ensayos que guardar' }

  const totalEnsayos = ensayos.length
  // Solo cuenta como acierto si fue correcto Y sin ayuda (independiente).
  // Un acierto con ayuda se guarda igualmente en el detalle, pero no suma al %.
  const aciertos = ensayos.filter((e) => e.correcto && e.ayuda === 'independiente').length

  const { data: bloque, error: bloqueError } = await supabase
    .from('bloques_ensayo_rft')
    .insert({
      programa_alumno_id: programaAlumnoId,
      terapeuta_id: user.id,
      grupo,
      fase,
      posicion_origen: posicionOrigen,
      posicion_destino: posicionDestino,
      num_comparativos: numComparativos,
      total_ensayos: totalEnsayos,
      aciertos,
      notas: notas?.trim() || null,
    })
    .select('id')
    .single()

  if (bloqueError || !bloque) {
    return { error: bloqueError?.message ?? 'Error creando el bloque' }
  }

  const { error: detalleError } = await supabase.from('ensayos_rft_detalle').insert(
    ensayos.map((e) => ({
      bloque_id: bloque.id,
      clase_id: e.claseId,
      estimulo_origen_id: e.estimuloOrigenId,
      estimulo_destino_id: e.estimuloDestinoId,
      pregunta: e.pregunta ?? null,
      correcto: e.correcto,
      ayuda: e.ayuda,
    }))
  )

  if (detalleError) return { error: detalleError.message }

  // Si es fase de entrenamiento, marcamos como entrenados los pares usados
  // (evitando duplicados gracias al unique constraint de la tabla)
  if (fase === 'entrenamiento') {
    const paresUnicos = new Map<string, { claseId: string; origenId: string; destinoId: string }>()
    ensayos.forEach((e) => {
      const key = `${e.claseId}-${e.estimuloOrigenId}-${e.estimuloDestinoId}`
      paresUnicos.set(key, {
        claseId: e.claseId,
        origenId: e.estimuloOrigenId,
        destinoId: e.estimuloDestinoId,
      })
    })

    for (const par of paresUnicos.values()) {
      await supabase
        .from('relaciones_entrenadas_rft')
        .insert({
          clase_id: par.claseId,
          estimulo_origen_id: par.origenId,
          estimulo_destino_id: par.destinoId,
        })
        .select()
        .maybeSingle() // si ya existe (unique constraint), simplemente lo ignoramos
    }
  }

  // Recalculamos el dominio a nivel de GRUPO para esta combinación exacta
  // de fase+posiciones. La celebración se basa en si ESTA combinación
  // concreta acaba de pasar a dominada (independiente de otras fases).
  let clasesDominadasAhora: string[] = []

  if (FASES_QUE_EVALUAN_DOMINIO.includes(fase)) {
    const { data: antes } = await supabase
      .from('dominio_rft_fases')
      .select('dominado')
      .eq('programa_alumno_id', programaAlumnoId)
      .eq('grupo', grupo)
      .eq('fase', fase)
      .eq('posicion_origen', posicionOrigen)
      .eq('posicion_destino', posicionDestino)
      .maybeSingle()

    const dominadoAntes = antes?.dominado ?? false

    const { error: rpcError } = await supabase.rpc('actualizar_dominio_grupo_rft', {
      p_programa_alumno_id: programaAlumnoId,
      p_grupo: grupo,
      p_fase: fase,
      p_posicion_origen: posicionOrigen,
      p_posicion_destino: posicionDestino,
    })

    if (rpcError) return { error: rpcError.message }

    const { data: despues } = await supabase
      .from('dominio_rft_fases')
      .select('dominado')
      .eq('programa_alumno_id', programaAlumnoId)
      .eq('grupo', grupo)
      .eq('fase', fase)
      .eq('posicion_origen', posicionOrigen)
      .eq('posicion_destino', posicionDestino)
      .maybeSingle()

    const dominadoDespues = despues?.dominado ?? false

    if (!dominadoAntes && dominadoDespues) {
      const clasesUnicas = [...new Set(ensayos.map((e) => e.claseId))]
      const { data: clases } = await supabase
        .from('clases_rft')
        .select('nombre')
        .in('id', clasesUnicas)
      clasesDominadasAhora = (clases ?? []).map((c) => c.nombre)
    }
  }

  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)

  return {
    success: true,
    porcentaje: Math.round((aciertos / totalEnsayos) * 100),
    clasesDominadasAhora,
  }
}