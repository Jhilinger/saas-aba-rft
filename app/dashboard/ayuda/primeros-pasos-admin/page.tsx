import Link from 'next/link'

export const metadata = {
  title: 'Primeros pasos como administrador — Ayuda Abacontext',
}

export default function PrimerosPasosAdminPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Primeros pasos como administrador</h1>
      <p className="text-sm text-slate-500">
        Esta guía te lleva paso a paso desde que te registras hasta que tu clínica está lista para
        trabajar en el día a día.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Invita a tu equipo de terapeutas</h2>
          <p>
            Ve a <Link href="/dashboard/equipo" className="text-indigo-600 hover:underline">Terapeutas</Link>{' '}
            y rellena el formulario con el nombre y email de cada terapeuta que trabaje en tu clínica.
            Recibirán un email de invitación para crear su contraseña y entrar por primera vez.
          </p>
          <p className="mt-2">
            Si tú mismo también atiendes a alumnos como terapeuta, activa el interruptor
            "También soy terapeuta" — esto añade las secciones de trabajo diario (Mis Alumnos,
            Agenda, Mis programas) a tu propio menú, sin necesitar una segunda cuenta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Da de alta a tus alumnos</h2>
          <p>
            Ve a <Link href="/dashboard/alumnos" className="text-indigo-600 hover:underline">Alumnos</Link>{' '}
            y crea una ficha por cada alumno. Solo necesitas su nombre (o iniciales, para proteger
            su identidad) y su fecha de nacimiento.
          </p>
          <p className="mt-2">
            Asigna al menos un terapeuta a cada alumno — puedes marcar uno como "principal" si
            trabajan varios terapeutas con el mismo alumno.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Configura el currículo de tu clínica</h2>
          <p>
            Ve a <Link href="/dashboard/curriculo" className="text-indigo-600 hover:underline">Currículo clínica</Link>.
            Ahí puedes clonar programas del Currículo Base (la biblioteca compartida de programas
            ABA y RFT) y adaptarlos a tu forma de trabajar, o crear programas completamente nuevos
            desde cero.
          </p>
          <p className="mt-2">
            No hace falta que tengas todo el currículo listo antes de empezar — puedes ir
            añadiendo programas sobre la marcha, a medida que los necesites para cada alumno.
          </p>
               </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Haz la evaluación inicial</h2>
          <p>
            Entra en la ficha de cada alumno → <strong>Valoración</strong>. Ahí puedes hacer una
            evaluación secuencial rápida (con reglas de parada configurables) tanto en Aprendizaje
            Directo (ABA) como en Aprendizaje Relacional (RFT), para saber de dónde parte el alumno
            antes de empezar a intervenir.
          </p>
          <p className="mt-2">
            Los programas que el alumno todavía no domina se pueden importar directamente a su PEI
            como línea base, con un solo clic.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">5. Ya está todo listo para trabajar</h2>
          <p>
            Con el equipo, los alumnos y el currículo configurados, tus terapeutas ya pueden entrar
            a tomar datos, gestionar la agenda, y hacer seguimiento del progreso. Como administrador,
            tú tienes visibilidad completa de toda la clínica desde el menú lateral.
          </p>
          <p className="mt-2">
            Un último paso recomendado: entra en{' '}
            <Link href="/dashboard/familia" className="text-indigo-600 hover:underline">Familia</Link>{' '}
            para vincular las cuentas de las familias de tus alumnos, así podrán ver el progreso,
            confirmar asistencia, y firmar documentos desde su propio portal.
          </p>
        </section>
      </div>
    </div>
  )
}
