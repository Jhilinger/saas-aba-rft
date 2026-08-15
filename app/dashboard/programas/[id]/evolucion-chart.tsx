'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

type Bloque = { fecha: string; porcentaje: number }
type Conjunto = { id: string; nombre: string; estado: string; bloques: Bloque[] }

const COLORES = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

export default function EvolucionChart({
  conjuntos,
  porcentajeDominio,
}: {
  conjuntos: Conjunto[]
  porcentajeDominio: number
}) {
  // Unimos los bloques de todos los conjuntos en un único dataset,
  // indexado por número de sesión (no por fecha exacta, para que las
  // líneas de distintos conjuntos con distinto ritmo se puedan comparar).
  const maxSesiones = Math.max(...conjuntos.map((c) => c.bloques.length), 0)

  const datos = Array.from({ length: maxSesiones }, (_, i) => {
    const punto: Record<string, any> = { sesion: `#${i + 1}` }
    conjuntos.forEach((c) => {
      if (c.bloques[i]) {
        punto[c.nombre] = c.bloques[i].porcentaje
      }
    })
    return punto
  })

  if (maxSesiones === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        Todavía no hay ensayos registrados para graficar.
      </p>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="sesion" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip />
          <Legend />
          <ReferenceLine
            y={porcentajeDominio}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: `Dominio (${porcentajeDominio}%)`, fontSize: 11, fill: '#64748b' }}
          />
          {conjuntos.map((c, i) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.nombre}
              stroke={COLORES[i % COLORES.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}