import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CrearClinicaForm from './crear-clinica-form'
import ClinicasTabla from './clinicas-tabla'

export default async function ClinicasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'superadmin') {
    redirect('/dashboard')
  }

    const { data: clinicasData, error } = await supabase
    .from('clinicas')
    .select('id, nombre, logo_url, estado_suscripcion, precio_fijo_mensual, precio_por_alumno, activa, sin_facturacion, created_at, telefono, ciudad, pais')
    .order('created_at', { ascending: false })

  const { data: admins } = await supabase
    .from('perfiles')
    .select('clinica_id, nombre, email')
    .eq('rol', 'clinica_admin')

  const adminPorClinica = new Map((admins ?? []).map((a) => [a.clinica_id, a]))

  const clinicas = (clinicasData ?? []).map((c) => ({
    ...c,
    admin_nombre: adminPorClinica.get(c.id)?.nombre ?? null,
    admin_email: adminPorClinica.get(c.id)?.email ?? null,
  }))

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestión de Clínicas</h1>

      <CrearClinicaForm />

      <ClinicasTabla clinicas={clinicas ?? []} />

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          Error cargando clínicas: {error.message}
        </p>
      )}
    </div>
  )
}