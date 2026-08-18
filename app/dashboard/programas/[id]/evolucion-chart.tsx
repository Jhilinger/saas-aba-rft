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
import { useMemo } from 'react'

type Punto = { fecha: string; fechaISO: string; porcentaje: number }
type Conjunto = { id: string; nombre: string; estado: string; bloques: Punto[] }

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
}: {
  conjuntos: Conjunto[]
  porcentajeDominio: number
}) {
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
    <div className="h-72 sm:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
          <Legend />
          <ReferenceLine
            y={porcentajeDominio}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: `Dominio (${porcentajeDominio}%)`, fontSize: 11, fill: '#64748b' }}
          />

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
  )
}