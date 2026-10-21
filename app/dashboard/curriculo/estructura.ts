import type { createClient } from '@/utils/supabase/server'

// El currículo se organiza en Niveles (1-4) → Dominios (1.1, 1.2...) →
// Programas. Solo los programas globales forman parte del currículo; los de
// una clínica o un terapeuta son "complementarios" (sin dominio ni código,
// lo garantiza un CHECK en programas_base).
// El código de un programa es posicional: "<dominio>.<posición>" (ej. 1.3.4),
// y se recalcula si se reordena. programas_base.orden guarda la posición
// dentro del dominio, contigua gracias a la función SQL
// colocar_programa_curriculo y al trigger de borrado.

export type Nivel = { numero: number; nombre: string }
export type Dominio = { id: string; nivel: number; numero: number; codigo: string; nombre: string }
export type EstructuraCurriculo = {
  niveles: Nivel[]
  dominios: Dominio[]
}

type ProgramaPosicionable = { dominio_id: string | null; orden: number | null; clinica_id: string | null }

type Supabase = Awaited<ReturnType<typeof createClient>>

export async function cargarEstructuraCurriculo(supabase: Supabase): Promise<EstructuraCurriculo> {
  const [{ data: niveles }, { data: dominios }] = await Promise.all([
    supabase.from('niveles_curriculo').select('numero, nombre').order('numero'),
    supabase.from('dominios_curriculo').select('id, nivel, numero, codigo, nombre').order('nivel').order('numero'),
  ])

  return {
    niveles: niveles ?? [],
    dominios: (dominios ?? []).map((d) => ({ ...d, codigo: d.codigo ?? `${d.nivel}.${d.numero}` })),
  }
}

export function crearCodificador(estructura: EstructuraCurriculo) {
  const dominios = new Map(estructura.dominios.map((d) => [d.id, d]))

  const dominioDe = (p: ProgramaPosicionable) =>
    p.clinica_id === null && p.dominio_id && p.orden !== null ? dominios.get(p.dominio_id) : undefined

  return {
    codigo(p: ProgramaPosicionable): string | null {
      const dominio = dominioDe(p)
      return dominio ? `${dominio.codigo}.${p.orden}` : null
    },
    // Clave numérica para ordenar programas de distintos dominios
    // (se copia a programas_alumno.orden al importar)
    ordenGlobal(p: ProgramaPosicionable): number | null {
      const dominio = dominioDe(p)
      return dominio ? dominio.nivel * 100000 + dominio.numero * 1000 + p.orden! : null
    },
  }
}
