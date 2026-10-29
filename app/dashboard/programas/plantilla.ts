import type { createClient } from '@/utils/supabase/server'

type Supabase = Awaited<ReturnType<typeof createClient>>

// Comparación entre la copia de un programa en el PEI y su plantilla
// (programas_base). Solo se comparan textos y criterios: el tipo y la forma de
// recogida no se cambian nunca en una copia, y las clases/conjuntos/pasos del
// alumno no se tocan (solo se pueden añadir los que la plantilla tenga y la
// copia no).

export const CAMPOS_PLANTILLA = [
  { campo: 'nombre', etiqueta: 'Nombre' },
  { campo: 'objetivo', etiqueta: 'Objetivo / habilidad' },
  { campo: 'materiales', etiqueta: 'Materiales' },
  { campo: 'instrucciones_terapeuta', etiqueta: 'Instrucciones para el terapeuta' },
  { campo: 'ayudas_posibles', etiqueta: 'Ayudas posibles' },
  { campo: 'ensayos_por_bloque', etiqueta: 'Ensayos por bloque' },
  { campo: 'bloques_para_dominio', etiqueta: 'Bloques para dominio' },
  { campo: 'porcentaje_dominio', etiqueta: '% de acierto para dominio' },
] as const

export type CampoPlantilla = (typeof CAMPOS_PLANTILLA)[number]['campo']

const CAMPOS_NUMERICOS: CampoPlantilla[] = ['ensayos_por_bloque', 'bloques_para_dominio', 'porcentaje_dominio']

export type DiferenciasPlantilla = {
  campos: { campo: CampoPlantilla; etiqueta: string; actual: string; plantilla: string }[]
  elementosNuevos: string[]
  // La plantilla pasó a ser de otro tipo (ej. de ABA a RFT): su contenido ya
  // no encaja en la copia y solo se puede volver a importar
  tipoCambiado: boolean
}

type ValorCampo = string | number | null

function iguales(campo: CampoPlantilla, a: ValorCampo, b: ValorCampo) {
  if (CAMPOS_NUMERICOS.includes(campo)) return Number(a) === Number(b)
  return (a ?? '').toString().trim() === (b ?? '').toString().trim()
}

export async function compararConPlantilla(supabase: Supabase, programaAlumnoId: string) {
  const { data: copia } = await supabase
    .from('programas_alumno')
    .select(
      'id, alumno_id, tipo, formato_recogida, programa_base_id, plantilla_sincronizada_at, nombre, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio'
    )
    .eq('id', programaAlumnoId)
    .maybeSingle()
  if (!copia?.programa_base_id) return null

  const { data: base } = await supabase
    .from('programas_base')
    .select(
      'id, tipo, tipo_relacion, contenido_actualizado_at, nombre, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio'
    )
    .eq('id', copia.programa_base_id)
    .maybeSingle()
  if (!base) return null

  const plantillaMasReciente = new Date(base.contenido_actualizado_at) > new Date(copia.plantilla_sincronizada_at)

  if (base.tipo !== copia.tipo) {
    return {
      copia,
      base,
      diferencias: { campos: [], elementosNuevos: [], tipoCambiado: true } as DiferenciasPlantilla,
      clasesNuevas: [],
      conjuntosNuevos: [],
      pasosNuevos: [],
      plantillaMasReciente,
    }
  }

  const campos = CAMPOS_PLANTILLA.filter(
    ({ campo }) => !iguales(campo, copia[campo] as ValorCampo, base[campo] as ValorCampo)
  ).map(({ campo, etiqueta }) => ({
    campo,
    etiqueta,
    actual: (copia[campo] ?? '').toString(),
    plantilla: (base[campo] ?? '').toString(),
  }))

  let clasesNuevas: { nombre: string; grupo: string; estimulos_rft_base: { etiqueta: string; nombre: string; posicion: string | null }[] }[] = []
  let conjuntosNuevos: { id: string; nombre: string; orden: number; estimulos_base: { nombre: string; descripcion: string | null; orden: number }[] }[] = []
  let pasosNuevos: { id: string; nombre: string; descripcion: string | null; orden: number }[] = []

  if (copia.tipo === 'rft') {
    const [{ data: clasesBase }, { data: clasesCopia }] = await Promise.all([
      supabase
        .from('clases_rft_base')
        .select('nombre, grupo, orden, estimulos_rft_base(etiqueta, nombre, posicion)')
        .eq('programa_base_id', base.id)
        .order('orden'),
      supabase.from('clases_rft').select('nombre, grupo').eq('programa_alumno_id', copia.id),
    ])
    const existentes = new Set((clasesCopia ?? []).map((c) => `${c.grupo}__${c.nombre}`))
    clasesNuevas = (clasesBase ?? []).filter((c) => !existentes.has(`${c.grupo}__${c.nombre}`))
  } else if (copia.tipo === 'aba_clasico') {
    const [{ data: conjuntosBase }, { data: conjuntosCopia }] = await Promise.all([
      supabase
        .from('conjuntos_estimulos_base')
        .select('id, nombre, orden, estimulos_base(nombre, descripcion, orden)')
        .eq('programa_base_id', base.id)
        .order('orden'),
      supabase.from('conjuntos_estimulos_alumno').select('conjunto_base_id').eq('programa_alumno_id', copia.id),
    ])
    const existentes = new Set((conjuntosCopia ?? []).map((c) => c.conjunto_base_id))
    conjuntosNuevos = (conjuntosBase ?? []).filter((c) => !existentes.has(c.id))

    if (copia.formato_recogida === 'analisis_tareas') {
      const [{ data: pasosBase }, { data: pasosCopia }] = await Promise.all([
        supabase.from('pasos_tarea_base').select('id, nombre, descripcion, orden').eq('programa_base_id', base.id).order('orden'),
        supabase.from('pasos_tarea_alumno').select('paso_base_id').eq('programa_alumno_id', copia.id),
      ])
      const pasosExistentes = new Set((pasosCopia ?? []).map((p) => p.paso_base_id))
      pasosNuevos = (pasosBase ?? []).filter((p) => !pasosExistentes.has(p.id))
    }
  }

  const diferencias: DiferenciasPlantilla = {
    campos,
    elementosNuevos: [
      ...clasesNuevas.map((c) => `Clase "${c.nombre}" (${c.grupo})`),
      ...conjuntosNuevos.map((c) => `Conjunto "${c.nombre}"`),
      ...pasosNuevos.map((p) => `Paso "${p.nombre}"`),
    ],
    tipoCambiado: false,
  }

  return {
    copia,
    base,
    diferencias,
    clasesNuevas,
    conjuntosNuevos,
    pasosNuevos,
    // La plantilla cambió después de la última sincronización (aplicada o descartada)
    plantillaMasReciente,
  }
}

// Diferencias a mostrar en el aviso del programa, o null si no hay que avisar
export async function avisoPlantilla(supabase: Supabase, programaAlumnoId: string) {
  const comparacion = await compararConPlantilla(supabase, programaAlumnoId)
  if (!comparacion?.plantillaMasReciente) return null
  const { diferencias } = comparacion
  if (!diferencias.tipoCambiado && diferencias.campos.length === 0 && diferencias.elementosNuevos.length === 0) return null
  return diferencias
}
