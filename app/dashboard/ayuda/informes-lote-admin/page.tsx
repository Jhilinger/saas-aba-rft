import Link from 'next/link'

export const metadata = {
  title: 'Informes en lote — Ayuda Abacontext',
}

export default function InformesLoteAdminPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Informes en lote</h1>
      <p className="text-sm text-slate-500">
        Genera el informe de progreso de varios alumnos a la vez, en vez de uno por uno.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Cómo funciona</h2>
          <p>
            En <strong>Informes en lote</strong>, marca los alumnos para los que quieras generar un
            informe (o usa "Seleccionar todos"), y pulsa el botón de generar. La plataforma los va
            procesando uno por uno, mostrándote en tiempo real el progreso de cada alumno
            (pendiente, generando, o completado).
          </p>
          <p className="mt-2">
            Los informes se generan con inteligencia artificial a partir de los datos de progreso
            reales de cada alumno, y quedan disponibles después en la ficha individual de cada uno,
            así como en el portal de su familia.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Cuándo usarlo</h2>
          <p>
            Es especialmente útil al final de un trimestre o periodo de revisión, cuando necesitas
            actualizar el informe de todos tus alumnos de golpe, en vez de entrar alumno por alumno.
          </p>
        </section>
      </div>
    </div>
  )
}