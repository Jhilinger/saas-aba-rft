'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CAMPOS_PLANTILLA, compararConPlantilla, type CampoPlantilla } from './plantilla'

function revalidarPrograma(programaAlumnoId: string, alumnoId: string) {
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/programas-rft/${programaAlumnoId}`)
  revalidatePath(`/dashboard/alumnos/${alumnoId}/pei`)
}

// Aplica a la copia del PEI los campos elegidos de su plantilla y, si se pide,
// añade las clases/conjuntos/pasos que la plantilla tiene y la copia no. Los
// datos registrados y las clases existentes del alumno no se tocan.
export async function actualizarDesdePlantilla(
  programaAlumnoId: string,
  campos: CampoPlantilla[],
  anadirElementos: boolean
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const validos = CAMPOS_PLANTILLA.map((c) => c.campo) as readonly string[]
  if (campos.some((c) => !validos.includes(c))) return { error: 'Campo no válido' }

  // Con RLS: si el usuario no puede ver el programa, no hay comparación
  const comparacion = await compararConPlantilla(supabase, programaAlumnoId)
  if (!comparacion) return { error: 'Programa o plantilla no encontrados' }
  if (comparacion.diferencias.tipoCambiado) {
    return { error: 'La plantilla ha cambiado de tipo: para usar la versión nueva hay que volver a importar el programa.' }
  }
  const { copia, base, clasesNuevas, conjuntosNuevos, pasosNuevos } = comparacion

  const cambios = Object.fromEntries(campos.map((campo) => [campo, base[campo]]))
  const { error } = await supabase
    .from('programas_alumno')
    .update({ ...cambios, plantilla_sincronizada_at: new Date().toISOString() })
    .eq('id', copia.id)
  if (error) return { error: error.message }

  if (anadirElementos) {
    for (const clase of clasesNuevas) {
      const { data: nuevaClase, error: claseError } = await supabase
        .from('clases_rft')
        .insert({
          programa_alumno_id: copia.id,
          nombre: clase.nombre,
          grupo: clase.grupo,
          tipo_relacion: base.tipo_relacion ?? 'coordinacion',
          respuestas_esperadas: clase.respuestas_esperadas,
        })
        .select('id')
        .single()
      if (claseError) return { error: claseError.message }
      if (clase.estimulos_rft_base.length) {
        const { error: estimulosError } = await supabase.from('estimulos_rft').insert(
          clase.estimulos_rft_base.map((e) => ({
            clase_id: nuevaClase.id,
            etiqueta: e.etiqueta,
            nombre: e.nombre,
            posicion: e.posicion,
          }))
        )
        if (estimulosError) return { error: estimulosError.message }
      }
    }

    for (const conjunto of conjuntosNuevos) {
      const { data: nuevoConjunto, error: conjuntoError } = await supabase
        .from('conjuntos_estimulos_alumno')
        .insert({
          programa_alumno_id: copia.id,
          conjunto_base_id: conjunto.id,
          nombre: conjunto.nombre,
          orden: conjunto.orden,
        })
        .select('id')
        .single()
      if (conjuntoError) return { error: conjuntoError.message }
      if (conjunto.estimulos_base.length) {
        const { error: estimulosError } = await supabase.from('estimulos_alumno').insert(
          conjunto.estimulos_base.map((e) => ({
            conjunto_id: nuevoConjunto.id,
            nombre: e.nombre,
            descripcion: e.descripcion,
            orden: e.orden,
          }))
        )
        if (estimulosError) return { error: estimulosError.message }
      }
    }

    if (pasosNuevos.length) {
      const { error: pasosError } = await supabase.from('pasos_tarea_alumno').insert(
        pasosNuevos.map((p) => ({
          programa_alumno_id: copia.id,
          paso_base_id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          orden: p.orden,
        }))
      )
      if (pasosError) return { error: pasosError.message }
    }
  }

  revalidarPrograma(copia.id, copia.alumno_id)
  return { success: true }
}

// Mantiene la versión del alumno: el aviso no vuelve a salir hasta que la
// plantilla cambie otra vez
export async function descartarAvisoPlantilla(programaAlumnoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data, error } = await supabase
    .from('programas_alumno')
    .update({ plantilla_sincronizada_at: new Date().toISOString() })
    .eq('id', programaAlumnoId)
    .select('alumno_id')
    .maybeSingle()
  if (error) return { error: error.message }
  if (!data) return { error: 'Programa no encontrado' }

  revalidarPrograma(programaAlumnoId, data.alumno_id)
  return { success: true }
}
