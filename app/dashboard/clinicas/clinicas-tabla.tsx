'use client'

import { useState, useMemo } from 'react'
import ClinicaRow from './clinica-row'
import { descargarCSV } from '@/utils/csv'

type Clinica = {
  id: string
  nombre: string
  logo_url: string | null
  estado_suscripcion: string
  precio_fijo_mensual: number
  precio_por_alumno: number
  activa: boolean
  sin_facturacion: boolean
  telefono: string | null
  ciudad: string | null
  pais: string | null
  admin_nombre: string | null
  admin_email: string | null
}

export default function ClinicasTabla({ clinicas }: { clinicas: Clinica[] }) {
  const [busqueda, setBusqueda] = useState('')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return clinicas
    return clinicas.filter((c) => c.nombre.toLowerCase().includes(q))
  }, [clinicas, busqueda])

  const exportar = () => {
    const filas = filtradas.map((c) => ({
      Nombre: c.nombre,
      Estado: c.activa ? 'Activa' : 'Archivada',
      'Estado suscripción': c.estado_suscripcion,
      'Cuota fija': c.precio_fijo_mensual,
      'Precio por alumno': c.precio_por_alumno,
      'Sin facturación': c.sin_facturacion ? 'Sí' : 'No',
      Admin: c.admin_nombre ?? '—',
      Email: c.admin_email ?? '—',
      Teléfono: c.telefono ?? '—',
      Ciudad: c.ciudad ?? '—',
      País: c.pais ?? '—',
    }))
    descargarCSV(`clinicas-${new Date().toISOString().split('T')[0]}.csv`, filas)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar clínica por nombre..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <button
          onClick={exportar}
          disabled={filtradas.length === 0}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40 whitespace-nowrap"
        >
          Exportar CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Cuota fija</th>
              <th className="p-3">Por alumno</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((c) => (
              <ClinicaRow key={c.id} clinica={c} />
            ))}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            {clinicas.length === 0 ? 'Todavía no hay clínicas creadas.' : 'Ninguna clínica coincide con la búsqueda.'}
          </p>
        )}
      </div>
    </div>
  )
}