import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EvaluacionClient, { type NivelValoracion, type ProgramaValoracion } from './evaluacion-client'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../curriculo/estructura'

const VALORACIONES = ['dominado', 'parcial', 'no'] as const
type Valoracion = (typeof VALORACIONES)[number]

export default async function ValoracionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: alumnoId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumno } = await supabase
    .from('alumnos')
    .select('id, clinica_id')
    .eq('id', alumnoId)
    .single()

  if (!alumno) notFound()

  const filtroClinica = `clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`

  const [{ data: programasBase }, { data: valoraciones }, { data: asignados }, estructura] = await Promise.all([
    supabase
      .from('programas_base')
      .select('id, nombre, tipo, objetivo, orden, dominio_id, clinica_id')
      .eq('activo', true)
      .or(filtroClinica),
    supabase.from('evaluaciones_iniciales').select('programa_base_id, valoracion').eq('alumno_id', alumnoId),
    supabase
      .from('programas_alumno')
      .select('programa_base_id, estado')
      .eq('alumno_id', alumnoId)
      .not('programa_base_id', 'is', null),
    cargarEstructuraCurriculo(supabase),
  ])

  // Se recorren en el orden del currículo (nivel → dominio → posición), sin
  // separar directo/relacional; los programas sin posición quedan fuera
  const codificador = crearCodificador(estructura)
  const dominios = new Map(estructura.dominios.map((d) => [d.id, d]))
  const programas: ProgramaValoracion[] = (programasBase ?? [])
    .map((p) => ({ p, ordenGlobal: codificador.ordenGlobal(p), dominio: p.dominio_id ? dominios.get(p.dominio_id) : undefined }))
    .filter((x): x is typeof x & { ordenGlobal: number; dominio: NonNullable<typeof x.dominio> } =>
      x.ordenGlobal !== null && x.dominio !== undefined
    )
    .sort((a, b) => a.ordenGlobal - b.ordenGlobal)
    .map(({ p, dominio }) => ({
      id: p.id,
      nombre: p.nombre,
      tipo: p.tipo,
      objetivo: p.objetivo,
      codigo: codificador.codigo(p),
      dominioId: dominio.id,
      nivel: dominio.nivel,
    }))

  const niveles: NivelValoracion[] = estructura.niveles.map((n) => ({
    numero: n.numero,
    nombre: n.nombre,
    dominios: estructura.dominios
      .filter((d) => d.nivel === n.numero)
      .map((d) => ({ id: d.id, codigo: d.codigo, nombre: d.nombre })),
  }))

  const valoracionesValidas = (valoraciones ?? []).filter(
    (valoracion): valoracion is typeof valoracion & { valoracion: Valoracion } =>
      VALORACIONES.includes(valoracion.valoracion as Valoracion)
  )

  // Ya dominados en el PEI: cuentan como dominados y no se preguntan
  const dominadosPei = (asignados ?? [])
    .filter((a) => a.estado === 'dominado' || a.estado === 'mantenimiento')
    .map((a) => a.programa_base_id!)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Valoración</h2>
        <Link
          href={`/dashboard/alumnos/${alumnoId}/valoracion/estandarizada`}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Evaluación inicial estandarizada →
        </Link>
      </div>
      <EvaluacionClient
        alumnoId={alumnoId}
        programas={programas}
        niveles={niveles}
        valoracionesIniciales={valoracionesValidas}
        dominadosPei={dominadosPei}
      />
    </div>
  )
}
