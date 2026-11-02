import Link from 'next/link'

export const metadata = {
  title: 'Política de Reembolsos — Abacontext',
}

export default function ReembolsosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Política de Reembolsos</h1>
      <p className="mt-1 text-sm text-slate-600">Última actualización: [02/11/2026]</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Prueba gratuita</h2>
          <p>
            Toda cuenta nueva empieza con 14 días de prueba gratuita, con acceso completo
            a la plataforma. Si cancelas antes de que termine la prueba, no se realiza
            ningún cobro.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Suscripción mensual</h2>
          <p>
            Tras la prueba, la suscripción se cobra por adelantado cada mes, según el
            número de alumnos activos (con el mínimo facturado vigente). Puedes cancelarla
            en cualquier momento desde el propio panel; la cancelación evita los cobros
            siguientes y mantienes el acceso hasta el final del periodo ya pagado.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Reembolsos</h2>
          <p>
            Como la prueba gratuita permite evaluar el servicio antes de pagar, los
            periodos mensuales ya cobrados no se reembolsan, ni total ni parcialmente,
            salvo en estos casos:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Cobros duplicados o realizados por error.</li>
            <li>Cobros posteriores a una cancelación hecha correctamente.</li>
            <li>
              Una interrupción del servicio atribuible a Abacontext que impida usarlo de
              forma prolongada durante el periodo cobrado.
            </li>
          </ul>
          <p className="mt-2">
            Lo anterior no limita los derechos que la legislación aplicable reconozca
            al cliente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Cómo solicitarlo</h2>
          <p>
            Escribe a legal@abacontext.com desde el email de la cuenta, indicando el
            nombre del centro y el cobro afectado, en un plazo de 30 días desde el cobro.
            Respondemos en un máximo de 10 días hábiles y, si procede, el reembolso se
            hace por el mismo medio de pago.
          </p>
        </section>
      </div>
    </div>
  )
}
