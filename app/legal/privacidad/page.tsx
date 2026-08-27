import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad — Abacontext',
}

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Política de Privacidad</h1>
      <p className="mt-1 text-sm text-slate-400">Última actualización: [27/08/2026]</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Responsable del tratamiento</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Titular:</strong> Javier Hilinger Sánchez</li>
            <li><strong>NIF:</strong> 44364132F</li>
            <li><strong>Domicilio:</strong> Árbol de la seda, local 3. 04007 Almería (España)</li>
            <li><strong>Email de contacto:</strong> privacidad@abacontext.com</li>
            <li>
              <strong>Actividad:</strong> Abacontext es una plataforma de software (SaaS)
              para la gestión clínica, terapéutica y administrativa de centros que
              trabajan con Análisis Aplicado de Conducta (ABA) y Teoría del Marco
              Relacional (RFT).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Un aviso importante: 2 roles distintos</h2>
          <p>Abacontext actúa con 2 papeles distintos según el tipo de dato:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Como responsable del tratamiento</strong>, respecto a los datos de
              las personas que se registran para usar la plataforma (administradores de
              clínica, terapeutas, familiares): nombre, email, teléfono, datos de
              facturación de la suscripción, etc.
            </li>
            <li>
              <strong>Como encargado del tratamiento</strong>, respecto a los datos
              clínicos de los alumnos/pacientes que cada clínica introduce en la
              plataforma (programas, evaluaciones, registros de conducta, documentos
              firmados). En este caso, <strong>la clínica es la responsable del
              tratamiento</strong> de los datos de sus propios pacientes, y Abacontext
              únicamente los trata siguiendo sus instrucciones, para prestarle el
              servicio. La clínica es quien debe recabar el consentimiento informado de
              las familias para el tratamiento de estos datos clínicos.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Datos que tratamos</h2>
          <p className="font-medium text-slate-800">3.1. Datos de la cuenta (como responsables)</p>
          <p>
            Nombre, email, teléfono, ciudad, país, y datos de facturación de la
            suscripción (gestionados a través de Stripe).
          </p>
          <p className="mt-3 font-medium text-slate-800">3.2. Datos clínicos (como encargados, por cuenta de la clínica)</p>
          <p>
            Nombre o iniciales del alumno, fecha de nacimiento, datos de programas de
            aprendizaje (ABA y RFT), registros de conducta (intervalo, duración, tasa,
            ABC), evaluaciones, informes generados, documentos firmados digitalmente, y
            datos de facturación aportados voluntariamente por la familia.
          </p>
          <p className="mt-2">
            Estos datos incluyen <strong>categorías especiales de datos</strong> (datos
            de salud, al tratarse de una condición del desarrollo) y{' '}
            <strong>datos de menores</strong>, por lo que reciben un nivel de
            protección reforzado.
          </p>
        </section>
                <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Finalidad y base legal</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Finalidad</th>
                  <th className="py-2">Base legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-3">Prestar el servicio contratado (gestión de la clínica)</td>
                  <td className="py-2">Ejecución de un contrato</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Gestionar el pago de la suscripción</td>
                  <td className="py-2">Ejecución de un contrato</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Enviar comunicaciones operativas (invitaciones, avisos)</td>
                  <td className="py-2">Ejecución de un contrato / interés legítimo</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Tratar los datos clínicos de los alumnos</td>
                  <td className="py-2">Instrucciones de la clínica (responsable), bajo su base legal</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Mejorar la plataforma</td>
                  <td className="py-2">Interés legítimo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">5. Plazo de conservación</h2>
          <p>
            Los datos de la cuenta se conservan mientras la suscripción esté activa, y
            durante los plazos legalmente exigidos tras la baja (obligaciones fiscales y
            contables). Los datos clínicos se conservan mientras la clínica mantenga la
            suscripción activa, siguiendo el criterio y las obligaciones legales propias
            de cada clínica como responsable de dichos datos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">6. Destinatarios y encargados del tratamiento</h2>
          <p>
            Para prestar el servicio, compartimos datos con los siguientes proveedores,
            actuando todos ellos como encargados del tratamiento bajo contrato:
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Proveedor</th>
                  <th className="py-2 pr-3">Función</th>
                  <th className="py-2">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-3">Supabase</td>
                  <td className="py-2 pr-3">Base de datos y autenticación</td>
                  <td className="py-2">UE</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Stripe</td>
                  <td className="py-2 pr-3">Procesamiento de pagos</td>
                  <td className="py-2">UE / Internacional (con garantías)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Resend / Amazon SES</td>
                  <td className="py-2 pr-3">Envío de emails transaccionales</td>
                  <td className="py-2">UE (eu-west-1)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Vercel</td>
                  <td className="py-2 pr-3">Alojamiento de la aplicación</td>
                  <td className="py-2">Internacional</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Anthropic (Claude)</td>
                  <td className="py-2 pr-3">Generación de informes asistida por IA</td>
                  <td className="py-2">EE.UU. (con Cláusulas Contractuales Tipo)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Importante sobre Anthropic:</strong> cuando una clínica usa la
            función de generar informes con IA, el contenido del informe (que puede
            incluir datos de progreso del alumno) se envía a los servidores de
            Anthropic en Estados Unidos para su procesamiento. Esta transferencia
            internacional se realiza bajo Cláusulas Contractuales Tipo aprobadas por la
            Comisión Europea. Las clínicas que prefieran no usar esta función pueden
            generar sus informes de forma manual.
          </p>
        </section>
                <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">7. Tus derechos</h2>
          <p>Puedes ejercer en cualquier momento tus derechos de:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Acceso</strong>: saber qué datos tuyos tratamos</li>
            <li><strong>Rectificación</strong>: corregir datos inexactos</li>
            <li><strong>Supresión ("derecho al olvido")</strong>: solicitar que borremos tus datos</li>
            <li>
              <strong>Portabilidad</strong>: recibir tus datos en un formato reutilizable
              (la plataforma ya permite exportar buena parte de esta información en CSV
              desde el propio panel)
            </li>
            <li><strong>Oposición y limitación</strong>: oponerte a ciertos tratamientos</li>
          </ul>
          <p className="mt-2">
            Para ejercerlos, escribe a <strong>privacidad@abacontext.com</strong>. Si tus
            datos clínicos han sido introducidos por una clínica (como responsable),
            también puedes dirigirte directamente a ella.
          </p>
          <p className="mt-2">
            Si consideras que no hemos atendido correctamente tu solicitud, puedes
            reclamar ante la <strong>Agencia Española de Protección de Datos</strong>{' '}
            (www.aepd.es).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">8. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables (cifrado en tránsito,
            control de acceso basado en roles, copias de seguridad) para proteger los
            datos frente a accesos no autorizados, pérdida o alteración.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">9. Menores de edad</h2>
          <p>
            Los datos clínicos tratados en la plataforma pertenecen, en su mayoría, a
            menores de edad. Estos datos son introducidos y gestionados por las
            clínicas (como responsables) y sus familias, no directamente por los
            menores, que no tienen acceso a la plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">10. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política para adaptarla a cambios legislativos o del
            servicio. Notificaremos cambios sustanciales por email a los administradores
            de clínica.
          </p>
        </section>
      </div>
    </div>
  )
}