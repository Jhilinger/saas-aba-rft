import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import InformesLoteClient from './informes-lote-client'

export default async function InformesLotePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado')
    .eq('clinica_id', perfil.clinica_id)
    .eq('activo', true)
    .order('nombre_anonimizado')

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Informes en lote</h1>
        <p className="text-sm text-slate-500">
          Genera el informe de varios alumnos a la vez, uno detrás de otro.
        </p>
      </div>

      <InformesLoteClient alumnos={alumnos ?? []} />
    </div>
  )
}