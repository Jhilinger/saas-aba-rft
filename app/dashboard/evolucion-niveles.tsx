'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Panel } from '../ui'
import DistribucionAyudasChart from './distribucion-ayudas-chart'
import type { DistribucionAyuda } from './ayuda-tipos'
import { SUFIJO_HABLANTE } from './conceptos'

// Evolución de los programas de abstracción de claves con ensayos generados en
// la tableta: cada nivel hace de grupo. Se muestran el estado de cada nivel, una
// sola curva con las líneas de cambio de nivel, los aciertos por clave (para ver
// si responde por una sola clave y no por la relación) y las ayudas por nivel.

export type BloqueNivel = { fecha: string; nivel: string; fase: string; porcentaje: number }
export type FilaClaveNivel = { nivel: string; fase: string; clave: string; correcto: boolean }

const AVISO_PUNTOS = 20
const AVISO_MINIMO = 5
const COLOR_ENTRENAMIENTO = '#4f46e5'
const COLOR_SONDA = '#059669'

const DIMENSION: Record<string, string> = { tamano: 'Tamaño', cantidad: 'Cantidad', longitud: 'Longitud', altura: 'Altura' }
const CLAVE: Record<string, string> = {
  igual: '«Igual»',
  diferente: '«Diferente»',
  intruso: '«Cuál es diferente»',
  contrario: '«Contrario»',
  antes: '«Antes»',
  despues: '«Después»',
  primero: '«Primero»',
  mas: 'más',
  menos: 'menos',
  encima: '«Encima»',
  debajo: '«Debajo»',
  dentro: '«Dentro»',
  fuera: '«Fuera»',
  delante: '«Delante»',
  detras: '«Detrás»',
  efecto: '«¿Qué pasará?»',
  causa: '«¿Por qué ha pasado?»',
  color: '«Mismo color»',
  forma: '«Misma forma»',
  tamano: '«Mismo tamaño»',
  'color+forma': '«Color y forma»',
  'forma+tamano': '«Forma y tamaño»',
  'color+tamano': '«Color y tamaño»',
  asc: 'ordenar de menos a más',
  desc: 'ordenar de más a menos',
}

export function etiquetaClave(clave: string) {
  const [a, b] = clave.split(':')
  if (b) return `${DIMENSION[a] ?? a} · «${CLAVE[b] ?? b}»`
  return CLAVE[a] ?? a
}

const fechaCorta = (f: string) => new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })

function Resumen({
  niveles,
  bloques,
  dominados,
}: {
  niveles: string[]
  bloques: BloqueNivel[]
  dominados: string[]
}) {
  return (
    <Panel className="space-y-2 p-4 sm:p-5">
      <p className="text-sm font-semibold text-slate-700">Niveles</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400">
              <th className="px-2 py-1 text-left font-medium">Nivel</th>
              <th className="px-2 py-1 text-left font-medium">Estado</th>
              <th className="px-2 py-1 text-right font-medium">Bloques</th>
              <th className="px-2 py-1 text-right font-medium">Último bloque</th>
              <th className="px-2 py-1 text-right font-medium">Última sonda</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((nivel) => {
              const entrenamiento = bloques.filter((b) => b.nivel === nivel && b.fase === 'entrenamiento')
              const sondas = bloques.filter((b) => b.nivel === nivel && b.fase === 'generalizacion')
              const ultimo = entrenamiento.at(-1)
              const sonda = sondas.at(-1)
              const dominado = dominados.includes(nivel)
              return (
                <tr key={nivel} className="border-t border-slate-100">
                  <td className="px-2 py-1.5 text-slate-700">{nivel}</td>
                  <td className="px-2 py-1.5">
                    {dominado ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">✓ Dominado</span>
                    ) : entrenamiento.length ? (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">En curso</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Pendiente</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums text-slate-600">{entrenamiento.length || '—'}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums text-slate-600">
                    {ultimo ? `${ultimo.porcentaje} % · ${fechaCorta(ultimo.fecha)}` : '—'}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums text-slate-600">
                    {sonda ? `${sonda.porcentaje} % · ${fechaCorta(sonda.fecha)}` : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// Una sola curva en orden de fecha; cada nivel es una fase (la línea se corta
// en el cambio de nivel) y las sondas van como puntos sueltos
function Curva({ titulo, bloques, porcentajeDominio }: { titulo: string; bloques: BloqueNivel[]; porcentajeDominio: number }) {
  if (!bloques.length) return null
  // Un tramo de línea por cada paso por un nivel: si se vuelve a un nivel
  // anterior, el tramo nuevo no se une con el antiguo
  const cambios: { x: string; nivel: string }[] = []
  const tramos = new Set<string>()
  const datos = bloques.map((b, i) => {
    const x = `#${i + 1}`
    if (i === 0 || bloques[i - 1].nivel !== b.nivel) cambios.push({ x, nivel: b.nivel })
    const punto: Record<string, string | number> = { x, nivel: b.nivel, fecha: fechaCorta(b.fecha) }
    if (b.fase === 'generalizacion') punto.sonda = b.porcentaje
    else {
      const tramo = `t${cambios.length}`
      tramos.add(tramo)
      punto[tramo] = b.porcentaje
    }
    return punto
  })

  return (
    <Panel className="space-y-2 p-4 sm:p-5">
      <div>
        <p className="text-sm font-semibold text-slate-700">{titulo}</p>
        <p className="text-xs text-slate-500">% de aciertos por bloque. Las líneas verticales marcan el cambio de nivel.</p>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: COLOR_ENTRENAMIENTO }} /> Entrenamiento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLOR_SONDA }} /> Sonda de generalización
          </span>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 24, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="x" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
            <Tooltip
              formatter={(valor, nombre) => [`${valor} %`, nombre === 'sonda' ? 'Sonda de generalización' : 'Entrenamiento']}
              labelFormatter={(x, carga) => {
                const p = carga?.[0]?.payload as { nivel?: string; fecha?: string } | undefined
                return p ? `${x} · ${p.nivel} · ${p.fecha}` : String(x)
              }}
            />
            <ReferenceLine
              y={porcentajeDominio}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{ value: `Dominio (${porcentajeDominio}%)`, fontSize: 11, fill: '#64748b', position: 'insideBottomRight' }}
            />
            {cambios.map((c) => (
              <ReferenceLine
                key={c.x}
                x={c.x}
                stroke="#cbd5e1"
                label={{ value: c.nivel, fontSize: 11, fill: '#475569', position: 'insideTopLeft' }}
              />
            ))}
            {[...tramos].map((id) => (
              <Line key={id} type="linear" dataKey={id} stroke={COLOR_ENTRENAMIENTO} strokeWidth={2} dot={{ r: 4 }} isAnimationActive={false} legendType="none" />
            ))}
            <Line
              type="linear"
              dataKey="sonda"
              stroke="none"
              dot={{ r: 6, fill: COLOR_SONDA, stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: COLOR_SONDA }}
              isAnimationActive={false}
              legendType="none"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

type Cuenta = { aciertos: number; total: number }
const pct = (c: Cuenta) => Math.round((c.aciertos / c.total) * 100)

// Aciertos por clave en cada nivel: si una clave queda muy por debajo de otra,
// el alumno puede estar respondiendo por una sola clave y no por la relación
function Claves({ niveles, filas }: { niveles: string[]; filas: FilaClaveNivel[] }) {
  const grupos = niveles.flatMap((nivel) =>
    (['entrenamiento', 'generalizacion'] as const).map((fase) => {
      const cuentas = new Map<string, Cuenta>()
      for (const f of filas) {
        if (f.nivel !== nivel || f.fase !== fase) continue
        const c = cuentas.get(f.clave) ?? { aciertos: 0, total: 0 }
        c.total++
        if (f.correcto) c.aciertos++
        cuentas.set(f.clave, c)
      }
      return { nivel, fase, cuentas: [...cuentas.entries()] }
    })
  )
  const conVarias = grupos.filter((g) => g.cuentas.length >= 2)
  if (!conVarias.length) return null

  return (
    <Panel className="space-y-3 p-4 sm:p-5">
      <div>
        <p className="text-sm font-semibold text-slate-700">Aciertos por clave</p>
        <p className="text-xs text-slate-500">
          Si una clave queda claramente por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «igual») y
          no por la relación: conviene más ejemplares de esa clave antes de dar el nivel por dominado.
        </p>
      </div>
      <div className="space-y-2">
        {conVarias.map((g) => {
          const fiables = g.cuentas.filter(([, c]) => c.total >= AVISO_MINIMO).map(([, c]) => pct(c))
          const aviso = fiables.length >= 2 && Math.max(...fiables) - Math.min(...fiables) >= AVISO_PUNTOS
          const peor = aviso ? g.cuentas.filter(([, c]) => c.total >= AVISO_MINIMO).sort(([, a], [, b]) => pct(a) - pct(b))[0][0] : null
          return (
            <div key={`${g.nivel}-${g.fase}`} className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-500">
                {g.nivel}
                {g.fase === 'generalizacion' && ' · sonda de generalización'}
                {peor && (
                  <span
                    className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700"
                    title={`${etiquetaClave(peor)} está ${AVISO_PUNTOS} puntos o más por debajo de otra clave`}
                  >
                    ⚠ {etiquetaClave(peor)}
                  </span>
                )}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {g.cuentas.map(([clave, c]) => (
                  <span key={clave} className="tabular-nums text-slate-700">
                    {etiquetaClave(clave)}: <span className="font-semibold">{pct(c)} %</span>{' '}
                    <span className="text-xs text-slate-400">
                      ({c.aciertos}/{c.total})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

export default function EvolucionNiveles({
  niveles,
  bloques,
  claves,
  dominados,
  porcentajeDominio,
  distribucionPorNivel,
}: {
  niveles: string[]
  bloques: BloqueNivel[]
  claves: FilaClaveNivel[]
  dominados: string[]
  porcentajeDominio: number
  distribucionPorNivel: Record<string, DistribucionAyuda[]>
}) {
  const conAyudas = niveles.filter((n) => distribucionPorNivel[n]?.length)
  const [nivelAyudas, setNivelAyudas] = useState(conAyudas.at(-1) ?? '')

  return (
    <div className="space-y-4">
      <Resumen niveles={niveles} bloques={bloques} dominados={dominados} />
      {bloques.length ? (
        <>
          <Curva
            titulo="Curva de aprendizaje · oyente (toca la opción)"
            bloques={bloques.filter((b) => !b.nivel.endsWith(SUFIJO_HABLANTE))}
            porcentajeDominio={porcentajeDominio}
          />
          <Curva
            titulo="Curva de aprendizaje · hablante (dice la relación)"
            bloques={bloques.filter((b) => b.nivel.endsWith(SUFIJO_HABLANTE))}
            porcentajeDominio={porcentajeDominio}
          />
          <Claves niveles={niveles} filas={claves} />
          {conAyudas.length > 0 && (
            <Panel className="space-y-3 p-4 sm:p-5">
              <div className="flex flex-wrap gap-2">
                {conAyudas.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNivelAyudas(n)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      nivelAyudas === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <DistribucionAyudasChart
                distribucion={distribucionPorNivel[nivelAyudas] ?? []}
                titulo={`Distribución de ayudas en Entrenamiento — ${nivelAyudas}`}
              />
            </Panel>
          )}
        </>
      ) : (
        <p className="py-8 text-center text-slate-500">Todavía no hay bloques registrados.</p>
      )}
    </div>
  )
}
