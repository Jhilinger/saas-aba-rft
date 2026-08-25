import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ConductaClient from './conducta-client'

export default async function ConductaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: alumnoId } = await params
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

  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const { data: programas } = await supabase
    .from('programas_alumno')
    .select('id, nombre, formato_recogida, direccion_objetivo, estado, visible_familia, created_at')
    .eq('alumno_id', alumnoId)
    .eq('tipo', 'conducta')
    .order('created_at', { ascending: false })

  return <ConductaClient alumnoId={alumnoId} programasIniciales={programas ?? []} />
}