import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import InformesSection from '../informes-section'
import { listarInformes } from './actions'

export default async function InformesAlumnoPage({
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

  const { data: alumno } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, clinica_id')
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  const { data: clinicaDatos } = await supabase
    .from('clinicas')
    .select('nombre')
    .eq('id', alumno.clinica_id)
    .single()

  const informesIniciales = await listarInformes(id)

    return (
    <div className="space-y-4">
    <h2 className="text-lg font-semibold text-slate-800">Informes</h2>
    <InformesSection
      alumnoId={id}
      nombreAlumno={alumno.nombre_anonimizado}
      nombreClinica={clinicaDatos?.nombre ?? 'Centro de terapia'}
      informesIniciales={informesIniciales as any}
        />
    </div>
  )
}