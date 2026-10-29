import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cargarItems, cargarRespuestas, cargarVinculos } from '../../cargar'
import { calcularColocacion, proponerProgramas, type Valoracion } from '../../colocacion'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../../../../curriculo/estructura'
import { calcularBloqueos } from '../../../../../../curriculo/secuencia'
import { cargarProgresoAlumno } from '../../../../progreso/cargar-progreso'
import ColocacionClient, { type FilaColocacion, type ProgramaPropuesto } from './colocacion-client'

const PREFIJO_NOTA = 'Evaluación estandarizada'

export default async function ColocacionPage({ params }: { params: Promise<{ id: string; evaluacionId: string }> }) {
  const { id: alumnoId, evaluacionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: evaluacion }, { data: alumno }] = await Promise.all([
    supabase
      .from('evaluaciones')
      .select('id, alumno_id, estado, nivel_inicio, colocacion_aplicada_at')
      .eq('id', evaluacionId)
      .single(),
    supabase.from('alumnos').select('id, clinica_id').eq('id', alumnoId).single(),
  ])
  if (!evaluacion || !alumno || evaluacion.alumno_id !== alumnoId) notFound()

  const volver = `/dashboard/alumnos/${alumnoId}/valoracion/estandarizada/${evaluacionId}`
  const cabecera = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-slate-800">Colocación en el currículo</h2>
      <Link href={volver} className="text-sm font-medium text-indigo-600 hover:underline">
        ← Volver a la evaluación
      </Link>
    </div>
  )

  if (evaluacion.estado !== 'finalizada') {
    return (
      <div className="space-y-4">
        {cabecera}
        <p className="text-sm text-slate-500">La colocación se hace con la evaluación finalizada.</p>
      </div>
    )
  }

  const filtroClinica = alumno.clinica_id
    ? `clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`
    : 'clinica_id.is.null'

  const [items, respuestas, vinculos, estructura, { data: programasBase }, { data: valoraciones }, { data: asignados }, { data: requisitos }] =
    await Promise.all([
      cargarItems(supabase),
      cargarRespuestas(supabase, evaluacionId),
      cargarVinculos(supabase),
      cargarEstructuraCurriculo(supabase),
      supabase.from('programas_base').select('id, nombre, orden, dominio_id, clinica_id').eq('activo', true).or(filtroClinica),
      supabase.from('evaluaciones_iniciales').select('programa_base_id, valoracion, notas').eq('alumno_id', alumnoId),
      supabase
        .from('programas_alumno')
        .select('programa_base_id, estado')
        .eq('alumno_id', alumnoId)
        .not('programa_base_id', 'is', null),
      supabase.from('requisitos_programa').select('programa_base_id, requisito_id'),
    ])

  const codificador = crearCodificador(estructura)
  const dominios = new Map(estructura.dominios.map((d) => [d.id, d]))
  const programas = new Map(
    (programasBase ?? []).map((p) => [
      p.id,
      { ...p, codigo: codificador.codigo(p), ordenGlobal: codificador.ordenGlobal(p), dominio: p.dominio_id ? dominios.get(p.dominio_id) : undefined },
    ])
  )
  const valoracionActual = new Map((valoraciones ?? []).map((v) => [v.programa_base_id, v]))
  const dominadosPei = new Set(
    (asignados ?? []).filter((a) => a.estado === 'dominado' || a.estado === 'mantenimiento').map((a) => a.programa_base_id!)
  )

  const filas: FilaColocacion[] = calcularColocacion(items, new Map(respuestas.map((r) => [r.itemId, r])), vinculos)
    .flatMap((c) => {
      const p = programas.get(c.programaBaseId)
      if (!p) return []
      const actual = valoracionActual.get(c.programaBaseId)
      return [
        {
          programaBaseId: c.programaBaseId,
          nombre: p.codigo ? `${p.codigo} ${p.nombre}` : p.nombre,
          dominio: p.dominio ? `${p.dominio.codigo} ${p.dominio.nombre}` : '',
          ordenGlobal: p.ordenGlobal ?? Number.MAX_SAFE_INTEGER,
          propuesta: c.valoracion,
          evidencias: c.evidencias,
          actual: (actual?.valoracion as Valoracion | undefined) ?? null,
          actualManual: !!actual && !(actual.notas ?? '').startsWith(PREFIJO_NOTA),
          dominadoPei: dominadosPei.has(c.programaBaseId),
        },
      ]
    })
    .sort((a, b) => a.ordenGlobal - b.ordenGlobal)

  let propuestos: ProgramaPropuesto[] = []
  let bloqueados = 0
  if (evaluacion.colocacion_aplicada_at) {
    const bloqueos = calcularBloqueos((await cargarProgresoAlumno(supabase, alumno, estructura)).niveles)
    const valoracionPorPrograma = new Map(
      (valoraciones ?? []).map((v) => [v.programa_base_id, v.valoracion as Valoracion])
    )
    const dominados = new Set([
      ...dominadosPei,
      ...(valoraciones ?? []).filter((v) => v.valoracion === 'dominado').map((v) => v.programa_base_id),
    ])
    const requisitosDe = new Map<string, string[]>()
    for (const r of requisitos ?? []) {
      requisitosDe.set(r.programa_base_id, [...(requisitosDe.get(r.programa_base_id) ?? []), r.requisito_id])
    }
    const enPei = new Set((asignados ?? []).map((a) => a.programa_base_id!))

    propuestos = proponerProgramas(
      [...programas.values()].map((p) => ({ id: p.id, ordenGlobal: p.ordenGlobal, dominioId: p.dominio_id })),
      valoracionPorPrograma,
      { enPei, dominados, bloqueos, requisitosDe }
    ).map((id) => {
      const p = programas.get(id)!
      return {
        programaBaseId: id,
        nombre: p.codigo ? `${p.codigo} ${p.nombre}` : p.nombre,
        valoracion: valoracionPorPrograma.get(id)!,
      }
    })

    bloqueados = filas.filter((f) => {
      const dominioId = programas.get(f.programaBaseId)?.dominio_id
      return f.propuesta !== 'dominado' && !enPei.has(f.programaBaseId) && dominioId && bloqueos.has(dominioId)
    }).length
  }

  return (
    <div className="space-y-4">
      {cabecera}
      <ColocacionClient
        alumnoId={alumnoId}
        evaluacionId={evaluacionId}
        aplicadaAt={evaluacion.colocacion_aplicada_at}
        nivelInicio={evaluacion.nivel_inicio}
        filas={filas}
        propuestos={propuestos}
        bloqueados={bloqueados}
      />
    </div>
  )
}
