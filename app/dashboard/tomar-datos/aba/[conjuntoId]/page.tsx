import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TomarDatosClient from './tomar-datos-client'

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
      'id, nombre, estado, programa_alumno_id, estimulos_alumno(id, nombre), programas_alumno(id, nombre, ensayos_por_bloque, alumno_id, alumnos(nombre_anonimizado), programas_base(instrucciones_terapeuta, ayudas_posibles))'
    )
    .eq('id', conjuntoId)
    .single()

  if (!conjunto) notFound()

  const programa = conjunto.programas_alumno as any
  const alumnoNombre = programa?.alumnos?.nombre_anonimizado ?? ''

  return (
    <div className="mx-auto max-w-2xl p-8 space-y-6">
      <div>
        <Link
          href={`/dashboard/programas/${programa.id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Volver a {programa.nombre}
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-800">
          {alumnoNombre} — {conjunto.nombre}
        </h1>
      </div>

      <TomarDatosClient
        conjuntoId={conjunto.id}
        programaAlumnoId={programa.id}
        alumnoId={programa.alumno_id}
        estimulos={conjunto.estimulos_alumno as any}
        ensayosPorBloque={programa.ensayos_por_bloque}
        instrucciones={programa.programas_base?.instrucciones_terapeuta ?? null}
        ayudasPosibles={programa.programas_base?.ayudas_posibles ?? null}
        faseConjunto={conjunto.estado as any}
      />
    </div>
  )
}