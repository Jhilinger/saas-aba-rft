import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { crearTerapeuta } from './actions'
import TerapeutasTabla from './terapeutas-tabla'
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

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8 sm:space-y-10">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Terapeutas</h1>

      {perfil.rol === 'clinica_admin' && (
        <ToggleTambienTerapeuta nombre={perfil.nombre} activo={perfil.tambien_terapeuta} />
      )}

      <section className="space-y-4">
        <form
          action={async (formData) => {
            'use server'
            await crearTerapeuta(formData)
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
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
          <button
            type="submit"
            className="sm:col-span-2 rounded-lg bg-indigo-600 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Invitar terapeuta
          </button>
        </form>

        <TerapeutasTabla terapeutas={terapeutasReales ?? []} />
      </section>
    </div>
  )
}