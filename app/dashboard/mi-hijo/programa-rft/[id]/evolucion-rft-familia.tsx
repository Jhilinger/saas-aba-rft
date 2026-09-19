'use client'

import { useState } from 'react'
import EvolucionRftChart from '../../../programas-rft/[id]/evolucion-rft-chart'
import DistribucionAyudasChart from '../../../distribucion-ayudas-chart'
import type { DistribucionAyuda } from '../../../ayuda-tipos'
import { Panel } from '../../../../ui'

type Punto = { fecha: string; porcentaje: number }
type Serie = { id: string; label: string; grupo: string; bloques: Punto[] }
type PorFase = Record<string, Serie[]>
type DominioFase = {
  grupo: string
  fase: string
  posicion_origen: string
  posicion_destino: string
  dominado: boolean
}

const NOMBRES_FASE: Record<string, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test de vínculo mutuo',
  test_combinatorio: 'Test de vínculo combinatorio',
  transformacion_funciones: 'Transformación de funciones',
  generalizacion: 'Sonda de generalización',
  mantenimiento: 'Sonda de mantenimiento',
}

export default function EvolucionRftFamilia({
  grupos,
  porFase,
  distribucionPorGrupo,
  dominioFases,
  porcentajeDominio,
}: {
  grupos: string[]
  porFase: PorFase
  distribucionPorGrupo: Record<string, DistribucionAyuda[]>
  dominioFases: DominioFase[]
  porcentajeDominio: number
}) {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(grupos[0] ?? '')

  if (grupos.length === 0) {
    return <p className="text-center text-slate-500 py-8">Todavía no hay datos registrados.</p>
  }

  const porFaseFiltrado: PorFase = {}
  for (const fase of Object.keys(porFase)) {
    const seriesDelGrupo = porFase[fase].filter((s) => s.grupo === grupoSeleccionado)
    if (seriesDelGrupo.length > 0) porFaseFiltrado[fase] = seriesDelGrupo
  }

  const dominioDelGrupo = dominioFases.filter((d) => d.grupo === grupoSeleccionado)

  return (
    <div className="space-y-4">
      {grupos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoSeleccionado(g)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                g === grupoSeleccionado ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {dominioDelGrupo.length > 0 && (
        <Panel className="p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Dominio por fase — {grupoSeleccionado}</p>
          <ul className="space-y-1">
            {dominioDelGrupo.map((d, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="text-slate-600">
                  {NOMBRES_FASE[d.fase] ?? d.fase}: {d.posicion_origen}→{d.posicion_destino}
                </span>
                {d.dominado ? (
                  <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                    ✓ Dominado
                  </span>
                ) : (
                  <span className="self-start sm:self-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                    En progreso
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel className="p-3 sm:p-5">
        <EvolucionRftChart porFase={porFaseFiltrado} porcentajeDominio={porcentajeDominio} />
      </Panel>

      <Panel className="p-4 sm:p-5">
        <DistribucionAyudasChart
          distribucion={distribucionPorGrupo[grupoSeleccionado] ?? []}
          titulo={`Distribución de ayudas en Entrenamiento — ${grupoSeleccionado}`}
        />
      </Panel>
    </div>
  )
}
