import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TerapeutasTabla from './terapeutas-tabla'
import ToggleTambienTerapeuta from './toggle-tambien-terapeuta'
import InvitarTerapeutaForm from './invitar-terapeuta-form'

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

  const clinicaId = perfil.clinica_id
  if (!clinicaId) redirect('/dashboard')

  const { data: terapeutasReales } = await supabase
    .from('perfiles')
    .select('id, nombre, email, activo')
    .eq('clinica_id', clinicaId)
    .eq('rol', 'terapeuta')
    .order('nombre')

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8 sm:space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Perfiles</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Terapeutas</h1>
        <p className="mt-1 text-sm text-slate-500">Invita y organiza al equipo que trabaja en tu clínica.</p>
      </div>

      {perfil.rol === 'clinica_admin' && (
        <ToggleTambienTerapeuta nombre={perfil.nombre} activo={perfil.tambien_terapeuta} />
      )}

      <section className="space-y-4">
        <InvitarTerapeutaForm />

        <TerapeutasTabla terapeutas={terapeutasReales ?? []} />
      </section>
    </div>
  )
}