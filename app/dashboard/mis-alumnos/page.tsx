import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Tables } from '@/database.types'

type VinculoAlumnoTerapeuta = Pick<Tables<'alumno_terapeuta'>, 'es_principal'> & {
  alumnos: Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'fecha_nacimiento'> | null
}

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

  const alumnos = ((vinculos ?? []) as unknown as VinculoAlumnoTerapeuta[])
    .map((v) => ({ ...v.alumnos, es_principal: v.es_principal }))
    .filter(
      (a): a is Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'fecha_nacimiento'> & { es_principal: boolean } =>
        Boolean(a.id)
    )
    .sort((a, b) => a.nombre_anonimizado.localeCompare(b.nombre_anonimizado))

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Mi trabajo</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Mis alumnos</h1>
        <p className="mt-1 text-sm text-slate-500">Accede rápidamente a los perfiles que tienes asignados.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm min-w-[450px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr className="whitespace-nowrap">
              <th className="p-3">Alumno</th>
              <th className="p-3">Fecha nacimiento</th>
              <th className="p-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-indigo-50/40">
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