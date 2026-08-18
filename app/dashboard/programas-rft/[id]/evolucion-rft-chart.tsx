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

type Punto = { fecha: string; porcentaje: number }
type Serie = { id: string; label: string; grupo: string; bloques: Punto[] }
type PorFase = Record<string, Serie[]>

const COLORES = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

const NOMBRES_FASE: Record<string, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test de vínculo mutuo',
  test_combinatorio: 'Test de vínculo combinatorio',
  directo: 'Directo (abstracción de marco)',
  transformacion_funciones: 'Transformación de funciones',
}

function GraficoFase({
  titulo,
  series,
  porcentajeDominio,
}: {
  titulo: string
  series: Serie[]
  porcentajeDominio: number
}) {
  const maxSesiones = Math.max(...series.map((s) => s.bloques.length), 0)

  const datos = Array.from({ length: maxSesiones }, (_, i) => {
    const punto: Record<string, any> = { sesion: `#${i + 1}` }
    series.forEach((s) => {
      if (s.bloques[i]) {
        punto[s.id] = s.bloques[i].porcentaje
      }
    })
    return punto
  })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
      <h3 className="text-sm font-semibold text-slate-700">{titulo}</h3>
      <div className="h-64 w-full">
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
            {series.map((s, i) => (
              <Line
                key={s.id}
                type="linear"
                dataKey={s.id}
                name={s.label}
                stroke={COLORES[i % COLORES.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function EvolucionRftChart({
  porFase,
  porcentajeDominio,
}: {
  porFase: PorFase
  porcentajeDominio: number
}) {
  const fasesConDatos = Object.keys(porFase)

  if (fasesConDatos.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        Todavía no hay ensayos registrados para graficar.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {fasesConDatos.map((fase) => (
        <GraficoFase
          key={fase}
          titulo={NOMBRES_FASE[fase] ?? fase}
          series={porFase[fase]}
          porcentajeDominio={porcentajeDominio}
        />
      ))}
    </div>
  )
}