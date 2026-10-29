import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cargarItems, cargarRespuestas } from '../cargar'
import AdministracionClient from './administracion-client'

export default async function AdministracionPage({
  params,
}: {
  params: Promise<{ id: string; evaluacionId: string }>
}) {
  const { id: alumnoId, evaluacionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: evaluacion } = await supabase
    .from('evaluaciones')
    .select('id, alumno_id, estado, modalidad, nivel_inicio, iniciada_at')
    .eq('id', evaluacionId)
    .single()

  if (!evaluacion || evaluacion.alumno_id !== alumnoId) notFound()

  const [items, respuestas] = await Promise.all([cargarItems(supabase), cargarRespuestas(supabase, evaluacionId)])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">
          Evaluación del {new Date(evaluacion.iniciada_at).toLocaleDateString('es-ES')}
        </h2>
        <Link
          href={`/dashboard/alumnos/${alumnoId}/valoracion/estandarizada`}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Evaluaciones
        </Link>
      </div>
      <AdministracionClient
        evaluacion={{
          id: evaluacion.id,
          estado: evaluacion.estado,
          modalidad: evaluacion.modalidad === 'no_vocal' ? 'no_vocal' : 'vocal',
          nivelInicio: evaluacion.nivel_inicio,
        }}
        items={items}
        respuestas={respuestas}
      />
    </div>
  )
}
