import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FamiliaTabla from './familia-tabla'
import type { Tables } from '@/database.types'

type VinculoFamiliar = Pick<Tables<'alumno_familia'>, 'perfil_id' | 'alumno_id'> & {
  perfiles: Pick<Tables<'perfiles'>, 'nombre' | 'email'> | null
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

export default async function FamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol) || !perfil.clinica_id) {
    redirect('/dashboard')
  }

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado')
    .eq('clinica_id', perfil.clinica_id)
    .eq('activo', true)
    .order('nombre_anonimizado')

  const alumnoIds = (alumnos ?? []).map((a) => a.id)

  const { data: vinculos } = alumnoIds.length
    ? await supabase
        .from('alumno_familia')
        .select('perfil_id, alumno_id, perfiles(nombre, email), alumnos(nombre_anonimizado)')
        .in('alumno_id', alumnoIds)
    : { data: [] }

  const familiaresMap = new Map<string, { perfilId: string; nombre: string; email: string; alumnos: { id: string; nombre: string }[] }>()

  for (const v of (vinculos ?? []) as unknown as VinculoFamiliar[]) {
    const p = v.perfiles
    const a = v.alumnos
    if (!p) continue
    if (!familiaresMap.has(v.perfil_id)) {
      familiaresMap.set(v.perfil_id, { perfilId: v.perfil_id, nombre: p.nombre, email: p.email, alumnos: [] })
    }
    familiaresMap.get(v.perfil_id)!.alumnos.push({ id: v.alumno_id, nombre: a?.nombre_anonimizado ?? '—' })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Perfiles</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Familia</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona los accesos de las familias vinculadas a tus alumnos.</p>
      </div>

      <FamiliaTabla alumnos={alumnos ?? []} familiares={[...familiaresMap.values()]} />
    </div>
  )
}