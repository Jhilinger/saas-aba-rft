import Link from 'next/link'

export const metadata = {
  title: 'Facturación y suscripción — Ayuda Abacontext',
}

export default function FacturacionAdminPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Facturación y suscripción</h1>
      <p className="text-sm text-slate-500">
        Cómo funciona el cobro de tu suscripción, y cómo consultar la facturación de cada alumno.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Tu suscripción</h2>
          <p>
            En <strong>Suscripción</strong> puedes ver el estado de tu plan, la cuota fija mensual,
            y el importe adicional por cada alumno activo. El número de alumnos se ajusta
            automáticamente según los que tengas activos en cada momento — no necesitas actualizarlo
            a mano.
          </p>
          <p className="mt-2">
            Desde ahí también puedes gestionar tu método de pago o cancelar la suscripción cuando
            quieras, sin permanencia.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Facturación por alumno</h2>
          <p>
            En <strong>Facturación</strong> (la sección dedicada a tus alumnos, distinta de tu
            propia suscripción), selecciona un alumno y un rango de fechas para ver todas sus
            sesiones realizadas — asistidas, canceladas, y no asistidas — junto con los datos de
            facturación que la familia haya aportado (nombre o razón social, NIF, dirección).
          </p>
          <p className="mt-2">
            Puedes exportar esa lista de sesiones en <strong>CSV</strong> con el botón
            correspondiente, para usarla en tu propia contabilidad.
          </p>
        </section>
      </div>
    </div>
  )
}