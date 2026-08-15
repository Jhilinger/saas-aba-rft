'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import ProgramaRowActions from './row-actions'

type Programa = {
  id: string
  nombre: string
  tipo: string
  tipo_relacion: string | null
  area: string
  activo: boolean
  orden: number | null
  clinica_id: string | null
  visibilidad: string
  creado_por: string
}

type ClaveOrden = 'orden' | 'nombre' | 'area' | 'tipo'

const POR_PAGINA = 10

function flechaOrden(activa: boolean, dir: 'asc' | 'desc') {
  if (!activa) return null
  return <span className="ml-1">{dir === 'asc' ? '▲' : '▼'}</span>
}

function origenBadge(p: Programa) {
  if (p.clinica_id === null) {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 whitespace-nowrap">
        Global
      </span>
    )
  }
  if (p.visibilidad === 'privado') {
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap">
        Privado
      </span>
    )
  }
  return (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
      De tu clínica
    </span>
  )
}

export default function CurriculoTabla({
  programas,
  miPerfilId,
  miRol,
}: {
  programas: Programa[]
  miPerfilId: string
  miRol: string
}) {
  const [claveOrden, setClaveOrden] = useState<ClaveOrden>('orden')
  const [direccion, setDireccion] = useState<'asc' | 'desc'>('asc')
  const [pagina, setPagina] = useState(1)

  const cambiarOrden = (clave: ClaveOrden) => {
    if (clave === claveOrden) {
      setDireccion((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setClaveOrden(clave)
      setDireccion('asc')
    }
    setPagina(1)
  }

  const puedeGestionar = (p: Programa) => {
    if (miRol === 'superadmin') return true
    if (p.clinica_id === null) return false
    return p.creado_por === miPerfilId || miRol === 'clinica_admin'
  }

  const programasOrdenados = useMemo(() => {
    const copia = [...programas]
    copia.sort((a, b) => {
      if (claveOrden === 'orden') {
        if (a.orden === null && b.orden === null) return 0
        if (a.orden === null) return 1
        if (b.orden === null) return -1
        return direccion === 'asc' ? a.orden - b.orden : b.orden - a.orden
      }

      const va = String(a[claveOrden] ?? '').toLowerCase()
      const vb = String(b[claveOrden] ?? '').toLowerCase()
      if (va < vb) return direccion === 'asc' ? -1 : 1
      if (va > vb) return direccion === 'asc' ? 1 : -1
      return 0
    })
    return copia
  }, [programas, claveOrden, direccion])

  const totalPaginas = Math.max(1, Math.ceil(programasOrdenados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginados = programasOrdenados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  )

  useEffect(() => {
    setPagina(1)
  }, [programas.length])

  const th = (clave: ClaveOrden, label: string) => (
    <th
      className="p-3 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
      onClick={() => cambiarOrden(clave)}
    >
      {label}
      {flechaOrden(claveOrden === clave, direccion)}
    </th>
  )

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              {th('orden', 'Orden')}
              {th('nombre', 'Nombre')}
              {th('tipo', 'Tipo')}
              {th('area', 'Área')}
              <th className="p-3">Origen</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 text-slate-500">{p.orden ?? '—'}</td>
                <td className="p-3 font-medium text-slate-800">
                  <Link href={`/dashboard/curriculo/${p.id}`} className="hover:underline">
                    {p.nombre}
                  </Link>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                      p.tipo === 'rft' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {p.tipo === 'rft'
                      ? `Aprendizaje Relacional · ${p.tipo_relacion ?? 'sin definir'}`
                      : 'Aprendizaje Directo'}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{p.area}</td>
                <td className="p-3">{origenBadge(p)}</td>
                <td className="p-3 text-slate-600">{p.activo ? 'Activo' : 'Inactivo'}</td>
                <td className="p-3">
                  {puedeGestionar(p) && <ProgramaRowActions id={p.id} activo={p.activo} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programasOrdenados.length === 0 && (
          <p className="p-6 text-center text-slate-400">Todavía no hay programas en el currículo.</p>
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
            Página {paginaActual} de {totalPaginas} ({programasOrdenados.length} en total)
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