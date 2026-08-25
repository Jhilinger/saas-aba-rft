import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AsignarProgramaForm from './asignar-programa-form'
import PeiTabla from './pei-tabla'

export default async function AlumnoPage({
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
    .select('id, rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumno } = await supabase
    .from('alumnos')
    .select('id')
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  const { data: programas } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, estado, fecha_inicio, orden')
    .eq('alumno_id', id)
    .order('orden', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  const { data: programasBase } = await supabase
    .from('programas_base')
    .select('id, nombre, tipo, area, orden, clinica_id, visibilidad, creado_por')
    .eq('activo', true)
    .order('orden', { ascending: true, nullsFirst: false })
    .order('nombre')

    return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Plan Educativo Individualizado (PEI)</h2>
      <AsignarProgramaForm alumnoId={id} programasBase={programasBase ?? []} miPerfilId={perfil.id} />
      <PeiTabla programas={(programas as any) ?? []} />
    </section>
  )
}