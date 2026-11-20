import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from './secuencia-rft'

// Aciertos con «antes» frente a «después» en los programas temporales. En las
// relaciones arbitrarias, «después» suele ser bastante más difícil que «antes»
// (Neufeld, Stewart y McElwee, 2023); ver la diferencia ayuda a decidir si hacen
// falta más ejemplares con «después».

export type Clave = 'antes' | 'despues'
export type Orden = 'mismo' | 'inverso'
export type FilaClave = { grupo: string; fase: string; clave: Clave; correcto: boolean; orden?: Orden | null }

// La clave de la PREGUNTA (lo que sigue al último «¿»): en las redes las
// premisas también dicen «antes de…»
export function claveTemporal(texto: string | null | undefined): Clave | null {
  if (!texto) return null
  const pregunta = texto.slice(texto.lastIndexOf('¿') + 1).toLowerCase()
  if (/\bdespu[eé]s\b|\bluego\b/.test(pregunta)) return 'despues'
  if (/\bantes\b|\bprimero\b/.test(pregunta)) return 'antes'
  return null
}

// Orden de mención de las premisas (lo que va antes del «¿»): «mismo» si la
// frase nombra los hechos en el orden en que pasan («Pim salta antes de
// cantar», «Después de saltar, Pim canta») e «inverso» si no («Pim canta
// después de saltar», «Antes de cantar, Pim salta»). Sin entender la clave, el
// niño responde por el orden en que se nombran (Clark, 1971). null si no hay
// premisas o si en una red se mezclan los dos órdenes
export function ordenMencion(texto: string | null | undefined): Orden | null {
  if (!texto || !texto.includes('¿')) return null
  const premisas = texto
    .slice(0, texto.lastIndexOf('¿'))
    .split('.')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
  const ordenes = premisas.map((p): Orden | null => {
    const antes = /\bantes\b/.test(p)
    const despues = /\bdespu[eé]s\b/.test(p)
    if (antes === despues) return null
    const delante = /^(antes|despu[eé]s) de\b/.test(p)
    return antes !== delante ? 'mismo' : 'inverso'
  })
  if (!ordenes.length || ordenes.some((o) => o === null)) return null
  return ordenes.every((o) => o === ordenes[0]) ? ordenes[0] : null
}

const NOMBRE_SONDA: Record<string, string> = { generalizacion: 'Sonda de generalización', mantenimiento: 'Sonda de mantenimiento' }
const AVISO_PUNTOS = 20
const AVISO_MINIMO = 5

type Cuenta = { aciertos: number; total: number }

// Por fase, aciertos de cada una de las dos columnas (a, b)
function contar<K extends string>(filas: FilaClave[], columna: (f: FilaClave) => K | null | undefined, a: K, b: K) {
  const porFase = new Map<string, Record<string, Cuenta>>()
  for (const f of filas) {
    const k = columna(f)
    if (!k) continue
    const c = porFase.get(f.fase) ?? { [a]: { aciertos: 0, total: 0 }, [b]: { aciertos: 0, total: 0 } }
    c[k].total++
    if (f.correcto) c[k].aciertos++
    porFase.set(f.fase, c)
  }
  return [...porFase.entries()].map(([fase, c]) => [fase, c[a], c[b]] as const)
}

const pct = (c: Cuenta) => (c.total ? Math.round((c.aciertos / c.total) * 100) : null)

function Celda({ c }: { c: Cuenta }) {
  const p = pct(c)
  return <td className="px-2 py-1 text-right tabular-nums">{p === null ? '—' : `${c.aciertos}/${c.total} · ${p} %`}</td>
}

function Tabla({
  titulo,
  filas,
  columnas,
  aviso,
}: {
  titulo: string
  filas: (readonly [string, Cuenta, Cuenta])[]
  columnas: [string, string]
  aviso: { texto: string; titulo: string }
}) {
  if (!filas.length) return null
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-500">{titulo}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400">
            <th className="px-2 py-1 text-left font-medium">Fase</th>
            <th className="px-2 py-1 text-right font-medium">{columnas[0]}</th>
            <th className="px-2 py-1 text-right font-medium">{columnas[1]}</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(([fase, a, b]) => {
            const pa = pct(a), pb = pct(b)
            const conAviso = pa !== null && pb !== null && a.total >= AVISO_MINIMO && b.total >= AVISO_MINIMO && pa - pb >= AVISO_PUNTOS
            return (
              <tr key={fase} className="border-t border-slate-100">
                <td className="px-2 py-1 text-slate-600">
                  {NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? NOMBRE_SONDA[fase] ?? fase}
                  {conAviso && (
                    <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700" title={aviso.titulo}>
                      ⚠ {aviso.texto}
                    </span>
                  )}
                </td>
                <Celda c={a} />
                <Celda c={b} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const AVISO_DESPUES = { texto: '«después»', titulo: '«Después» bastante por debajo de «antes»: conviene dar más ejemplares con «después»' }
const AVISO_ORDEN = {
  texto: 'orden inverso',
  titulo: 'Falla cuando la frase nombra los hechos en orden inverso: puede estar respondiendo por el orden de las palabras y no por la clave',
}

function Bloque({ titulo, filas }: { titulo: string; filas: FilaClave[] }) {
  return (
    <div className="space-y-2">
      <Tabla titulo={titulo} filas={contar(filas, (f) => f.clave, 'antes', 'despues')} columnas={['«Antes»', '«Después»']} aviso={AVISO_DESPUES} />
      <Tabla
        titulo={`${titulo} · orden de mención`}
        filas={contar(filas, (f) => f.orden, 'mismo', 'inverso')}
        columnas={['Mismo orden', 'Orden inverso']}
        aviso={AVISO_ORDEN}
      />
    </div>
  )
}

export default function ClavesTemporales({ filas, grupo }: { filas: FilaClave[]; grupo: string }) {
  if (!filas.length) return null
  const delGrupo = filas.filter((f) => f.grupo === grupo)
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-700">Aciertos con «antes» y con «después»</p>
        <p className="text-xs text-slate-500">
          Si «después» queda claramente por debajo, conviene dar más ejemplares con esa clave antes de pasar de fase. El orden de
          mención separa las frases que nombran los hechos en el orden en que pasan («Pim salta antes de cantar») de las que los
          nombran al revés («Pim canta después de saltar»): si falla sobre todo en estas, responde por el orden de las palabras.
        </p>
      </div>
      <Bloque titulo={grupo} filas={delGrupo} />
      <Bloque titulo="Todos los grupos" filas={filas} />
    </div>
  )
}
