'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

const URL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// Importa un programa (de Currículo base, Currículo clínica o Mis programas
// — los 3 viven en la misma tabla programas_base): copia sus conjuntos y
// estímulos (solo aplica de verdad a ABA; en RFT solo se copian los metadatos)
export async function importarPrograma(alumnoId: string, programaBaseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: base, error: baseError } = await supabase
    .from('programas_base')
    .select(
      'nombre, tipo, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, orden'
    )
    .eq('id', programaBaseId)
    .single()

  if (baseError || !base) return { error: 'Programa base no encontrado' }

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
      orden: base.orden,
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

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// Crea un programa 100% personalizado, sin plantilla base
export async function crearProgramaPersonalizado(
  alumnoId: string,
  nombre: string,
  tipo: string,
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

// --- FAMILIA ---

export async function crearFamiliar(alumnoId: string, nombre: string, email: string) {
  const supabase = await createClient()

  const { data: alumno } = await supabase
    .from('alumnos')
    .select('clinica_id')
    .eq('id', alumnoId)
    .single()

  if (!alumno) return { error: 'Alumno no encontrado' }

  const admin = createAdminClient()

  // Comprobamos que el email no esté ya en uso, para dar un error claro
  const { data: existente } = await admin.from('perfiles').select('id').eq('email', email).maybeSingle()
  if (existente) {
    return { error: `Ya existe una cuenta con el email "${email}".` }
  }

  const { data: authUser, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${URL_BASE}/login`,
  })

  if (authError || !authUser.user) {
    return { error: authError?.message ?? 'Error invitando al familiar' }
  }

  const { error: perfilError } = await admin.from('perfiles').insert({
    id: authUser.user.id,
    clinica_id: alumno.clinica_id,
    rol: 'familia',
    nombre,
    email,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return { error: perfilError.message }
  }

  const { error: vinculoError } = await admin.from('alumno_familia').insert({
    alumno_id: alumnoId,
    perfil_id: authUser.user.id,
  })

  if (vinculoError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return { error: vinculoError.message }
  }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function desvincularFamiliar(perfilId: string, alumnoId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alumno_familia')
    .delete()
    .eq('alumno_id', alumnoId)
    .eq('perfil_id', perfilId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// --- TERAPEUTAS ---

export async function vincularTerapeuta(alumnoId: string, terapeutaId: string, esPrincipal: boolean) {
  const supabase = await createClient()

  if (esPrincipal) {
    await supabase
      .from('alumno_terapeuta')
      .update({ es_principal: false })
      .eq('alumno_id', alumnoId)
  }

  const { error } = await supabase.from('alumno_terapeuta').insert({
    alumno_id: alumnoId,
    terapeuta_id: terapeutaId,
    es_principal: esPrincipal,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function desvincularTerapeuta(alumnoId: string, terapeutaId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alumno_terapeuta')
    .delete()
    .eq('alumno_id', alumnoId)
    .eq('terapeuta_id', terapeutaId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

export async function marcarTerapeutaPrincipal(alumnoId: string, terapeutaId: string) {
  const supabase = await createClient()

  await supabase
    .from('alumno_terapeuta')
    .update({ es_principal: false })
    .eq('alumno_id', alumnoId)

  const { error } = await supabase
    .from('alumno_terapeuta')
    .update({ es_principal: true })
    .eq('alumno_id', alumnoId)
    .eq('terapeuta_id', terapeutaId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}

// --- DATOS DEL ALUMNO ---

export async function editarAlumno(alumnoId: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('alumnos')
    .update({
      nombre_anonimizado: formData.get('nombre_anonimizado') as string,
      fecha_nacimiento: formData.get('fecha_nacimiento') as string,
      diagnostico: formData.get('diagnostico') as string,
      colegio: formData.get('colegio') as string,
      notas_clinicas: formData.get('notas_clinicas') as string,
      contacto_emergencia: formData.get('contacto_emergencia') as string,
      alergias: formData.get('alergias') as string,
    })
    .eq('id', alumnoId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  revalidatePath('/dashboard/equipo')
  return { success: true }
}