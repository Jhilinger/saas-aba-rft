'use client'

import { useState, useMemo } from 'react'
import TerapeutaActions from './terapeuta-actions'
import { descargarCSV } from '@/utils/csv'

type Terapeuta = { id: string; nombre: string; email: string; activo: boolean }

export default function TerapeutasTabla({ terapeutas }: { terapeutas: Terapeuta[] }) {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return terapeutas
    return terapeutas.filter(
      (t) => t.nombre.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    )
  }, [terapeutas, busqueda])

  const exportar = () => {
    const filas = filtrados.map((t) => ({
      Nombre: t.nombre,
      Email: t.email,
      Estado: t.activo ? 'Activo' : 'Desactivado',
    }))
    descargarCSV(`terapeutas-${new Date().toISOString().split('T')[0]}.csv`, filas)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar terapeuta por nombre o email..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <button
          onClick={exportar}
          disabled={filtrados.length === 0}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40 whitespace-nowrap"
        >
          Exportar CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((t) => (
              <tr key={t.id} className={`border-b border-slate-100 last:border-0 ${!t.activo ? 'opacity-50' : ''}`}>
                <td className="p-3 font-medium text-slate-800">
                  {t.nombre}
                  {!t.activo && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                      Desactivado
                    </span>
                  )}
                </td>
                <td className="p-3 text-slate-600">{t.email}</td>
                <td className="p-3">
                  <TerapeutaActions id={t.id} activo={t.activo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            {terapeutas.length === 0 ? 'Sin terapeutas todavía.' : 'Ningún terapeuta coincide con la búsqueda.'}
          </p>
        )}
      </div>
    </div>
  )
}