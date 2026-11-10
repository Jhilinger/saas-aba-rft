'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { FASES_QUE_REQUIEREN_CONEXION, construirGrafoEntrenado, estanConectadas } from './relaciones-rft'
import { coerceNivelRft, FASES_POR_NIVEL, NOMBRE_NIVEL_RFT } from '../../../niveles-rft'
import { duracionValida, latenciaMedia, latenciaValida } from '../../tiempos'
import { leerEscalonBloque } from '../../../sin-error'
import type { Json } from '@/database.types'

// En los conceptos generados en la tableta no hay clase ni estímulos fijos:
// los ids van a null y el ensayo se describe en generado
type EnsayoInput = {
  claseId: string | null
  estimuloOrigenId: string | null
  estimuloDestinoId: string | null
  generado?: Json
  pregunta?: string
  correcto: boolean
  ayuda: string
  latenciaMs?: number | null
  respuesta?: string | null
  // Ayudas de menor a mayor: nivel con que acertó tras fallar (1–5)
  nivelAyuda?: number | null
}

// Ensayo de transferencia: el mismo ensayo sin ayuda tras acertar con ayuda
type TransferenciaInput = {
  claseId: string | null
  estimuloOrigenId: string | null
  estimuloDestinoId: string | null
  correcto: boolean
  latenciaMs?: number | null
  respuesta?: string | null
}

function nivelAyudaValido(v: unknown): number | null {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5 ? v : null
}

type ControlInput = {
  claseId: string
  estimuloOrigenId: string
  pregunta: string
  respuesta: string | null
  correcto: boolean
}

// Texto libre del alumno o pregunta del terapeuta: recortado y con límite
function textoLimitado(valor: unknown, maximo: number): string | null {
  if (typeof valor !== 'string') return null
  const limpio = valor.trim()
  return limpio ? limpio.slice(0, maximo) : null
}
// "directo" existe en el enum de la base de datos pero nunca ha sido
// seleccionable desde la interfaz (no encaja con el flujo de comparación
// tipo match-to-sample que usan el resto de fases) — se deja fuera de la
// lista de fases válidas para que la API tampoco lo acepte.
const FASES_VALIDAS = ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones', 'generalizacion', 'mantenimiento'] as const
type FaseRft = (typeof FASES_VALIDAS)[number]
const AYUDAS_VALIDAS = ['independiente', 'verbal', 'verbal_parcial', 'gestual', 'visual', 'modelado', 'fisica_parcial', 'fisica_total', 'textual'] as const
type AyudaRft = (typeof AYUDAS_VALIDAS)[number]

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
  notas?: string,
  duracionSegundos?: number | null,
  controles: ControlInput[] = [],
  modo: 'material' | 'tableta' = 'material',
  // Escalón de aprendizaje sin error con que se hizo el bloque (solo entrenamiento)
  sinError: unknown = null,
  transferencias: TransferenciaInput[] = [],
  // Clave y opciones también en texto (solo en la tableta)
  conTexto = false
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (ensayos.length === 0) return { error: 'No hay ensayos que guardar' }
  if (!FASES_VALIDAS.includes(fase as FaseRft)) return { error: 'Fase no válida' }
  if (ensayos.some((ensayo) => !AYUDAS_VALIDAS.includes(ensayo.ayuda as AyudaRft))) {
    return { error: 'Tipo de ayuda no válido' }
  }

  // El nivel del programa (abstracción/mutuo/combinatorio) limita qué fases
  // tienen sentido — ej. no hay test combinatorio posible con clases de 2
  // miembros. Las sondas (generalizacion/mantenimiento) se dejan pasar
  // siempre: si la combinación llegó a dominarse, ya pasó este filtro
  // cuando se registró como test.
  if (fase !== 'generalizacion' && fase !== 'mantenimiento') {
    const { data: programa } = await supabase
      .from('programas_alumno')
      .select('nivel_rft')
      .eq('id', programaAlumnoId)
      .single()
    const nivel = coerceNivelRft(programa?.nivel_rft)
    if (!FASES_POR_NIVEL[nivel].includes(fase)) {
      return { error: `Un programa de ${NOMBRE_NIVEL_RFT[nivel]} no admite la fase "${fase}"` }
    }
  }

  // Un test de vínculo mutuo/combinatorio o de transformación de funciones
  // solo es válido si ya se domina en entrenamiento una cadena de
  // relaciones que conecte esas dos posiciones (comprobación de refuerzo:
  // el cliente ya bloquea esto en la interfaz, pero se repite aquí porque
  // esta acción decide qué cuenta como dato real).
  if ((FASES_QUE_REQUIEREN_CONEXION as readonly string[]).includes(fase)) {
    const { data: entrenamientosDominados } = await supabase
      .from('dominio_rft_fases')
      .select('grupo, posicion_origen, posicion_destino')
      .eq('programa_alumno_id', programaAlumnoId)
      .eq('grupo', grupo)
      .eq('fase', 'entrenamiento')
      .eq('dominado', true)

    const grafo = construirGrafoEntrenado(entrenamientosDominados ?? [], grupo)
    if (!estanConectadas(grafo, posicionOrigen, posicionDestino)) {
      return {
        error: `Todavía no se puede probar ${posicionOrigen}→${posicionDestino}: hace falta dominar antes en entrenamiento una cadena de relaciones que las conecte.`,
      }
    }
  }

  const escalon = fase === 'entrenamiento' ? leerEscalonBloque(sinError as Json) : null

  const totalEnsayos = ensayos.length
  // Solo cuenta como acierto si fue correcto Y sin ayuda (independiente).
  // Un acierto con ayuda se guarda igualmente en el detalle, pero no suma al %.
  const aciertos = ensayos.filter((e) => e.correcto && e.ayuda === 'independiente').length
  const latencias = ensayos.map((e) => latenciaValida(e.latenciaMs))

  const { data: bloque, error: bloqueError } = await supabase
    .from('bloques_ensayo_rft')
    .insert({
      duracion_segundos: duracionValida(duracionSegundos),
      latencia_media_ms: latenciaMedia(latencias),
      // Los ensayos de control se guardan aparte: no cuentan para el % ni el dominio
      controles_total: controles.length,
      controles_aciertos: controles.filter((c) => c.correcto).length,
      programa_alumno_id: programaAlumnoId,
      terapeuta_id: user.id,
      grupo,
      fase: fase as FaseRft,
      posicion_origen: posicionOrigen,
      posicion_destino: posicionDestino,
      num_comparativos: numComparativos,
      total_ensayos: totalEnsayos,
      modo: modo === 'tableta' ? 'tableta' : 'material',
      con_texto: modo === 'tableta' && conTexto === true,
      sin_error: escalon,
      aciertos,
      notas: notas?.trim() || null,
    })
    .select('id')
    .single()

  if (bloqueError || !bloque) {
    return { error: bloqueError?.message ?? 'Error creando el bloque' }
  }

  const { error: detalleError } = await supabase.from('ensayos_rft_detalle').insert(
    ensayos.map((e, i) => ({
      bloque_id: bloque.id,
      clase_id: e.claseId,
      estimulo_origen_id: e.estimuloOrigenId,
      estimulo_destino_id: e.estimuloDestinoId,
      pregunta: e.pregunta ?? null,
      correcto: e.correcto,
      ayuda: e.ayuda as AyudaRft,
      latencia_ms: latencias[i],
      respuesta: textoLimitado(e.respuesta, 500),
      nivel_ayuda: fase === 'entrenamiento' ? nivelAyudaValido(e.nivelAyuda) : null,
      generado: e.generado ?? null,
    }))
  )

  if (detalleError) return { error: detalleError.message }

  // Los ensayos de transferencia se guardan aparte: no cuentan para el % ni el dominio
  if (transferencias.length > 0 && fase === 'entrenamiento') {
    const { error: transferenciasError } = await supabase.from('ensayos_rft_detalle').insert(
      transferencias.map((t) => ({
        bloque_id: bloque.id,
        clase_id: t.claseId,
        estimulo_origen_id: t.estimuloOrigenId,
        estimulo_destino_id: t.estimuloDestinoId,
        correcto: t.correcto,
        ayuda: 'independiente' as AyudaRft,
        latencia_ms: latenciaValida(t.latenciaMs),
        respuesta: textoLimitado(t.respuesta, 500),
        tipo_ensayo: 'transferencia',
      }))
    )
    if (transferenciasError) return { error: transferenciasError.message }
  }

  if (controles.length > 0) {
    const { error: controlesError } = await supabase.from('ensayos_rft_detalle').insert(
      controles.map((c) => ({
        bloque_id: bloque.id,
        clase_id: c.claseId,
        estimulo_origen_id: c.estimuloOrigenId,
        estimulo_destino_id: null,
        pregunta: textoLimitado(c.pregunta, 1000),
        respuesta: textoLimitado(c.respuesta, 500),
        correcto: c.correcto,
        ayuda: 'independiente' as AyudaRft,
        tipo_ensayo: 'control',
      }))
    )
    if (controlesError) return { error: controlesError.message }
  }

  // Si es fase de entrenamiento, marcamos como entrenados los pares usados
  // (evitando duplicados gracias al unique constraint de la tabla)
  if (fase === 'entrenamiento') {
    const paresUnicos = new Map<string, { claseId: string; origenId: string; destinoId: string }>()
    ensayos.forEach((e) => {
      if (!e.claseId || !e.estimuloOrigenId || !e.estimuloDestinoId) return
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
  let derivado = false
  // Esta combinación (grupo + fase + posiciones) acaba de pasar a dominada
  let dominadoAhora = false

  if (FASES_QUE_EVALUAN_DOMINIO.includes(fase)) {
    const { data: antes } = await supabase
      .from('dominio_rft_fases')
      .select('dominado')
      .eq('programa_alumno_id', programaAlumnoId)
      .eq('grupo', grupo)
      .eq('fase', fase as FaseRft)
      .eq('posicion_origen', posicionOrigen)
      .eq('posicion_destino', posicionDestino)
      .maybeSingle()

    const dominadoAntes = antes?.dominado ?? false

    const { error: rpcError } = await supabase.rpc('actualizar_dominio_grupo_rft', {
      p_programa_alumno_id: programaAlumnoId,
      p_grupo: grupo,
      p_fase: fase as FaseRft,
      p_posicion_origen: posicionOrigen,
      p_posicion_destino: posicionDestino,
    })

    if (rpcError) return { error: rpcError.message }

    const { data: despues } = await supabase
      .from('dominio_rft_fases')
      .select('dominado, via_entrenamiento')
      .eq('programa_alumno_id', programaAlumnoId)
      .eq('grupo', grupo)
      .eq('fase', fase as FaseRft)
      .eq('posicion_origen', posicionOrigen)
      .eq('posicion_destino', posicionDestino)
      .maybeSingle()

    const dominadoDespues = despues?.dominado ?? false

    dominadoAhora = !dominadoAntes && dominadoDespues
    if (dominadoAhora) {
      const clasesUnicas = [...new Set(ensayos.map((e) => e.claseId).filter((c): c is string => !!c))]
      const { data: clases } = await supabase
        .from('clases_rft')
        .select('nombre')
        .in('id', clasesUnicas)
      clasesDominadasAhora = (clases ?? []).map((c) => c.nombre)
      derivado = fase !== 'entrenamiento' && !despues?.via_entrenamiento
    }
  }

  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)

  return {
    success: true,
    porcentaje: Math.round((aciertos / totalEnsayos) * 100),
    clasesDominadasAhora,
    derivado,
    dominadoAhora,
  }
}

// Mostrar también en texto la clave y las opciones en la tableta (alumno
// lector): se recuerda en el programa del alumno
export async function guardarTextoTablet(programaAlumnoId: string, conTexto: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('programas_alumno').update({ texto_tablet: conTexto }).eq('id', programaAlumnoId)
  return error ? { error: error.message } : {}
}
