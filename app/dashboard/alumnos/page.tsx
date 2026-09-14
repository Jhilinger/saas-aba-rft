import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AlumnosTabla from './alumnos-tabla'
import CrearAlumnoForm from './crear-alumno-form'

export default async function AlumnosListaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, clinica_id, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  if (!perfil.clinica_id) redirect('/dashboard')

  const { data: terapeutasReales } = await supabase
    .from('perfiles')
    .select('id, nombre, email, activo')
    .eq('clinica_id', perfil.clinica_id)
    .eq('rol', 'terapeuta')
    .order('nombre')

  const terapeutas =
    perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta
      ? [
          { id: perfil.id, nombre: `${perfil.nombre} (tú)`, email: '', activo: true },
          ...(terapeutasReales ?? []),
        ]
      : terapeutasReales

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, fecha_nacimiento, activo, alumno_terapeuta(terapeuta_id, es_principal)')
    .eq('clinica_id', perfil.clinica_id)
    .order('nombre_anonimizado')

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Perfiles</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Alumnos</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona los perfiles y las asignaciones del equipo clínico.</p>
      </div>

      <section className="space-y-4">
        <CrearAlumnoForm terapeutas={terapeutas ?? []} />

        <AlumnosTabla alumnos={alumnos ?? []} terapeutas={terapeutas ?? []} />
      </section>
    </div>
  )
}