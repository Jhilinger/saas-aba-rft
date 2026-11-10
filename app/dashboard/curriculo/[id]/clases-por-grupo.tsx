'use client'

import { useState, type ComponentProps } from 'react'
import ClaseRftBaseCard from './clase-rft-base-card'
import MiniaturaEstimulo from '../../miniatura-estimulo'
import { urlImagen } from '../../tomar-datos/rft/[programaId]/pantalla-tablet'

type PropsTarjeta = Omit<ComponentProps<typeof ClaseRftBaseCard>, 'clase'>
type Clase = ComponentProps<typeof ClaseRftBaseCard>['clase']

const natural = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true })

// Clases de la plantilla en dos vistas:
// - Revisión: cada grupo es una tabla (clases en filas, posiciones en
//   columnas) con la imagen o figura de cada estímulo, todos los grupos a la vista.
// - Editar: una pestaña por grupo con las tarjetas de edición.
export default function ClasesPorGrupo({ clases, ...props }: PropsTarjeta & { clases: Clase[] }) {
  const grupos = [...new Set(clases.map((c) => c.grupo))].sort(natural)
  const [vista, setVista] = useState<'revision' | 'editar'>('revision')
  const [grupo, setGrupo] = useState(grupos[0] ?? '')
  const posiciones = [...new Set(clases.flatMap((c) => c.estimulos_rft_base.map((e) => e.posicion).filter((p): p is string => !!p)))].sort()
  const imagenes = props.imagenes ?? {}
  const delGrupo = (g: string) => clases.filter((c) => c.grupo === g).sort((a, b) => natural(a.nombre, b.nombre))

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-sm">
        {(
          [
            ['revision', 'Revisión'],
            ['editar', 'Editar clases'],
          ] as const
        ).map(([v, texto]) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`rounded-md px-3 py-1.5 font-medium ${vista === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {texto}
          </button>
        ))}
      </div>

      {vista === 'revision' ? (
        <div className="space-y-5">
          {grupos.map((g) => (
            <div key={g} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{g}</p>
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="w-20 px-3 py-2 font-medium">Clase</th>
                    {posiciones.map((p) => (
                      <th key={p} className="px-3 py-2 font-medium">
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {delGrupo(g).map((c) => (
                    <tr key={c.id}>
                      <td className="px-3 py-2 font-medium text-slate-700">{c.nombre}</td>
                      {posiciones.map((p) => {
                        const e = c.estimulos_rft_base.find((x) => x.posicion === p)
                        const foto = e ? urlImagen(imagenes, e.concepto_imagen, 'entrenamiento', 0) : null
                        return (
                          <td key={p} className="px-3 py-2 align-middle">
                            {e ? (
                              <span className="flex items-center gap-2">
                                {foto ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={foto} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-contain" />
                                ) : (
                                  <MiniaturaEstimulo pantalla={e.pantalla} imagenes={imagenes} />
                                )}
                                <span className="text-slate-700">{e.nombre}</span>
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {grupos.map((g) => (
              <button
                key={g}
                onClick={() => setGrupo(g)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${g === grupo ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {delGrupo(grupo).map((c) => (
              <ClaseRftBaseCard key={c.id} clase={c} {...props} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
