import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from './secuencia-rft'

// Aciertos con «antes» frente a «después» en los programas temporales. En las
// relaciones arbitrarias, «después» suele ser bastante más difícil que «antes»
// (Neufeld, Stewart y McElwee, 2023); ver la diferencia ayuda a decidir si hacen
// falta más ejemplares con «después».

export type Clave = 'antes' | 'despues'
export type FilaClave = { grupo: string; fase: string; clave: Clave; correcto: boolean }

// La clave de la PREGUNTA (lo que sigue al último «¿»): en las redes las
// premisas también dicen «antes de…»
export function claveTemporal(texto: string | null | undefined): Clave | null {
  if (!texto) return null
  const pregunta = texto.slice(texto.lastIndexOf('¿') + 1).toLowerCase()
  if (/\bdespu[eé]s\b|\bluego\b/.test(pregunta)) return 'despues'
  if (/\bantes\b|\bprimero\b/.test(pregunta)) return 'antes'
  return null
}

const NOMBRE_SONDA: Record<string, string> = { generalizacion: 'Sonda de generalización', mantenimiento: 'Sonda de mantenimiento' }
const AVISO_PUNTOS = 20
const AVISO_MINIMO = 5

type Cuenta = { aciertos: number; total: number }

function contar(filas: FilaClave[]) {
  const porFase = new Map<string, Record<Clave, Cuenta>>()
  for (const f of filas) {
    const c = porFase.get(f.fase) ?? { antes: { aciertos: 0, total: 0 }, despues: { aciertos: 0, total: 0 } }
    c[f.clave].total++
    if (f.correcto) c[f.clave].aciertos++
    porFase.set(f.fase, c)
  }
  return [...porFase.entries()]
}

const pct = (c: Cuenta) => (c.total ? Math.round((c.aciertos / c.total) * 100) : null)

function Celda({ c }: { c: Cuenta }) {
  const p = pct(c)
  return <td className="px-2 py-1 text-right tabular-nums">{p === null ? '—' : `${c.aciertos}/${c.total} · ${p} %`}</td>
}

function Tabla({ titulo, filas }: { titulo: string; filas: FilaClave[] }) {
  const fases = contar(filas)
  if (!fases.length) return null
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-500">{titulo}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400">
            <th className="px-2 py-1 text-left font-medium">Fase</th>
            <th className="px-2 py-1 text-right font-medium">«Antes»</th>
            <th className="px-2 py-1 text-right font-medium">«Después»</th>
          </tr>
        </thead>
        <tbody>
          {fases.map(([fase, c]) => {
            const pa = pct(c.antes), pd = pct(c.despues)
            const aviso = pa !== null && pd !== null && c.antes.total >= AVISO_MINIMO && c.despues.total >= AVISO_MINIMO && pa - pd >= AVISO_PUNTOS
            return (
              <tr key={fase} className="border-t border-slate-100">
                <td className="px-2 py-1 text-slate-600">
                  {NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? NOMBRE_SONDA[fase] ?? fase}
                  {aviso && (
                    <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700" title="«Después» bastante por debajo de «antes»: conviene dar más ejemplares con «después»">
                      ⚠ «después»
                    </span>
                  )}
                </td>
                <Celda c={c.antes} />
                <Celda c={c.despues} />
              </tr>
            )
          })}
        </tbody>
      </table>
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
          Si «después» queda claramente por debajo, conviene dar más ejemplares con esa clave antes de pasar de fase.
        </p>
      </div>
      <Tabla titulo={grupo} filas={delGrupo} />
      <Tabla titulo="Todos los grupos" filas={filas} />
    </div>
  )
}
