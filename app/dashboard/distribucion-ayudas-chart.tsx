'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { DistribucionAyuda } from './ayuda-tipos'

export default function DistribucionAyudasChart({
  distribucion,
  titulo,
}: {
  distribucion: DistribucionAyuda[]
  titulo?: string
}) {
  if (distribucion.length === 0) {
    return (
      <p className="text-center text-slate-500 py-8">
        Todavía no hay ensayos registrados para calcular la distribución de ayudas.
      </p>
    )
  }

  const totalEnsayos = distribucion.reduce((s, d) => s + d.cantidad, 0)

  return (
    <div className="space-y-3">
      {titulo && <p className="text-sm font-semibold text-slate-700">{titulo}</p>}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribucion}
                dataKey="cantidad"
                nameKey="etiqueta"
                innerRadius="58%"
                outerRadius="90%"
                paddingAngle={2}
                stroke="none"
              >
                {distribucion.map((d) => (
                  <Cell key={d.tipo} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => {
                  const n = Number(value ?? 0)
                  return [`${n} ensayo${n === 1 ? '' : 's'} (${item.payload.porcentaje}%)`, item.payload.etiqueta]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-1.5">
          {distribucion.map((d) => (
            <li key={d.tipo} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="truncate">{d.etiqueta}</span>
              </span>
              <span className="shrink-0 font-medium text-slate-500">
                {d.porcentaje}% <span className="text-slate-500">({d.cantidad})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-slate-500">{totalEnsayos} ensayos en total</p>
    </div>
  )
}
