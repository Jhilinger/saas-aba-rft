import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DocumentosLegalesClient from './documentos-legales-client'

export default async function DocumentosLegalesPage() {
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

  const clinicaId = perfil.clinica_id
  if (!clinicaId) redirect('/dashboard')

  const { data: tipos, error: errorTipos } = await supabase
    .from('tipos_documento_clinica')
    .select('id, titulo, contenido, activo, created_at')
    .eq('clinica_id', clinicaId)
    .order('created_at', { ascending: true })

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Centro</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Documentos legales</h1>
        <p className="text-sm text-slate-500">
          Redacta aquí el consentimiento informado, la protección de datos, los términos y
          condiciones, o cualquier otro documento que las familias deban firmar.
        </p>
      </div>

      <DocumentosLegalesClient tiposIniciales={tipos ?? []} />
    </div>
  )
}