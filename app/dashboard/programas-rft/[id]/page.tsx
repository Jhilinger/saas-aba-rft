import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ProgramaRftClient from './programa-rft-client'
import { obtenerEvolucionRft } from './evolucion-actions'
import EstadoProgramaSelector from '../../programas/[id]/estado-programa-selector'

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
      'id, nombre, tipo, estado, alumno_id, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, porcentaje_dominio, alumnos(nombre_anonimizado)'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()
  if (programa.tipo !== 'rft') redirect(`/dashboard/alumnos/${programa.alumno_id}`)

  const { data: clases } = await supabase
    .from('clases_rft')
    .select(
      'id, nombre, grupo, tipo_relacion, estado, estimulos_rft(id, etiqueta, nombre, posicion), relaciones_entrenadas_rft(id, estimulo_origen_id, estimulo_destino_id)'
    )
    .eq('programa_alumno_id', id)
    .order('grupo')
    .order('created_at', { ascending: false })

  const { porFase } = await obtenerEvolucionRft(id)

  const { data: bloquesTest } = await supabase
    .from('bloques_ensayo_rft')
    .select('id, fase, posicion_origen, posicion_destino, fecha, porcentaje, ensayos_rft_detalle(clase_id)')
    .eq('programa_alumno_id', id)
    .neq('fase', 'entrenamiento')
    .order('fecha', { ascending: false })

  const testsPorClase: Record<string, any[]> = {}
  const vistos = new Set<string>()
  for (const bloque of bloquesTest ?? []) {
    const clasesDelBloque = [...new Set((bloque as any).ensayos_rft_detalle.map((d: any) => d.clase_id))]
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

  const alumnoNombre = (programa.alumnos as any)?.nombre_anonimizado ?? ''
  const grupos = [...new Set((clases ?? []).map((c) => c.grupo))]

  const tieneInfo =
    programa.objetivo || programa.materiales || programa.instrucciones_terapeuta || programa.ayudas_posibles

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <Link
          href={`/dashboard/alumnos/${programa.alumno_id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Volver a {alumnoNombre}
        </Link>
        <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          {programa.area && <span>{programa.area}</span>}
          <EstadoProgramaSelector
            programaAlumnoId={programa.id}
            alumnoId={programa.alumno_id}
            estadoActual={programa.estado}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-sm space-y-3">
        <div>
          <span className="text-slate-400">% de acierto para dominio</span>
          <p className="text-slate-700">{programa.porcentaje_dominio}%</p>
        </div>

        {programa.objetivo && (
          <div>
            <span className="text-slate-400">Objetivo / habilidad</span>
            <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo}</p>
          </div>
        )}
        {programa.materiales && (
          <div>
            <span className="text-slate-400">Materiales</span>
            <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales}</p>
          </div>
        )}
        {programa.instrucciones_terapeuta && (
          <div>
            <span className="text-slate-400">Instrucciones para el terapeuta</span>
            <p className="text-slate-700 whitespace-pre-wrap">{programa.instrucciones_terapeuta}</p>
          </div>
        )}
        {programa.ayudas_posibles && (
          <div>
            <span className="text-slate-400">Ayudas posibles</span>
            <p className="text-slate-700 whitespace-pre-wrap">{programa.ayudas_posibles}</p>
          </div>
        )}
        {!tieneInfo && (
          <p className="text-xs text-slate-400 italic">
            Este programa no tiene objetivo/materiales/instrucciones registrados (probablemente se
            importó antes de que añadiéramos esta información).
          </p>
        )}
      </div>

      <ProgramaRftClient
        programaAlumnoId={id}
        grupos={grupos}
        clases={(clases as any) ?? []}
        testsPorClase={testsPorClase}
        porFase={porFase}
        dominioFases={dominioFases ?? []}
        porcentajeDominio={programa.porcentaje_dominio}
      />
    </div>
  )
}