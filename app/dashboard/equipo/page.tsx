import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { crearTerapeuta, crearAlumno } from './actions'
import TerapeutasTabla from './terapeutas-tabla'
import AlumnosTabla from './alumnos-tabla'
import ToggleTambienTerapeuta from './toggle-tambien-terapeuta'

export default async function EquipoPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, clinica_id, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: terapeutasReales } = await supabase
    .from('perfiles')
    .select('id, nombre, email, activo')
    .eq('clinica_id', perfil.clinica_id)
    .eq('rol', 'terapeuta')
    .order('nombre')

  const terapeutas =
    perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta
      ? [
          { id: perfil.id, nombre: `${perfil.nombre} (tú)`, email: '', activo: true },
          ...(terapeutasReales ?? []),
        ]
      : terapeutasReales

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, fecha_nacimiento, activo, alumno_terapeuta(terapeuta_id, es_principal)')
    .eq('clinica_id', perfil.clinica_id)
    .order('nombre_anonimizado')

  const nombreTerapeuta = (id: string) => terapeutas?.find((t) => t.id === id)?.nombre ?? '—'

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8 sm:space-y-10">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Equipo y Alumnos</h1>

      {perfil.rol === 'clinica_admin' && (
        <ToggleTambienTerapeuta nombre={perfil.nombre} activo={perfil.tambien_terapeuta} />
      )}

      {/* --- TERAPEUTAS --- */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-700">Terapeutas</h2>

        <form
          action={async (formData) => {
            'use server'
            await crearTerapeuta(formData)
          }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
        >
          <input
            name="nombre"
            placeholder="Nombre"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña provisional"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-3 rounded-lg bg-indigo-600 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear terapeuta
          </button>
        </form>

        <TerapeutasTabla terapeutas={terapeutasReales ?? []} />
      </section>

      {/* --- ALUMNOS --- */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-700">Alumnos</h2>

        <form
          action={async (formData) => {
            'use server'
            await crearAlumno(formData)
          }}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="nombre_anonimizado"
              placeholder="Iniciales (ej. M.S.)"
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
            <input
              name="fecha_nacimiento"
              type="date"
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-600">
              Terapeutas asignados <span className="text-slate-400">(marca "Principal" en uno)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {terapeutas?.filter((t) => t.activo).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" name="terapeuta_ids" value={t.id} />
                    {t.nombre}
                  </label>
                  <label className="flex items-center gap-1 text-xs text-indigo-600 border-l border-slate-200 pl-2">
                    <input type="radio" name="terapeuta_principal_id" value={t.id} />
                    Principal
                  </label>
                </div>
              ))}
              {(!terapeutas || terapeutas.filter((t) => t.activo).length === 0) && (
                <p className="text-sm text-slate-400">
                  Todavía no hay terapeutas activos creados en esta clínica.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Registrar alumno
          </button>
        </form>

        <AlumnosTabla alumnos={(alumnos as any) ?? []} terapeutas={terapeutas ?? []} />
      </section>
    </div>
  )
}