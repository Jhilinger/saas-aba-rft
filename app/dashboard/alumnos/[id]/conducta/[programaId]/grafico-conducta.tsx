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
} from 'recharts'
import { useMemo, useRef } from 'react'

type Punto = { fecha: string; valor: number; fase: 'linea_base' | 'intervencion' }

function calcularTendencia(puntos: { x: number; y: number }[], min: number, max: number) {
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
    { x: xMin, y: Math.max(min, Math.min(max, pendiente * xMin + interseccion)) },
    { x: xMax, y: Math.max(min, Math.min(max, pendiente * xMax + interseccion)) },
  ]
}

export default function GraficoConducta({
  puntos,
  etiquetaY,
  direccionObjetivo,
  titulo,
  dominioYFijo,
}: {
  puntos: Punto[]
  etiquetaY: string
  direccionObjetivo: 'aumentar' | 'reducir' | null
  titulo?: string
  dominioYFijo?: [number, number]
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
          <title>${titulo ?? 'Gráfico'}</title>
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
    const { lineaBase, intervencion, tendencia, maxSesion } = useMemo(() => {
    const ordenados = [...puntos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    const conIndice = ordenados.map((p, i) => ({ ...p, x: i + 1 }))

    const lineaBase = conIndice.filter((p) => p.fase === 'linea_base').map((p) => ({ x: p.x, y: p.valor }))
    const intervencion = conIndice.filter((p) => p.fase === 'intervencion').map((p) => ({ x: p.x, y: p.valor }))

    const [minY, maxY] = dominioYFijo ?? [0, Math.max(100, ...conIndice.map((p) => p.valor))]
    const tendencia = calcularTendencia(intervencion, minY, maxY)

    return { lineaBase, intervencion, tendencia, maxSesion: conIndice.length }
  }, [puntos, dominioYFijo])

  if (puntos.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">Todavía no hay bloques registrados para graficar.</p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {direccionObjetivo && (
          <p className="text-xs font-medium text-slate-500">
            {direccionObjetivo === 'reducir' ? '↓ El progreso es que baje' : '↑ El progreso es que suba'}
          </p>
        )}
        <button onClick={imprimir} className="text-xs font-medium text-indigo-600 hover:underline">
          🖨️ Imprimir gráfico
        </button>
      </div>

      <div ref={chartRef}>
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[1, Math.max(maxSesion, 1)]}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                label={{ value: 'Bloque', position: 'insideBottom', offset: -5, fontSize: 12 }}
              />
              <YAxis
                domain={dominioYFijo ?? ['auto', 'auto']}
                tick={{ fontSize: 12 }}
                label={{ value: etiquetaY, angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 20 }} />

              {lineaBase.length > 0 && (
                <Line
                  data={lineaBase}
                  dataKey="y"
                  name={intervencion.length > 0 ? `${titulo ?? 'Valor'} (línea base)` : titulo ?? 'Valor'}
                  type="linear"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: '#fff', stroke: '#4f46e5', strokeWidth: 2 }}
                  connectNulls
                  legendType={intervencion.length > 0 ? 'none' : 'line'}
                />
              )}

              {intervencion.length > 0 && (
                <Line
                  data={intervencion}
                  dataKey="y"
                  name={titulo ?? 'Valor'}
                  type="linear"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}

              {tendencia.length === 2 && (
                <Line
                  data={tendencia}
                  dataKey="y"
                  name="Tendencia"
                  type="linear"
                  stroke="#4f46e5"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  legendType="none"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}