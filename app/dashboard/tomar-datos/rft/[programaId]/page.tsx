import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TomarDatosRftClient from './tomar-datos-rft-client'

export default async function TomarDatosRftPage({
  params,
  searchParams,
}: {
  params: Promise<{ programaId: string }>
  searchParams: Promise<{ grupo?: string }>
}) {
  const { programaId } = await params
  const { grupo } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  const puedeVer =
    perfil &&
    (perfil.rol === 'superadmin' ||
      perfil.rol === 'terapeuta' ||
      (perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta))

  if (!puedeVer) {
    redirect('/dashboard')
  }

    const { data: programa } = await supabase
    .from('programas_alumno')
    .select(
      'id, nombre, ensayos_por_bloque, alumno_id, alumnos(nombre_anonimizado), programas_base(instrucciones_terapeuta, ayudas_posibles, video_url)'
    )
    .eq('id', programaId)
    .single()

  if (!programa) notFound()

  const { data: clases } = await supabase
    .from('clases_rft')
    .select('id, nombre, grupo, estimulos_rft(id, nombre, posicion)')
    .eq('programa_alumno_id', programaId)
    .order('grupo')
    .order('created_at')

  const { data: dominioFases } = await supabase
    .from('dominio_rft_fases')
    .select('grupo, fase, posicion_origen, posicion_destino, dominado')
    .eq('programa_alumno_id', programaId)
    .eq('dominado', true)
    .in('fase', ['test_mutuo', 'test_combinatorio', 'transformacion_funciones'])

  const alumnoNombre = programa.alumnos?.nombre_anonimizado ?? ''

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <div>
        <Link
          href={`/dashboard/programas-rft/${programa.id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Volver a {programa.nombre}
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">Toma de datos RFT</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
          {alumnoNombre} — {programa.nombre}
        </h1>
      </div>

            <TomarDatosRftClient
        programaAlumnoId={programa.id}
        alumnoId={programa.alumno_id}
        clases={clases ?? []}
        ensayosPorBloqueDefecto={programa.ensayos_por_bloque}
        instrucciones={programa.programas_base?.instrucciones_terapeuta ?? null}
        ayudasPosibles={programa.programas_base?.ayudas_posibles ?? null}
        videoUrl={programa.programas_base?.video_url ?? null}
        grupoInicial={grupo ?? null}
        combosDominados={(dominioFases ?? []).map((d) => `${d.grupo}__${d.posicion_origen}__${d.posicion_destino}`)}
      />
    </div>
  )
}