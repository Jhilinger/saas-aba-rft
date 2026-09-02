import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PreferenciasSection from '../preferencias-section'
import EvaluacionPreferencia from './evaluacion-preferencia'
import { listarPreferencias, listarEvaluacionesPreferencia } from './actions'

export default async function PreferenciasAlumnoPage({
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

  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', id).single()
  if (!alumno) notFound()

    const preferenciasIniciales = await listarPreferencias(id)
  const evaluacionesIniciales = await listarEvaluacionesPreferencia(id)

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-slate-800">Preferencias</h2>
      <EvaluacionPreferencia alumnoId={id} evaluacionesIniciales={evaluacionesIniciales as any} />
      <PreferenciasSection alumnoId={id} preferenciasIniciales={preferenciasIniciales as any} />
    </div>
  )
}