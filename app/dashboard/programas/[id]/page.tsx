import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import NuevoConjuntoForm from './nuevo-conjunto-form'
import ConjuntoCard from './conjunto-card'
import EvolucionChart from './evolucion-chart'
import { obtenerEvolucionAba } from './evolucion-actions'
import ProgramaAbaTabs from './programa-aba-tabs'
import EstadoProgramaSelector from './estado-programa-selector'

const COLORES = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

export default async function ProgramaAlumnoPage({
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
      'id, nombre, tipo, estado, alumno_id, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, alumnos(nombre_anonimizado)'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()

  if (programa.tipo !== 'aba_clasico') redirect(`/dashboard/alumnos/${programa.alumno_id}`)

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select('id, nombre, estado, estimulos_alumno(id, nombre, descripcion)')
    .eq('programa_alumno_id', id)
    .order('orden')

  const { conjuntos: datosEvolucion } = await obtenerEvolucionAba(id)

  const alumnoNombre = (programa.alumnos as any)?.nombre_anonimizado ?? ''

  const tieneInfo =
    programa.objetivo || programa.materiales || programa.instrucciones_terapeuta || programa.ayudas_posibles

  const enLineaBase = (conjuntos ?? []).filter((c: any) => c.estado === 'linea_base')
  const enAdquisicion = (conjuntos ?? []).filter((c: any) => c.estado !== 'dominado' && c.estado !== 'linea_base')
  const dominados = (conjuntos ?? []).filter((c: any) => c.estado === 'dominado')

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-slate-400">Ensayos por bloque</span>
            <p className="text-slate-700">{programa.ensayos_por_bloque}</p>
          </div>
          <div>
            <span className="text-slate-400">Criterio de dominio</span>
            <p className="text-slate-700">
              {programa.bloques_para_dominio} bloques al {programa.porcentaje_dominio}%
            </p>
          </div>
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
      <ProgramaAbaTabs
       evolucion={
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
              <EvolucionChart
                conjuntos={datosEvolucion}
                porcentajeDominio={programa.porcentaje_dominio}
                titulo={`${alumnoNombre} — ${programa.nombre}`}
                estimulosPorConjunto={(conjuntos ?? []).map((c: any) => ({
                  id: c.id,
                  nombre: c.nombre,
                  estimulos: c.estimulos_alumno.map((e: any) => e.nombre),
                }))}
              />
            </div>
          </div>
        }
        conjuntos={
          <section className="space-y-6">
            <NuevoConjuntoForm programaAlumnoId={id} />

            {enLineaBase.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-sky-700">
                  Línea base ({enLineaBase.length})
                </h2>
                <div className="space-y-4">
                  {enLineaBase.map((c: any) => (
                    <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id}/>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">
                En adquisición ({enAdquisicion.length})
              </h2>
              <div className="space-y-4">
                {enAdquisicion.map((c: any) => (
                  <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id} />
                ))}
                {enAdquisicion.length === 0 && (
                  <p className="text-sm text-slate-400">Sin conjuntos en adquisición.</p>
                )}
              </div>
            </div>

            {dominados.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-emerald-700">
                  Dominados ({dominados.length})
                </h2>
                <div className="space-y-4">
                  {dominados.map((c: any) => (
                    <ConjuntoCard key={c.id} conjunto={c} programaAlumnoId={id} alumnoId={programa.alumno_id} />
                  ))}
                </div>
              </div>
            )}

            {(!conjuntos || conjuntos.length === 0) && (
              <p className="text-center text-slate-400">Sin conjuntos de estímulos todavía.</p>
            )}
          </section>
        }
      />
    </div>
  )
}