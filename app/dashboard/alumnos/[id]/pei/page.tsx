import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AsignarProgramaForm from '../asignar-programa-form'
import PeiTabla from '../pei-tabla'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../curriculo/estructura'
import { calcularBloqueos, ROLES_EXCEPCION_SECUENCIA } from '../../../curriculo/secuencia'
import { cargarProgresoAlumno } from '../progreso/cargar-progreso'

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
    .select('id, clinica_id')
    .eq('id', id)
    .single()

  if (!alumno) notFound()

  const estructura = await cargarEstructuraCurriculo(supabase)
  const [{ data: programas }, { data: programasBase }, progreso, { data: requisitos }] = await Promise.all([
    supabase
      .from('programas_alumno')
      .select('id, nombre, tipo, estado, fecha_inicio, orden, excepcion_secuencia, programa_base_id, programas_base(dominio_id, orden, clinica_id)')
      .eq('alumno_id', id)
      .order('orden', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('programas_base')
      .select('id, nombre, tipo, area, dominio_id, orden, clinica_id, visibilidad, creado_por')
      .eq('activo', true),
    cargarProgresoAlumno(supabase, alumno, estructura),
    supabase.from('requisitos_programa').select('programa_base_id, requisito_id'),
  ])

  // Secuencia del currículo: dominios bloqueados para este alumno
  const bloqueos = calcularBloqueos(progreso.niveles)
  const puedeForzar = ROLES_EXCEPCION_SECUENCIA.includes(perfil.rol)

  // Para filtrar el selector: ya en el PEI, o dominados (PEI o valoración inicial)
  const enPei = new Set((programas ?? []).map((p) => p.programa_base_id).filter(Boolean))
  const dominados = new Set(
    progreso.niveles.flatMap((n) => n.dominios.flatMap((d) => d.programas))
      .filter((p) => p.estado === 'dominado')
      .map((p) => p.id)
  )

  // El código es posicional: se calcula en vivo desde el programa base
  const codificador = crearCodificador(estructura)
  const programasPei = (programas ?? [])
    .map(({ programas_base, ...p }) => ({
      ...p,
      codigo: programas_base ? codificador.codigo(programas_base) : null,
      ordenGlobal: programas_base ? codificador.ordenGlobal(programas_base) : null,
      // Solo los del currículo (globales) tienen dominio; el resto son complementarios
      dominioId: programas_base?.clinica_id === null ? programas_base.dominio_id : null,
    }))
    .sort((a, b) => (a.ordenGlobal ?? Infinity) - (b.ordenGlobal ?? Infinity))
  // Requisitos previos que el alumno todavía no domina (solo avisan, no bloquean)
  const nombrePrograma = new Map(
    (programasBase ?? []).map((p) => {
      const codigo = codificador.codigo(p)
      return [p.id, codigo ? `${codigo} ${p.nombre}` : p.nombre]
    })
  )
  const requisitosDe = new Map<string, string[]>()
  for (const r of requisitos ?? []) {
    requisitosDe.set(r.programa_base_id, [...(requisitosDe.get(r.programa_base_id) ?? []), r.requisito_id])
  }
  const opcionesBase = (programasBase ?? [])
    .map((p) => ({
      ...p,
      codigo: codificador.codigo(p),
      ordenGlobal: codificador.ordenGlobal(p),
      bloqueo: p.dominio_id ? (bloqueos.get(p.dominio_id) ?? null) : null,
      requisitosPendientes: (requisitosDe.get(p.id) ?? [])
        .filter((r) => !dominados.has(r) && nombrePrograma.has(r))
        .map((r) => nombrePrograma.get(r)!),
      situacion: enPei.has(p.id)
        ? ('en_pei' as const)
        : dominados.has(p.id)
          ? ('dominado' as const)
          : ('disponible' as const),
    }))
    .sort((a, b) => (a.ordenGlobal ?? Infinity) - (b.ordenGlobal ?? Infinity) || a.nombre.localeCompare(b.nombre))

  const niveles = estructura.niveles.map((n) => ({
    ...n,
    dominios: estructura.dominios.filter((d) => d.nivel === n.numero),
  }))

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Plan Educativo Individualizado (PEI)</h2>
      <AsignarProgramaForm
        alumnoId={id}
        programasBase={opcionesBase}
        niveles={niveles}
        miPerfilId={perfil.id}
        puedeForzar={puedeForzar}
        abiertoInicial={programasPei.length === 0}
      />
      <PeiTabla programas={programasPei} niveles={niveles} />
    </section>
  )
}