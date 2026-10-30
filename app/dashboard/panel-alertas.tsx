import { ALERTA } from './alertas-progreso'
import type { AlertasUnidad } from './cargar-alertas'
import { Panel } from '../ui'

// Alertas de estancamiento de un programa, con los datos que las disparan y
// la sugerencia (solo para quien diseña la intervención)
export default function PanelAlertas({ unidades }: { unidades: AlertasUnidad[] }) {
  if (unidades.length === 0) return null
  return (
    <Panel className="space-y-3 border-amber-200 bg-amber-50/60 p-4 sm:p-5">
      <p className="font-semibold text-amber-900">Alertas de progreso</p>
      <ul className="space-y-3">
        {unidades.flatMap((u) =>
          u.alertas.map((a) => (
            <li key={`${u.unidad}-${a.tipo}`} className="space-y-0.5 text-sm">
              <p className="font-medium text-slate-800">
                {ALERTA[a.tipo].titulo} <span className="font-normal text-slate-500">· {u.unidad}</span>
              </p>
              <p className="text-xs text-slate-600">{a.detalle}</p>
              <p className="text-xs text-amber-900">{ALERTA[a.tipo].sugerencia}</p>
            </li>
          ))
        )}
      </ul>
    </Panel>
  )
}
