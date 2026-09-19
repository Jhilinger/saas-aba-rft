import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProgramaRftClient from './programa-rft-client'
import { obtenerEvolucionRft } from './evolucion-actions'
import EstadoProgramaSelector from '../../programas/[id]/estado-programa-selector'
import VideoDiferido from '../../video-diferido'
import { Breadcrumb, Panel } from '../../../ui'
import type { Enums, Tables } from '@/database.types'

type TestBloque = {
  fase: Enums<'fase_rft'>
  posicionOrigen: string | null
  posicionDestino: string | null
  fecha: string
  porcentaje: number | null
}

export default async function ProgramaRftPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

    const { data: programa } = await supabase
    .from('programas_alumno')
    .select(
      'id, nombre, tipo, estado, alumno_id, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, porcentaje_dominio, nivel_rft, alumnos(nombre_anonimizado), programas_base(video_url)'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()
  if (programa.tipo !== 'rft') redirect(`/dashboard/alumnos/${programa.alumno_id}`)

  const alumno = programa.alumnos as unknown as Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
  const programaBase = programa.programas_base as unknown as Pick<Tables<'programas_base'>, 'video_url'> | null
  const alumnoNombre = alumno?.nombre_anonimizado ?? ''
  const tieneInfo =
    programa.objetivo || programa.materiales || programa.instrucciones_terapeuta || programa.ayudas_posibles

  const cabecera = (
    <div>
      <Breadcrumb items={[{ label: 'Alumnos', href: '/dashboard/alumnos' }, { label: alumnoNombre, href: `/dashboard/alumnos/${programa.alumno_id}` }, { label: programa.nombre }]} />
      <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{programa.nombre}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {programa.area && <span>{programa.area}</span>}
        <EstadoProgramaSelector
          programaAlumnoId={programa.id}
          alumnoId={programa.alumno_id}
          estadoActual={programa.estado}
        />
      </div>
    </div>
  )

  const infoPanel = (
    <Panel className="space-y-3 p-4 text-sm sm:p-5">
      <div>
        <span className="text-slate-500">% de acierto para dominio</span>
        <p className="text-slate-700">{programa.porcentaje_dominio}%</p>
      </div>

      {programa.objetivo && (
        <div>
          <span className="text-slate-500">Objetivo / habilidad</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo}</p>
        </div>
      )}
      {programa.materiales && (
        <div>
          <span className="text-slate-500">Materiales</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales}</p>
        </div>
      )}
      {programa.instrucciones_terapeuta && (
        <div>
          <span className="text-slate-500">Instrucciones para el terapeuta</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.instrucciones_terapeuta}</p>
        </div>
      )}
      {programa.ayudas_posibles && (
        <div>
          <span className="text-slate-500">Ayudas posibles</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.ayudas_posibles}</p>
        </div>
      )}
      {programaBase?.video_url && (
        <div>
          <span className="text-slate-500">Vídeo de ejemplo</span>
          <VideoDiferido url={programaBase.video_url} />
        </div>
      )}
      {!tieneInfo && (
        <p className="text-xs text-slate-500 italic">
          Este programa no tiene objetivo/materiales/instrucciones registrados (probablemente se
          importó antes de que añadiéramos esta información).
        </p>
      )}
    </Panel>
  )

  const { data: clases } = await supabase
    .from('clases_rft')
    .select(
      'id, nombre, grupo, tipo_relacion, estado, estimulos_rft(id, etiqueta, nombre, posicion, elemento), relaciones_entrenadas_rft(id, estimulo_origen_id, estimulo_destino_id)'
    )
    .eq('programa_alumno_id', id)
    .order('grupo')
    .order('created_at', { ascending: false })

  const { porFase, distribucionPorGrupo } = await obtenerEvolucionRft(id)

  const { data: bloquesTest } = await supabase
    .from('bloques_ensayo_rft')
    .select('id, fase, posicion_origen, posicion_destino, fecha, porcentaje, ensayos_rft_detalle(clase_id)')
    .eq('programa_alumno_id', id)
    .neq('fase', 'entrenamiento')
    .order('fecha', { ascending: false })

  const testsPorClase: Record<string, TestBloque[]> = {}
  const vistos = new Set<string>()
  for (const bloque of bloquesTest ?? []) {
    const clasesDelBloque = [...new Set(bloque.ensayos_rft_detalle.map((d) => d.clase_id))]
    for (const claseId of clasesDelBloque) {
      const clave = `${claseId}-${bloque.fase}-${bloque.posicion_origen}-${bloque.posicion_destino}`
      if (vistos.has(clave)) continue
      vistos.add(clave)
      if (!testsPorClase[claseId as string]) testsPorClase[claseId as string] = []
      testsPorClase[claseId as string].push({
        fase: bloque.fase,
        posicionOrigen: bloque.posicion_origen,
        posicionDestino: bloque.posicion_destino,
        fecha: bloque.fecha,
        porcentaje: bloque.porcentaje,
      })
    }
  }

  const { data: dominioFases } = await supabase
    .from('dominio_rft_fases')
    .select('grupo, fase, posicion_origen, posicion_destino, dominado, updated_at')
    .eq('programa_alumno_id', id)

  const grupos = [...new Set((clases ?? []).map((c) => c.grupo))]

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {cabecera}
      {infoPanel}

      <ProgramaRftClient
        programaAlumnoId={id}
        grupos={grupos}
        clases={clases ?? []}
        testsPorClase={testsPorClase}
        porFase={porFase}
        distribucionPorGrupo={distribucionPorGrupo}
        dominioFases={dominioFases ?? []}
        porcentajeDominio={programa.porcentaje_dominio}
        nivelRft={programa.nivel_rft}
      />
    </div>
  )
}