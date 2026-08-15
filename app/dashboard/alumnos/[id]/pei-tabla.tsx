'use client'

import { useState } from 'react'
import Link from 'next/link'

type Programa = {
  id: string
  nombre: string
  tipo: string
  estado: string
  fecha_inicio: string
  orden: number | null
}

const POR_PAGINA = 10

export default function PeiTabla({ programas }: { programas: Programa[] }) {
  const [pagina, setPagina] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(programas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginados = programas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Orden</th>
              <th className="p-3">Programa</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Inicio</th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 text-slate-500">{p.orden ?? '—'}</td>
                <td className="p-3 font-medium text-slate-800">
                  {p.tipo === 'aba_clasico' ? (
                    <Link href={`/dashboard/programas/${p.id}`} className="hover:underline">
                      {p.nombre}
                    </Link>
                  ) : (
                    <Link href={`/dashboard/programas-rft/${p.id}`} className="hover:underline">
                      {p.nombre}
                    </Link>
                  )}
                </td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${p.tipo === 'rft' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'}`}>
                    {p.tipo === 'rft' ? 'Aprendizaje Relacional' : 'Aprendizaje Directo'}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{p.estado}</td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{p.fecha_inicio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {programas.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            Este alumno todavía no tiene programas asignados.
          </p>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas} ({programas.length} en total)
          </span>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}