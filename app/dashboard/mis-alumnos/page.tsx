import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MisAlumnosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  const puedeVer =
    perfil &&
    (perfil.rol === 'superadmin' ||
      perfil.rol === 'terapeuta' ||
      (perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta))

  if (!puedeVer) {
    redirect('/dashboard')
  }

  const { data: vinculos } = await supabase
    .from('alumno_terapeuta')
    .select('es_principal, alumnos(id, nombre_anonimizado, fecha_nacimiento)')
    .eq('terapeuta_id', user.id)

  const alumnos = (vinculos ?? [])
    .map((v: any) => ({ ...v.alumnos, es_principal: v.es_principal }))
    .filter((a) => a.id)
    .sort((a, b) => a.nombre_anonimizado.localeCompare(b.nombre_anonimizado))

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Mis Alumnos</h1>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[450px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Alumno</th>
              <th className="p-3">Fecha nacimiento</th>
              <th className="p-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a: any) => (
              <tr key={a.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-medium text-slate-800">
                  <Link href={`/dashboard/alumnos/${a.id}`} className="hover:underline">
                    {a.nombre_anonimizado}
                  </Link>
                </td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{a.fecha_nacimiento}</td>
                <td className="p-3 text-slate-600">
                  {a.es_principal ? 'Terapeuta principal' : 'Colaborador'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alumnos.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            Todavía no tienes alumnos asignados.
          </p>
        )}
      </div>
    </div>
  )
}