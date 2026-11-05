import type { Json } from '@/database.types'

// Consignas de los programas RFT: la clave relacional que se da al alumno en
// cada paso («Toca el igual», «Toca el contrario», «Toca {muestra}»…). Tiene que
// ser la misma desde los programas de abstracción hasta los de relaciones
// arbitrarias, y la misma con material y en la tableta.
//
// programas_*.consignas: { pasos: { "fase:O→D": texto }, alternativas: { "O→D": texto } }
// clases_rft*.consignas: { "fase:O→D": texto } (prioridad sobre las del programa;
// para preguntas que dependen de la clase: transformación de funciones, categorías)
// {muestra} se sustituye por la palabra oída de la muestra. En las sondas de
// generalización se usa la alternativa de la relación, si la hay, para
// comprobar que la respuesta no depende de una frase concreta.

export type ConsignasPrograma = { pasos: Record<string, string>; alternativas: Record<string, string> }

const FASES_SONDA = ['generalizacion', 'mantenimiento']
const MAX = 200

export function claveConsigna(fase: string, origen: string, destino: string) {
  return `${fase}:${origen}→${destino}`
}

function textos(v: unknown): Record<string, string> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  return Object.fromEntries(
    Object.entries(v as Record<string, unknown>)
      .filter(([, t]) => typeof t === 'string' && t.trim())
      .map(([k, t]) => [k, (t as string).trim().slice(0, MAX)])
  )
}

export function leerConsignasPrograma(valor: Json | null | undefined): ConsignasPrograma {
  const o = valor && typeof valor === 'object' && !Array.isArray(valor) ? (valor as Record<string, unknown>) : {}
  return { pasos: textos(o.pasos), alternativas: textos(o.alternativas) }
}

export function leerConsignasClase(valor: Json | null | undefined): Record<string, string> {
  return textos(valor)
}

// Consigna de un ensayo. Las sondas usan la de cualquier fase con la misma
// relación (las de generalización, la alternativa si existe).
export function consignaPara(
  programa: ConsignasPrograma,
  clase: Record<string, string>,
  fase: string,
  origen: string,
  destino: string,
  muestra: string
): string | null {
  const relacion = `${origen}→${destino}`
  let texto: string | undefined
  if (FASES_SONDA.includes(fase)) {
    const deRelacion = (m: Record<string, string>) => Object.entries(m).find(([k]) => k.endsWith(`:${relacion}`))?.[1]
    texto = (fase === 'generalizacion' ? programa.alternativas[relacion] : undefined) ?? deRelacion(clase) ?? deRelacion(programa.pasos)
  } else {
    const clave = claveConsigna(fase, origen, destino)
    texto = clase[clave] ?? programa.pasos[clave]
  }
  return texto ? texto.replaceAll('{muestra}', muestra.toLowerCase()) : null
}
