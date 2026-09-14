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
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Administración</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Gestión de clínicas</h1>
        <p className="mt-1 text-sm text-slate-500">Administra centros, suscripciones y responsables de cuenta.</p>
      </div>

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