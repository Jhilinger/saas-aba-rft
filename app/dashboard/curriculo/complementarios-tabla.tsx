'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ProgramaRowActions from './row-actions'
import { origenBadge, tipoBadge, type Programa } from './curriculo-tabla'
import { Panel } from '../../ui'

// Programas complementarios (de la clínica o privados de un terapeuta):
// fuera del currículo, sin código ni posición; se agrupan por área libre
export default function ComplementariosTabla({
  programas,
  miPerfilId,
  miRol,
}: {
  programas: (Programa & { area: string })[]
  miPerfilId: string
  miRol: string
}) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const puedeGestionar = (p: Programa) => p.creado_por === miPerfilId || miRol === 'clinica_admin'

  const porArea = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const mapa = new Map<string, typeof programas>()
    for (const p of programas) {
      if (filtroTipo && p.tipo !== filtroTipo) continue
      if (texto && !p.nombre.toLowerCase().includes(texto)) continue
      const area = p.area.trim() || 'Sin área'
      mapa.set(area, [...(mapa.get(area) ?? []), p])
    }
    return [...mapa.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([area, lista]) => [area, lista.sort((a, b) => a.nombre.localeCompare(b.nombre))] as const)
  }, [programas, busqueda, filtroTipo])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="aba_clasico">Aprendizaje Directo</option>
          <option value="rft">Aprendizaje Relacional</option>
        </select>
      </div>

      {porArea.map(([area, lista]) => (
        <section key={area} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {area} <span className="font-normal normal-case tracking-normal">({lista.length})</span>
          </h2>
          <Panel className="overflow-hidden">
            {lista.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-100 px-4 py-2.5 text-sm last:border-0 hover:bg-slate-50"
              >
                <Link
                  href={`/dashboard/curriculo/${p.id}`}
                  className={`min-w-0 flex-1 font-medium hover:underline ${p.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}
                >
                  {p.nombre}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  {tipoBadge(p)}
                  {origenBadge(p)}
                  {!p.activo && <span className="text-xs text-slate-500">Inactivo</span>}
                  {puedeGestionar(p) && <ProgramaRowActions id={p.id} activo={p.activo} />}
                </div>
              </div>
            ))}
          </Panel>
        </section>
      ))}

      {porArea.length === 0 && (
        <p className="p-6 text-center text-slate-500">
          {programas.length === 0 ? 'Todavía no hay programas complementarios.' : 'Ningún programa coincide con la búsqueda.'}
        </p>
      )}
    </div>
  )
}
