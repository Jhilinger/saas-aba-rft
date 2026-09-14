'use server'

import { createClient } from '@/utils/supabase/server'

export async function obtenerEvolucionAba(programaAlumnoId: string) {
  const supabase = await createClient()

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estado')
    .eq('programa_alumno_id', programaAlumnoId)
    .order('orden')

  if (!conjuntos || conjuntos.length === 0) return { conjuntos: [] }

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

  return { conjuntos: resultado }
}