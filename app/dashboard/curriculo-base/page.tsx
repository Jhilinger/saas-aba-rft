import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CurriculoTabla from '../curriculo/curriculo-tabla'
import { cargarEstructuraCurriculo } from '../curriculo/estructura'

// Currículo Base en solo lectura para el personal de las clínicas (solo el
// superadmin lo edita, desde /dashboard/curriculo)
export default async function CurriculoBasePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['clinica_admin', 'terapeuta'].includes(perfil.rol)) redirect('/dashboard')

  const [{ data: programas, error }, estructura] = await Promise.all([
    supabase
      .from('programas_base')
      .select('id, nombre, tipo, tipo_relacion, dominio_id, activo, orden, clinica_id, visibilidad, creado_por')
      .is('clinica_id', null)
      .eq('activo', true),
    cargarEstructuraCurriculo(supabase),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:space-y-8 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Biblioteca clínica</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Currículo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Programas del currículo organizados por niveles y dominios. Abre cualquiera para ver su objetivo,
          materiales, instrucciones y estímulos de plantilla.
        </p>
      </div>

      <CurriculoTabla programas={programas ?? []} estructura={estructura} miPerfilId={perfil.id} miRol={perfil.rol} />

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Error cargando programas: {error.message}</p>
      )}
    </div>
  )
}
