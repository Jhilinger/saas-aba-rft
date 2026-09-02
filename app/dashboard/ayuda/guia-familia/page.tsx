import Link from 'next/link'

export const metadata = {
  title: 'Guía para familias — Ayuda Abacontext',
}

export default function GuiaFamiliaPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Guía para familias</h1>
      <p className="text-sm text-slate-500">
        Todo lo que puedes hacer desde tu portal: seguir el progreso, confirmar sesiones,
        consultar informes, y más.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Ver el progreso</h2>
          <p>
            En <strong>Progreso</strong>, la pantalla con la que entras por defecto, verás una
            tabla con todos los programas que está trabajando tu hijo/a, y si quieres más detalle,
            puedes entrar en el gráfico de evolución de cualquiera de ellos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Confirmar la asistencia</h2>
                    <p>
            En <strong>Asistencia</strong> verás el listado de sesiones realizadas. Te pedimos que
            las confirmes cuando corresponda — es un simple clic, y ayuda a mantener el registro al
            día. Recibirás un recordatorio por email hacia final de mes si te queda alguna pendiente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Informes</h2>
          <p>
            En <strong>Informes</strong> puedes consultar y descargar los informes que el equipo
            terapéutico haya generado sobre el progreso de tu hijo/a.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Registros de conducta compartidos</h2>
          <p>
            Si el equipo terapéutico decide compartir contigo algún registro de conducta concreto
            (por ejemplo, para hacer seguimiento de una conducta también en casa), lo verás en{' '}
            <strong>Registros de conducta</strong>. Ahí podrás ver el progreso y, si te lo permiten,
            añadir tú misma/o observaciones desde casa, con las mismas herramientas que usa el
            equipo (cronómetro, contador, o el registro narrativo ABC según el caso).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">5. Documentos</h2>
          <p>
            En <strong>Documentos</strong> puedes firmar digitalmente los documentos legales que tu
            clínica te solicite (consentimientos informados, protección de datos...), directamente
            desde el móvil, dibujando tu firma con el dedo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">6. Facturación</h2>
          <p>
            En <strong>Facturación</strong> puedes aportar tus datos de facturación (nombre o razón
            social, NIF, dirección) para que tu clínica pueda emitirte las facturas correctamente.
          </p>
        </section>
      </div>
    </div>
  )
}