import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AsignarProgramaForm from './asignar-programa-form'
import FamiliaresSection from './familiares-section'
import TerapeutasSection from './terapeutas-section'
import EditarAlumnoForm from './editar-alumno-form'
import AlumnoTabs from './alumno-tabs'
import InformesSection from './informes-section'
import { listarInformes } from './informes/actions'
import PreferenciasSection from './preferencias-section'
import { listarPreferencias } from './preferencias/actions'
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
    .select(
      'id, nombre_anonimizado, fecha_nacimiento, clinica_id, diagnostico, colegio, notas_clinicas, contacto_emergencia, alergias'
    )
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  const { data: clinicaDatos } = await supabase
    .from('clinicas')
    .select('nombre')
    .eq('id', alumno.clinica_id)
    .single()

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

  const { data: vinculosFamilia } = await supabase
    .from('alumno_familia')
    .select('perfil_id, perfiles(nombre, email)')
    .eq('alumno_id', id)

  const familiares = (vinculosFamilia ?? []).map((v: any) => ({
    perfil_id: v.perfil_id,
    nombre: v.perfiles?.nombre ?? '—',
    email: v.perfiles?.email ?? '—',
  }))

  const { data: terapeutasClinica } = await supabase
    .from('perfiles')
    .select('id, nombre, email')
    .eq('clinica_id', alumno.clinica_id)
    .eq('rol', 'terapeuta')
    .order('nombre')

  const { data: vinculosTerapeuta } = await supabase
    .from('alumno_terapeuta')
    .select('terapeuta_id, es_principal')
    .eq('alumno_id', id)

  const informesIniciales = await listarInformes(id)
  const preferenciasIniciales = await listarPreferencias(id)

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <Link href="/dashboard/equipo" className="text-sm text-indigo-600 hover:underline">
          ← Volver a equipo y alumnos
        </Link>
        <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{alumno.nombre_anonimizado}</h1>
        <p className="text-sm text-slate-500">Nacimiento: {alumno.fecha_nacimiento}</p>
      </div>

      <AlumnoTabs
        clinicos={<EditarAlumnoForm alumno={alumno as any} />}
        pei={
          <section className="space-y-4">
            <AsignarProgramaForm alumnoId={id} programasBase={programasBase ?? []} miPerfilId={perfil.id} />
            <PeiTabla programas={(programas as any) ?? []} />
          </section>
        }
        terapeutas={
          <TerapeutasSection
            alumnoId={id}
            terapeutasClinica={terapeutasClinica ?? []}
            vinculados={vinculosTerapeuta ?? []}
          />
        }
        familia={<FamiliaresSection alumnoId={id} familiares={familiares} />}
        informes={
          <InformesSection
            alumnoId={id}
            nombreAlumno={alumno.nombre_anonimizado}
            nombreClinica={clinicaDatos?.nombre ?? 'Centro de terapia'}
            informesIniciales={informesIniciales as any}
          />
        }
        preferencias={
          <PreferenciasSection alumnoId={id} preferenciasIniciales={preferenciasIniciales as any} />
        }
      />
    </div>
  )
}