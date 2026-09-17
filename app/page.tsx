import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AbacontextIcon from './abacontext-icon'
import {
  ClipboardList,
  Activity,
  CalendarDays,
  Users,
  FileSignature,
  Star,
  BookOpenCheck,
  LineChart,
  Link2,
  MessageCircle,
  Brain,
  GraduationCap,
  Home as HomeIcon,
  WifiOff,
} from 'lucide-react'

function Nodo() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M 9 3 L 5 3 L 5 13 L 9 13" fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 15 3 L 19 3 L 19 13 L 15 13" fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const METODO = [
  {
    paso: '1',
    titulo: 'Evaluar',
    texto: 'Dónde está cada alumno hoy: habilidades directas, relacionales y preferencias.',
    color: 'var(--brand-primary)',
    fondo: 'var(--brand-primary-soft)',
  },
  {
    paso: '2',
    titulo: 'Enseñar',
    texto: 'Ensayo a ensayo, al ritmo de cada alumno — con el currículo de siempre.',
    color: '#aa5541',
    fondo: 'var(--brand-accent-soft)',
  },
  {
    paso: '3',
    titulo: 'Relacionar',
    texto: 'Lo aprendido se conecta con lo demás — aprendizaje relacional (RFT), no memorización suelta.',
    color: 'var(--brand-primary)',
    fondo: 'var(--brand-primary-soft)',
  },
  {
    paso: '4',
    titulo: 'Medir',
    texto: 'El progreso queda a la vista de todo el equipo, sesión a sesión.',
    color: '#aa5541',
    fondo: 'var(--brand-accent-soft)',
  },
]

const PERFILES = [
  { nombre: 'Terapeutas ABA', Icono: GraduationCap },
  { nombre: 'Logopedas', Icono: MessageCircle },
  { nombre: 'Psicólogos', Icono: Brain },
  { nombre: 'Educadores y PT/AL', Icono: BookOpenCheck },
  { nombre: 'Familias', Icono: HomeIcon },
]

const BLOQUES_FUNCIONALIDAD = [
  {
    eyebrow: 'El enfoque',
    titulo: 'La base de cada plan',
    items: [
      {
        titulo: 'Evaluación inicial y PEI',
        texto: 'Punto de partida en aprendizaje directo y relacional, y un plan de intervención que se arma solo desde el currículo.',
        Icono: ClipboardList,
      },
      {
        titulo: 'Currículo reutilizable',
        texto: 'Biblioteca propia de programas ABA y grupos RFT — se define una vez, se usa con cada alumno que lo necesite.',
        Icono: BookOpenCheck,
      },
      {
        titulo: 'Evaluación de preferencias',
        texto: 'MSWO y MSW guiados paso a paso, con la jerarquía de preferencia calculada al terminar.',
        Icono: Star,
      },
    ],
  },
  {
    eyebrow: 'Cada sesión',
    titulo: 'Lo que pasa en la sala',
    items: [
      {
        titulo: 'Toma de datos ABA y RFT',
        texto: 'Ensayo discreto y las cuatro fases del aprendizaje relacional, en el mismo sitio — hasta sin conexión: nada se pierde si se corta el wifi a mitad de sesión.',
        Icono: WifiOff,
      },
      {
        titulo: 'Registros de conducta',
        texto: 'Intervalo, duración, tasa y registro ABC, con línea base propia y gráficos que distinguen aumentar de reducir.',
        Icono: Activity,
      },
      {
        titulo: 'Agenda semanal',
        texto: 'Sesiones recurrentes y un aviso siempre visible de lo que quedó pendiente de marcar.',
        Icono: CalendarDays,
      },
    ],
  },
  {
    eyebrow: 'Todo el equipo',
    titulo: 'Conectados, no solo informados',
    items: [
      {
        titulo: 'Progreso que se entiende',
        texto: 'Gráficos de evolución con línea base, intervención y tendencia — sin necesitar que nadie los traduzca.',
        Icono: LineChart,
      },
      {
        titulo: 'Portal de familia',
        texto: 'Progreso, asistencia, informes generados con IA y documentos con firma digital, en un único acceso.',
        Icono: Users,
      },
      {
        titulo: 'Documentos y facturación',
        texto: 'Consentimientos firmados desde el móvil y suscripción por alumno activo, sin depender de otra herramienta.',
        Icono: FileSignature,
      },
    ],
  },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex min-w-0 items-center gap-2">
          <AbacontextIcon className="h-7 w-7" />
          <span className="truncate text-base font-bold tracking-tight text-slate-800 sm:text-lg">abacontext</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link href="/login" className="whitespace-nowrap text-xs font-medium text-slate-600 hover:text-slate-900 sm:text-sm">
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors sm:px-4 sm:text-sm"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: 'var(--brand-primary-soft)', color: 'var(--brand-primary-dark)' }}
            >
              <Nodo /> Basado en ABA y aprendizaje relacional (RFT)
            </p>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Enseñar y aprender<br />
              <span style={{ color: '#aa5541' }}>desde la evidencia.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Un enfoque guiado y flexible — no una plantilla rígida — que se adapta a cada alumno,
              desde la evaluación hasta el progreso real. Para terapeutas ABA, logopedas,
              psicólogos, educadores y familias que enseñan con evidencia, no por intuición.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/registro"
                className="w-full rounded-lg px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors sm:w-auto"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Empieza gratis
              </Link>
              <Link
                href="/login"
                className="w-full rounded-lg border border-slate-300 px-6 py-3 text-center text-base font-medium text-slate-700 hover:bg-white sm:w-auto"
              >
                Ya tengo cuenta
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-600">14 días de prueba gratis</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-600">El enfoque, en cuatro pasos</p>
            <div className="space-y-0">
              {METODO.map((m, i) => (
                <div key={m.paso} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: m.fondo, color: m.color }}
                    >
                      {m.paso}
                    </span>
                    {i < METODO.length - 1 && <span className="w-px flex-1 bg-slate-200" style={{ minHeight: 28 }} />}
                  </div>
                  <div className="pb-5">
                    <p className="font-semibold text-slate-800">{m.titulo}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{m.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
          <p className="text-center text-sm font-medium text-slate-600">
            Pensado para cualquier profesional que enseña de forma guiada — y para la familia que acompaña
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {PERFILES.map((p) => (
              <span
                key={p.nombre}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                <p.Icono className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} strokeWidth={2} />
                {p.nombre}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problema / solución */}
      <section className="border-b border-slate-100" style={{ backgroundColor: 'var(--brand-primary-soft)' }}>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Lo habitual</p>
              <p className="mt-2 text-lg text-slate-700">
                Protocolos rígidos que no se adaptan al alumno, cada profesional con su propio
                enfoque, y lo relacional como una asignatura pendiente que nunca encuentra hueco.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-primary-dark)' }}>
                Con Abacontext
              </p>
              <p className="mt-2 text-lg text-slate-700">
                Un enfoque que se ajusta a cada alumno sin perder el rigor — terapeuta, familia y el
                resto del equipo siguiendo el mismo plan, con datos que se entienden sin que nadie
                tenga que traducirlos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidad en profundidad */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Una herramienta, todo el recorrido</h2>
          <p className="mt-3 text-base text-slate-600">
            No es una lista de funciones sueltas — es el mismo enfoque, sostenido de principio a fin.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {BLOQUES_FUNCIONALIDAD.map((bloque) => (
            <div key={bloque.titulo}>
              <div className="mb-6 flex items-baseline gap-3">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--brand-accent-soft)', color: '#aa5541' }}
                >
                  {bloque.eyebrow}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{bloque.titulo}</h3>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {bloque.items.map((f) => (
                  <div key={f.titulo}>
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'var(--brand-primary-soft)', color: 'var(--brand-primary)' }}
                      >
                        <f.Icono className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <h4 className="font-semibold text-slate-800">{f.titulo}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{f.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RFT como diferencial */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-8">
          <Link2 className="mx-auto h-8 w-8" style={{ color: 'var(--brand-accent)' }} strokeWidth={1.75} />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Lo relacional, sin esperar a "tener tiempo"</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            La mayoría de herramientas se quedan en el aprendizaje directo. Abacontext trae el
            currículo, la toma de datos y los gráficos del aprendizaje relacional (RFT) integrados
            desde el primer día — con el mismo criterio clínico de siempre, no como un módulo aparte.
          </p>
        </div>
      </section>

      {/* Quién hay detrás */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
          <Image
            src="/javier-hilinger.jpg"
            alt="Javier Hilinger"
            width={160}
            height={160}
            className="h-32 w-32 shrink-0 rounded-full object-cover ring-4 sm:h-40 sm:w-40"
            style={{ boxShadow: '0 0 0 4px var(--brand-primary-soft)' }}
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-primary)' }}>
              Quién hay detrás
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Javier Hilinger</h2>
            <p className="text-sm text-slate-600">
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
              para dar a cualquier profesional guiado por la evidencia, y a las familias
              que los acompañan, ese mismo camino hacia lo relacional.
            </p>
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Precio simple</h2>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-4xl font-bold text-slate-900">30€<span className="text-base font-normal text-slate-600">/mes</span></p>
          <p className="mt-1 text-sm text-slate-600">+ 4€/mes por cada alumno activo</p>
          <p
            className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--brand-primary-soft)', color: 'var(--brand-primary-dark)' }}
          >
            14 días de prueba gratis
          </p>
          <ul className="mt-6 space-y-3 text-left text-sm text-slate-600">
            <li className="flex items-center gap-2"><Nodo /> Equipo y alumnos sin límite</li>
            <li className="flex items-center gap-2"><Nodo /> ABA y RFT incluidos</li>
            <li className="flex items-center gap-2"><Nodo /> Portal de familia incluido</li>
            <li className="flex items-center gap-2"><Nodo /> Cancela cuando quieras</li>
          </ul>
          <Link
            href="/registro"
            className="mt-8 block w-full rounded-lg py-3 text-base font-semibold text-white"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Empieza gratis
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 sm:flex-row sm:px-8">
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
