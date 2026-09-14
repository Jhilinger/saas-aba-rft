import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProgramaForm from './programa-form'
import CurriculoTabla from './curriculo-tabla'
import CurriculoTabs from './curriculo-tabs'

export default async function CurriculoPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id, id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  if (perfil.rol === 'clinica_admin' && !perfil.clinica_id) redirect('/dashboard')

  let query = supabase
    .from('programas_base')
    .select('id, nombre, tipo, tipo_relacion, area, activo, orden, clinica_id, visibilidad, creado_por, created_at')
    .order('created_at', { ascending: false })

  if (perfil.rol === 'superadmin') {
    query = query.is('clinica_id', null)
  } else {
    const clinicaId = perfil.clinica_id
    if (!clinicaId) redirect('/dashboard')
    query = query.eq('clinica_id', clinicaId).eq('visibilidad', 'clinica')
  }

  const { data: programas, error } = await query

  const titulo = perfil.rol === 'superadmin' ? 'Currículo Base (global)' : 'Currículo de la clínica'

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:space-y-8 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Biblioteca clínica</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{titulo}</h1>
        <p className="mt-1 text-sm text-slate-500">Organiza los programas que el equipo utilizará con los alumnos.</p>
      </div>

      <CurriculoTabs
        tabla={
          <CurriculoTabla
            programas={programas ?? []}
            miPerfilId={perfil.id}
            miRol={perfil.rol}
          />
        }
        formulario={<ProgramaForm esGlobal={perfil.rol === 'superadmin'} />}
      />

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          Error cargando programas: {error.message}
        </p>
      )}
    </div>
  )
}