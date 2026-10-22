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

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tu suscripción</h1>
      <p className="text-sm text-slate-500">
        Cómo funciona el cobro de tu suscripción.
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

      </div>
    </div>
  )
}