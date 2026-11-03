import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AbacontextIcon from './abacontext-icon'
import { Check, FileSpreadsheet, FileText, PenLine, Puzzle, WifiOff } from 'lucide-react'

function Nodo() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M 9 3 L 5 3 L 5 13 L 9 13" fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 15 3 L 19 3 L 19 13 L 15 13" fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const CIFRAS = [
  { valor: '159', texto: 'programas listos para aplicar' },
  { valor: '4 × 16', texto: 'niveles y dominios de aprendizaje' },
  { valor: '+1.400', texto: 'imágenes de estímulos incluidas' },
  { valor: '0', texto: 'datos perdidos si se corta el wifi' },
]

const DOLORES = [
  { texto: 'Hojas de registro en papel que alguien tiene que pasar a limpio.', Icono: PenLine },
  { texto: 'Gráficos en Excel que se actualizan cuando hay tiempo… o nunca.', Icono: FileSpreadsheet },
  { texto: 'Programas de RFT que te inventas tú: estímulos, relaciones y criterios.', Icono: Puzzle },
  { texto: 'Informes para las familias redactados a mano, uno por uno.', Icono: FileText },
]

const PREGUNTAS = [
  {
    p: '¿Necesito formación en RFT para usarlo?',
    r: 'No. Cada programa viene preparado con sus estímulos y su criterio de dominio, y la app te guía ensayo a ensayo. Si sabes aplicar ensayo discreto, puedes empezar.',
  },
  {
    p: '¿Quién ve los datos de los alumnos?',
    r: 'Solo tu centro. Cada terapeuta ve los alumnos que tiene asignados y cada familia, únicamente los de su hijo o hija.',
  },
  {
    p: '¿Hay permanencia?',
    r: 'No. Pagas mes a mes por los alumnos activos y puedes cancelar cuando quieras desde la propia app.',
  },
]

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={2.5} />
          {i}
        </li>
      ))}
    </ul>
  )
}

function Estimulo({ src, marcado }: { src: string; marcado?: boolean }) {
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-xl border-2 bg-white shadow-sm ${marcado ? 'border-emerald-400' : 'border-slate-200'}`}
    >
      <Image src={`/landing/${src}.webp`} alt="" width={160} height={160} className="h-[85%] w-[85%] object-contain" />
    </div>
  )
}

// Recreación de la pantalla del alumno en la tableta (programa RFT)
function MaquetaTableta() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-slate-900 p-2.5 shadow-2xl sm:p-3">
      <div className="flex aspect-[4/3] flex-col rounded-[20px] px-4 py-3 sm:px-6" style={{ backgroundColor: '#F5F2EC' }}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 sm:text-xs">
          <span>Igualación · Ensayo 7 de 10</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">6 correctos</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
          <div className="w-[28%] rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-2">
            <Estimulo src="vaca-1" />
          </div>
          <span className="text-sm font-semibold leading-none text-slate-400">=</span>
          <div className="grid w-[80%] grid-cols-3 gap-3 sm:gap-4">
            <Estimulo src="caballo-2" />
            <Estimulo src="vaca-eval" marcado />
            <Estimulo src="platano-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Recreación del currículo: un programa con sus estímulos
function MaquetaCurriculo() {
  const niveles = ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4']
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
      <div className="flex flex-wrap gap-1.5">
        {niveles.map((n, i) => (
          <span
            key={n}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={i === 1 ? { backgroundColor: 'var(--brand-primary)', color: 'white' } : { backgroundColor: 'var(--brand-primary-soft)', color: 'var(--brand-primary-dark)' }}
          >
            {n}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Relacional · Coordinación</p>
            <p className="mt-0.5 font-semibold text-slate-800">Categorías: animales y alimentos</p>
          </div>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: 'var(--brand-accent-soft)', color: '#aa5541' }}>
            En curso
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {['elefante-1', 'jirafa-1', 'buho-1', 'caballo-2', 'manzana-1', 'platano-1', 'autobus-1', 'ambulancia-1'].map((s) => (
            <div key={s} className="flex aspect-square items-center justify-center rounded-lg border border-slate-100 bg-white">
              <Image src={`/landing/${s}.webp`} alt="" width={96} height={96} className="h-[85%] w-[85%] object-contain" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Criterio: 90% en 2 sesiones</span>
          <span className="font-semibold text-slate-700">Grupo 2 de 4</span>
        </div>
      </div>
    </div>
  )
}

// Recreación de la toma de datos en el móvil
function MaquetaMovil() {
  const ensayos = ['+', '+', 'A', '+', '−', '+', '+']
  return (
    <div className="mx-auto w-64 rounded-[36px] bg-slate-900 p-2.5 shadow-2xl">
      <div className="rounded-[28px] bg-white px-4 pb-5 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Lucía · Sesión de hoy</p>
        <p className="mt-0.5 font-semibold text-slate-800">Imitación motora</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {ensayos.map((e, i) => (
            <span
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                e === '+' ? 'bg-emerald-100 text-emerald-700' : e === '−' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {e}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">5 de 7 correctos sin ayuda · 71%</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <span className="rounded-xl bg-emerald-500 py-4 text-center text-lg font-bold text-white">Correcto</span>
          <span className="rounded-xl bg-rose-500 py-4 text-center text-lg font-bold text-white">Error</span>
          <span className="col-span-2 rounded-xl bg-amber-100 py-3 text-center text-sm font-semibold text-amber-800">Con ayuda</span>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <WifiOff className="h-3.5 w-3.5" /> Sin conexión · se sincroniza al volver
        </p>
      </div>
    </div>
  )
}

// Recreación del gráfico de progreso con línea base e intervención
function MaquetaGrafico() {
  const base = [20, 25, 15, 20]
  const intervencion = [30, 40, 45, 55, 60, 70, 75, 85, 90, 90]
  const x = (i: number) => 40 + i * 25
  const y = (v: number) => 170 - v * 1.5
  const puntos = (vs: number[], desde: number) => vs.map((v, i) => `${x(desde + i)},${y(v)}`).join(' ')
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold text-slate-800">Imitación motora</p>
        <span className="text-xs font-semibold text-emerald-600">Dominado</span>
      </div>
      <svg viewBox="0 0 400 190" className="mt-3 w-full" role="img" aria-label="Gráfico de progreso: línea base baja y subida durante la intervención hasta el 90%">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1="35" x2="395" y1={y(v)} y2={y(v)} stroke="#e2e8f0" />
            <text x="28" y={y(v) + 4} fontSize="10" textAnchor="end" fill="#64748b">{v}%</text>
          </g>
        ))}
        <line x1="35" x2="395" y1={y(90)} y2={y(90)} stroke="#10b981" strokeDasharray="4 4" />
        <line x1={x(3.5)} x2={x(3.5)} y1="15" y2="170" stroke="#94a3b8" strokeDasharray="3 3" />
        <text x={x(1.5)} y="12" fontSize="10" textAnchor="middle" fill="#64748b">Línea base</text>
        <text x={x(8.5)} y="12" fontSize="10" textAnchor="middle" fill="#64748b">Intervención</text>
        <line x1={x(4)} y1={y(32)} x2={x(13)} y2={y(95)} stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="6 4" />
        <polyline points={puntos(base, 0)} fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" />
        <polyline points={puntos(intervencion, 4)} fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" />
        {[...base, ...intervencion].map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="white" stroke="var(--brand-primary)" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-3 rounded-xl p-3 text-sm leading-relaxed text-slate-700" style={{ backgroundColor: 'var(--brand-primary-soft)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-primary-dark)' }}>Informe para la familia</p>
        Lucía ya imita gestos con las manos sin ayuda en 9 de cada 10 ocasiones. Esta semana empezamos a combinar dos movimientos seguidos…
      </div>
    </div>
  )
}

function Bloque({
  eyebrow,
  titulo,
  texto,
  items,
  maqueta,
  invertido,
}: {
  eyebrow: string
  titulo: string
  texto: string
  items: string[]
  maqueta: React.ReactNode
  invertido?: boolean
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={invertido ? 'lg:order-2' : ''}>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#aa5541' }}>{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{titulo}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{texto}</p>
        <Lista items={items} />
      </div>
      <div className={invertido ? 'lg:order-1' : ''}>{maqueta}</div>
    </div>
  )
}

function BotonPrueba({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/registro"
      className={`rounded-lg px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:opacity-90 ${className}`}
      style={{ backgroundColor: 'var(--brand-primary)' }}
    >
      Prueba 14 días gratis
    </Link>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--background)' }}>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex min-w-0 items-center gap-2">
          <AbacontextIcon className="h-7 w-7" />
          <span className="truncate text-base font-bold tracking-tight text-slate-800 sm:text-lg">abacontext</span>
        </div>
        <nav className="flex shrink-0 items-center gap-3 sm:gap-6">
          <a href="#como-funciona" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 md:inline">Cómo funciona</a>
          <a href="#precio" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 md:inline">Precio</a>
          <Link href="/login" className="whitespace-nowrap text-xs font-medium text-slate-600 hover:text-slate-900 sm:text-sm">
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm sm:px-4 sm:text-sm"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Prueba gratis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: 'var(--brand-primary-soft)', color: 'var(--brand-primary-dark)' }}
            >
              <Nodo /> Software para centros y terapeutas ABA
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Deja el papel. Enseña con un currículo{' '}
              <span style={{ color: '#aa5541' }}>ABA y RFT ya preparado.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Programas listos para aplicar, datos ensayo a ensayo en la tableta y gráficos de
              progreso que tu equipo y las familias entienden. Todo en una sola app, creada por un
              psicólogo que lleva 20 años dirigiendo un centro ABA.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BotonPrueba />
              <a
                href="#como-funciona"
                className="rounded-lg border border-slate-300 px-6 py-3 text-center text-base font-medium text-slate-700 hover:bg-white"
              >
                Ver cómo funciona
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">14 días gratis · sin permanencia · cancela cuando quieras</p>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={2.5} />
              Se usa a diario en ABA Almería, centro especializado en autismo
            </p>
          </div>
          <MaquetaTableta />
        </div>
      </section>

      {/* Cifras */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-4">
          {CIFRAS.map((c) => (
            <div key={c.texto} className="text-center">
              <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--brand-primary)' }}>{c.valor}</p>
              <p className="mt-1 text-sm text-slate-600">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dolores */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">¿Te suena?</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DOLORES.map((d) => (
            <div key={d.texto} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--brand-accent-soft)', color: '#aa5541' }}>
                <d.Icono className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-base leading-relaxed text-slate-700">{d.texto}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold text-slate-800">
          Abacontext se encarga de todo eso, para que tú te dediques a enseñar.
        </p>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="scroll-mt-6 bg-white">
        <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:space-y-28 sm:px-8 sm:py-24">
          <Bloque
            eyebrow="1 · El currículo"
            titulo="No empiezas de una hoja en blanco"
            texto="159 programas de aprendizaje directo y relacional, ordenados en 4 niveles y 16 dominios. Cada uno trae sus estímulos con imagen, sus grupos y su criterio de dominio."
            items={[
              'Evaluación inicial y PEI que se arma solo desde el currículo.',
              'Cada nivel y dominio se desbloquea al conseguir el anterior.',
              'Evaluación de preferencias (MSWO y MSW) guiada paso a paso.',
            ]}
            maqueta={<MaquetaCurriculo />}
          />
          <Bloque
            invertido
            eyebrow="2 · La sesión"
            titulo="Los datos se toman solos, ensayo a ensayo"
            texto="En los programas RFT el alumno responde directamente en la tableta y cada ensayo queda registrado. En el resto, anotas con un toque desde el móvil, con una mano."
            items={[
              'Ensayo discreto y las cuatro fases del aprendizaje relacional.',
              'Registros de conducta: intervalo, duración, tasa y ABC.',
              'Funciona sin conexión: no se pierde nada si se corta el wifi.',
            ]}
            maqueta={<MaquetaMovil />}
          />
          <Bloque
            eyebrow="3 · El progreso"
            titulo="Gráficos que nadie tiene que traducir"
            texto="Línea base, intervención y tendencia se dibujan solas con cada sesión. La familia ve el progreso de su hijo e informes en lenguaje claro, sin que tengas que redactarlos."
            items={[
              'Todo el equipo trabaja sobre el mismo plan y los mismos datos.',
              'Portal de familia con progreso por niveles y dominios.',
              'Informes para familias generados con IA.',
            ]}
            maqueta={<MaquetaGrafico />}
          />
        </div>
      </section>

      {/* RFT + quién hay detrás */}
      <section style={{ backgroundColor: 'var(--brand-primary)' }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Lo que nos diferencia</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              El primer currículo de RFT aplicado en español
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85 sm:text-lg">
              La mayoría de herramientas se quedan en el aprendizaje directo. Abacontext integra
              desde el primer día el currículo, la toma de datos y los gráficos de la Teoría del
              Marco Relacional (RFT): equivalencia, coordinación, distinción, comparación… Con el
              mismo criterio clínico, no como un módulo aparte que nunca encuentra hueco.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <Image
                src="/javier-hilinger.jpg"
                alt="Javier Hilinger"
                width={96}
                height={96}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900">Javier Hilinger</p>
                <p className="text-sm text-slate-600">Psicólogo · Doctorando en Análisis Funcional, Universidad de Almería</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-relaxed text-slate-700">
              «Desde hace 20 años dirijo <strong>ABA Almería</strong>, un centro para niños con
              autismo donde llevamos años desarrollando programas basados en RFT. Abacontext es la
              herramienta que me habría gustado tener: reúne lo que hacemos cada día para que
              cualquier profesional pueda aplicarlo.»
            </p>
          </div>
        </div>
      </section>

      {/* Precio */}
      <section id="precio" className="scroll-mt-6 mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Pagas por alumno, no por usuario</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Sin cuota fija y con todo el equipo incluido: terapeutas, coordinadores y familias
              entran sin coste adicional. Si un alumno deja el centro, deja de facturarse.
            </p>
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <strong>Ejemplo:</strong> un centro con 10 alumnos activos paga 120 €/mes, con
              todos sus profesionales y familias dentro.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-5xl font-bold tracking-tight text-slate-900">
              12€<span className="text-base font-normal text-slate-600"> /mes por alumno activo</span>
            </p>
            <p className="mt-2 text-sm text-slate-600">Sin cuota fija · mínimo 3 alumnos</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {['Equipo y familias sin límite', 'ABA y RFT incluidos, con todo el currículo', 'Portal de familia e informes', 'Sin permanencia'].map((i) => (
                <li key={i} className="flex items-center gap-2"><Nodo /> {i}</li>
              ))}
            </ul>
            <BotonPrueba className="mt-8 block w-full" />
            <p className="mt-3 text-center text-xs text-slate-500">
              Precio en España. En Latinoamérica, precio adaptado a cada país: lo verás al registrarte.
            </p>
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Preguntas frecuentes</h2>
          <div className="mt-8 divide-y divide-slate-200">
            {PREGUNTAS.map((q) => (
              <div key={q.p} className="py-5">
                <p className="font-semibold text-slate-800">{q.p}</p>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{q.r}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm">
            <Link href="/faq" className="font-medium" style={{ color: 'var(--brand-primary)' }}>
              Ver todas las preguntas →
            </Link>
          </p>
        </div>
      </section>

      {/* Cierre */}
      <section style={{ backgroundColor: 'var(--brand-primary-soft)' }}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Prueba Abacontext con tus alumnos durante 14 días
          </h2>
          <p className="mt-3 text-base text-slate-600">Configura tu centro en minutos y empieza con el currículo ya cargado.</p>
          <BotonPrueba className="mt-8 inline-block" />
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
            <Link href="/legal/reembolsos" className="hover:text-slate-600">
              Reembolsos
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
