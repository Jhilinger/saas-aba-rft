import Link from 'next/link'

export const metadata = {
  title: 'Documentos legales — Ayuda Abacontext',
}

export default function DocumentosLegalesAdminPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Documentos legales</h1>
      <p className="text-sm text-slate-500">
        Cómo crear plantillas de documentos y hacer seguimiento de qué familias los han firmado.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Crear un tipo de documento</h2>
          <p>
            En <strong>Documentos legales</strong>, crea una plantilla nueva (por ejemplo,
            "Consentimiento informado" o "Política de protección de datos de la clínica") con el
            texto que quieras que las familias acepten y firmen.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Cómo lo firma la familia</h2>
          <p>
            Cada documento que crees aparece automáticamente en el portal de todas las familias de
            tu clínica, dentro de su sección "Documentos". Ahí pueden leerlo y firmarlo dibujando su
            firma con el dedo desde el móvil, junto con su nombre y DNI. Se genera un PDF con la
            firma incluida, con validez como constancia del consentimiento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Seguimiento de firmas</h2>
          <p>
            Desde la misma sección puedes ver, para cada documento, qué familias lo han firmado ya
            y cuáles tienen pendiente, con acceso directo al PDF firmado de cada una.
          </p>
        </section>
      </div>
    </div>
  )
}