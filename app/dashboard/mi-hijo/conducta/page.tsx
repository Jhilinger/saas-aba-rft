import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ETIQUETA_FORMATO: Record<string, string> = {
  intervalo: 'Intervalo',
  duracion: 'Duración',
  tasa: 'Tasa',
  abc: 'ABC (registro narrativo)',
}

export default async function ConductaFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-400 py-8">Sin alumnos vinculados todavía.</p>
  }

  const datosPorAlumno = await Promise.all(
    alumnos.map(async (alumno: any) => {
      const { data: programas } = await supabase
        .from('programas_alumno')
        .select('id, nombre, formato_recogida, direccion_objetivo, estado')
        .eq('alumno_id', alumno.id)
        .eq('tipo', 'conducta')
        .eq('visible_familia', true)
        .order('created_at', { ascending: false })

      return { alumnoId: alumno.id, alumnoNombre: alumno.nombre_anonimizado, programas: programas ?? [] }
    })
  )

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Registros de conducta</h1>
        <p className="text-sm text-slate-500">
          Aquí puedes ver el progreso y, si el terapeuta lo permite, añadir tus propios registros
          desde casa.
        </p>
      </div>

      {datosPorAlumno.map((d) => (
        <div key={d.alumnoId} className="space-y-3">
          {datosPorAlumno.length > 1 && <h2 className="text-lg font-bold text-slate-800">{d.alumnoNombre}</h2>}
          {d.programas.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/mi-hijo/conducta/${d.alumnoId}/${p.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300"
            >
              <p className="font-semibold text-slate-800">{p.nombre}</p>
              <p className="text-xs text-slate-500">
                {ETIQUETA_FORMATO[p.formato_recogida]}
                {p.direccion_objetivo && ` · Objetivo: ${p.direccion_objetivo === 'reducir' ? 'disminuir' : 'aumentar'}`}
              </p>
            </Link>
          ))}
          {d.programas.length === 0 && (
            <p className="text-sm text-slate-400">Sin registros compartidos contigo todavía.</p>
          )}
        </div>
      ))}
    </div>
  )
}