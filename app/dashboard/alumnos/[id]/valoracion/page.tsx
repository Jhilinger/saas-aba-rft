import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PuntoPartidaClient, { type NivelPartida, type ProgramaPartida, type Origen } from './punto-partida-client'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../curriculo/estructura'
import { puedeDisenar } from '../../../permisos'
import { ESTADO_EVALUACION } from './estandarizada/etiquetas'
import { Panel } from '../../../../ui'

const VALORACIONES = ['dominado', 'parcial', 'no'] as const
type Valoracion = (typeof VALORACIONES)[number]

// Punto de partida del alumno en el currículo: la valoración de cada
// programa (de la evaluación estandarizada, manual o por dominio en el PEI).
// La evaluación estandarizada es la vía principal; aquí se revisa y se
// completa lo que ella no cubre.
export default async function PuntoPartidaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: alumnoId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('perfiles').select('rol').eq('id', user.id).single()
  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) redirect('/dashboard')

  const { data: alumno } = await supabase.from('alumnos').select('id, clinica_id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const filtroClinica = alumno.clinica_id
    ? `clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`
    : 'clinica_id.is.null'

  const [{ data: programasBase }, { data: valoraciones }, { data: asignados }, { data: evaluaciones }, estructura, disena] =
    await Promise.all([
      supabase.from('programas_base').select('id, nombre, orden, dominio_id, clinica_id').eq('activo', true).or(filtroClinica),
      supabase.from('evaluaciones_iniciales').select('programa_base_id, valoracion, notas').eq('alumno_id', alumnoId),
      supabase.from('programas_alumno').select('programa_base_id, estado').eq('alumno_id', alumnoId).not('programa_base_id', 'is', null),
      supabase
        .from('evaluaciones')
        .select('id, estado, iniciada_at, colocacion_aplicada_at')
        .eq('alumno_id', alumnoId)
        .neq('estado', 'anulada')
        .order('iniciada_at', { ascending: false })
        .limit(1),
      cargarEstructuraCurriculo(supabase),
      puedeDisenar(supabase),
    ])

  const valoracionDe = new Map((valoraciones ?? []).map((v) => [v.programa_base_id, v]))
  const dominadosPei = new Set(
    (asignados ?? []).filter((a) => a.estado === 'dominado' || a.estado === 'mantenimiento').map((a) => a.programa_base_id!)
  )
  const enPei = new Set((asignados ?? []).map((a) => a.programa_base_id!))

  const codificador = crearCodificador(estructura)
  const dominios = new Map(estructura.dominios.map((d) => [d.id, d]))
  const programas: ProgramaPartida[] = (programasBase ?? [])
    .map((p) => ({ p, ordenGlobal: codificador.ordenGlobal(p), dominio: p.dominio_id ? dominios.get(p.dominio_id) : undefined }))
    .filter((x): x is typeof x & { ordenGlobal: number; dominio: NonNullable<typeof x.dominio> } => x.ordenGlobal !== null && x.dominio !== undefined)
    .sort((a, b) => a.ordenGlobal - b.ordenGlobal)
    .map(({ p, dominio }) => {
      const v = valoracionDe.get(p.id)
      const valoracion = v && (VALORACIONES as readonly string[]).includes(v.valoracion) ? (v.valoracion as Valoracion) : null
      let origen: Origen = null
      if (dominadosPei.has(p.id)) origen = 'pei'
      else if (v?.notas?.startsWith('Evaluación estandarizada')) origen = 'evaluacion'
      else if (v?.notas?.startsWith('Marcado en bloque')) origen = 'bloque'
      else if (v) origen = 'manual'
      return {
        id: p.id,
        nombre: p.nombre,
        codigo: codificador.codigo(p),
        dominioId: dominio.id,
        valoracion: dominadosPei.has(p.id) ? 'dominado' : valoracion,
        origen,
        notas: v?.notas ?? null,
        enPei: enPei.has(p.id),
      }
    })

  const niveles: NivelPartida[] = estructura.niveles.map((n) => ({
    numero: n.numero,
    nombre: n.nombre,
    dominios: estructura.dominios.filter((d) => d.nivel === n.numero).map((d) => ({ id: d.id, codigo: d.codigo, nombre: d.nombre })),
  }))

  const ultima = evaluaciones?.[0] ?? null
  const base = `/dashboard/alumnos/${alumnoId}/valoracion/estandarizada`
  const estadoUltima = ultima ? (ESTADO_EVALUACION[ultima.estado] ?? ESTADO_EVALUACION.en_curso) : null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Punto de partida</h2>

      <Panel className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">Evaluación inicial estandarizada</p>
          {ultima && estadoUltima ? (
            <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              Última: {new Date(ultima.iniciada_at).toLocaleDateString('es-ES')}
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${estadoUltima.color}`}>{estadoUltima.label}</span>
              {ultima.estado === 'finalizada' && !ultima.colocacion_aplicada_at && (
                <span className="text-amber-700">· colocación pendiente</span>
              )}
            </p>
          ) : (
            <p className="text-sm text-slate-600">Es el punto de partida recomendado: decide el nivel y valora los programas.</p>
          )}
        </div>
        <Link
          href={ultima?.estado === 'en_curso' ? `${base}/${ultima.id}` : ultima?.estado === 'finalizada' && !ultima.colocacion_aplicada_at ? `${base}/${ultima.id}/colocacion` : base}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {ultima?.estado === 'en_curso'
            ? 'Continuar la evaluación'
            : ultima?.estado === 'finalizada' && !ultima.colocacion_aplicada_at
              ? 'Hacer la colocación'
              : ultima
                ? 'Ver evaluaciones'
                : 'Empezar la evaluación'}
        </Link>
      </Panel>

      <PuntoPartidaClient alumnoId={alumnoId} programas={programas} niveles={niveles} soloLectura={!disena} />
    </div>
  )
}
