import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PuntoPartidaClient, { type NivelPartida, type ProgramaPartida, type Origen } from './punto-partida-client'
import { cargarEstructuraCurriculo, crearCodificador } from '../../../curriculo/estructura'
import { puedeDisenar } from '../../../permisos'
import { textoResultado } from './entrevista/resultado'
import { Panel } from '../../../../ui'

const VALORACIONES = ['dominado', 'parcial', 'no'] as const
type Valoracion = (typeof VALORACIONES)[number]

// Punto de partida del alumno en el currículo: valoración por dominio (y, si
// hace falta, por programa). La entrevista inicial la rellena de forma
// aproximada; aquí se revisa y se corrige. La antigua evaluación estandarizada
// de 80 ítems se retiró el 2026-11-27 (sus datos se conservan).
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
        .from('entrevistas_iniciales')
        .select('id, estado, created_at, dominio_recomendado, lagunas, pendientes')
        .eq('alumno_id', alumnoId)
        .neq('estado', 'anulada')
        .order('created_at', { ascending: false })
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
      else if (v?.notas?.startsWith('Evaluación estandarizada') || v?.notas?.startsWith('Entrevista inicial')) origen = 'evaluacion'
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
  const base = `/dashboard/alumnos/${alumnoId}/valoracion/entrevista`

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Punto de partida</h2>

      <Panel className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">Entrevista inicial</p>
          {ultima ? (
            <p className="text-sm text-slate-600">
              {new Date(ultima.created_at).toLocaleDateString('es-ES')}:{' '}
              {ultima.estado === 'finalizada' ? textoResultado(ultima.dominio_recomendado, ultima.lagunas, ultima.pendientes) : 'en curso'}
            </p>
          ) : (
            <p className="text-sm text-slate-600">Preguntas a la familia que sitúan al alumno, de forma aproximada, en nivel y dominio.</p>
          )}
        </div>
        <Link
          href={ultima?.estado === 'en_curso' ? `${base}/${ultima.id}` : base}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {ultima?.estado === 'en_curso' ? 'Continuar la entrevista' : ultima ? 'Ver o hacer otra entrevista' : 'Hacer la entrevista'}
        </Link>
      </Panel>

      <PuntoPartidaClient alumnoId={alumnoId} programas={programas} niveles={niveles} soloLectura={!disena} />
    </div>
  )
}
