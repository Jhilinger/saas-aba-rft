import Link from 'next/link'

export const metadata = {
  title: 'Aviso Legal — Abacontext',
}

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Aviso Legal</h1>
      <p className="mt-1 text-sm text-slate-400">Última actualización: [27/08/2026]</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la
          Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
          y de Comercio Electrónico (LSSI-CE), se exponen los siguientes datos:
        </p>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Datos identificativos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Titular:</strong> Javier Hilinger Sánchez</li>
            <li><strong>NIF:</strong> 44364132F</li>
            <li><strong>Domicilio:</strong> Árbol de la seda, local 3. 04007 Almería (España)</li>
            <li><strong>Email de contacto:</strong> legal@abacontext.com</li>
            <li><strong>Sitio web:</strong> abacontext.com</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Objeto</h2>
          <p>
            El presente sitio web y la plataforma Abacontext tienen por objeto ofrecer
            un servicio de software (SaaS) para la gestión clínica, terapéutica y
            administrativa de centros que trabajan con Análisis Aplicado de Conducta
            (ABA) y Teoría del Marco Relacional (RFT).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Condiciones de acceso y uso</h2>
          <p>
            El acceso al sitio web es gratuito. El uso de la plataforma como servicio
            requiere registro y contratación de una suscripción, conforme a los{' '}
            <Link href="/legal/terminos" className="text-indigo-600 hover:underline">
              Términos de Uso
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del sitio web (textos, diseño, logotipo, código
            fuente) son propiedad de Javier Hilinger Sánchez o se utilizan con la
            correspondiente autorización, y están protegidos por la normativa de
            propiedad intelectual e industrial. Queda prohibida su reproducción total o
            parcial sin autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">5. Exclusión de garantías y responsabilidad</h2>
          <p>
            Javier Hilinger Sánchez no garantiza la disponibilidad, continuidad ni
            infalibilidad del sitio web, y no será responsable de los daños derivados
            de la falta de disponibilidad o de fallos técnicos ajenos a su control
            razonable.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">6. Enlaces</h2>
          <p>
            Este sitio puede contener enlaces a sitios de terceros (por ejemplo,
            Stripe para el procesamiento de pagos). Javier Hilinger Sánchez no se hace
            responsable del contenido o las políticas de dichos sitios.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">7. Legislación aplicable</h2>
          <p>Este Aviso Legal se rige por la legislación española.</p>
        </section>
      </div>
    </div>
  )
}