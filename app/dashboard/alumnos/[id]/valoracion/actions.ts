'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function guardarValoracion(
  alumnoId: string,
  programaBaseId: string,
  valoracion: 'dominado' | 'parcial' | 'no',
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('evaluaciones_iniciales').upsert(
    {
      alumno_id: alumnoId,
      programa_base_id: programaBaseId,
      valoracion,
      notas: notas?.trim() || null,
      evaluado_por: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'alumno_id,programa_base_id' }
  )

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function borrarValoracion(alumnoId: string, programaBaseId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('evaluaciones_iniciales')
    .delete()
    .eq('alumno_id', alumnoId)
    .eq('programa_base_id', programaBaseId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// Importa al PEI (como línea base) todos los programas marcados como
// "no" o "parcial" que todavía no estén ya importados para este alumno
export async function importarNoDominados(alumnoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: valoraciones } = await supabase
    .from('evaluaciones_iniciales')
    .select('programa_base_id, valoracion')
    .eq('alumno_id', alumnoId)
    .in('valoracion', ['no', 'parcial'])

  if (!valoraciones || valoraciones.length === 0) {
    return { error: 'No hay programas marcados como "No" o "Parcial" para importar' }
  }

  const { data: yaImportados } = await supabase
    .from('programas_alumno')
    .select('programa_base_id')
    .eq('alumno_id', alumnoId)
    .not('programa_base_id', 'is', null)

  const idsYaImportados = new Set((yaImportados ?? []).map((p) => p.programa_base_id))
  const pendientes = valoraciones.filter((v) => !idsYaImportados.has(v.programa_base_id))

  if (pendientes.length === 0) {
    return { success: true, importados: 0, yaExistian: valoraciones.length }
  }

  let importados = 0
  const errores: string[] = []

  for (const v of pendientes) {
    const { data: base } = await supabase
      .from('programas_base')
      .select(
        'nombre, tipo, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, orden'
      )
      .eq('id', v.programa_base_id)
      .single()

    if (!base) continue

    const { data: programaAlumno, error: insertError } = await supabase
      .from('programas_alumno')
      .insert({
        alumno_id: alumnoId,
        programa_base_id: v.programa_base_id,
        nombre: base.nombre,
        tipo: base.tipo,
        area: base.area,
        objetivo: base.objetivo,
        materiales: base.materiales,
        instrucciones_terapeuta: base.instrucciones_terapeuta,
        ayudas_posibles: base.ayudas_posibles,
        terapeuta_id: user.id,
        ensayos_por_bloque: base.ensayos_por_bloque,
        bloques_para_dominio: base.bloques_para_dominio,
        porcentaje_dominio: base.porcentaje_dominio,
        orden: base.orden,
      })
      .select('id')
      .single()

    if (insertError || !programaAlumno) {
      errores.push(base.nombre)
      continue
    }

    // Si es ABA, copiamos también los conjuntos/estímulos de plantilla
    // (nacen en línea base automáticamente, por el valor por defecto)
    if (base.tipo === 'aba_clasico') {
      const { data: conjuntosBase } = await supabase
        .from('conjuntos_estimulos_base')
        .select('nombre, orden, estimulos_base(nombre, descripcion, orden)')
        .eq('programa_base_id', v.programa_base_id)
        .order('orden')

      for (const conjunto of conjuntosBase ?? []) {
        const { data: nuevoConjunto } = await supabase
          .from('conjuntos_estimulos_alumno')
          .insert({
            programa_alumno_id: programaAlumno.id,
            nombre: conjunto.nombre,
            orden: conjunto.orden,
          })
          .select('id')
          .single()

        if (nuevoConjunto && conjunto.estimulos_base?.length) {
          await supabase.from('estimulos_alumno').insert(
            conjunto.estimulos_base.map((e: any) => ({
              conjunto_id: nuevoConjunto.id,
              nombre: e.nombre,
              descripcion: e.descripcion,
              orden: e.orden,
            }))
          )
        }
      }
    }

    importados++
  }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true, importados, errores }
}