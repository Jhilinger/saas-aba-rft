import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProgramaFormPrivado from './programa-form'
import CurriculoTabla from '../curriculo/curriculo-tabla'
import CurriculoTabs from '../curriculo/curriculo-tabs'

export default async function MisProgramasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id, id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: programas, error } = await supabase
    .from('programas_base')
    .select('id, nombre, tipo, tipo_relacion, area, activo, orden, clinica_id, visibilidad, creado_por, created_at')
    .eq('creado_por', perfil.id)
    .eq('visibilidad', 'privado')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Mi trabajo</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Mis programas</h1>
      </div>
      <p className="-mt-3 text-sm text-slate-500">
        Tu espacio privado de programas — solo tú los ves y los usas, aunque puedas asignarlos a cualquier alumno.
      </p>

      <CurriculoTabs
        tabla={
          <CurriculoTabla
            programas={programas ?? []}
            miPerfilId={perfil.id}
            miRol={perfil.rol}
          />
        }
        formulario={<ProgramaFormPrivado />}
      />

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          Error cargando programas: {error.message}
        </p>
      )}
    </div>
  )
}