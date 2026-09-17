'use server'

import { createClient } from '@/utils/supabase/server'
import { calcularDistribucionAyudas } from '../../ayuda-tipos'

export async function obtenerEvolucionAba(programaAlumnoId: string) {
  const supabase = await createClient()

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estado')
    .eq('programa_alumno_id', programaAlumnoId)
    .order('orden')

  if (!conjuntos || conjuntos.length === 0) return { conjuntos: [], distribucionAyudas: [], sondas: [] }

  const resultado = await Promise.all(
    conjuntos.map(async (c) => {
      const { data: bloques } = await supabase
        .from('bloques_ensayo')
        .select('fecha, porcentaje, fase')
        .eq('conjunto_id', c.id)
        .order('fecha', { ascending: true })

      return {
        id: c.id,
        nombre: c.nombre,
        estado: c.estado,
        bloques: (bloques ?? []).flatMap((b) => {
          if (!['linea_base', 'intervencion'].includes(b.fase)) return []
          return [{
            fecha: new Date(b.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
            fechaISO: b.fecha,
            porcentaje: Number(b.porcentaje),
            fase: b.fase as 'linea_base' | 'intervencion',
          }]
        }),
      }
    })
  )

  // Distribución de tipos de ayuda usados en todo el programa (todos los
  // conjuntos juntos), para el donut de "cuánta ayuda hizo falta".
  const { data: bloquesTodos } = await supabase
    .from('bloques_ensayo')
    .select('id')
    .in('conjunto_id', conjuntos.map((c) => c.id))

  const bloqueIds = (bloquesTodos ?? []).map((b) => b.id)
  const ensayos = bloqueIds.length
    ? (
        await supabase
          .from('ensayos_aba_detalle')
          .select('ayuda')
          .in('bloque_id', bloqueIds)
      ).data ?? []
    : []

  // Sondas de generalización y mantenimiento: se muestran aparte del gráfico
  // principal (son puntuales, no una serie continua de sesiones).
  const { data: bloquesSonda } = await supabase
    .from('bloques_ensayo')
    .select('id, fecha, porcentaje, fase, notas, conjunto_id')
    .in('conjunto_id', conjuntos.map((c) => c.id))
    .in('fase', ['generalizacion', 'mantenimiento'])
    .order('fecha', { ascending: false })

  const nombrePorConjunto = new Map(conjuntos.map((c) => [c.id, c.nombre]))
  const sondas = (bloquesSonda ?? []).map((b) => ({
    id: b.id,
    fecha: new Date(b.fecha).toLocaleDateString('es-ES'),
    tipo: b.fase as 'generalizacion' | 'mantenimiento',
    contexto: b.notas,
    porcentaje: Number(b.porcentaje),
    conjuntoNombre: nombrePorConjunto.get(b.conjunto_id) ?? '—',
  }))

  return { conjuntos: resultado, distribucionAyudas: calcularDistribucionAyudas(ensayos), sondas }
}