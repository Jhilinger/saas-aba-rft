import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import InformesFamilia from '../informes-familia'

export default async function InformesFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado, clinica_id)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-400 py-8">Sin alumnos vinculados todavía.</p>
  }

  const alumnoIds = alumnos.map((a: any) => a.id)

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

  const informesFormateados = (informesData ?? []).map((i: any) => ({
    id: i.id,
    periodo_desde: i.periodo_desde,
    periodo_hasta: i.periodo_hasta,
    contenido: i.contenido,
    created_at: i.created_at,
    alumno_nombre: i.alumnos?.nombre_anonimizado ?? '—',
  }))

  return (
    <InformesFamilia
      informes={informesFormateados}
      nombreClinica={clinicaDatos?.nombre ?? 'Centro de terapia'}
    />
  )
}