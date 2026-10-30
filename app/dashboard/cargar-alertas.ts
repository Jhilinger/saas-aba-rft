import type { createClient } from '@/utils/supabase/server'
import { alertasDeUnidad, type Alerta, type BloqueAlerta } from './alertas-progreso'
import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from './secuencia-rft'

type Supabase = Awaited<ReturnType<typeof createClient>>

export type AlertasUnidad = {
  programaId: string
  programaNombre: string
  tipo: 'aba' | 'rft'
  alumnoId: string
  unidad: string
  alertas: Alerta[]
}

// Bloques recientes por unidad que se revisan (suficiente para todas las reglas)
const BLOQUES_POR_UNIDAD = 20
const FASES_RFT = ['entrenamiento', 'test_mutuo', 'test_combinatorio', 'transformacion_funciones'] as const

function conAyuda(detalle: { correcto: boolean; ayuda: string; tipo_ensayo?: string }[]) {
  return detalle.filter((e) => e.correcto && e.ayuda !== 'independiente' && (e.tipo_ensayo ?? 'principal') === 'principal').length
}

// Alertas de los programas en curso de estos alumnos (o de un solo programa)
export async function cargarAlertas(supabase: Supabase, alumnoIds: string[], programaId?: string): Promise<AlertasUnidad[]> {
  if (alumnoIds.length === 0) return []

  let consultaAba = supabase
    .from('programas_alumno')
    .select(
      'id, nombre, alumno_id, conjuntos_estimulos_alumno(id, nombre, estado, bloques_ensayo(fecha, porcentaje, fase, latencia_media_ms, aciertos, ensayos_aba_detalle(correcto, ayuda)))'
    )
    .in('alumno_id', alumnoIds)
    .eq('tipo', 'aba_clasico')
    .eq('formato_recogida', 'ensayo_discreto')
    .in('estado', ['linea_base', 'adquisicion'])
    .eq('conjuntos_estimulos_alumno.estado', 'adquisicion')
    .eq('conjuntos_estimulos_alumno.bloques_ensayo.fase', 'intervencion')
    .order('fecha', { referencedTable: 'conjuntos_estimulos_alumno.bloques_ensayo', ascending: false })
    .limit(BLOQUES_POR_UNIDAD, { referencedTable: 'conjuntos_estimulos_alumno.bloques_ensayo' })
  let consultaRft = supabase
    .from('programas_alumno')
    .select(
      'id, nombre, alumno_id, bloques_ensayo_rft(fecha, porcentaje, fase, grupo, posicion_origen, posicion_destino, latencia_media_ms, aciertos, controles_total, controles_aciertos, ensayos_rft_detalle(correcto, ayuda, tipo_ensayo)), dominio_rft_fases(grupo, fase, posicion_origen, posicion_destino, dominado)'
    )
    .in('alumno_id', alumnoIds)
    .eq('tipo', 'rft')
    .in('estado', ['linea_base', 'adquisicion'])
    .in('bloques_ensayo_rft.fase', [...FASES_RFT])
    .order('fecha', { referencedTable: 'bloques_ensayo_rft', ascending: false })
    .limit(200, { referencedTable: 'bloques_ensayo_rft' })
  if (programaId) {
    consultaAba = consultaAba.eq('id', programaId)
    consultaRft = consultaRft.eq('id', programaId)
  }
  const [{ data: aba }, { data: rft }] = await Promise.all([consultaAba, consultaRft])

  const resultado: AlertasUnidad[] = []

  for (const p of aba ?? []) {
    for (const c of p.conjuntos_estimulos_alumno ?? []) {
      const bloques: BloqueAlerta[] = (c.bloques_ensayo ?? [])
        .filter((b) => b.porcentaje !== null)
        .reverse()
        .map((b) => ({
          fecha: b.fecha,
          porcentaje: Number(b.porcentaje),
          fase: b.fase,
          latenciaMediaMs: b.latencia_media_ms,
          aciertos: b.aciertos,
          aciertosConAyuda: conAyuda(b.ensayos_aba_detalle ?? []),
          controlesTotal: 0,
          controlesAciertos: 0,
        }))
      const alertas = alertasDeUnidad(bloques, false)
      if (alertas.length) {
        resultado.push({ programaId: p.id, programaNombre: p.nombre, tipo: 'aba', alumnoId: p.alumno_id, unidad: c.nombre, alertas })
      }
    }
  }

  for (const p of rft ?? []) {
    const dominadas = new Set(
      (p.dominio_rft_fases ?? []).filter((d) => d.dominado).map((d) => `${d.grupo}|${d.fase}|${d.posicion_origen}|${d.posicion_destino}`)
    )
    const unidades = new Map<string, BloqueAlerta[]>()
    for (const b of [...(p.bloques_ensayo_rft ?? [])].reverse()) {
      if (b.porcentaje === null) continue
      const clave = `${b.grupo ?? ''}|${b.fase}|${b.posicion_origen ?? ''}|${b.posicion_destino ?? ''}`
      if (dominadas.has(clave)) continue
      const lista = unidades.get(clave) ?? []
      lista.push({
        fecha: b.fecha,
        porcentaje: Number(b.porcentaje),
        fase: b.fase,
        latenciaMediaMs: b.latencia_media_ms,
        aciertos: b.aciertos,
        aciertosConAyuda: conAyuda(b.ensayos_rft_detalle ?? []),
        controlesTotal: b.controles_total,
        controlesAciertos: b.controles_aciertos,
      })
      unidades.set(clave, lista)
    }
    for (const [clave, bloques] of unidades) {
      const [grupo, fase, origen, destino] = clave.split('|')
      const alertas = alertasDeUnidad(bloques.slice(-BLOQUES_POR_UNIDAD), fase !== 'entrenamiento')
      if (alertas.length) {
        const nombreFase = NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? fase
        resultado.push({
          programaId: p.id,
          programaNombre: p.nombre,
          tipo: 'rft',
          alumnoId: p.alumno_id,
          unidad: `${grupo} · ${nombreFase} ${origen}→${destino}`,
          alertas,
        })
      }
    }
  }

  return resultado
}
