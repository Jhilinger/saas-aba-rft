import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BotonPortal from './boton-portal'

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  trialing: { label: 'Periodo de prueba', color: 'bg-sky-50 text-sky-700' },
  active: { label: 'Activa', color: 'bg-emerald-50 text-emerald-700' },
  past_due: { label: 'Pago pendiente', color: 'bg-amber-50 text-amber-700' },
  canceled: { label: 'Cancelada', color: 'bg-slate-100 text-slate-500' },
  unpaid: { label: 'Impagada', color: 'bg-rose-50 text-rose-700' },
  incomplete: { label: 'Incompleta', color: 'bg-slate-100 text-slate-500' },
  incomplete_expired: { label: 'Caducada', color: 'bg-slate-100 text-slate-500' },
  paused: { label: 'Pausada', color: 'bg-slate-100 text-slate-500' },
}

export default async function FacturacionPage() {
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

  const { data: clinica } = await supabase
    .from('clinicas')
    .select('nombre, estado_suscripcion, precio_fijo_mensual, precio_por_alumno, sin_facturacion')
    .eq('id', perfil.clinica_id)
    .single()

  if (!clinica) redirect('/dashboard')

  const { count: alumnosActivos } = await supabase
    .from('alumnos')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', perfil.clinica_id)
    .eq('activo', true)

  const estadoInfo = ETIQUETA_ESTADO[clinica.estado_suscripcion] ?? {
    label: clinica.estado_suscripcion,
    color: 'bg-slate-100 text-slate-500',
  }

  const totalEstimado =
    Number(clinica.precio_fijo_mensual) + Number(clinica.precio_por_alumno) * (alumnosActivos ?? 0)

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Facturación</h1>

      {clinica.sin_facturacion ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5 text-sm text-indigo-800">
          Esta clínica no tiene facturación activa (cuenta interna, sin cobros).
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-800">{clinica.nombre}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${estadoInfo.color}`}>
                {estadoInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Cuota fija</p>
                <p className="text-slate-700">{clinica.precio_fijo_mensual} €/mes</p>
              </div>
              <div>
                <p className="text-slate-400">Por alumno</p>
                <p className="text-slate-700">{clinica.precio_por_alumno} €/mes</p>
              </div>
              <div>
                <p className="text-slate-400">Alumnos activos</p>
                <p className="text-slate-700">{alumnosActivos ?? 0}</p>
              </div>
              <div>
                <p className="text-slate-400">Total estimado</p>
                <p className="text-slate-700 font-semibold">{totalEstimado.toFixed(2)} €/mes</p>
              </div>
            </div>
          </div>

          {clinica.estado_suscripcion === 'past_due' && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Hay un pago pendiente en tu suscripción. Actualiza tu método de pago desde el portal para evitar la suspensión del servicio.
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-2">
            <p className="text-sm text-slate-600">
              Desde el portal de facturación puedes cambiar tu método de pago, consultar tus facturas anteriores, o cancelar tu suscripción.
            </p>
            <BotonPortal />
          </div>
        </>
      )}
    </div>
  )
}