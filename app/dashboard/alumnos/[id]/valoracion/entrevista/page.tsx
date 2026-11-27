import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Panel } from '../../../../../ui'
import NuevaEntrevista from './nueva-entrevista'
import { textoResultado } from './resultado'

// Entrevistas iniciales del alumno (la más reciente primero) y una nueva
export default async function EntrevistasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: alumnoId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', alumnoId).single()
  if (!alumno) notFound()
  const { data: entrevistas } = await supabase
    .from('entrevistas_iniciales')
    .select('id, estado, created_at, finalizada_at, dominio_recomendado, lagunas, pendientes')
    .eq('alumno_id', alumnoId)
    .neq('estado', 'anulada')
    .order('created_at', { ascending: false })
  const base = `/dashboard/alumnos/${alumnoId}/valoracion/entrevista`
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Entrevista inicial</h2>
        <Link href={`/dashboard/alumnos/${alumnoId}/valoracion`} className="text-sm font-medium text-indigo-600 hover:underline">
          ← Punto de partida
        </Link>
      </div>
      <Panel className="space-y-3 p-4">
        <p className="text-sm text-slate-600">
          Usted pregunta y la familia responde. Las preguntas siguen el orden del currículo, cada una con un ejemplo. No es exhaustiva: sitúa
          aproximadamente en nivel y dominio. La prueba real es el primer bloque sin ayudas de cada programa; si el alumno no aprende, mire los
          requisitos del programa o baje de dominio o de nivel.
        </p>
        <NuevaEntrevista alumnoId={alumnoId} />
      </Panel>
      {(entrevistas ?? []).length > 0 && (
        <Panel className="divide-y divide-slate-100 p-0">
          {(entrevistas ?? []).map((e) => (
            <Link key={e.id} href={`${base}/${e.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-slate-50">
              <span className="font-medium text-slate-800">{new Date(e.created_at).toLocaleDateString('es-ES')}</span>
              <span className="min-w-0 flex-1 text-slate-600">
                {e.estado === 'finalizada' ? textoResultado(e.dominio_recomendado, e.lagunas, e.pendientes) : 'En curso: continuar'}
              </span>
            </Link>
          ))}
        </Panel>
      )}
    </div>
  )
}
