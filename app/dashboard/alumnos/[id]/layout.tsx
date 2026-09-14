import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Panel } from '../../../ui'

export default async function AlumnoLayout({
  children,
  params,
}: {
  children: React.ReactNode
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
    .select('id, nombre_anonimizado, fecha_nacimiento')
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <Panel className="p-4 sm:p-5">
        <Link href="/dashboard/alumnos" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Volver a alumnos
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{alumno.nombre_anonimizado}</h1>
        <p className="text-sm text-slate-500">Nacimiento: {alumno.fecha_nacimiento}</p>
      </Panel>

      {children}
    </div>
  )
}