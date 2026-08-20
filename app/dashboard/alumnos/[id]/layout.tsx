import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AlumnoSubNav from './alumno-subnav'

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
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <Link href="/dashboard/alumnos" className="text-sm text-indigo-600 hover:underline">
          ← Volver a alumnos
        </Link>
        <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{alumno.nombre_anonimizado}</h1>
        <p className="text-sm text-slate-500">Nacimiento: {alumno.fecha_nacimiento}</p>
      </div>

      <AlumnoSubNav alumnoId={id} />

      {children}
    </div>
  )
}