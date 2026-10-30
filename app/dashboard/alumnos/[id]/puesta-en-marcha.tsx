import Link from 'next/link'
import type { createClient } from '@/utils/supabase/server'

type Supabase = Awaited<ReturnType<typeof createClient>>

// Pasos para poner en marcha a un alumno nuevo, en orden. Se muestra a quien
// diseña la intervención hasta que el alumno tiene su primera sesión
// registrada; los pasos anteriores son recomendaciones, no requisitos.
export default async function PuestaEnMarcha({ supabase, alumnoId }: { supabase: Supabase; alumnoId: string }) {
  const [
    { data: clinicos },
    { count: preferencias },
    { count: evaluacionesPref },
    { data: evaluaciones },
    { count: valoraciones },
    { count: programas },
    { data: bloquesAba },
    { data: bloquesRft },
  ] = await Promise.all([
    supabase.from('alumnos_datos_clinicos').select('diagnostico, modalidad_comunicacion').eq('alumno_id', alumnoId).maybeSingle(),
    supabase.from('preferencias_alumno').select('id', { count: 'exact', head: true }).eq('alumno_id', alumnoId),
    supabase.from('evaluaciones_preferencia').select('id', { count: 'exact', head: true }).eq('alumno_id', alumnoId),
    supabase.from('evaluaciones').select('estado, colocacion_aplicada_at').eq('alumno_id', alumnoId).neq('estado', 'anulada'),
    supabase.from('evaluaciones_iniciales').select('id', { count: 'exact', head: true }).eq('alumno_id', alumnoId),
    supabase
      .from('programas_alumno')
      .select('id', { count: 'exact', head: true })
      .eq('alumno_id', alumnoId)
      .in('estado', ['linea_base', 'adquisicion', 'mantenimiento']),
    supabase
      .from('bloques_ensayo')
      .select('id, conjuntos_estimulos_alumno!inner(programas_alumno!inner(alumno_id))')
      .eq('conjuntos_estimulos_alumno.programas_alumno.alumno_id', alumnoId)
      .limit(1),
    supabase
      .from('bloques_ensayo_rft')
      .select('id, programas_alumno!inner(alumno_id)')
      .eq('programas_alumno.alumno_id', alumnoId)
      .limit(1),
  ])

  const conSesiones = (bloquesAba?.length ?? 0) + (bloquesRft?.length ?? 0) > 0
  if (conSesiones) return null

  const base = `/dashboard/alumnos/${alumnoId}`
  const evaluada = (evaluaciones ?? []).some((e) => e.estado === 'finalizada')
  const pasos = [
    { label: 'Datos clínicos', hecho: !!(clinicos?.diagnostico || clinicos?.modalidad_comunicacion), href: `${base}/datos-clinicos` },
    { label: 'Preferencias', hecho: (preferencias ?? 0) + (evaluacionesPref ?? 0) > 0, href: `${base}/preferencias` },
    { label: 'Evaluación inicial', hecho: evaluada, href: `${base}/valoracion` },
    {
      label: 'Punto de partida',
      hecho: (evaluaciones ?? []).some((e) => e.colocacion_aplicada_at) || (valoraciones ?? 0) > 0,
      href: `${base}/valoracion`,
    },
    { label: 'Programas en el PEI', hecho: (programas ?? 0) > 0, href: `${base}/pei` },
    { label: 'Primera sesión', hecho: false, href: '/dashboard' },
  ]
  const siguiente = pasos.findIndex((p) => !p.hecho)

  return (
    <nav aria-label="Puesta en marcha del alumno" className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3 print:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">Puesta en marcha</p>
      <ol className="flex flex-wrap gap-2">
        {pasos.map((p, i) => (
          <li key={p.label}>
            <Link
              href={p.href}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                p.hecho
                  ? 'border-emerald-200 bg-white text-emerald-700'
                  : i === siguiente
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <span>{p.hecho ? '✓' : i + 1}</span>
              {p.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
