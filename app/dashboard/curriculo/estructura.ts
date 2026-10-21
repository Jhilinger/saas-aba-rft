import type { createClient } from '@/utils/supabase/server'

// El currículo se organiza en Niveles (1-4) → Dominios (1.1, 1.2...) →
// Programas. El código de un programa es posicional: "<dominio>.<posición>"
// (ej. 1.3.4), y se recalcula si se reordena. programas_base.orden guarda la
// posición dentro del dominio, contigua por origen (global / cada clínica)
// gracias a la función SQL colocar_programa_curriculo y al trigger de borrado.
// Los programas de clínica se numeran a continuación de los globales de su
// dominio para no repetir códigos. Los privados no tienen posición ni código.

export type Nivel = { numero: number; nombre: string }
export type Dominio = { id: string; nivel: number; numero: number; codigo: string; nombre: string }
export type EstructuraCurriculo = {
  niveles: Nivel[]
  dominios: Dominio[]
  // nº de programas globales con posición en cada dominio (offset de los de clínica)
  globalesPorDominio: Record<string, number>
}

type ProgramaPosicionable = { dominio_id: string | null; orden: number | null; clinica_id: string | null }

type Supabase = Awaited<ReturnType<typeof createClient>>

export async function cargarEstructuraCurriculo(supabase: Supabase): Promise<EstructuraCurriculo> {
  const [{ data: niveles }, { data: dominios }, { data: globales }] = await Promise.all([
    supabase.from('niveles_curriculo').select('numero, nombre').order('numero'),
    supabase.from('dominios_curriculo').select('id, nivel, numero, codigo, nombre').order('nivel').order('numero'),
    supabase.from('programas_base').select('dominio_id').is('clinica_id', null).not('orden', 'is', null),
  ])

  const globalesPorDominio: Record<string, number> = {}
  for (const g of globales ?? []) {
    if (g.dominio_id) globalesPorDominio[g.dominio_id] = (globalesPorDominio[g.dominio_id] ?? 0) + 1
  }

  return {
    niveles: niveles ?? [],
    dominios: (dominios ?? []).map((d) => ({ ...d, codigo: d.codigo ?? `${d.nivel}.${d.numero}` })),
    globalesPorDominio,
  }
}

// Posición absoluta dentro del dominio (globales primero, luego la clínica)
function posicionEnDominio(p: ProgramaPosicionable, estructura: EstructuraCurriculo): number | null {
  if (!p.dominio_id || p.orden === null) return null
  return p.clinica_id === null ? p.orden : (estructura.globalesPorDominio[p.dominio_id] ?? 0) + p.orden
}

export function crearCodificador(estructura: EstructuraCurriculo) {
  const dominios = new Map(estructura.dominios.map((d) => [d.id, d]))

  return {
    codigo(p: ProgramaPosicionable): string | null {
      const pos = posicionEnDominio(p, estructura)
      const dominio = p.dominio_id ? dominios.get(p.dominio_id) : undefined
      if (pos === null || !dominio) return null
      return `${dominio.codigo}.${pos}`
    },
    // Clave numérica para ordenar programas de distintos dominios
    // (se copia a programas_alumno.orden al importar)
    ordenGlobal(p: ProgramaPosicionable): number | null {
      const pos = posicionEnDominio(p, estructura)
      const dominio = p.dominio_id ? dominios.get(p.dominio_id) : undefined
      if (pos === null || !dominio) return null
      return dominio.nivel * 100000 + dominio.numero * 1000 + pos
    },
  }
}
