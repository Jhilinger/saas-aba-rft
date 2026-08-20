import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PreferenciasSection from '../preferencias-section'
import { listarPreferencias } from './actions'

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

  return <PreferenciasSection alumnoId={id} preferenciasIniciales={preferenciasIniciales as any} />
}