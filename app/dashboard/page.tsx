import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Panel } from '../ui'
import type { Tables } from '@/database.types'
import SesionHoy from './sesion-hoy'
import { puedeDisenar } from './permisos'

type AlumnoConTerapeuta = Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado'> & {
  alumno_terapeuta: Pick<Tables<'alumno_terapeuta'>, 'terapeuta_id'>[]
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, clinica_id, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  if (error || !perfil) {
    return (
      <div className="p-4 sm:p-8">
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          Error leyendo perfil: {error?.message ?? 'perfil no encontrado'}
        </p>
      </div>
    )
  }

  if (perfil.rol === 'clinica_admin' && !perfil.clinica_id) redirect('/dashboard')

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">{perfil.rol === 'terapeuta' ? 'Sesión de hoy' : 'Resumen'}</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Hola, {perfil.nombre}</h1>
      </div>

      {perfil.rol === 'terapeuta' && (
        <SesionHoy supabase={supabase} terapeutaId={perfil.id} disena={await puedeDisenar(supabase)} />
      )}
      {perfil.rol === 'clinica_admin' && perfil.clinica_id && <InicioClinica clinicaId={perfil.clinica_id} />}
      {perfil.rol === 'clinica_admin' && perfil.tambien_terapeuta && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Mis alumnos</h2>
          <SesionHoy supabase={supabase} terapeutaId={perfil.id} disena />
        </section>
      )}
      {perfil.rol === 'superadmin' && <InicioSuperadmin />}
      {perfil.rol === 'familia' && (
        <p className="text-slate-600">
          Ve a{' '}
          <Link href="/dashboard/mi-hijo" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
            Mi hijo/a
          </Link>{' '}
          para ver su progreso.
        </p>
      )}
    </div>
  )
}

// ============================================================================
// CLINICA_ADMIN
// ============================================================================
async function InicioClinica({ clinicaId }: { clinicaId: string }) {
  const supabase = await createClient()

  const { count: alumnosActivos } = await supabase
    .from('alumnos')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
    .eq('activo', true)

  const { count: terapeutasActivos } = await supabase
    .from('perfiles')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
    .eq('rol', 'terapeuta')
    .eq('activo', true)

  const { count: terapeutasDesactivados } = await supabase
    .from('perfiles')
    .select('id', { count: 'exact', head: true })
    .eq('clinica_id', clinicaId)
    .eq('rol', 'terapeuta')
    .eq('activo', false)

  const { data: alumnosConTerapeuta } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, alumno_terapeuta(terapeuta_id)')
    .eq('clinica_id', clinicaId)
    .eq('activo', true)

  const sinTerapeuta = ((alumnosConTerapeuta ?? []) as unknown as AlumnoConTerapeuta[]).filter(
    (a) => !a.alumno_terapeuta || a.alumno_terapeuta.length === 0
  )

  const { data: clinica } = await supabase
    .from('clinicas')
    .select('precio_fijo_mensual, precio_por_alumno, sin_facturacion, estado_suscripcion')
    .eq('id', clinicaId)
    .single()

  const totalEstimado = clinica
    ? Number(clinica.precio_fijo_mensual) + Number(clinica.precio_por_alumno) * (alumnosActivos ?? 0)
    : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{alumnosActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Alumnos activos</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-accent)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{terapeutasActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Terapeutas activos</p>
        </Panel>
        {clinica && !clinica.sin_facturacion && totalEstimado !== null && (
          <Link
            href="/dashboard/facturacion"
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-indigo-300 transition-colors border-t-4"
            style={{ borderTopColor: 'var(--brand-primary)' }}
          >
            <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalEstimado.toFixed(2)} €</p>
            <p className="text-sm text-slate-500">Próxima factura estimada</p>
          </Link>
        )}
      </div>

      {(sinTerapeuta.length > 0 || (terapeutasDesactivados ?? 0) > 0 || clinica?.estado_suscripcion === 'past_due') && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Avisos</h2>
          <div className="space-y-2">
            {clinica?.estado_suscripcion === 'past_due' && (
              <Link
                href="/dashboard/facturacion"
                className="block rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 hover:bg-rose-100"
              >
                Hay un pago pendiente en tu suscripción. Revísalo en Facturación.
              </Link>
            )}
            {sinTerapeuta.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="font-medium text-amber-800">
                  {sinTerapeuta.length} alumno{sinTerapeuta.length > 1 ? 's' : ''} sin terapeuta asignado
                </p>
                <ul className="mt-2 space-y-1">
                  {sinTerapeuta.slice(0, 5).map((a) => (
                    <li key={a.id}>
                      <Link href={`/dashboard/alumnos/${a.id}/pei`} className="text-amber-700 hover:underline">
                        {a.nombre_anonimizado}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(terapeutasDesactivados ?? 0) > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {terapeutasDesactivados} terapeuta{(terapeutasDesactivados ?? 0) > 1 ? 's' : ''} desactivado
                {(terapeutasDesactivados ?? 0) > 1 ? 's' : ''} en tu clínica.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

// ============================================================================
// SUPERADMIN
// ============================================================================
async function InicioSuperadmin() {
  const supabase = await createClient()

  const { count: clinicasActivas } = await supabase
    .from('clinicas')
    .select('id', { count: 'exact', head: true })
    .eq('activa', true)

  const { count: clinicasArchivadas } = await supabase
    .from('clinicas')
    .select('id', { count: 'exact', head: true })
    .eq('activa', false)

  const { count: totalAlumnos } = await supabase
    .from('alumnos')
    .select('id', { count: 'exact', head: true })

  const { data: ultimasClinicas } = await supabase
    .from('clinicas')
    .select('id, nombre, created_at, activa')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: clinicasParaMrr } = await supabase
    .from('clinicas')
    .select('id, precio_fijo_mensual, precio_por_alumno')
    .eq('activa', true)

  const { data: alumnosActivosPorClinica } = await supabase
    .from('alumnos')
    .select('clinica_id')
    .eq('activo', true)

  const conteoAlumnos = new Map<string, number>()
  for (const a of alumnosActivosPorClinica ?? []) {
    conteoAlumnos.set(a.clinica_id, (conteoAlumnos.get(a.clinica_id) ?? 0) + 1)
  }

  const mrr = (clinicasParaMrr ?? []).reduce((total, c) => {
    const numAlumnos = conteoAlumnos.get(c.id) ?? 0
    return total + (c.precio_fijo_mensual ?? 0) + (c.precio_por_alumno ?? 0) * numAlumnos
  }, 0)

  const arpu = clinicasActivas && clinicasActivas > 0 ? mrr / clinicasActivas : 0

  const primerDiaMes = new Date()
  primerDiaMes.setDate(1)
  primerDiaMes.setHours(0, 0, 0, 0)

  const { count: nuevasEsteMes } = await supabase
    .from('clinicas')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', primerDiaMes.toISOString())

  const { data: clinicasEnRiesgo } = await supabase
    .from('clinicas')
    .select('id, nombre, estado_suscripcion')
    .in('estado_suscripcion', ['past_due', 'unpaid', 'incomplete'])

  const { count: totalTerapeutas } = await supabase
    .from('perfiles')
    .select('id', { count: 'exact', head: true })
    .eq('rol', 'terapeuta')

  const { count: totalFamilias } = await supabase
    .from('perfiles')
    .select('id', { count: 'exact', head: true })
    .eq('rol', 'familia')

  const { count: informesEsteMes } = await supabase
    .from('informes')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', primerDiaMes.toISOString())

  const ETIQUETA_ESTADO_SUS: Record<string, string> = {
    past_due: 'Pago atrasado',
    unpaid: 'Impagado',
    incomplete: 'Pago incompleto',
  }
      return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5 col-span-2 sm:col-span-1">
          <p className="text-2xl sm:text-3xl font-bold text-indigo-700">
            {mrr.toLocaleString('es-ES', { minimumFractionDigits: 0 })}€
          </p>
          <p className="text-sm text-indigo-600">MRR (ingreso mensual recurrente)</p>
        </div>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">
            {arpu.toLocaleString('es-ES', { minimumFractionDigits: 0 })}€
          </p>
          <p className="text-sm text-slate-500">ARPU (ingreso medio/clínica)</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-accent)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{nuevasEsteMes ?? 0}</p>
          <p className="text-sm text-slate-500">Nuevas este mes</p>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalTerapeutas ?? 0}</p>
          <p className="text-sm text-slate-500">Terapeutas (total)</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-accent)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalFamilias ?? 0}</p>
          <p className="text-sm text-slate-500">Familias (total)</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{informesEsteMes ?? 0}</p>
          <p className="text-sm text-slate-500">Informes este mes</p>
        </Panel>
      </div>

      {clinicasEnRiesgo && clinicasEnRiesgo.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-amber-700">⚠️ Clínicas en riesgo de impago</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
            {clinicasEnRiesgo.map((c) => (
              <Link
                key={c.id}
                href="/dashboard/clinicas"
                className="flex items-center justify-between border-b border-amber-100 last:border-0 px-4 py-3 text-sm hover:bg-amber-100"
              >
                <span className="font-medium text-slate-800">{c.nombre}</span>
                <span className="text-xs font-medium text-amber-700">
                  {ETIQUETA_ESTADO_SUS[c.estado_suscripcion] ?? c.estado_suscripcion}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{clinicasActivas ?? 0}</p>
          <p className="text-sm text-slate-500">Clínicas activas</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-accent)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{clinicasArchivadas ?? 0}</p>
          <p className="text-sm text-slate-500">Archivadas</p>
        </Panel>
        <Panel className="p-4 sm:p-5 border-t-4" style={{ borderTopColor: 'var(--brand-primary)' }}>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalAlumnos ?? 0}</p>
          <p className="text-sm text-slate-500">Alumnos (total)</p>
        </Panel>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/clinicas"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Clínicas
        </Link>
        <Link
          href="/dashboard/curriculo"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Currículo Base
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Últimas clínicas dadas de alta</h2>
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Alta</th>
              </tr>
            </thead>
            <tbody>
              {(ultimasClinicas ?? []).map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-medium text-slate-800">
                    <Link href="/dashboard/clinicas" className="hover:underline">
                      {c.nombre}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.activa ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.activa ? 'Activa' : 'Archivada'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!ultimasClinicas || ultimasClinicas.length === 0) && (
            <p className="p-6 text-center text-slate-500">Sin clínicas todavía.</p>
          )}
        </Panel>
      </section>
    </div>
  )
}