import Link from 'next/link'
import { Panel } from '../../../../ui'
import { VENTANA_TEXTO, type Estancado, type Indicador, type Tendencia } from './indicadores'

const TENDENCIA: Record<Exclude<Tendencia, null>, { texto: string; clase: string }> = {
  mejora: { texto: '↑ Mejora', clase: 'bg-emerald-50 text-emerald-700' },
  empeora: { texto: '↓ Empeora', clase: 'bg-rose-50 text-rose-700' },
  estable: { texto: '→ Estable', clase: 'bg-slate-100 text-slate-600' },
}

// En velocidad, el valor son ensayos (menos = mejor): la tendencia se dice
// en términos de rapidez para que no se lea al revés
const TEXTO_VELOCIDAD: Record<Exclude<Tendencia, null>, string> = {
  mejora: '↑ Más rápido',
  empeora: '↓ Más lento',
  estable: '→ Estable',
}

// El reparto directo/derivado no es mejor ni peor (depende del nivel): su
// tendencia se describe en términos neutros
const TEXTO_REPARTO: Record<Exclude<Tendencia, null>, string> = {
  mejora: '↑ Más derivado',
  empeora: '↓ Más directo',
  estable: '→ Estable',
}

function Tarjeta({ ind }: { ind: Indicador }) {
  return (
    <Panel className="flex flex-col gap-1 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">{ind.titulo}</p>
        {ind.tendencia && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
              ind.clave === 'derivado' ? 'bg-indigo-50 text-indigo-700' : TENDENCIA[ind.tendencia].clase
            }`}
          >
            {ind.clave === 'criterio'
              ? TEXTO_VELOCIDAD[ind.tendencia]
              : ind.clave === 'derivado'
                ? TEXTO_REPARTO[ind.tendencia]
                : TENDENCIA[ind.tendencia].texto}
          </span>
        )}
      </div>
      {ind.valor === null ? (
        <p className="text-lg font-semibold text-slate-300">Datos insuficientes</p>
      ) : (
        <p className="text-3xl font-bold tabular-nums text-slate-800">{ind.valor}</p>
      )}
      <p className="text-xs text-slate-500">{ind.detalle}</p>
      <details className="mt-auto pt-1 text-xs text-slate-500">
        <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">¿Qué mide?</summary>
        <p className="mt-1">{ind.explicacion}</p>
      </details>
    </Panel>
  )
}

export default function IndicadoresAlumno({
  indicadores,
  estancados,
}: {
  indicadores: Indicador[]
  estancados: Estancado[]
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-800">Cómo aprende</h3>
        <p className="text-xs text-slate-400">
          Indicadores de los últimos {VENTANA_TEXTO}, frente a los {VENTANA_TEXTO} anteriores · orientativos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((ind) => (
          <Tarjeta key={ind.clave} ind={ind} />
        ))}
      </div>

      {estancados.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {estancados.length === 1 ? '1 objetivo sin avance' : `${estancados.length} objetivos sin avance`}
          </p>
          <p className="text-xs text-amber-800">
            En adquisición desde hace al menos 6 bloques, sin mejora en los 3 últimos y por debajo del criterio. Puede
            convenir revisar las ayudas, los estímulos o el paso del programa.
          </p>
          <ul className="mt-2 divide-y divide-amber-100">
            {estancados.map((e, i) => (
              <li key={`${e.programaId}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-sm">
                <Link
                  href={e.tipo === 'rft' ? `/dashboard/programas-rft/${e.programaId}` : `/dashboard/programas/${e.programaId}`}
                  className="min-w-0 basis-48 flex-1 font-medium text-slate-800 hover:underline"
                >
                  {e.programaNombre}
                </Link>
                <span className="text-xs text-slate-600">{e.objetivo}</span>
                <span className="text-xs tabular-nums text-amber-800">
                  {e.bloques} bloques · último {e.ultimoPorcentaje}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
