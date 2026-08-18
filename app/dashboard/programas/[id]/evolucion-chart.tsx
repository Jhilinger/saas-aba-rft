'use client'

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useMemo, useRef } from 'react'

type Punto = { fecha: string; fechaISO: string; porcentaje: number }
type Conjunto = { id: string; nombre: string; estado: string; bloques: Punto[] }
type ConjuntoEstimulos = { id: string; nombre: string; estimulos: string[] }

const COLORES = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

function calcularTendencia(puntos: { x: number; y: number }[]) {
  const n = puntos.length
  if (n < 2) return []

  const sumX = puntos.reduce((s, p) => s + p.x, 0)
  const sumY = puntos.reduce((s, p) => s + p.y, 0)
  const sumXY = puntos.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = puntos.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return []

  const pendiente = (n * sumXY - sumX * sumY) / denom
  const interseccion = (sumY - pendiente * sumX) / n

  const xMin = Math.min(...puntos.map((p) => p.x))
  const xMax = Math.max(...puntos.map((p) => p.x))

  return [
    { x: xMin, y: Math.max(0, Math.min(100, pendiente * xMin + interseccion)) },
    { x: xMax, y: Math.max(0, Math.min(100, pendiente * xMax + interseccion)) },
  ]
}

export default function EvolucionChart({
  conjuntos,
  porcentajeDominio,
  titulo,
  estimulosPorConjunto,
}: {
  conjuntos: Conjunto[]
  porcentajeDominio: number
  titulo?: string
  estimulosPorConjunto?: ConjuntoEstimulos[]
}) {
  const chartRef = useRef<HTMLDivElement>(null)

  const imprimir = () => {
    if (!chartRef.current) return
    const contenido = chartRef.current.innerHTML
    const ventana = window.open('', '_blank')
    if (!ventana) return
    ventana.document.write(`
      <html>
        <head>
          <title>${titulo ?? 'Gráfico de evolución'}</title>
          <style>
            body { margin: 24px; font-family: sans-serif; }
            h1 { font-size: 16px; margin-bottom: 16px; color: #1e293b; }
          </style>
        </head>
        <body>
          ${titulo ? `<h1>${titulo}</h1>` : ''}
          ${contenido}
        </body>
      </html>
    `)
    ventana.document.close()
    ventana.focus()
    setTimeout(() => {
      ventana.print()
      ventana.close()
    }, 300)
  }

  const { series, maxSesion } = useMemo(() => {
    const todos = conjuntos.flatMap((c) =>
      c.bloques.map((b) => ({ ...b, conjuntoId: c.id }))
    )
    todos.sort((a, b) => new Date(a.fechaISO).getTime() - new Date(b.fechaISO).getTime())

    const conSesionGlobal = todos.map((b, i) => ({ ...b, sesionGlobal: i + 1 }))

    const series = conjuntos.map((c, i) => {
      const puntos = conSesionGlobal
        .filter((b) => b.conjuntoId === c.id)
        .map((b) => ({ x: b.sesionGlobal, y: b.porcentaje }))

      return {
        id: c.id,
        nombre: c.nombre,
        color: COLORES[i % COLORES.length],
        puntos,
        tendencia: calcularTendencia(puntos),
      }
    })

    return { series, maxSesion: conSesionGlobal.length }
  }, [conjuntos])

  const hayDatos = series.some((s) => s.puntos.length > 0)

  if (!hayDatos) {
    return (
      <p className="text-center text-slate-400 py-8">
        Todavía no hay bloques registrados para graficar.
      </p>
    )
  }
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          onClick={imprimir}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          🖨️ Imprimir gráfico
        </button>
      </div>

      <div ref={chartRef}>
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[1, Math.max(maxSesion, 1)]}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{ value: 'Sesión', position: 'insideBottom', offset: -5, fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <ReferenceLine y={porcentajeDominio} stroke="#94a3b8" strokeDasharray="4 4" />

              {series.map((s) => (
                <Line
                  key={s.id}
                  data={s.puntos}
                  dataKey="y"
                  name={s.nombre}
                  type="linear"
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}

              {series.map(
                (s) =>
                  s.tendencia.length === 2 && (
                    <Line
                      key={`${s.id}-tendencia`}
                      data={s.tendencia}
                      dataKey="y"
                      name={`${s.nombre} (tendencia)`}
                      type="linear"
                      stroke={s.color}
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      dot={false}
                      legendType="none"
                    />
                  )
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {estimulosPorConjunto && estimulosPorConjunto.length > 0 && (
          <div className="mt-3 space-y-1.5 text-sm">
            {estimulosPorConjunto.map((c, i) => (
              <div key={c.id} className="flex items-start gap-2">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORES[i % COLORES.length] }}
                />
                <span>
                  <strong className="text-slate-700">{c.nombre}:</strong>{' '}
                  <span className="text-slate-500">
                    {c.estimulos.length > 0 ? c.estimulos.join(', ') : 'sin estímulos todavía'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}