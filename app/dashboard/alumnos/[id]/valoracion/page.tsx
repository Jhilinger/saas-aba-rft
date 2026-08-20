import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EvaluacionClient from './evaluacion-client'
import ValoracionTabs from './valoracion-tabs'

export default async function ValoracionPage({
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
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumno } = await supabase
    .from('alumnos')
    .select('id, clinica_id')
    .eq('id', alumnoId)
    .single()

  if (!alumno) notFound()

  const { data: programas } = await supabase
    .from('programas_base')
    .select('id, nombre, tipo, area, objetivo, orden')
    .eq('activo', true)
    .eq('tipo', 'aba_clasico')
    .or(`clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`)
    .order('orden', { ascending: true, nullsFirst: false })

  const { data: valoraciones } = await supabase
    .from('evaluaciones_iniciales')
    .select('programa_base_id, valoracion')
    .eq('alumno_id', alumnoId)

  return (
    <ValoracionTabs
      aba={
        <EvaluacionClient
          alumnoId={alumnoId}
          programas={(programas ?? []).filter((p) => p.orden !== null)}
          valoracionesIniciales={valoraciones ?? []}
        />
      }
    />
  )
}