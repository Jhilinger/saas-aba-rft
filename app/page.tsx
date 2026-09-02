import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AbacontextIcon from './abacontext-icon'

function Nodo() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M 9 3 L 5 3 L 5 13 L 9 13" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 15 3 L 19 3 L 19 13 L 15 13" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  const funcionalidades = [
    {
      titulo: 'PEI y evaluación inicial',
      texto:
        'Valora el punto de partida de cada alumno en Aprendizaje Directo y Relacional, y arma el plan de intervención con el currículo de tu clínica.',
    },
    {
      titulo: 'Registros de conducta',
      texto:
        'Intervalo, duración, tasa y registro ABC, con línea base propia y gráficos que reflejan si el objetivo es aumentar o reducir la conducta.',
    },
    {
      titulo: 'Agenda semanal',
      texto:
        'Sesiones recurrentes, cuadrícula semanal, y un aviso siempre visible de lo que quedó pendiente de marcar.',
    },
    {
      titulo: 'Portal de familia',
      texto:
        'Progreso, asistencia, informes generados con IA, documentos con firma digital y datos de facturación, todo en un único acceso.',
    },
    {
      titulo: 'Documentos con firma',
      texto:
        'Consentimiento informado, protección de datos y lo que necesite tu clínica, firmado desde el móvil con validez real.',
    },
    {
      titulo: 'Facturación integrada',
      texto:
        'Suscripción por alumno activo, portal de facturación propio, sin depender de una herramienta aparte.',
    },
    {
      titulo: 'Evaluación de preferencias',
      texto:
        'MSWO y MSW guiados paso a paso, con la jerarquía de preferencia calculada automáticamente al terminar.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <div className="flex items-center gap-2">
          <AbacontextIcon className="h-7 w-7" />
          <span className="text-lg font-bold text-slate-800">abacontext</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-20 text-center sm:px-8 sm:pt-20">
        <div className="mb-6 flex justify-center">
          <AbacontextIcon className="h-20 w-20" />
        </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          ABA, con el aprendizaje<br className="hidden sm:block" /> relacional integrado
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-500 sm:text-lg">
          Un mismo currículo, una misma toma de datos, para trabajar habilidades directas y
          relaciones — sin cambiar de herramienta. Agenda, familia y facturación, resueltas desde
          el primer día.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/registro"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500 sm:w-auto"
          >
            Crea tu centro
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-slate-300 px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>
            <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Lo habitual</p>
              <p className="mt-2 text-lg text-slate-700">
                Una herramienta para tomar datos, otra para la agenda, un Excel para facturar, y RFT
                como una asignatura pendiente que nunca encuentra hueco.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Con Abacontext</p>
              <p className="mt-2 text-lg text-slate-700">
                Todo conectado desde el principio — y un camino claro para empezar a trabajar
                también el aprendizaje relacional, con el mismo criterio clínico de siempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Todo lo que necesita tu clínica
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {funcionalidades.map((f) => (
            <div key={f.titulo}>
              <div className="mb-3 flex items-center gap-2">
                <Nodo />
                <h3 className="font-semibold text-slate-800">{f.titulo}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">{f.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">Un acceso para cada persona</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="font-semibold text-slate-800">Administración</p>
              <p className="mt-2 text-sm text-slate-500">
                Equipo, alumnos, familia, currículo, facturación y documentos legales, todo desde un
                único panel.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="font-semibold text-slate-800">Terapeutas</p>
              <p className="mt-2 text-sm text-slate-500">
                Toma de datos pensada para usarse en sesión, agenda semanal, y gráficos que se
                construyen solos.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="font-semibold text-slate-800">Familias</p>
              <p className="mt-2 text-sm text-slate-500">
                Progreso, asistencia, informes y firma de documentos, sin depender de que alguien se
                lo explique por teléfono.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
          <img
            src="/javier-hilinger.jpg"
            alt="Javier Hilinger"
            className="h-32 w-32 shrink-0 rounded-full object-cover ring-4 ring-indigo-50 sm:h-40 sm:w-40"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Quién hay detrás</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Javier Hilinger</h2>
            <p className="text-sm text-slate-500">
              Licenciado en Psicología · Programa de doctorado en Análisis Funcional en
              Contextos Clínicos y de la Salud, Universidad de Almería
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Desde hace 16 años dirijo <strong>ABA Almería</strong>, centro dedicado a
              niños con autismo, donde he sido pionero en habla hispana en el desarrollo
              de programas basados en la Teoría del Marco Relacional (RFT). También
              dirijo <strong>Eureka Psicología</strong>, centrado en terapia para adultos
              desde una perspectiva contextual y la Terapia de Aceptación y Compromiso
              (ACT).
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              He impartido formaciones y presentado en congresos nacionales e
              internacionales sobre RFT y ACT. Abacontext nace de esa misma experiencia
              clínica de 16 años — y de mi otra faceta como desarrollador de software —
              para dar a otras clínicas ABA el mismo camino hacia lo relacional que yo
              mismo recorrí.
            </p>
          </div>
        </div>
      </section>
            <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Precio simple</h2>
        <div className="mt-8 rounded-2xl border border-slate-200 p-8">
          <p className="text-4xl font-bold text-slate-900">30€<span className="text-base font-normal text-slate-400">/mes</span></p>
          <p className="mt-1 text-sm text-slate-500">+ 4€/mes por cada alumno activo</p>
          <ul className="mt-6 space-y-3 text-left text-sm text-slate-600">
            <li className="flex items-center gap-2"><Nodo /> Equipo y alumnos sin límite</li>
            <li className="flex items-center gap-2"><Nodo /> ABA y RFT incluidos</li>
            <li className="flex items-center gap-2"><Nodo /> Portal de familia incluido</li>
            <li className="flex items-center gap-2"><Nodo /> Cancela cuando quieras</li>
          </ul>
          <Link
            href="/registro"
            className="mt-8 block w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500"
          >
            Crea tu centro
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <AbacontextIcon className="h-5 w-5" />
            <span>abacontext</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/faq" className="hover:text-slate-600">
              Preguntas frecuentes
            </Link>
            <Link href="/legal/privacidad" className="hover:text-slate-600">
              Privacidad
            </Link>
            <Link href="/legal/terminos" className="hover:text-slate-600">
              Términos
            </Link>
            <Link href="/legal/aviso-legal" className="hover:text-slate-600">
              Aviso Legal
            </Link>
          </div>
          <p>© {new Date().getFullYear()} abacontext</p>
        </div>
      </footer>
    </div>
  )
}