'use server'

import { createClient } from '@/utils/supabase/server'

export async function obtenerEvolucionRft(programaAlumnoId: string) {
  const supabase = await createClient()

  const { data: bloques } = await supabase
    .from('bloques_ensayo_rft')
    .select('fase, grupo, posicion_origen, posicion_destino, fecha, porcentaje')
    .eq('programa_alumno_id', programaAlumnoId)
    .order('fecha', { ascending: true })

  type Punto = { fecha: string; porcentaje: number }
  type Serie = {
    id: string
    label: string
    grupo: string
    bloques: Punto[]
  }

  const porFase: Record<string, Serie[]> = {}

  for (const b of bloques ?? []) {
    // Bloques antiguos anteriores a esta mejora no tienen grupo guardado;
    // los ignoramos para este gráfico (no podemos saber a qué grupo pertenecen)
    if (!b.grupo) continue

    if (!porFase[b.fase]) porFase[b.fase] = []

    const id = `${b.grupo}__${b.posicion_origen}__${b.posicion_destino}`
    let entrada = porFase[b.fase].find((e) => e.id === id)
    if (!entrada) {
      entrada = {
        id,
        label: `${b.posicion_origen}→${b.posicion_destino}`,
        grupo: b.grupo,
        bloques: [],
      }
      porFase[b.fase].push(entrada)
    }

    entrada.bloques.push({
      fecha: new Date(b.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      porcentaje: Number(b.porcentaje),
    })
  }

  return { porFase }
}