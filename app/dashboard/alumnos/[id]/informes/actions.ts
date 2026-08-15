'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import Anthropic from '@anthropic-ai/sdk'

const LIMITE_INFORMES_MES = 4

function inicioMesActual(): string {
  const ahora = new Date()
  return new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--
  return edad
}

const ETIQUETA_TIPO: Record<string, string> = {
  comida: 'comida',
  juguete: 'juguete',
  actividad: 'actividad',
  sensorial: 'estímulo sensorial',
  social: 'refuerzo social',
  musica: 'música',
  otro: 'otro',
}

export async function generarInforme(
  alumnoId: string,
  destinatario: 'familia' | 'formal',
  periodoDesde: string,
  periodoHasta: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // --- Límite mensual ---
  const { count } = await supabase
    .from('informes')
    .select('id', { count: 'exact', head: true })
    .eq('alumno_id', alumnoId)
    .gte('created_at', inicioMesActual())

  if ((count ?? 0) >= LIMITE_INFORMES_MES) {
    return {
      error: `Este alumno ya tiene ${LIMITE_INFORMES_MES} informes generados este mes. Espera al próximo mes para generar más.`,
    }
  }

  // --- Datos del alumno y de la clínica ---
  const { data: alumno } = await supabase
    .from('alumnos')
    .select('nombre_anonimizado, fecha_nacimiento, diagnostico, clinica_id')
    .eq('id', alumnoId)
    .single()

  if (!alumno) return { error: 'Alumno no encontrado' }

  const { data: clinica } = await supabase
    .from('clinicas')
    .select('nombre')
    .eq('id', alumno.clinica_id)
    .single()

  const edad = calcularEdad(alumno.fecha_nacimiento)

  // --- Preferencias / reforzadores conocidos (TODOS, no solo los del período:
  // son contexto de fondo sobre qué funciona con el alumno, no un progreso a medir) ---
  const { data: preferencias } = await supabase
    .from('preferencias_alumno')
    .select('nombre, tipo')
    .eq('alumno_id', alumnoId)

  const textoPreferencias =
    preferencias && preferencias.length > 0
      ? preferencias.map((p) => `${p.nombre} (${ETIQUETA_TIPO[p.tipo] ?? p.tipo})`).join(', ')
      : null

  // --- Asistencia del período ---
  const { data: sesionesPeriodo } = await supabase
    .from('sesiones_programadas')
    .select('estado')
    .eq('alumno_id', alumnoId)
    .gte('fecha_hora', periodoDesde)
    .lt('fecha_hora', periodoHasta + 'T23:59:59.999')
    .neq('estado', 'programada') // solo sesiones ya resueltas, no las futuras

  let textoAsistencia: string | null = null
  if (sesionesPeriodo && sesionesPeriodo.length > 0) {
    const asistidas = sesionesPeriodo.filter((s) => s.estado === 'asistio').length
    const canceladas = sesionesPeriodo.filter((s) => s.estado === 'cancelada').length
    const noAsistio = sesionesPeriodo.filter((s) => s.estado === 'no_asistio').length
    textoAsistencia = `${sesionesPeriodo.length} sesiones en el período: ${asistidas} asistidas, ${canceladas} canceladas, ${noAsistio} sin asistir`
  }

  // --- Programas del alumno ---
  const { data: programas } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, area, estado, porcentaje_dominio')
    .eq('alumno_id', alumnoId)

  // Agrupamos el texto recopilado POR ÁREA, no por programa suelto
  const textoPorArea: Record<string, string[]> = {}

  const anadirAArea = (area: string | null, texto: string) => {
    const clave = area?.trim() || 'General'
    if (!textoPorArea[clave]) textoPorArea[clave] = []
    textoPorArea[clave].push(texto)
  }

  for (const programa of programas ?? []) {
    if (programa.tipo === 'aba_clasico') {
      const { data: conjuntos } = await supabase
        .from('conjuntos_estimulos_alumno')
        .select('id, nombre, estado')
        .eq('programa_alumno_id', programa.id)

      for (const conjunto of conjuntos ?? []) {
        const { data: bloques } = await supabase
          .from('bloques_ensayo')
          .select('fecha, porcentaje, notas')
          .eq('conjunto_id', conjunto.id)
          .gte('fecha', periodoDesde)
          .lt('fecha', periodoHasta + 'T23:59:59.999')
          .order('fecha', { ascending: true })

        if (!bloques || bloques.length === 0) continue

        const porcentajes = bloques.map((b) => `${b.porcentaje}%`).join(', ')
        const notas = bloques.filter((b) => b.notas).map((b) => `- ${b.notas}`).join('\n')

        anadirAArea(
          programa.area,
          `Programa "${programa.nombre}" (Aprendizaje Directo) — Conjunto "${conjunto.nombre}" — Estado: ${conjunto.estado}\n` +
          `Bloques del período (${bloques.length}): ${porcentajes}\n` +
          (notas ? `Notas del terapeuta:\n${notas}\n` : '')
        )
      }
    } else if (programa.tipo === 'rft') {
      const { data: dominioFases } = await supabase
        .from('dominio_rft_fases')
        .select('grupo, fase, posicion_origen, posicion_destino, dominado')
        .eq('programa_alumno_id', programa.id)

      const { data: bloques } = await supabase
        .from('bloques_ensayo_rft')
        .select('grupo, fase, posicion_origen, posicion_destino, fecha, porcentaje, notas')
        .eq('programa_alumno_id', programa.id)
        .gte('fecha', periodoDesde)
        .lt('fecha', periodoHasta + 'T23:59:59.999')
        .order('fecha', { ascending: true })

      if (!bloques || bloques.length === 0) continue

      const gruposDelPeriodo = [...new Set(bloques.map((b) => b.grupo))]

      for (const grupo of gruposDelPeriodo) {
        const bloquesGrupo = bloques.filter((b) => b.grupo === grupo)
        const porcentajes = bloquesGrupo.map((b) => `${b.fase} ${b.posicion_origen}→${b.posicion_destino}: ${b.porcentaje}%`).join('; ')
        const notas = bloquesGrupo.filter((b) => b.notas).map((b) => `- ${b.notas}`).join('\n')
        const dominadas = (dominioFases ?? [])
          .filter((d) => d.grupo === grupo && d.dominado)
          .map((d) => `${d.fase} ${d.posicion_origen}→${d.posicion_destino}`)
          .join(', ')

        anadirAArea(
          programa.area,
          `Programa "${programa.nombre}" (Aprendizaje Relacional) — ${grupo}\n` +
          `Bloques del período: ${porcentajes}\n` +
          (dominadas ? `Combinaciones ya dominadas: ${dominadas}\n` : '') +
          (notas ? `Notas del terapeuta:\n${notas}\n` : '')
        )
      }
    }
  }

  const areas = Object.keys(textoPorArea)

  if (areas.length === 0 && !textoAsistencia) {
    return { error: 'No hay datos registrados para este alumno en el período seleccionado.' }
  }

  const datosPorArea = areas.length > 0
    ? areas.map((area) => `ÁREA: ${area}\n\n${textoPorArea[area].join('\n---\n')}`).join('\n\n===\n\n')
    : '(Sin datos de programas en este período)'

  // --- Prompt según destinatario ---
  const instruccionTono =
    destinatario === 'familia'
      ? 'Escribe para la familia del niño/a: tono cercano, cálido, sin tecnicismos clínicos (evita siglas como ABA o RFT, explica las cosas en lenguaje sencillo, como "aprendizaje directo" o "aprendizaje relacional").'
      : 'Escribe un informe clínico formal, para entregar a un colegio, aseguradora u otro profesional: tono técnico y objetivo, puedes usar terminología propia del análisis de conducta (ABA, RFT, ensayo discreto, dominio, generalización, etc.).'

  const prompt = `Eres un asistente que redacta informes de progreso para un centro de terapia infantil especializado en autismo (métodos ABA/RFT).

${instruccionTono}

FORMATO OBLIGATORIO:
- No uses markdown de ningún tipo (nada de **, #, -, *, listas con guiones). Solo texto plano.
- Cada título de sección debe ir en su propia línea, EN MAYÚSCULAS y sin ningún símbolo delante (ej.: INTRODUCCIÓN, en vez de "## Introducción" o "**Introducción**").
- Extensión objetivo: entre 300 y 500 palabras en total.
- Estructura exacta:
  1. Título "INTRODUCCIÓN" — 2-3 frases situando el período y el alumno. Si hay reforzadores/preferencias conocidos, puedes mencionarlos brevemente aquí como contexto (ej. "durante las sesiones se han utilizado sus reforzadores habituales, como..."), sin dedicarles una sección propia. Si hay datos de asistencia, menciona aquí también de forma breve cuántas sesiones hubo y cuántas se asistieron.
  2. Un apartado por cada ÁREA de trabajo (usa el nombre del área, ya en mayúsculas, como título). DENTRO de cada área, combina TODOS los programas de esa área en un único párrafo fluido y natural — NO crees un sub-apartado ni un título separado para cada programa individual, intégralos en el mismo relato.
  3. Título "RESUMEN" — 1-2 frases de cierre general.

REGLAS DE CONTENIDO:
- Describe ÚNICAMENTE los hechos y datos que se te dan a continuación. No inventes datos.
- NO des interpretaciones clínicas, diagnósticos, ni recomendaciones de tratamiento — eso es responsabilidad exclusiva del terapeuta.
- Integra las notas del terapeuta de forma natural en el relato, no las cites literalmente entre comillas.
- Los reforzadores/preferencias son solo contexto de fondo, no un progreso a describir — menciónalos como mucho una vez, brevemente.
- La asistencia es un dato objetivo a mencionar brevemente en la introducción, sin interpretarla (no valores si es "buena" o "mala" asistencia, solo indica las cifras).

DATOS DEL ALUMNO:
- Iniciales: ${alumno.nombre_anonimizado}
- Edad: ${edad} años
${destinatario === 'formal' && alumno.diagnostico ? `- Diagnóstico: ${alumno.diagnostico}\n` : ''}${textoPreferencias ? `- Reforzadores/preferencias conocidos: ${textoPreferencias}\n` : ''}${textoAsistencia ? `- Asistencia del período: ${textoAsistencia}\n` : ''}- Centro: ${clinica?.nombre ?? 'Centro de terapia'}
- Período del informe: ${periodoDesde} a ${periodoHasta}

DATOS DEL PERÍODO (agrupados por área):

${datosPorArea}`

  // --- Llamada a la IA ---
  let contenido: string
  try {
    const anthropic = new Anthropic()
    const respuesta = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
    const bloqueTexto = respuesta.content.find((b) => b.type === 'text')
    contenido = bloqueTexto && bloqueTexto.type === 'text' ? bloqueTexto.text : ''
    if (!contenido) return { error: 'La IA no devolvió contenido. Inténtalo de nuevo.' }
  } catch (err: any) {
    return { error: 'Error al generar el informe con IA: ' + (err?.message ?? 'error desconocido') }
  }

  // --- Guardar informe ---
  const { data: informe, error: insertError } = await supabase
    .from('informes')
    .insert({
      alumno_id: alumnoId,
      destinatario,
      periodo_desde: periodoDesde,
      periodo_hasta: periodoHasta,
      contenido,
      creado_por: user.id,
    })
    .select('id')
    .single()

  if (insertError || !informe) {
    return { error: insertError?.message ?? 'Error guardando el informe' }
  }

  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true, id: informe.id, contenido }
}

export async function listarInformes(alumnoId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('informes')
    .select('id, destinatario, periodo_desde, periodo_hasta, contenido, created_at')
    .eq('alumno_id', alumnoId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function eliminarInforme(id: string, alumnoId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('informes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/alumnos/${alumnoId}`)
  return { success: true }
}