'use client'

// Lista de ayudas que el terapeuta elige ANTES de que el alumno responda (se
// anota en el siguiente acierto). Común a todas las pantallas de registro:
// ordenada de menos a más intrusiva y con las que sugiere el programa marcadas
// y explicadas con su propio texto («Ayudas sugeridas» del programa).

export type OpcionAyuda = { value: string; label: string }

// De menos a más intrusiva
export const AYUDAS_ORDENADAS: OpcionAyuda[] = [
  { value: 'gestual', label: 'Gestual' },
  { value: 'visual', label: 'Visual' },
  { value: 'textual', label: 'Textual' },
  { value: 'verbal_parcial', label: 'Verbal parcial' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'modelado', label: 'Modelado' },
  { value: 'fisica_parcial', label: 'Física parcial' },
  { value: 'fisica_total', label: 'Física total' },
]

export const etiquetaAyuda = (valor: string | null) => (valor ? AYUDAS_ORDENADAS.find((a) => a.value === valor)?.label ?? valor : null)

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const ALIAS: Record<string, string> = {
  gestual: 'gestual',
  visual: 'visual',
  textual: 'textual',
  'verbal parcial': 'verbal_parcial',
  verbal: 'verbal',
  'verbal total': 'verbal',
  modelado: 'modelado',
  'fisica parcial': 'fisica_parcial',
  'fisica total': 'fisica_total',
}

// «- Física parcial: guiar la mano…» → { fisica_parcial: 'guiar la mano…' }
export function ayudasDelPrograma(texto: string | null): Record<string, string> {
  const salida: Record<string, string> = {}
  if (!texto) return salida
  for (const linea of texto.split(/\r?\n/)) {
    const m = linea.match(/^\s*[-•]\s*([^:]+):\s*(.+)$/)
    if (!m) continue
    const valor = ALIAS[sinTildes(m[1])]
    if (valor && !salida[valor]) salida[valor] = m[2].trim()
  }
  return salida
}

export default function SelectorAyuda({
  elegida,
  sugeridas,
  ocultar = [],
  onElegir,
}: {
  elegida: string | null
  sugeridas: Record<string, string>
  ocultar?: string[]
  onElegir: (valor: string | null) => void
}) {
  const hay = Object.keys(sugeridas).length > 0
  return (
    <div className="space-y-2 text-left text-sm">
      <p className="text-xs text-slate-600">
        Si cree que no va a poder solo, elija una ayuda <strong>antes</strong> de que responda: se anota en el siguiente acierto. Si responde solo y
        falla, la app le guiará en la corrección. Están ordenadas de menos a más intrusiva
        {hay ? '; ★ son las que sugiere este programa' : ''}.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {AYUDAS_ORDENADAS.filter((a) => !ocultar.includes(a.value)).map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => onElegir(a.value)}
            className={`rounded-lg px-3 py-2 text-left ${
              elegida === a.value ? 'bg-amber-200 text-amber-900' : sugeridas[a.value] ? 'border border-amber-300 bg-white text-slate-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span className="font-medium">
              {sugeridas[a.value] ? '★ ' : ''}
              {a.label}
            </span>
            {sugeridas[a.value] && <span className="block text-xs text-slate-500">{sugeridas[a.value]}</span>}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onElegir(null)} className="w-full rounded-lg px-3 py-2 text-slate-500">
        Sin ayuda
      </button>
    </div>
  )
}
