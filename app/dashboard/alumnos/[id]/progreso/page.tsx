import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProgresoCurriculo from './progreso-curriculo'
import { cargarProgresoAlumno } from './cargar-progreso'

export default async function ProgresoPage({
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

  const { data: alumno } = await supabase.from('alumnos').select('id, clinica_id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const { niveles, fueraDelCurriculo } = await cargarProgresoAlumno(supabase, alumno)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Progreso del Alumno</h2>
      <ProgresoCurriculo niveles={niveles} fueraDelCurriculo={fueraDelCurriculo} />
    </div>
  )
}
