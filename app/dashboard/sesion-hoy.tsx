import Link from 'next/link'
import type { createClient } from '@/utils/supabase/server'
import { Panel } from '../ui'

type Supabase = Awaited<ReturnType<typeof createClient>>

// Inicio del terapeuta: lo que hay que trabajar con cada alumno asignado, con
// acceso directo a la toma de datos. A quien diseña la intervención le añade
// avisos sobre el PEI.

const DIAS_SIN_DATOS = 14
const MIN_PROGRAMAS_ACTIVOS = 3

type Accion = { href: string; label: string }
type ProgramaHoy = {
  id: string
  nombre: string
  estado: string
  acciones: Accion[]
  ultimoDato: string | null
}

function haceDias(fecha: string | null) {
  if (!fecha) return null
  return Math.floor((new Date().getTime() - new Date(fecha).getTime()) / 86400000)
}

function textoUltimoDato(fecha: string | null) {
  const dias = haceDias(fecha)
  if (dias === null) return 'sin datos todavía'
  if (dias === 0) return 'último dato hoy'
  if (dias === 1) return 'último dato ayer'
  return `último dato hace ${dias} días`
}

export default async function SesionHoy({ supabase, terapeutaId, disena }: { supabase: Supabase; terapeutaId: string; disena: boolean }) {
  const { data: vinculos } = await supabase
    .from('alumno_terapeuta')
    .select('alumnos(id, nombre_anonimizado, activo)')
    .eq('terapeuta_id', terapeutaId)

  const alumnos = (vinculos ?? [])
    .map((v) => v.alumnos)
    .filter((a): a is NonNullable<typeof a> => !!a && a.activo)
    .sort((a, b) => a.nombre_anonimizado.localeCompare(b.nombre_anonimizado))
  const alumnoIds = alumnos.map((a) => a.id)

  if (alumnoIds.length === 0) {
    return (
      <Panel className="p-6 text-center text-sm text-slate-500">
        Todavía no tienes alumnos asignados. Pídeselo al administrador de tu clínica.
      </Panel>
    )
  }

  const [{ data: programas }, { data: valoraciones }] = await Promise.all([
    supabase
      .from('programas_alumno')
      .select('id, nombre, tipo, estado, formato_recogida, orden, alumno_id, conjuntos_estimulos_alumno(id, nombre, estado, bloques_ensayo(fecha))')
      .in('alumno_id', alumnoIds)
      .in('estado', ['linea_base', 'adquisicion', 'mantenimiento'])
      .order('orden', { nullsFirst: false })
      // Solo el último bloque de cada conjunto
      .order('fecha', { referencedTable: 'conjuntos_estimulos_alumno.bloques_ensayo', ascending: false })
      .limit(1, { referencedTable: 'conjuntos_estimulos_alumno.bloques_ensayo' }),
    disena
      ? supabase.from('evaluaciones_iniciales').select('alumno_id').in('alumno_id', alumnoIds)
      : Promise.resolve({ data: [] as { alumno_id: string }[] }),
  ])

  // Último bloque de cada programa RFT (una consulta para todos)
  const idsRft = (programas ?? []).filter((p) => p.tipo === 'rft').map((p) => p.id)
  const { data: ultimosRft } = idsRft.length
    ? await supabase
        .from('bloques_ensayo_rft')
        .select('programa_alumno_id, fecha')
        .in('programa_alumno_id', idsRft)
        .order('fecha', { ascending: false })
        .limit(500)
    : { data: [] as { programa_alumno_id: string; fecha: string }[] }
  const ultimoRft = new Map<string, string>()
  for (const b of ultimosRft ?? []) if (!ultimoRft.has(b.programa_alumno_id)) ultimoRft.set(b.programa_alumno_id, b.fecha)

  const porAlumno = new Map<string, ProgramaHoy[]>()
  for (const p of programas ?? []) {
    let acciones: Accion[] = []
    let ultimoDato: string | null = null
    if (p.tipo === 'rft') {
      acciones = [{ href: `/dashboard/tomar-datos/rft/${p.id}`, label: 'Tomar datos' }]
      ultimoDato = ultimoRft.get(p.id) ?? null
    } else if (p.formato_recogida === 'ensayo_discreto') {
      const conjuntos = p.conjuntos_estimulos_alumno ?? []
      const enCurso = conjuntos.filter(
        (c) => c.estado === 'linea_base' || c.estado === 'adquisicion' || (p.estado === 'mantenimiento' && c.estado === 'dominado')
      )
      acciones = enCurso.map((c) => ({
        href: `/dashboard/tomar-datos/aba/${c.id}`,
        label: enCurso.length === 1 ? 'Tomar datos' : c.nombre,
      }))
      ultimoDato =
        conjuntos
          .flatMap((c) => c.bloques_ensayo ?? [])
          .map((b) => b.fecha)
          .sort()
          .at(-1) ?? null
    } else {
      acciones = [{ href: `/dashboard/programas/${p.id}`, label: 'Registrar' }]
    }
    porAlumno.set(p.alumno_id, [...(porAlumno.get(p.alumno_id) ?? []), { id: p.id, nombre: p.nombre, estado: p.estado, acciones, ultimoDato }])
  }

  const conPuntoPartida = new Set((valoraciones ?? []).map((v) => v.alumno_id))

  return (
    <div className="space-y-4">
      {alumnos.map((alumno) => {
        const lista = porAlumno.get(alumno.id) ?? []
        const activos = lista.filter((p) => p.estado !== 'mantenimiento')
        const mantenimiento = lista.filter((p) => p.estado === 'mantenimiento')
        const avisos: { texto: string; href: string }[] = []
        if (disena) {
          if (!conPuntoPartida.has(alumno.id))
            avisos.push({ texto: 'Sin punto de partida: empieza por la evaluación inicial', href: `/dashboard/alumnos/${alumno.id}/valoracion` })
          if (activos.length < MIN_PROGRAMAS_ACTIVOS)
            avisos.push({ texto: `Solo ${activos.length} programas activos en el PEI`, href: `/dashboard/alumnos/${alumno.id}/pei` })
          const sinDatos = activos.filter((p) => p.acciones.length > 0 && (haceDias(p.ultimoDato) ?? 0) > DIAS_SIN_DATOS)
          if (sinDatos.length)
            avisos.push({ texto: `${sinDatos.length} programas sin datos en más de ${DIAS_SIN_DATOS} días`, href: `/dashboard/alumnos/${alumno.id}/pei` })
        }

        return (
          <Panel key={alumno.id} className="space-y-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-800">{alumno.nombre_anonimizado}</h2>
              <Link href={`/dashboard/alumnos/${alumno.id}/pei`} className="text-sm font-medium text-indigo-600 hover:underline">
                Ver PEI →
              </Link>
            </div>

            {avisos.length > 0 && (
              <ul className="space-y-1">
                {avisos.map((a) => (
                  <li key={a.texto}>
                    <Link href={a.href} className="block rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-100">
                      {a.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {activos.length === 0 && mantenimiento.length === 0 ? (
              <p className="text-sm text-slate-500">Sin programas en curso.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {[...activos, ...mantenimiento].map((p) => (
                  <li key={p.id} className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-800">
                        {p.nombre}
                        {p.estado === 'linea_base' && <span className="ml-2 text-xs font-normal text-sky-700">línea base</span>}
                        {p.estado === 'mantenimiento' && <span className="ml-2 text-xs font-normal text-blue-700">mantenimiento</span>}
                      </span>
                      <span className="block text-xs text-slate-500">{textoUltimoDato(p.ultimoDato)}</span>
                    </span>
                    <span className="flex flex-wrap gap-2">
                      {p.acciones.length === 0 ? (
                        <Link href={`/dashboard/programas/${p.id}`} className="text-xs text-slate-500 hover:underline">
                          Sin conjuntos activos
                        </Link>
                      ) : (
                        p.acciones.map((a) => (
                          <Link
                            key={a.href}
                            href={a.href}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                          >
                            {a.label}
                          </Link>
                        ))
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )
      })}
    </div>
  )
}
