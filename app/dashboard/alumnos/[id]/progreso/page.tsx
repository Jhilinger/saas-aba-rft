import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProgresoCurriculo from './progreso-curriculo'
import { cargarProgresoAlumno } from './cargar-progreso'
import { calcularIndicadores } from './indicadores'
import IndicadoresAlumno from './indicadores-alumno'

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

  const [{ niveles, fueraDelCurriculo }, { indicadores, estancados }] = await Promise.all([
    cargarProgresoAlumno(supabase, alumno),
    calcularIndicadores(supabase, alumno.id),
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Progreso del Alumno</h2>
      <IndicadoresAlumno indicadores={indicadores} estancados={estancados} />
      <ProgresoCurriculo niveles={niveles} fueraDelCurriculo={fueraDelCurriculo} />
    </div>
  )
}
