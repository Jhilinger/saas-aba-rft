'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cargarEstructuraCurriculo, crearCodificador } from '../../curriculo/estructura'
import { calcularBloqueos, ROLES_EXCEPCION_SECUENCIA } from '../../curriculo/secuencia'
import { cargarProgresoAlumno } from './progreso/cargar-progreso'

type TipoPrograma = 'aba_clasico' | 'rft' | 'conducta'

// Importa un programa (del Currículo base, Programas de la clínica o Mis programas
// — los 3 viven en la misma tabla programas_base): copia sus conjuntos y
// estímulos (solo aplica de verdad a ABA; en RFT solo se copian los metadatos)
// Si el dominio del programa está bloqueado por la secuencia del currículo,
// solo el clinica_admin/superadmin puede importarlo, con justificación.
export async function importarPrograma(alumnoId: string, programaBaseId: string, justificacion?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

    const { data: base, error: baseError } = await supabase
    .from('programas_base')
    .select(
      'nombre, tipo, tipo_relacion, nivel_rft, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, orden, dominio_id, clinica_id, formato_recogida, direccion_objetivo, direccion_cadena'
    )
    .eq('id', programaBaseId)
    .single()

  if (baseError || !base) return { error: 'Programa base no encontrado' }

  const estructura = await cargarEstructuraCurriculo(supabase)
  // orden en el alumno = clave global del currículo (nivel, dominio, posición)
  const ordenGlobal = crearCodificador(estructura).ordenGlobal(base)

  let excepcion: { excepcion_secuencia: string; excepcion_por: string } | null = null
  if (base.dominio_id) {
    const { data: alumno } = await supabase.from('alumnos').select('id, clinica_id').eq('id', alumnoId).single()
    if (!alumno) return { error: 'Alumno no encontrado' }

    const { niveles } = await cargarProgresoAlumno(supabase, alumno, estructura)
    const motivo = calcularBloqueos(niveles).get(base.dominio_id)
    if (motivo) {
      const texto = justificacion?.trim()
      if (!texto) return { error: `"${base.nombre}" está bloqueado: ${motivo}.` }

      const { data: perfil } = await supabase.from('perfiles').select('rol').eq('id', user.id).single()
      if (!perfil || !ROLES_EXCEPCION_SECUENCIA.includes(perfil.rol)) {
        return { error: 'Solo el administrador de la clínica puede saltarse la secuencia del currículo.' }
      }
      excepcion = { excepcion_secuencia: texto, excepcion_por: user.id }
    }
  }

  const { data: programaAlumno, error: insertError } = await supabase
    .from('programas_alumno')
    .insert({
      alumno_id: alumnoId,
      programa_base_id: programaBaseId,
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
      orden: ordenGlobal,
      formato_recogida: base.formato_recogida,
      direccion_objetivo: base.direccion_objetivo,
      direccion_cadena: base.direccion_cadena,
      nivel_rft: base.nivel_rft,
      ...excepcion,
    })
    .select('id')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: `"${base.nombre}" ya está importado en el PEI de este alumno. No se puede añadir dos veces.` }
    }
    return { error: insertError.message }
  }

  if (!programaAlumno) {
    return { error: 'Error creando el programa' }
  }

  if (base.tipo === 'aba_clasico') {
    const { data: conjuntosBase } = await supabase
      .from('conjuntos_estimulos_base')
      .select('id, nombre, orden, estimulos_base(nombre, descripcion, orden)')
      .eq('programa_base_id', programaBaseId)
      .order('orden')

    for (const conjunto of conjuntosBase ?? []) {
      const { data: nuevoConjunto } = await supabase
        .from('conjuntos_estimulos_alumno')
        .insert({
          programa_alumno_id: programaAlumno.id,
          conjunto_base_id: conjunto.id,
          nombre: conjunto.nombre,
          orden: conjunto.orden,
        })
        .select('id')
        .single()

            if (nuevoConjunto && conjunto.estimulos_base?.length) {
        await supabase.from('estimulos_alumno').insert(
          conjunto.estimulos_base.map((e) => ({
            conjunto_id: nuevoConjunto.id,
            nombre: e.nombre,
            descripcion: e.descripcion,
            orden: e.orden,
          }))
        )
      }
    }

    if (base.formato_recogida === 'analisis_tareas') {
      const { data: pasosBase } = await supabase
        .from('pasos_tarea_base')
        .select('id, nombre, descripcion, orden')
        .eq('programa_base_id', programaBaseId)
        .order('orden')

      if (pasosBase?.length) {
        await supabase.from('pasos_tarea_alumno').insert(
          pasosBase.map((p) => ({
            programa_alumno_id: programaAlumno.id,
            paso_base_id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            orden: p.orden,
          }))
        )
      }
    }
  } else if (base.tipo === 'rft') {
    const { data: clasesBase } = await supabase
      .from('clases_rft_base')
      .select('id, nombre, grupo, orden, estimulos_rft_base(etiqueta, nombre, posicion, orden)')
      .eq('programa_base_id', programaBaseId)
      .order('orden')

    for (const clase of clasesBase ?? []) {
      const { data: nuevaClase } = await supabase
        .from('clases_rft')
        .insert({
          programa_alumno_id: programaAlumno.id,
          nombre: clase.nombre,
          grupo: clase.grupo,
          tipo_relacion: base.tipo_relacion ?? 'coordinacion',
        })
        .select('id')
        .single()

      if (nuevaClase && clase.estimulos_rft_base?.length) {
        await supabase.from('estimulos_rft').insert(
          clase.estimulos_rft_base.map((e) => ({
            clase_id: nuevaClase.id,
            etiqueta: e.etiqueta,
            nombre: e.nombre,
            posicion: e.posicion,
          }))
        )
      }
    }
  }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// Crea un programa 100% personalizado, sin plantilla base
export async function crearProgramaPersonalizado(
  alumnoId: string,
  nombre: string,
  tipo: TipoPrograma,
  area: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('programas_alumno').insert({
    alumno_id: alumnoId,
    programa_base_id: null,
    nombre,
    tipo,
    area: area || 'General',
    terapeuta_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// --- DATOS DEL ALUMNO ---

export async function editarAlumno(alumnoId: string, formData: FormData) {
  const supabase = await createClient()
  // Campo vacío = sin dato (null): una fecha o modalidad vacía no es válida
  const textoONulo = (campo: string) => ((formData.get(campo) as string) ?? '').trim() || null

  const { error } = await supabase
    .from('alumnos')
    .update({
      nombre_anonimizado: formData.get('nombre_anonimizado') as string,
      fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    })
    .eq('id', alumnoId)

  if (error) return { error: error.message }

  // Datos clínicos: tabla aparte, solo visible para el personal (no familias)
  const { error: errorClinicos } = await supabase.from('alumnos_datos_clinicos').upsert({
    alumno_id: alumnoId,
    fecha_inicio_intervencion: textoONulo('fecha_inicio_intervencion'),
    diagnostico: textoONulo('diagnostico'),
    modalidad_comunicacion: textoONulo('modalidad_comunicacion'),
    idiomas_entorno: textoONulo('idiomas_entorno'),
    colegio: textoONulo('colegio'),
    otras_terapias: textoONulo('otras_terapias'),
    medicacion: textoONulo('medicacion'),
    alergias: textoONulo('alergias'),
    conductas_riesgo: textoONulo('conductas_riesgo'),
    contacto_emergencia: textoONulo('contacto_emergencia'),
    notas_clinicas: textoONulo('notas_clinicas'),
    updated_at: new Date().toISOString(),
  })

  if (errorClinicos) return { error: errorClinicos.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  revalidatePath('/dashboard/equipo')
  return { success: true }
}