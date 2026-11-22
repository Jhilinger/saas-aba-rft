'use client'

import type { AccionPaso, Paso, TipoPaso } from './siguiente-paso'

// «Siguiente paso»: lo que la app propone hacer con los datos del programa (ver
// siguiente-paso.ts). Con onPreparar, los pasos que proponen un bloque concreto
// tienen un botón que lo deja preparado en la toma de datos.

const ESTILO: Record<TipoPaso, { icono: string; color: string }> = {
  operante_generalizada: { icono: '🎯', color: 'border-emerald-200 bg-emerald-50' },
  sonda_generalizacion: { icono: '🔎', color: 'border-emerald-200 bg-emerald-50' },
  sonda_mantenimiento: { icono: '🗓', color: 'border-emerald-200 bg-emerald-50' },
  probar_hablante: { icono: '🗣', color: 'border-sky-200 bg-sky-50' },
  probar_oyente: { icono: '👂', color: 'border-sky-200 bg-sky-50' },
  repetir_test: { icono: '↻', color: 'border-sky-200 bg-sky-50' },
  probar_fichas: { icono: '🃏', color: 'border-amber-200 bg-amber-50' },
  entrenar_direccion: { icono: '🧩', color: 'border-amber-200 bg-amber-50' },
  estancado: { icono: '⏸', color: 'border-amber-200 bg-amber-50' },
  mas_ejemplares_clave: { icono: '⚖', color: 'border-amber-200 bg-amber-50' },
  mas_orden_inverso: { icono: '⇄', color: 'border-amber-200 bg-amber-50' },
  volver_paso_anterior: { icono: '↩', color: 'border-rose-200 bg-rose-50' },
}

export default function PanelSiguientePaso({
  pasos,
  grupo,
  onPreparar,
  titulo = 'Siguiente paso',
}: {
  pasos: Paso[]
  // Solo los pasos de este grupo y los del programa (null: todos)
  grupo?: string | null
  onPreparar?: (accion: AccionPaso) => void
  titulo?: string
}) {
  const visibles = grupo ? pasos.filter((p) => p.grupo === null || p.grupo === grupo) : pasos
  if (!visibles.length) return null
  return (
    <div className="space-y-2 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{titulo}</p>
      {visibles.map((p, i) => (
        <div key={`${p.tipo}-${p.grupo}-${i}`} className={`rounded-xl border p-3 ${ESTILO[p.tipo].color}`}>
          <p className="text-sm font-semibold text-slate-800">
            <span className="mr-1.5" aria-hidden>
              {ESTILO[p.tipo].icono}
            </span>
            {p.grupo && !grupo && <span className="text-slate-500">{p.grupo} · </span>}
            {p.titulo}
          </p>
          <p className="mt-1 text-sm text-slate-600">{p.detalle}</p>
          {p.accion && onPreparar && (
            <button
              type="button"
              onClick={() => onPreparar(p.accion!)}
              className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Preparar este bloque →
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
