import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TomarDatosClient from './tomar-datos-client'
import type { Tables } from '@/database.types'

type ProgramaAlumnoConRelaciones = Pick<
  Tables<'programas_alumno'>,
  'id' | 'nombre' | 'ensayos_por_bloque' | 'alumno_id'
> & {
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
  programas_base: Pick<
    Tables<'programas_base'>,
    'instrucciones_terapeuta' | 'ayudas_posibles' | 'video_url'
  > | null
}

export default async function TomarDatosAbaPage({
  params,
}: {
  params: Promise<{ conjuntoId: string }>
}) {
  const { conjuntoId } = await params
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

    const { data: conjunto } = await supabase
    .from('conjuntos_estimulos_alumno')
    .select(
      'id, nombre, estado, programa_alumno_id, estimulos_alumno(id, nombre), programas_alumno(id, nombre, ensayos_por_bloque, alumno_id, alumnos(nombre_anonimizado), programas_base(instrucciones_terapeuta, ayudas_posibles, video_url))'
    )
    .eq('id', conjuntoId)
    .single()

  if (!conjunto) notFound()

  const programa = conjunto.programas_alumno as ProgramaAlumnoConRelaciones
  const alumnoNombre = programa?.alumnos?.nombre_anonimizado ?? ''

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <div>
        <Link
          href={`/dashboard/programas/${programa.id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Volver a {programa.nombre}
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">Toma de datos ABA</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
          {alumnoNombre} — {conjunto.nombre}
        </h1>
      </div>

            <TomarDatosClient
        conjuntoId={conjunto.id}
        programaAlumnoId={programa.id}
        alumnoId={programa.alumno_id}
        estimulos={conjunto.estimulos_alumno}
        ensayosPorBloque={programa.ensayos_por_bloque}
        instrucciones={programa.programas_base?.instrucciones_terapeuta ?? null}
        ayudasPosibles={programa.programas_base?.ayudas_posibles ?? null}
        videoUrl={programa.programas_base?.video_url ?? null}
        faseConjunto={conjunto.estado}
      />
    </div>
  )
}