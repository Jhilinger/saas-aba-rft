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

  let query = supabase
    .from('programas_base')
    .select('id, nombre, tipo, tipo_relacion, area, activo, orden, clinica_id, visibilidad, creado_por, created_at')
    .order('created_at', { ascending: false })

  if (perfil.rol === 'superadmin') {
    query = query.is('clinica_id', null)
  } else {
    query = query.eq('clinica_id', perfil.clinica_id).eq('visibilidad', 'clinica')
  }

  const { data: programas, error } = await query

  const titulo = perfil.rol === 'superadmin' ? 'Currículo Base (global)' : 'Currículo de la clínica'

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{titulo}</h1>

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