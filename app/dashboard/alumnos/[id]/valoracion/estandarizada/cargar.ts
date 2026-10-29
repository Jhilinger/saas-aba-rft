import type { createClient } from '@/utils/supabase/server'
import { leerEnsayos, type Fuente, type ItemEvaluacion, type RespuestaEvaluacion } from './logica'

type Supabase = Awaited<ReturnType<typeof createClient>>

export async function cargarItems(supabase: Supabase): Promise<ItemEvaluacion[]> {
  const { data } = await supabase
    .from('evaluacion_items')
    .select(
      'id, codigo, tipo, nivel, dominio_id, orden, titulo, formatos, relacional, indicador, consigna, materiales, ensayos, criterio_2, criterio_1, criterio_0, pregunta_familia, requiere_item_id, requiere_puntuacion, dominios_curriculo(codigo, nombre)'
    )
    .eq('activo', true)

  return (data ?? []).map((i) => ({
    id: i.id,
    codigo: i.codigo,
    tipo: i.tipo === 'cribado' ? 'cribado' : 'item',
    nivel: i.nivel,
    dominioId: i.dominio_id,
    dominioCodigo: i.dominios_curriculo?.codigo ?? null,
    dominioNombre: i.dominios_curriculo?.nombre ?? null,
    orden: i.orden,
    titulo: i.titulo,
    formatos: i.formatos,
    relacional: i.relacional,
    indicador: i.indicador,
    consigna: i.consigna,
    materiales: i.materiales,
    ensayos: i.ensayos,
    criterio2: i.criterio_2,
    criterio1: i.criterio_1,
    criterio0: i.criterio_0,
    preguntaFamilia: i.pregunta_familia,
    requiereItemId: i.requiere_item_id,
    requierePuntuacion: i.requiere_puntuacion,
  }))
}

export async function cargarRespuestas(supabase: Supabase, evaluacionId: string): Promise<RespuestaEvaluacion[]> {
  const { data } = await supabase
    .from('evaluacion_respuestas')
    .select('item_id, puntuacion, no_aplicado, fuente, ensayos, notas')
    .eq('evaluacion_id', evaluacionId)

  return (data ?? []).map((r) => ({
    itemId: r.item_id,
    puntuacion: r.puntuacion,
    noAplicado: r.no_aplicado,
    fuente: (r.fuente === 'informado' ? 'informado' : 'observado') as Fuente,
    ensayos: leerEnsayos(r.ensayos),
    notas: r.notas,
  }))
}
