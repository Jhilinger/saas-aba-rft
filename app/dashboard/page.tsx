import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, clinica_id')
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

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Hola, {perfil.nombre}</h1>

      {perfil.rol === 'terapeuta' && <InicioTerapeuta terapeutaId={perfil.id} />}
      {perfil.rol === 'clinica_admin' && <InicioClinica clinicaId={perfil.clinica_id} />}
      {perfil.rol === 'superadmin' && <InicioSuperadmin />}
      {perfil.rol === 'familia' && (
        <p className="text-slate-600">
          Ve a{' '}
          <Link href="/dashboard/mi-hijo" className="text-indigo-600 hover:underline">
            Mi hijo/a
          </Link>{' '}
          para ver su progreso.
        </p>
      )}
    </div>
  )
}

// ============================================================================
// TERAPEUTA
// ============================================================================
async function InicioTerapeuta({ terapeutaId }: { terapeutaId: string }) {
  const supabase = await createClient()

  const { data: vinculos } = await supabase
    .from('alumno_terapeuta')
    .select('alumno_id')
    .eq('terapeuta_id', terapeutaId)

  const alumnoIds = (vinculos ?? []).map((v) => v.alumno_id)

  const { count: totalProgramas } = alumnoIds.length
    ? await supabase
        .from('programas_alumno')
        .select('id', { count: 'exact', head: true })
        .in('alumno_id', alumnoIds)
    : { count: 0 }

  const { data: bloquesAba } = await supabase
    .from('bloques_ensayo')
    .select('fecha, porcentaje, conjuntos_estimulos_alumno(programa_alumno_id, programas_alumno(nombre, alumno_id, alumnos(nombre_anonimizado)))')
    .eq('terapeuta_id', terapeutaId)
    .order('fecha', { ascending: false })
    .limit(8)

  const { data: bloquesRft } = await supabase
    .from('bloques_ensayo_rft')
    .select('fecha, porcentaje, programa_alumno_id, programas_alumno(nombre, alumno_id, alumnos(nombre_anonimizado))')
    .eq('terapeuta_id', terapeutaId)
    .order('fecha', { ascending: false })
    .limit(8)

  type Actividad = {
    fecha: string
    porcentaje: number
    tipo: 'aba' | 'rft'
    programaId: string
    programaNombre: string
    alumnoNombre: string
  }

  const actividad: Actividad[] = [
    ...(bloquesAba ?? []).map((b: any) => ({
      fecha: b.fecha,
      porcentaje: Number(b.porcentaje),
      tipo: 'aba' as const,
      programaId: b.conjuntos_estimulos_alumno?.programa_alumno_id,
      programaNombre: b.conjuntos_estimulos_alumno?.programas_alumno?.nombre ?? '—',
      alumnoNombre: b.conjuntos_estimulos_alumno?.programas_alumno?.alumnos?.nombre_anonimizado ?? '—',
    })),
    ...(bloquesRft ?? []).map((b: any) => ({
      fecha: b.fecha,
      porcentaje: Number(b.porcentaje),
      tipo: 'rft' as const,
      programaId: b.programa_alumno_id,
      programaNombre: b.programas_alumno?.nombre ?? '—',
      alumnoNombre: b.programas_alumno?.alumnos?.nombre_anonimizado ?? '—',
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{alumnoIds.length}</p>
          <p className="text-sm text-slate-500">Alumnos asignados</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalProgramas ?? 0}</p>
          <p className="text-sm text-slate-500">Programas en total</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/mis-alumnos"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Mis Alumnos
        </Link>
        <Link
          href="/dashboard/mis-programas"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Mis programas
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Última actividad</h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Alumno</th>
                <th className="p-3">Programa</th>
                <th className="p-3">%</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {actividad.map((a, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-medium text-slate-800">{a.alumnoNombre}</td>
                  <td className="p-3">
                    <Link
                      href={a.tipo === 'aba' ? `/dashboard/programas/${a.programaId}` : `/dashboard/programas-rft/${a.programaId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {a.programaNombre}
                    </Link>
                  </td>
                  <td className={`p-3 font-medium ${a.porcentaje >= 90 ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {a.porcentaje}%
                  </td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">
                    {new Date(a.fecha).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {actividad.length === 0 && (
            <p className="p-6 text-center text-slate-400">Todavía no has tomado datos.</p>
          )}
        </div>
      </section>
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

  const sinTerapeuta = (alumnosConTerapeuta ?? []).filter(
    (a: any) => !a.alumno_terapeuta || a.alumno_terapeuta.length === 0
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{alumnosActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Alumnos activos</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{terapeutasActivos ?? 0}</p>
          <p className="text-sm text-slate-500">Terapeutas activos</p>
        </div>
        {clinica && !clinica.sin_facturacion && totalEstimado !== null && (
          <Link
            href="/dashboard/facturacion"
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-indigo-300 transition-colors"
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
                  {sinTerapeuta.slice(0, 5).map((a: any) => (
                    <li key={a.id}>
                      <Link href={`/dashboard/alumnos/${a.id}`} className="text-amber-700 hover:underline">
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{clinicasActivas ?? 0}</p>
          <p className="text-sm text-slate-500">Clínicas activas</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{clinicasArchivadas ?? 0}</p>
          <p className="text-sm text-slate-500">Archivadas</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalAlumnos ?? 0}</p>
          <p className="text-sm text-slate-500">Alumnos (total)</p>
        </div>
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
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
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
            <p className="p-6 text-center text-slate-400">Sin clínicas todavía.</p>
          )}
        </div>
      </section>
    </div>
  )
}