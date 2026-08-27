import Link from 'next/link'

export const metadata = {
  title: 'Términos de Uso — Abacontext',
}

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Términos de Uso</h1>
      <p className="mt-1 text-sm text-slate-400">Última actualización: [27/08/2026]</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Objeto y aceptación</h2>
          <p>
            Estos Términos de Uso regulan el acceso y uso de Abacontext, una plataforma
            de software como servicio (SaaS) para la gestión clínica, terapéutica y
            administrativa de centros de intervención en Análisis Aplicado de Conducta
            (ABA) y Teoría del Marco Relacional (RFT).
          </p>
          <p className="mt-2">
            Al registrarte y usar la plataforma, aceptas estos Términos y nuestra{' '}
            <Link href="/legal/privacidad" className="text-indigo-600 hover:underline">
              Política de Privacidad
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Descripción del servicio</h2>
          <p>
            Abacontext ofrece, entre otras funciones: gestión de currículo y programas
            (ABA/RFT), toma de datos y registros de conducta, evaluación inicial, agenda
            de sesiones, portal de familia, generación de informes (incluyendo mediante
            inteligencia artificial), documentos con firma digital, y facturación de la
            suscripción.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Registro y cuenta</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Para usar la plataforma, la clínica debe registrarse aportando datos
              veraces (nombre de la clínica, persona de contacto, email, teléfono,
              ciudad y país).
            </li>
            <li>
              El titular de la cuenta es responsable de mantener la confidencialidad de
              sus credenciales de acceso y de toda actividad realizada bajo su cuenta.
            </li>
            <li>
              Cada clínica es responsable de la veracidad y adecuación de los datos que
              introduce sobre sus alumnos, terapeutas y familias.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Precio y forma de pago</h2>
          <p>
            El servicio se factura mediante suscripción mensual, compuesta por una
            cuota fija más un importe variable por cada alumno activo, según las
            condiciones vigentes en el momento de la contratación. El pago se gestiona
            a través de Stripe. La suscripción se renueva automáticamente cada mes
            salvo cancelación por parte del cliente, que puede hacerse en cualquier
            momento desde el propio panel.
          </p>
          <p className="mt-2">
            El impago o la falta de renovación puede conllevar la suspensión o
            cancelación del acceso al servicio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            5. El papel de la clínica como responsable de los datos de sus pacientes
          </h2>
          <p>
            Abacontext es una herramienta que la clínica utiliza para gestionar sus
            propios pacientes. La clínica es responsable de contar con la base legal
            adecuada (habitualmente el consentimiento informado de las familias) para
            tratar los datos de sus alumnos dentro de la plataforma, así como de
            cumplir con sus propias obligaciones profesionales y legales en el
            ejercicio de la intervención terapéutica.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">6. Uso aceptable</h2>
          <p>
            El usuario se compromete a no utilizar la plataforma para fines distintos
            de los previstos, no intentar acceder a datos de otras clínicas, no
            sobrecargar deliberadamente el servicio, y no introducir contenido ilícito.
          </p>
        </section>
                <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">7. Propiedad intelectual</h2>
          <p>
            El software, diseño, marca "Abacontext" y demás elementos de la plataforma
            son propiedad de Javier Hilinger Sánchez y están protegidos por la normativa
            de propiedad intelectual. El uso de la plataforma no otorga ningún derecho
            de propiedad sobre el software.
          </p>
          <p className="mt-2">
            Los datos introducidos por cada clínica (sobre sus alumnos, programas,
            etc.) siguen siendo propiedad de dicha clínica.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">8. Disponibilidad del servicio</h2>
          <p>
            Se realizan esfuerzos razonables para mantener el servicio operativo y
            disponible, pero no se garantiza una disponibilidad del 100%. Pueden
            producirse interrupciones puntuales por mantenimiento o causas ajenas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">9. Limitación de responsabilidad</h2>
          <p>
            En la medida permitida por la ley, no se garantiza que el servicio esté
            libre de errores. El uso de la plataforma no sustituye el criterio
            profesional del terapeuta ni exime del cumplimiento de sus obligaciones
            deontológicas y legales propias.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">10. Duración y baja</h2>
          <p>
            El contrato tiene duración mensual, renovable automáticamente. El cliente
            puede darse de baja en cualquier momento desde su panel. Tras la baja, los
            datos se conservarán durante un periodo razonable por si el cliente desea
            reactivar el servicio, y posteriormente podrán eliminarse conforme a la
            Política de Privacidad.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">11. Modificaciones</h2>
          <p>
            Podemos modificar estos Términos para adaptarlos a cambios legales o del
            servicio, notificando cambios sustanciales con antelación razonable.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">12. Legislación y jurisdicción</h2>
          <p>
            Estos Términos se rigen por la legislación española. Para cualquier
            controversia, las partes se someten a los juzgados y tribunales de
            Almería, salvo que la normativa de consumidores aplicable disponga
            otra cosa.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">13. Contacto</h2>
          <p>Para cualquier consulta sobre estos Términos: legal@abacontext.com</p>
        </section>
      </div>
    </div>
  )
}