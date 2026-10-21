import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AsignarProgramaForm from '../asignar-programa-form'
import PeiTabla from '../pei-tabla'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../curriculo/estructura'

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
    .select('id')
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  const [{ data: programas }, { data: programasBase }, estructura] = await Promise.all([
    supabase
      .from('programas_alumno')
      .select('id, nombre, tipo, estado, fecha_inicio, orden, programas_base(dominio_id, orden, clinica_id)')
      .eq('alumno_id', id)
      .order('orden', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('programas_base')
      .select('id, nombre, tipo, area, dominio_id, orden, clinica_id, visibilidad, creado_por')
      .eq('activo', true),
    cargarEstructuraCurriculo(supabase),
  ])

  // El código es posicional: se calcula en vivo desde el programa base
  const codificador = crearCodificador(estructura)
  const programasPei = (programas ?? [])
    .map(({ programas_base, ...p }) => ({
      ...p,
      codigo: programas_base ? codificador.codigo(programas_base) : null,
      ordenGlobal: programas_base ? codificador.ordenGlobal(programas_base) : null,
    }))
    .sort((a, b) => (a.ordenGlobal ?? Infinity) - (b.ordenGlobal ?? Infinity))
  const opcionesBase = (programasBase ?? [])
    .map((p) => ({ ...p, codigo: codificador.codigo(p), ordenGlobal: codificador.ordenGlobal(p) }))
    .sort((a, b) => (a.ordenGlobal ?? Infinity) - (b.ordenGlobal ?? Infinity) || a.nombre.localeCompare(b.nombre))

    return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Plan Educativo Individualizado (PEI)</h2>
      <AsignarProgramaForm alumnoId={id} programasBase={opcionesBase} miPerfilId={perfil.id} />
      <PeiTabla programas={programasPei} />
    </section>
  )
}