import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FacturacionClient from './facturacion-client'

export default async function FacturacionAlumnosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol !== 'clinica_admin') {
    redirect('/dashboard')
  }

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado')
    .eq('clinica_id', perfil.clinica_id)
    .eq('activo', true)
    .order('nombre_anonimizado')

  const alumnoIds = (alumnos ?? []).map((a) => a.id)

  const { data: sesiones } = alumnoIds.length
    ? await supabase
        .from('sesiones_programadas')
        .select('id, fecha_hora, estado, cancelado_por, confirmada_familia, alumno_id, alumnos(nombre_anonimizado), terapeuta:terapeuta_id(nombre)')
        .in('alumno_id', alumnoIds)
        .neq('estado', 'programada')
        .order('fecha_hora', { ascending: false })
    : { data: [] }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Facturación</h1>
        <p className="text-sm text-slate-500">Consulta las sesiones realizadas por alumno para facilitar su facturación a las familias.</p>
      </div>

      <FacturacionClient alumnos={alumnos ?? []} sesiones={(sesiones as any) ?? []} />
    </div>
  )
}