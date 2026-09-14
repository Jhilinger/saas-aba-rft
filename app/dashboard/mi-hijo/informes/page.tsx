import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import InformesFamilia from '../informes-familia'
import type { Tables } from '@/database.types'

type VinculoAlumno = {
  alumnos: Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'clinica_id'> | null
}

type InformeConAlumno = Pick<
  Tables<'informes'>,
  'id' | 'periodo_desde' | 'periodo_hasta' | 'contenido' | 'created_at' | 'alumno_id'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
}

export default async function InformesFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado, clinica_id)')
    .eq('perfil_id', user.id)

  const alumnos = ((vinculos ?? []) as unknown as VinculoAlumno[])
    .map((v) => v.alumnos)
    .filter((a): a is Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'clinica_id'> => Boolean(a))

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-500 py-8">Sin alumnos vinculados todavía.</p>
  }

  const alumnoIds = alumnos.map((a) => a.id)

  const { data: clinicaDatos } = await supabase
    .from('clinicas')
    .select('nombre')
    .eq('id', alumnos[0].clinica_id)
    .single()

  const { data: informesData } = await supabase
    .from('informes')
    .select('id, periodo_desde, periodo_hasta, contenido, created_at, alumno_id, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .eq('destinatario', 'familia')
    .order('created_at', { ascending: false })

  const informesFormateados = ((informesData ?? []) as unknown as InformeConAlumno[]).map((i) => ({
    id: i.id,
    periodo_desde: i.periodo_desde,
    periodo_hasta: i.periodo_hasta,
    contenido: i.contenido,
    created_at: i.created_at,
    alumno_nombre: i.alumnos?.nombre_anonimizado ?? '—',
  }))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Seguimiento</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Informes</h1>
      </div>

      <InformesFamilia
        informes={informesFormateados}
        nombreClinica={clinicaDatos?.nombre ?? 'Centro de terapia'}
      />
    </div>
  )
}