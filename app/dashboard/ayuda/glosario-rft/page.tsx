import Link from 'next/link'
import { GLOSARIO_RFT, type EntradaGlosario } from '../../glosario-rft'

const GRUPOS: EntradaGlosario['grupo'][] = ['Estructura', 'Fases', 'Resultados y bloques especiales', 'Conceptos']

export default function GlosarioRftPage() {
  const entradas: EntradaGlosario[] = Object.values(GLOSARIO_RFT)
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <div>
        <Link href="/dashboard/ayuda" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Ayuda
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Glosario RFT</h1>
        <p className="mt-1 text-sm text-slate-500">
          Los términos de los programas relacionales, explicados para el día a día. En las pantallas, el botón «?» junto a
          cada término muestra su definición.
        </p>
      </div>
      {GRUPOS.map((grupo) => (
        <section key={grupo} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{grupo}</h2>
          <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {entradas
              .filter((e) => e.grupo === grupo)
              .map((e) => (
                <div key={e.termino} className="p-4">
                  <dt className="font-semibold text-slate-800">{e.termino}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{e.definicion}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
