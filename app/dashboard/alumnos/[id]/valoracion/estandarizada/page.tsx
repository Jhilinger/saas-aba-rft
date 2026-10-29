import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Panel } from '../../../../../ui'
import NuevaEvaluacion from './nueva-evaluacion'
import { ESTADO_EVALUACION } from './etiquetas'

export default async function EvaluacionesEstandarizadasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: alumnoId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: evaluaciones } = await supabase
    .from('evaluaciones')
    .select('id, estado, modalidad, nivel_inicio, iniciada_at, finalizada_at, perfiles(nombre), evaluacion_respuestas(puntuacion)')
    .eq('alumno_id', alumnoId)
    .order('iniciada_at', { ascending: false })

  const hayEnCurso = (evaluaciones ?? []).some((e) => e.estado === 'en_curso')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Evaluación inicial estandarizada</h2>
        <Link href={`/dashboard/alumnos/${alumnoId}/valoracion`} className="text-sm font-medium text-indigo-600 hover:underline">
          ← Valoración por programas
        </Link>
      </div>

      <Panel className="space-y-2 p-4 text-sm text-slate-600">
        <p>
          Banco de ítems con administración y puntuación fijas (0/1/2). El cribado decide el nivel de inicio; en cada
          dominio se deja de aplicar tras dos ceros seguidos, y se pasa al nivel siguiente si el nivel alcanza la mitad
          de los puntos. Al finalizar, los resultados se trasladan a la valoración por programas.
        </p>
        {!hayEnCurso && <NuevaEvaluacion alumnoId={alumnoId} />}
      </Panel>

      {(evaluaciones ?? []).length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no hay evaluaciones.</p>
      ) : (
        <ul className="space-y-2">
          {(evaluaciones ?? []).map((e) => {
            const estado = ESTADO_EVALUACION[e.estado] ?? ESTADO_EVALUACION.en_curso
            const puntuados = e.evaluacion_respuestas.filter((r) => r.puntuacion !== null).length
            return (
              <li key={e.id}>
                <Link
                  href={`/dashboard/alumnos/${alumnoId}/valoracion/estandarizada/${e.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300"
                >
                  <span className="space-y-0.5">
                    <span className="block font-medium text-slate-800">
                      {new Date(e.iniciada_at).toLocaleDateString('es-ES')}
                      {e.perfiles?.nombre && <span className="font-normal text-slate-500"> · {e.perfiles.nombre}</span>}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {e.modalidad === 'no_vocal' ? 'Sin lenguaje vocal' : 'Vocal'}
                      {e.nivel_inicio !== null && ` · inicio en el nivel ${e.nivel_inicio}`} · {puntuados} ítems puntuados
                    </span>
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${estado.color}`}>{estado.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
