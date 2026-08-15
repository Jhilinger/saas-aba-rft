import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { obtenerEvolucionAba } from '../programas/[id]/evolucion-actions'
import { obtenerEvolucionRft } from '../programas-rft/[id]/evolucion-actions'
import EvolucionChart from '../programas/[id]/evolucion-chart'
import EvolucionRftChart from '../programas-rft/[id]/evolucion-rft-chart'
import ConfirmarAsistencia from './confirmar-asistencia'
import HistorialAsistencia from './historial-asistencia'
import InformesFamilia from './informes-familia'
import MiHijoTabs from './mi-hijo-tabs'

const ESTADO_LABEL: Record<string, string> = {
  adquisicion: 'En adquisición',
  mantenimiento: 'En mantenimiento',
  dominado: 'Dominado',
  pausado: 'Pausado',
}

const ESTADO_COLOR: Record<string, string> = {
  adquisicion: 'bg-amber-50 text-amber-700',
  mantenimiento: 'bg-blue-50 text-blue-700',
  dominado: 'bg-emerald-50 text-emerald-700',
  pausado: 'bg-slate-100 text-slate-500',
}

export default async function MiHijoPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'familia') redirect('/dashboard')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado, fecha_nacimiento, clinica_id)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p className="text-center text-slate-400">
          Todavía no hay ningún alumno vinculado a tu cuenta. Contacta con la clínica.
        </p>
      </div>
    )
  }

  const alumnoIds = alumnos.map((a: any) => a.id)

  const { data: clinicaDatos } = await supabase
    .from('clinicas')
    .select('nombre')
    .eq('id', alumnos[0].clinica_id)
    .single()

  const { data: sesionesPendientes } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora, estado, cancelado_por, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .neq('estado', 'programada')
    .eq('confirmada_familia', false)
    .order('fecha_hora', { ascending: false })

  const pendientesFormateadas = (sesionesPendientes ?? []).map((s: any) => ({
    id: s.id,
    fecha_hora: s.fecha_hora,
    estado: s.estado,
    cancelado_por: s.cancelado_por,
    alumno_nombre: s.alumnos?.nombre_anonimizado ?? '—',
  }))

  const { data: historial } = await supabase
    .from('sesiones_programadas')
    .select('id, fecha_hora, estado, cancelado_por, confirmada_familia, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .order('fecha_hora', { ascending: false })
    .limit(50)

  const historialFormateado = (historial ?? []).map((s: any) => ({
    id: s.id,
    fecha_hora: s.fecha_hora,
    estado: s.estado,
    cancelado_por: s.cancelado_por,
    confirmada_familia: s.confirmada_familia,
    alumno_nombre: s.alumnos?.nombre_anonimizado ?? '—',
  }))

  const { data: informesData } = await supabase
    .from('informes')
    .select('id, periodo_desde, periodo_hasta, contenido, created_at, alumno_id, alumnos(nombre_anonimizado)')
    .in('alumno_id', alumnoIds)
    .eq('destinatario', 'familia')
    .order('created_at', { ascending: false })

  const informesFormateados = (informesData ?? []).map((i: any) => ({
    id: i.id,
    periodo_desde: i.periodo_desde,
    periodo_hasta: i.periodo_hasta,
    contenido: i.contenido,
    created_at: i.created_at,
    alumno_nombre: i.alumnos?.nombre_anonimizado ?? '—',
  }))

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <MiHijoTabs
        progreso={
          <div className="space-y-10">
            {alumnos.map(async (alumno: any) => {
              const { data: programas } = await supabase
                .from('programas_alumno')
                .select('id, nombre, tipo, estado, porcentaje_dominio')
                .eq('alumno_id', alumno.id)
                .order('created_at', { ascending: false })

              return (
                <div key={alumno.id} className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{alumno.nombre_anonimizado}</h1>
                    <p className="text-sm text-slate-500">Nacimiento: {alumno.fecha_nacimiento}</p>
                  </div>

                  {(!programas || programas.length === 0) && (
                    <p className="text-center text-slate-400">
                      Todavía no hay programas asignados.
                    </p>
                  )}

                  {programas?.map(async (p: any) => {
                    const datos =
                      p.tipo === 'aba_clasico'
                        ? await obtenerEvolucionAba(p.id)
                        : await obtenerEvolucionRft(p.id)

                    return (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold text-slate-800">{p.nombre}</h2>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${ESTADO_COLOR[p.estado]}`}
                          >
                            {ESTADO_LABEL[p.estado] ?? p.estado}
                          </span>
                        </div>

                        {p.tipo === 'aba_clasico' ? (
                          <EvolucionChart
                            conjuntos={(datos as any).conjuntos}
                            porcentajeDominio={p.porcentaje_dominio}
                          />
                        ) : (
                          <EvolucionRftChart
                            porFase={(datos as any).porFase}
                            porcentajeDominio={p.porcentaje_dominio}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        }
        asistencia={
          <div className="space-y-6">
            <ConfirmarAsistencia sesionesIniciales={pendientesFormateadas} />
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
              <HistorialAsistencia sesiones={historialFormateado} />
            </div>
          </div>
        }
        informes={
          <InformesFamilia
            informes={informesFormateados}
            nombreClinica={clinicaDatos?.nombre ?? 'Centro de terapia'}
          />
        }
      />
    </div>
  )
}