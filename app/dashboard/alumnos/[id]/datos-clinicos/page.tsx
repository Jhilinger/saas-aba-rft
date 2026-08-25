import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditarAlumnoForm from '../editar-alumno-form'

export default async function DatosClinicosPage({
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
    .select(
      'id, nombre_anonimizado, fecha_nacimiento, clinica_id, diagnostico, colegio, notas_clinicas, contacto_emergencia, alergias'
    )
    .eq('id', id)
    .single()

  if (!alumno) notFound()

    return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Datos</h2>
      <EditarAlumnoForm alumno={alumno as any} />
    </div>
  )
}