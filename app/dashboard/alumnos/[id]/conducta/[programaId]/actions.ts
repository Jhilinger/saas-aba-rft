'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Estos componentes de registro (ABC, tasa, duración, intervalo, latencia) se
// usan en la página de programa ABA (terapeuta y familia) para cualquier
// programa aba_clasico con formato_recogida distinto de ensayo_discreto.
// router.refresh() ya refresca la ruta actual; esto solo evita dejar
// cachés obsoletas de la otra vista (terapeuta vs familia) del mismo programa.
function revalidarRegistroConducta(alumnoId: string, programaAlumnoId: string) {
  revalidatePath(`/dashboard/programas/${programaAlumnoId}`)
  revalidatePath(`/dashboard/mi-hijo/programa/${programaAlumnoId}`)
}

export async function toggleVisibleFamiliaPrograma(programaAlumnoId: string, alumnoId: string, valor: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('programas_alumno')
    .update({ visible_familia: valor })
    .eq('id', programaAlumnoId)
  if (error) return { error: error.message }
  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function crearRegistroAbc(
  programaAlumnoId: string,
  alumnoId: string,
  datos: { antecedente: string; conducta: string; consecuencia: string; notas?: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (!datos.antecedente.trim() || !datos.conducta.trim() || !datos.consecuencia.trim()) {
    return { error: 'Antecedente, conducta y consecuencia son obligatorios' }
  }

  const { error } = await supabase.from('registros_abc').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    antecedente: datos.antecedente.trim(),
    conducta: datos.conducta.trim(),
    consecuencia: datos.consecuencia.trim(),
    notas: datos.notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function editarRegistroAbc(
  registroId: string,
  alumnoId: string,
  programaAlumnoId: string,
  datos: { antecedente: string; conducta: string; consecuencia: string; notas?: string }
) {
  const supabase = await createClient()

  if (!datos.antecedente.trim() || !datos.conducta.trim() || !datos.consecuencia.trim()) {
    return { error: 'Antecedente, conducta y consecuencia son obligatorios' }
  }

  const { error } = await supabase
    .from('registros_abc')
    .update({
      antecedente: datos.antecedente.trim(),
      conducta: datos.conducta.trim(),
      consecuencia: datos.consecuencia.trim(),
      notas: datos.notas?.trim() || null,
    })
    .eq('id', registroId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function eliminarRegistroAbc(registroId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('registros_abc').delete().eq('id', registroId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

async function obtenerFase(supabase: Awaited<ReturnType<typeof createClient>>, programaAlumnoId: string) {
  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('estado')
    .eq('id', programaAlumnoId)
    .single()
  return programa?.estado === 'linea_base' ? 'linea_base' : 'intervencion'
}

export async function guardarBloqueTasa(
  programaAlumnoId: string,
  alumnoId: string,
  duracionObservacionSegundos: number,
  numeroOcurrencias: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_tasa').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    duracion_observacion_segundos: duracionObservacionSegundos,
    numero_ocurrencias: numeroOcurrencias,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function editarBloqueTasa(
  bloqueId: string,
  alumnoId: string,
  programaAlumnoId: string,
  duracionObservacionSegundos: number,
  numeroOcurrencias: number,
  notas?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bloques_tasa')
    .update({
      duracion_observacion_segundos: duracionObservacionSegundos,
      numero_ocurrencias: numeroOcurrencias,
      notas: notas?.trim() || null,
    })
    .eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function eliminarBloqueTasa(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_tasa').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function guardarBloqueDuracion(
  programaAlumnoId: string,
  alumnoId: string,
  duracionSesionSegundos: number,
  numeroEpisodios: number,
  duracionTotalConductaSegundos: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_duracion').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    duracion_sesion_segundos: duracionSesionSegundos,
    numero_episodios: numeroEpisodios,
    duracion_total_conducta_segundos: duracionTotalConductaSegundos,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function editarBloqueDuracion(
  bloqueId: string,
  alumnoId: string,
  programaAlumnoId: string,
  duracionSesionSegundos: number,
  numeroEpisodios: number,
  duracionTotalConductaSegundos: number,
  notas?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bloques_duracion')
    .update({
      duracion_sesion_segundos: duracionSesionSegundos,
      numero_episodios: numeroEpisodios,
      duracion_total_conducta_segundos: duracionTotalConductaSegundos,
      notas: notas?.trim() || null,
    })
    .eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function eliminarBloqueDuracion(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_duracion').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function guardarBloqueIntervalo(
  programaAlumnoId: string,
  alumnoId: string,
  tipoIntervalo: 'parcial' | 'total' | 'momentaneo',
  duracionIntervaloSegundos: number,
  totalIntervalos: number,
  intervalosConConducta: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_intervalo').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    tipo_intervalo: tipoIntervalo,
    duracion_intervalo_segundos: duracionIntervaloSegundos,
    total_intervalos: totalIntervalos,
    intervalos_con_conducta: intervalosConConducta,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function editarBloqueIntervalo(
  bloqueId: string,
  alumnoId: string,
  programaAlumnoId: string,
  tipoIntervalo: 'parcial' | 'total' | 'momentaneo',
  duracionIntervaloSegundos: number,
  totalIntervalos: number,
  intervalosConConducta: number,
  notas?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bloques_intervalo')
    .update({
      tipo_intervalo: tipoIntervalo,
      duracion_intervalo_segundos: duracionIntervaloSegundos,
      total_intervalos: totalIntervalos,
      intervalos_con_conducta: intervalosConConducta,
      notas: notas?.trim() || null,
    })
    .eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function eliminarBloqueIntervalo(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_intervalo').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function guardarBloqueLatencia(
  programaAlumnoId: string,
  alumnoId: string,
  numeroEnsayos: number,
  latenciaTotalSegundos: number,
  notas?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const fase = await obtenerFase(supabase, programaAlumnoId)

  const { error } = await supabase.from('bloques_latencia').insert({
    programa_alumno_id: programaAlumnoId,
    terapeuta_id: user.id,
    fase,
    numero_ensayos: numeroEnsayos,
    latencia_total_segundos: latenciaTotalSegundos,
    notas: notas?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function editarBloqueLatencia(
  bloqueId: string,
  alumnoId: string,
  programaAlumnoId: string,
  numeroEnsayos: number,
  latenciaTotalSegundos: number,
  notas?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bloques_latencia')
    .update({
      numero_ensayos: numeroEnsayos,
      latencia_total_segundos: latenciaTotalSegundos,
      notas: notas?.trim() || null,
    })
    .eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}

export async function eliminarBloqueLatencia(bloqueId: string, alumnoId: string, programaAlumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bloques_latencia').delete().eq('id', bloqueId)

  if (error) return { error: error.message }

  revalidarRegistroConducta(alumnoId, programaAlumnoId)
  return { success: true }
}