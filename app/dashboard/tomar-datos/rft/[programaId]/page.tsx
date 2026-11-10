import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TomarDatosRftClient from './tomar-datos-rft-client'
import type { Json } from '@/database.types'
import { conceptosDePantalla, parsearEstimuloPantalla } from '../../../estimulo-pantalla'
import { cargarImagenes } from '../../../imagenes-estimulo'
import { leerSinError } from '../../../sin-error'
import ConceptosTablet from './conceptos-tablet'
import { CATEGORIAS_ENTRENAMIENTO, CATEGORIAS_GENERALIZACION, conceptosPropiosDe, leerActividadConceptos, type Concepto } from '../../../conceptos'

export default async function TomarDatosRftPage({
  params,
  searchParams,
}: {
  params: Promise<{ programaId: string }>
  searchParams: Promise<{ grupo?: string }>
}) {
  const { programaId } = await params
  const { grupo } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  const puedeVer =
    perfil &&
    (perfil.rol === 'superadmin' ||
      perfil.rol === 'terapeuta' ||
      (perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta))

  if (!puedeVer) {
    redirect('/dashboard')
  }

    const { data: programa } = await supabase
    .from('programas_alumno')
    .select(
      'id, nombre, estado, ensayos_por_bloque, alumno_id, nivel_rft, tipo_respuesta, opciones_respuesta, respuesta_por_fase, secuencia_rft, sin_error, consignas, actividad_tablet, opciones_clase, texto_tablet, alumnos(nombre_anonimizado), programas_base(instrucciones_terapeuta, ayudas_posibles, video_url)'
    )
    .eq('id', programaId)
    .single()

  if (!programa) notFound()

  const alumnoNombre = programa.alumnos?.nombre_anonimizado ?? ''

  const { data: clases } = await supabase
    .from('clases_rft')
    .select('id, nombre, grupo, respuestas_esperadas, consignas, estimulos_rft(id, nombre, posicion, concepto_imagen, pantalla)')
    .eq('programa_alumno_id', programaId)
    .order('grupo')
    .order('created_at')

  // Imágenes (del banco o propias del centro) de los conceptos que usan las clases
  const conceptos = [
    ...new Set(
      (clases ?? []).flatMap((c) =>
        c.estimulos_rft.flatMap((e) => [e.concepto_imagen, conceptosDePantalla(parsearEstimuloPantalla(e.pantalla))].flat())
      )
    ),
  ].filter((x): x is string => !!x)
  const imagenes = await cargarImagenes(supabase, conceptos)

  const { data: dominioFases } = await supabase
    .from('dominio_rft_fases')
    .select('grupo, fase, posicion_origen, posicion_destino')
    .eq('programa_alumno_id', programaId)
    .eq('dominado', true)

  // Aprendizaje sin error: escalón del último bloque de cada grupo y relación
  const sinError = leerSinError(programa.sin_error)
  const ultimosEscalones: Record<string, Json> = {}
  if (sinError?.activo) {
    const { data: bloquesSinError } = await supabase
      .from('bloques_ensayo_rft')
      .select('grupo, posicion_origen, posicion_destino, sin_error')
      .eq('programa_alumno_id', programaId)
      .eq('fase', 'entrenamiento')
      .not('sin_error', 'is', null)
      .order('fecha', { ascending: false })
      .limit(300)
    for (const b of bloquesSinError ?? []) {
      const clave = `${b.grupo}__${b.posicion_origen}__${b.posicion_destino}`
      if (!(clave in ultimosEscalones) && b.sin_error) ultimosEscalones[clave] = b.sin_error
    }
  }

  // Conceptos básicos generados en la tableta: imágenes de las categorías de
  // entrenamiento y, aparte, de las de generalización
  const actividad = leerActividadConceptos(programa.actividad_tablet)
  let conceptosActividad: { entrenamiento: Concepto[]; generalizacion: Concepto[] } = { entrenamiento: [], generalizacion: [] }
  let imagenesActividad: Awaited<ReturnType<typeof cargarImagenes>> = {}
  if (actividad) {
    const categorias = [...CATEGORIAS_ENTRENAMIENTO, ...CATEGORIAS_GENERALIZACION]
    const { data: banco } = await supabase
      .from('biblioteca_imagenes')
      .select('concepto, nombre')
      .is('clinica_id', null)
      .eq('ejemplar', '1')
      .or(categorias.map((c) => `concepto.like.${c}/%`).join(','))
    const de = (lista: string[]) => (banco ?? []).filter((b) => lista.includes(b.concepto.split('/')[0]))
    conceptosActividad = { entrenamiento: de(CATEGORIAS_ENTRENAMIENTO), generalizacion: de(CATEGORIAS_GENERALIZACION) }
    imagenesActividad = await cargarImagenes(supabase, conceptosPropiosDe(actividad) ?? (banco ?? []).map((b) => b.concepto))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <div>
        <Link
          href={`/dashboard/programas-rft/${programa.id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Volver a {programa.nombre}
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">Toma de datos RFT</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
          {alumnoNombre} — {programa.nombre}
        </h1>
      </div>

      {actividad && (
        <ConceptosTablet
          programaAlumnoId={programa.id}
          alumnoId={programa.alumno_id}
          actividad={actividad}
          conceptos={conceptosActividad}
          imagenes={imagenesActividad}
          dominados={(dominioFases ?? [])
            .filter((d) => d.fase === 'entrenamiento' && d.posicion_origen === 'A' && d.posicion_destino === 'A')
            .map((d) => d.grupo)}
          ensayosPorBloque={programa.ensayos_por_bloque}
          sinError={sinError}
          ultimosEscalones={ultimosEscalones}
        />
      )}

            <TomarDatosRftClient
        programaAlumnoId={programa.id}
        alumnoId={programa.alumno_id}
        clases={clases ?? []}
        ensayosPorBloqueDefecto={programa.ensayos_por_bloque}
        instrucciones={programa.programas_base?.instrucciones_terapeuta ?? null}
        ayudasPosibles={programa.programas_base?.ayudas_posibles ?? null}
        videoUrl={programa.programas_base?.video_url ?? null}
        grupoInicial={grupo ?? null}
        dominioFases={dominioFases ?? []}
        nivelRft={programa.nivel_rft}
        respuesta={{
          tipo_respuesta: programa.tipo_respuesta,
          opciones_respuesta: programa.opciones_respuesta,
          respuesta_por_fase: programa.respuesta_por_fase,
        }}
        secuenciaPrograma={programa.secuencia_rft}
        imagenes={imagenes}
        sinError={sinError}
        ultimosEscalones={ultimosEscalones}
        consignas={programa.consignas}
        opcionesClase={programa.opciones_clase}
        textoTablet={programa.texto_tablet}
      />
    </div>
  )
}