// Cómo responde el alumno en un programa RFT. Por defecto elige un estímulo
// entre comparaciones; algunos programas piden en cambio una de varias
// opciones fijas (sí/no, igual/diferente/no se sabe…), ejecutar una acción o
// una respuesta abierta. Se configura en el programa y puede cambiar por fase.

import type { Json } from '@/database.types'

export const TIPOS_RESPUESTA = ['seleccion', 'opciones', 'ejecucion', 'abierta'] as const
export type TipoRespuesta = (typeof TIPOS_RESPUESTA)[number]

export const NOMBRE_TIPO_RESPUESTA: Record<TipoRespuesta, string> = {
  seleccion: 'Selección de estímulo',
  opciones: 'Opciones fijas',
  ejecucion: 'Ejecución (lo hace o no)',
  abierta: 'Respuesta abierta',
}

export type ConfigRespuesta = { tipo: TipoRespuesta; opciones: string[] }

export function esTipoRespuesta(valor: unknown): valor is TipoRespuesta {
  return typeof valor === 'string' && (TIPOS_RESPUESTA as readonly string[]).includes(valor)
}

// Texto "Sí, No" → ["Sí", "No"] (sin vacíos ni repetidos)
export function parsearOpciones(texto: string): string[] {
  return [...new Set(texto.split(',').map((o) => o.trim()).filter(Boolean))]
}

// Lee respuesta_por_fase (jsonb) descartando lo que no tenga forma válida
export function leerRespuestaPorFase(valor: Json | null | undefined): Record<string, ConfigRespuesta> {
  const resultado: Record<string, ConfigRespuesta> = {}
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return resultado
  for (const [fase, config] of Object.entries(valor)) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) continue
    const { tipo, opciones } = config as { tipo?: unknown; opciones?: unknown }
    if (!esTipoRespuesta(tipo)) continue
    resultado[fase] = {
      tipo,
      opciones: Array.isArray(opciones) ? opciones.filter((o): o is string => typeof o === 'string') : [],
    }
  }
  return resultado
}

// Configuración que se aplica en una fase: la propia de la fase o la general
export function configRespuesta(
  programa: { tipo_respuesta: string; opciones_respuesta: string[] | null; respuesta_por_fase: Json | null },
  fase: string
): ConfigRespuesta {
  const porFase = leerRespuestaPorFase(programa.respuesta_por_fase)
  if (porFase[fase]) return porFase[fase]
  return {
    tipo: esTipoRespuesta(programa.tipo_respuesta) ? programa.tipo_respuesta : 'seleccion',
    opciones: programa.opciones_respuesta ?? [],
  }
}

// Clave de las respuestas esperadas de una clase: "A→C"
export function claveCombinacion(origen: string, destino: string) {
  return `${origen}→${destino}`
}

export function leerRespuestasEsperadas(valor: Json | null | undefined): Record<string, string> {
  const resultado: Record<string, string> = {}
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return resultado
  for (const [clave, respuesta] of Object.entries(valor)) {
    if (typeof respuesta === 'string' && respuesta.trim()) resultado[clave] = respuesta
  }
  return resultado
}

// El programa usa en alguna fase una respuesta que no es elegir un estímulo
// (solo entonces tienen sentido las respuestas esperadas por clase)
export function usaRespuestasSinSeleccion(programa: {
  tipo_respuesta: string
  respuesta_por_fase: Json | null
}): boolean {
  if (programa.tipo_respuesta !== 'seleccion') return true
  return Object.values(leerRespuestaPorFase(programa.respuesta_por_fase)).some((c) => c.tipo !== 'seleccion')
}

// Validación en el servidor de las respuestas esperadas de una clase
export function validarRespuestasEsperadas(valor: unknown): Record<string, string> | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const resultado: Record<string, string> = {}
  for (const [clave, respuesta] of Object.entries(valor)) {
    if (!/^[A-E]→[A-E]$/.test(clave) || typeof respuesta !== 'string') return null
    const limpia = respuesta.trim().slice(0, 200)
    if (limpia) resultado[clave] = limpia
  }
  return resultado
}
