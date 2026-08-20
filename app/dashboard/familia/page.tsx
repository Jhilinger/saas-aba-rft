import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FamiliaTabla from './familia-tabla'

export default async function FamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
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

  for (const v of vinculos ?? []) {
    const p = v.perfiles as any
    const a = v.alumnos as any
    if (!p) continue
    if (!familiaresMap.has(v.perfil_id)) {
      familiaresMap.set(v.perfil_id, { perfilId: v.perfil_id, nombre: p.nombre, email: p.email, alumnos: [] })
    }
    familiaresMap.get(v.perfil_id)!.alumnos.push({ id: v.alumno_id, nombre: a?.nombre_anonimizado ?? '—' })
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Familia</h1>

      <FamiliaTabla alumnos={alumnos ?? []} familiares={[...familiaresMap.values()]} />
    </div>
  )
}