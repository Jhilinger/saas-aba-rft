import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EvolucionRftFamilia from './evolucion-rft-familia'
import { obtenerEvolucionRft } from '../../../programas-rft/[id]/evolucion-actions'
import { obtenerEvolucionAnalogias } from '../../../programas-rft/[id]/analogias-actions'
import GraficoConducta from '../../../alumnos/[id]/conducta/[programaId]/grafico-conducta'
import DistribucionAyudasChart from '../../../distribucion-ayudas-chart'
import { Panel } from '../../../../ui'
import type { Tables } from '@/database.types'

type ProgramaConAlumno = Pick<
  Tables<'programas_alumno'>,
  'id' | 'nombre' | 'tipo' | 'alumno_id' | 'porcentaje_dominio' | 'nivel_rft'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

const ETIQUETA_RELACION: Record<string, string> = {
  coordinacion: 'Coordinación',
  distincion: 'Distinción',
  oposicion: 'Oposición',
  comparacion: 'Comparación',
  jerarquia: 'Jerarquía',
  temporal: 'Temporal',
  causal: 'Causal',
  deictica: 'Deíctico',
}

export default async function ProgramaRftFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, alumno_id, porcentaje_dominio, nivel_rft, alumnos(nombre_anonimizado)')
    .eq('id', id)
    .single()

  if (!programa) notFound()

  if (programa.tipo !== 'rft') redirect('/dashboard/mi-hijo')

  const { data: vinculo } = await supabase
    .from('alumno_familia')
    .select('alumno_id')
    .eq('alumno_id', programa.alumno_id)
    .eq('perfil_id', user.id)
    .maybeSingle()

  if (!vinculo) redirect('/dashboard/mi-hijo')

  const alumnoNombre = (programa as unknown as ProgramaConAlumno).alumnos?.nombre_anonimizado ?? ''

  if (programa.nivel_rft === 'relacion_relaciones') {
    const { data: analogias } = await supabase
      .from('analogias_alumno')
      .select('id, par1_termino_a, par1_termino_b, par1_relacion, par2_termino_a, par2_termino_b, par2_relacion')
      .eq('programa_alumno_id', id)
      .order('orden')

    const { data: bloques } = await supabase
      .from('bloques_analogias')
      .select('id, fecha, fase, total_ensayos, aciertos, porcentaje, notas')
      .eq('programa_alumno_id', id)
      .order('fecha', { ascending: false })

    const { puntos, distribucion } = await obtenerEvolucionAnalogias(id)

    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
        <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
          ← Volver a Progreso
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          {alumnoNombre} — {programa.nombre}
        </h1>

        <Panel className="p-3 sm:p-5">
          <GraficoConducta puntos={puntos} etiquetaY="% de acierto" direccionObjetivo="aumentar" titulo={programa.nombre} dominioYFijo={[0, 100]} />
        </Panel>
        <Panel className="p-4 sm:p-5">
          <DistribucionAyudasChart distribucion={distribucion} titulo="Distribución de ayudas" />
        </Panel>
        <Panel className="p-3 sm:p-5 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Analogías</p>
          <div className="space-y-2">
            {(analogias ?? []).map((a) => {
              const misma = a.par1_relacion === a.par2_relacion
              return (
                <div key={a.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <p className="text-slate-800">
                    <strong>{a.par1_termino_a}</strong> — <strong>{a.par1_termino_b}</strong>{' '}
                    <span className="text-xs text-slate-500">({ETIQUETA_RELACION[a.par1_relacion] ?? a.par1_relacion})</span>
                    {'  vs.  '}
                    <strong>{a.par2_termino_a}</strong> — <strong>{a.par2_termino_b}</strong>{' '}
                    <span className="text-xs text-slate-500">({ETIQUETA_RELACION[a.par2_relacion] ?? a.par2_relacion})</span>
                  </p>
                  <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold ${misma ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {misma ? 'Igual relación' : 'Relación distinta'}
                  </span>
                </div>
              )
            })}
            {(!analogias || analogias.length === 0) && <p className="text-sm text-slate-500 text-center py-2">Sin analogías todavía.</p>}
          </div>
        </Panel>
        <Panel className="p-3 sm:p-5 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Historial de bloques</p>
          <div className="space-y-2">
            {(bloques ?? []).map((b) => (
              <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">{new Date(b.fecha).toLocaleDateString('es-ES')}</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {b.aciertos}/{b.total_ensayos} ({b.porcentaje ?? 0}%)
                    {b.fase !== 'intervencion' && ` · ${b.fase}`}
                  </span>
                </div>
                {b.notas && <p className="mt-1 text-xs text-slate-500">{b.notas}</p>}
              </div>
            ))}
            {(!bloques || bloques.length === 0) && <p className="text-center text-slate-500 py-4">Sin bloques todavía.</p>}
          </div>
        </Panel>
      </div>
    )
  }

  const { data: clases } = await supabase
    .from('clases_rft')
    .select('grupo')
    .eq('programa_alumno_id', id)

  const grupos = [...new Set((clases ?? []).map((c) => c.grupo))]

  const { porFase, distribucionPorGrupo } = await obtenerEvolucionRft(id)

  const { data: dominioFases } = await supabase
    .from('dominio_rft_fases')
    .select('grupo, fase, posicion_origen, posicion_destino, dominado')
    .eq('programa_alumno_id', id)

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-4">
      <Link href="/dashboard/mi-hijo" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Progreso
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
        {alumnoNombre} — {programa.nombre}
      </h1>

      <EvolucionRftFamilia
        grupos={grupos}
        porFase={porFase}
        distribucionPorGrupo={distribucionPorGrupo}
        dominioFases={dominioFases ?? []}
        porcentajeDominio={programa.porcentaje_dominio}
      />
    </div>
  )
}
