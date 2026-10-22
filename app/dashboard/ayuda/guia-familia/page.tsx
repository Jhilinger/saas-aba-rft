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
        Todo lo que puedes hacer desde tu portal: seguir el progreso y consultar los informes.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Ver el progreso</h2>
          <p>
            En <strong>Progreso</strong>, la pantalla con la que entras por defecto, verás cuánto
            ha avanzado tu hijo/a en cada nivel y área del currículo. Al pulsar un área se
            despliegan los programas que está trabajando, y puedes entrar en el gráfico de
            evolución de cualquiera de ellos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Informes</h2>
          <p>
            En <strong>Informes</strong> puedes consultar y descargar los informes que el equipo
            terapéutico haya generado sobre el progreso de tu hijo/a.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Registros de conducta compartidos</h2>
          <p>
            Si el equipo terapéutico decide compartir contigo algún registro de conducta concreto
            (por ejemplo, para hacer seguimiento de una conducta también en casa), lo verás junto
            al resto de programas en <strong>Progreso</strong>. Ahí podrás ver el progreso y, si te
            lo permiten, añadir tú misma/o observaciones desde casa, con las mismas herramientas
            que usa el equipo (cronómetro, contador, o el registro narrativo ABC según el caso).
          </p>
        </section>

      </div>
    </div>
  )
}