import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import EntrevistaClient from './entrevista-client'
import { PREGUNTAS } from '../preguntas'
import { leerRespuestas } from '../logica'

export default async function EntrevistaPage({ params }: { params: Promise<{ id: string; entrevistaId: string }> }) {
  const { id: alumnoId, entrevistaId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: e } = await supabase
    .from('entrevistas_iniciales')
    .select('id, alumno_id, estado, nivel_salto, modalidad, respuestas, notas, created_at')
    .eq('id', entrevistaId)
    .single()
  if (!e || e.alumno_id !== alumnoId) notFound()

  // «Comprobar ahora»: guiones de tableta de los ítems de la antigua evaluación e imágenes de evaluación
  const codigos = [...new Set(PREGUNTAS.map((p) => p.item).filter((x): x is string => !!x))]
  const [{ data: items }, { data: filasImagenes }] = await Promise.all([
    supabase.from('evaluacion_items').select('codigo, guion').in('codigo', codigos),
    supabase.from('biblioteca_imagenes').select('concepto, ruta').eq('uso', 'evaluacion'),
  ])
  const guiones = Object.fromEntries((items ?? []).map((i) => [i.codigo, i.guion]))
  const imagenes = Object.fromEntries(
    (filasImagenes ?? []).map((f) => [f.concepto, supabase.storage.from('biblioteca').getPublicUrl(f.ruta).data.publicUrl])
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Entrevista inicial del {new Date(e.created_at).toLocaleDateString('es-ES')}</h2>
        <Link href={`/dashboard/alumnos/${alumnoId}/valoracion/entrevista`} className="text-sm font-medium text-indigo-600 hover:underline">
          ← Entrevistas
        </Link>
      </div>
      <EntrevistaClient
        alumnoId={alumnoId}
        entrevistaId={e.id}
        cerrada={e.estado !== 'en_curso'}
        nivelSalto={e.nivel_salto}
        modalidad={e.modalidad === 'no_vocal' ? 'no_vocal' : 'vocal'}
        respuestasIniciales={leerRespuestas(e.respuestas)}
        notasIniciales={e.notas ?? ''}
        guiones={guiones}
        imagenes={imagenes}
      />
    </div>
  )
}
