import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditarAlumnoForm from '../editar-alumno-form'

export default async function DatosClinicosPage({
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
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const [{ data: alumno }, { data: clinicos }] = await Promise.all([
    supabase.from('alumnos').select('id, nombre_anonimizado, fecha_nacimiento').eq('id', id).single(),
    // Tabla aparte: solo la ve el personal con acceso al alumno
    supabase
      .from('alumnos_datos_clinicos')
      .select(
        'fecha_inicio_intervencion, diagnostico, modalidad_comunicacion, idiomas_entorno, colegio, otras_terapias, medicacion, alergias, conductas_riesgo, contacto_emergencia, notas_clinicas'
      )
      .eq('alumno_id', id)
      .maybeSingle(),
  ])

  if (!alumno) notFound()

  const vacio = {
    fecha_inicio_intervencion: null,
    diagnostico: null,
    modalidad_comunicacion: null,
    idiomas_entorno: null,
    colegio: null,
    otras_terapias: null,
    medicacion: null,
    alergias: null,
    conductas_riesgo: null,
    contacto_emergencia: null,
    notas_clinicas: null,
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Datos</h2>
      <EditarAlumnoForm alumno={{ ...alumno, ...vacio, ...clinicos }} />
    </div>
  )
}