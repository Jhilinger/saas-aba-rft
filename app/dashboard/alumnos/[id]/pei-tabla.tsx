'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Panel } from '../../../ui'

type Programa = {
  id: string
  nombre: string
  tipo: string
  estado: string
  fecha_inicio: string
  codigo: string | null
  excepcion_secuencia: string | null
  dominioId: string | null
}

type Nivel = {
  numero: number
  nombre: string
  dominios: { id: string; codigo: string; nombre: string }[]
}

const ESTADOS: Record<string, { label: string; color: string }> = {
  linea_base: { label: 'Línea base', color: 'bg-sky-50 text-sky-700' },
  adquisicion: { label: 'En adquisición', color: 'bg-amber-50 text-amber-700' },
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-teal-50 text-teal-700' },
  pausado: { label: 'Pausado', color: 'bg-slate-100 text-slate-500' },
}

function FilaPrograma({ p }: { p: Programa }) {
  const estado = ESTADOS[p.estado] ?? { label: p.estado, color: 'bg-slate-100 text-slate-600' }
  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:px-5 ${p.estado === 'pausado' ? 'opacity-50' : ''}`}
    >
      <span className="w-14 shrink-0 font-mono text-xs text-slate-500">{p.codigo ?? '—'}</span>
      <Link
        href={p.tipo === 'rft' ? `/dashboard/programas-rft/${p.id}` : `/dashboard/programas/${p.id}`}
        className="min-w-0 flex-1 font-medium text-slate-800 hover:underline"
      >
        {p.nombre}
      </Link>
      {/* En móvil, las etiquetas bajan a su propia línea bajo el nombre */}
      <div className="flex w-full flex-wrap items-center gap-2 pl-[4.25rem] sm:w-auto sm:pl-0">
        {p.excepcion_secuencia && (
          <span
            title={`Asignado fuera de secuencia: ${p.excepcion_secuencia}`}
            className="cursor-help rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap"
          >
            Excepción
          </span>
        )}
        <span className="text-xs text-slate-500 whitespace-nowrap">{p.tipo === 'rft' ? 'Relacional' : 'Directo'}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${estado.color}`}>
          {estado.label}
        </span>
        <span className="w-20 text-right text-xs text-slate-400 tabular-nums whitespace-nowrap">
          {new Date(p.fecha_inicio).toLocaleDateString('es-ES')}
        </span>
      </div>
    </li>
  )
}

// PEI agrupado como el progreso y la valoración: Nivel → Dominio → programas
// (en orden del currículo), y al final los complementarios
export default function PeiTabla({ programas, niveles }: { programas: Programa[]; niveles: Nivel[] }) {
  const [mostrarPausados, setMostrarPausados] = useState(false)

  const visibles = useMemo(
    () => (mostrarPausados ? programas : programas.filter((p) => p.estado !== 'pausado')),
    [programas, mostrarPausados]
  )
  const numPausados = programas.filter((p) => p.estado === 'pausado').length

  const porDominio = useMemo(() => {
    const m = new Map<string, Programa[]>()
    for (const p of visibles) if (p.dominioId) m.set(p.dominioId, [...(m.get(p.dominioId) ?? []), p])
    return m
  }, [visibles])
  const complementarios = visibles.filter((p) => !p.dominioId)

  return (
    <div className="space-y-4">
      {numPausados > 0 && (
        <div className="flex justify-end text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={mostrarPausados} onChange={(e) => setMostrarPausados(e.target.checked)} />
            Mostrar pausados ({numPausados})
          </label>
        </div>
      )}

      {niveles.map((n) => {
        const dominios = n.dominios.filter((d) => porDominio.has(d.id))
        if (dominios.length === 0) return null
        return (
          <section key={n.numero} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Nivel {n.numero} · <span className="normal-case tracking-normal">{n.nombre}</span>
            </h3>
            <Panel className="overflow-hidden">
              {dominios.map((d) => (
                <div key={d.id} className="border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 text-sm sm:px-5">
                    <span className="font-mono text-xs text-indigo-600">{d.codigo}</span>
                    <span className="min-w-0 flex-1 font-medium text-slate-700">{d.nombre}</span>
                    <span className="text-xs text-slate-500">{porDominio.get(d.id)!.length}</span>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {porDominio.get(d.id)!.map((p) => (
                      <FilaPrograma key={p.id} p={p} />
                    ))}
                  </ul>
                </div>
              ))}
            </Panel>
          </section>
        )
      })}

      {complementarios.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Programas complementarios</h3>
          <Panel className="overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {complementarios
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((p) => (
                  <FilaPrograma key={p.id} p={p} />
                ))}
            </ul>
          </Panel>
        </section>
      )}

      {visibles.length === 0 && (
        <Panel className="p-6 text-center text-slate-500">
          {programas.length === 0
            ? 'Este alumno todavía no tiene programas asignados.'
            : 'Todos los programas están pausados. Marca "Mostrar pausados" para verlos.'}
        </Panel>
      )}
    </div>
  )
}
