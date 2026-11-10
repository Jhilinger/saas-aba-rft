'use client'

import MiniaturaEstimulo from './miniatura-estimulo'
import { urlImagen, type ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

// Vista de revisión de las clases RFT: cada grupo es una tabla con las
// clases en filas y las posiciones en columnas (A, B, C…), con la imagen o
// figura de cada estímulo. Se usa en el currículo y en el PEI.

type EstimuloTabla = { posicion: string | null; nombre: string; concepto_imagen: string | null; pantalla?: unknown }
export type ClaseTabla = { id: string; nombre: string; grupo: string; estimulos: EstimuloTabla[] }

const natural = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true })

export default function TablaGruposClases({ clases, imagenes }: { clases: ClaseTabla[]; imagenes: ImagenesBanco }) {
  const grupos = [...new Set(clases.map((c) => c.grupo))].sort(natural)
  const posiciones = [...new Set(clases.flatMap((c) => c.estimulos.map((e) => e.posicion).filter((p): p is string => !!p)))].sort()

  return (
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
              {clases
                .filter((c) => c.grupo === g)
                .sort((a, b) => natural(a.nombre, b.nombre))
                .map((c) => (
                  <tr key={c.id}>
                    <td className="px-3 py-2 font-medium text-slate-700">{c.nombre}</td>
                    {posiciones.map((p) => {
                      const e = c.estimulos.find((x) => x.posicion === p)
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
  )
}
