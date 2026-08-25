import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AbcClient from '../../../../alumnos/[id]/conducta/[programaId]/abc-client'
import TasaClient from '../../../../alumnos/[id]/conducta/[programaId]/tasa-client'
import DuracionClient from '../../../../alumnos/[id]/conducta/[programaId]/duracion-client'
import IntervaloClient from '../../../../alumnos/[id]/conducta/[programaId]/intervalo-client'
import GraficoConducta from '../../../../alumnos/[id]/conducta/[programaId]/grafico-conducta'

export default async function ProgramaConductaFamiliaPage({
  params,
}: {
  params: Promise<{ id: string; programaId: string }>
}) {
  const { id: alumnoId, programaId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculo } = await supabase
    .from('alumno_familia')
    .select('alumno_id')
    .eq('alumno_id', alumnoId)
    .eq('perfil_id', user.id)
    .maybeSingle()

  if (!vinculo) redirect('/dashboard/mi-hijo/conducta')

  const { data: programa } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, formato_recogida, direccion_objetivo, objetivo, alumno_id, visible_familia')
    .eq('id', programaId)
    .single()

  if (!programa || programa.tipo !== 'conducta' || programa.alumno_id !== alumnoId || !programa.visible_familia) {
    notFound()
  }

  const cabecera = (
    <div>
      <Link href="/dashboard/mi-hijo/conducta" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Registros de conducta
      </Link>
      <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>
      {programa.objetivo && <p className="text-sm text-slate-500 mt-1">{programa.objetivo}</p>}
    </div>
  )
    if (programa.formato_recogida === 'abc') {
    const { data: registros } = await supabase
      .from('registros_abc')
      .select('id, fecha_hora, antecedente, conducta, consecuencia, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha_hora', { ascending: false })

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <AbcClient programaAlumnoId={programaId} registrosIniciales={registros ?? []} />
      </div>
    )
  }

  if (programa.formato_recogida === 'tasa') {
    const { data: bloques } = await supabase
      .from('bloques_tasa')
      .select('id, fecha, fase, duracion_observacion_segundos, numero_ocurrencias, tasa_por_minuto, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const puntos = (bloques ?? []).map((b) => ({ fecha: b.fecha, valor: b.tasa_por_minuto, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="Ocurrencias/min"
            direccionObjetivo={programa.direccion_objetivo as any}
            titulo={programa.nombre}
          />
        </div>
        <TasaClient programaAlumnoId={programaId} bloquesIniciales={bloques ?? []} />
      </div>
    )
  }

  if (programa.formato_recogida === 'duracion') {
    const { data: bloques } = await supabase
      .from('bloques_duracion')
      .select('id, fecha, fase, duracion_sesion_segundos, numero_episodios, duracion_total_conducta_segundos, porcentaje, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const puntos = (bloques ?? []).map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="% del tiempo"
            direccionObjetivo={programa.direccion_objetivo as any}
            titulo={programa.nombre}
            dominioYFijo={[0, 100]}
          />
        </div>
        <DuracionClient programaAlumnoId={programaId} bloquesIniciales={bloques ?? []} />
      </div>
    )
  }

  if (programa.formato_recogida === 'intervalo') {
    const { data: bloques } = await supabase
      .from('bloques_intervalo')
      .select('id, fecha, fase, tipo_intervalo, duracion_intervalo_segundos, total_intervalos, intervalos_con_conducta, porcentaje, notas')
      .eq('programa_alumno_id', programaId)
      .order('fecha', { ascending: false })

    const puntos = (bloques ?? []).map((b) => ({ fecha: b.fecha, valor: b.porcentaje, fase: b.fase }))

    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
        {cabecera}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
          <GraficoConducta
            puntos={puntos}
            etiquetaY="% de intervalos"
            direccionObjetivo={programa.direccion_objetivo as any}
            titulo={programa.nombre}
            dominioYFijo={[0, 100]}
          />
        </div>
        <IntervaloClient programaAlumnoId={programaId} bloquesIniciales={bloques ?? []} />
      </div>
    )
  }

  return null
}