'use client'

import { useState } from 'react'
import Link from 'next/link'
import { descargarCSV } from '@/utils/csv'
import { Button, Panel } from '../../../../ui'

export type EstadoPrograma = 'dominado' | 'adquisicion' | 'sin_ensenar'

export type ProgramaProgreso = {
  id: string
  codigo: string | null
  nombre: string
  tipo: string
  estado: EstadoPrograma
  href: string | null
}

type DominioProgreso = {
  id: string
  codigo: string
  nombre: string
  total: number
  dominados: number
  adquisicion: number
  porcentaje: number | null
  programas: ProgramaProgreso[]
}

export type NivelProgreso = {
  numero: number
  nombre: string
  porcentaje: number | null
  dominios: DominioProgreso[]
}

const ETIQUETA_ESTADO: Record<EstadoPrograma, { label: string; color: string }> = {
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700' },
  adquisicion: { label: 'En adquisición', color: 'bg-amber-50 text-amber-700' },
  sin_ensenar: { label: 'Sin enseñar', color: 'bg-slate-100 text-slate-500' },
}

const ETIQUETA_TIPO: Record<string, string> = {
  aba_clasico: 'Aprendizaje Directo',
  rft: 'Aprendizaje Relacional',
}

// Barra apilada: dominados (verde) + en adquisición (ámbar) sobre el total
function BarraDominio({ d }: { d: DominioProgreso }) {
  const pct = (n: number) => `${(n / d.total) * 100}%`
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="bg-emerald-500" style={{ width: pct(d.dominados) }} />
      <div className="bg-amber-500" style={{ width: pct(d.adquisicion) }} />
    </div>
  )
}

function FilaPrograma({ p }: { p: ProgramaProgreso }) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-sm">
      {p.codigo && <span className="w-14 shrink-0 font-mono text-xs text-slate-500">{p.codigo}</span>}
      {p.href ? (
        <Link href={p.href} className="min-w-0 flex-1 text-slate-800 hover:underline">
          {p.nombre}
        </Link>
      ) : (
        <span className="min-w-0 flex-1 text-slate-800">{p.nombre}</span>
      )}
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[p.estado].color}`}>
        {ETIQUETA_ESTADO[p.estado].label}
      </span>
    </li>
  )
}

export default function ProgresoCurriculo({
  niveles,
  fueraDelCurriculo,
  ocultarSinEnsenar = false,
}: {
  niveles: NivelProgreso[]
  fueraDelCurriculo: ProgramaProgreso[]
  // Vista de familia: los no enseñados cuentan en los % pero no se listan
  ocultarSinEnsenar?: boolean
}) {
  const visibles = (programas: ProgramaProgreso[]) =>
    ocultarSinEnsenar ? programas.filter((p) => p.estado !== 'sin_ensenar') : programas

  const [abiertos, setAbiertos] = useState<Set<string>>(new Set())

  const alternar = (id: string) =>
    setAbiertos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const exportar = () => {
    const filas = niveles.flatMap((n) =>
      n.dominios.flatMap((d) =>
        visibles(d.programas).map((p) => ({
          Código: p.codigo ?? '',
          Nivel: n.numero,
          Dominio: `${d.codigo} ${d.nombre}`,
          Programa: p.nombre,
          Tipo: ETIQUETA_TIPO[p.tipo] ?? p.tipo,
          Estado: ETIQUETA_ESTADO[p.estado].label,
        }))
      )
    )
    for (const p of fueraDelCurriculo) {
      filas.push({
        Código: '',
        Nivel: 0,
        Dominio: 'Fuera del currículo',
        Programa: p.nombre,
        Tipo: ETIQUETA_TIPO[p.tipo] ?? p.tipo,
        Estado: ETIQUETA_ESTADO[p.estado].label,
      })
    }
    descargarCSV(`progreso-${new Date().toISOString().split('T')[0]}.csv`, filas)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Dominado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> En adquisición
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Sin enseñar
          </span>
        </div>
        {!ocultarSinEnsenar && (
          <Button variant="secondary" onClick={exportar} className="px-3 py-1.5 text-xs font-medium">
            Exportar CSV
          </Button>
        )}
      </div>

      {niveles.map((n) =>
        n.porcentaje === null ? (
          // Nivel sin programas: una línea compacta, para no empujar hacia
          // abajo lo importante
          <div
            key={n.numero}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-xl border border-dashed border-slate-200 px-4 py-2.5 text-sm sm:px-5"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Nivel {n.numero}</span>
            <span className="text-xs text-slate-500 sm:order-last">Sin programas todavía</span>
            {/* En móvil el nombre baja a su propia línea en vez de quedar aplastado */}
            <span className="min-w-0 basis-full text-slate-600 sm:basis-0 sm:flex-1">{n.nombre}</span>
          </div>
        ) : (
        <Panel key={n.numero} className="overflow-hidden">
          <div className="space-y-2 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Nivel {n.numero}</p>
                <h3 className="font-semibold text-slate-800">{n.nombre}</h3>
              </div>
              <span className="text-2xl font-bold tabular-nums text-slate-800">{n.porcentaje}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${n.porcentaje}%` }} />
            </div>
          </div>

          <ul>
            {n.dominios.map((d) => {
              const abierto = abiertos.has(d.id)
              if (d.total === 0) {
                return (
                  <li key={d.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-sm last:border-0 sm:px-5">
                    <span className="w-8 shrink-0 font-mono text-xs text-slate-400">{d.codigo}</span>
                    <span className="min-w-0 flex-1 text-slate-500">{d.nombre}</span>
                    <span className="text-xs text-slate-500">Sin programas</span>
                  </li>
                )
              }
              return (
                <li key={d.id} className="border-b border-slate-100 last:border-0">
                  <button
                    type="button"
                    onClick={() => alternar(d.id)}
                    aria-expanded={abierto}
                    className="w-full space-y-1.5 px-4 py-2.5 text-left hover:bg-slate-50 sm:px-5"
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 shrink-0 font-mono text-xs text-indigo-600">{d.codigo}</span>
                      <span className="min-w-0 flex-1 text-slate-700">{d.nombre}</span>
                      <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {d.dominados}/{d.total}
                      </span>
                      <span className="w-10 text-right font-semibold text-slate-800 tabular-nums">{d.porcentaje}%</span>
                    </div>
                    <div className="pl-11">
                      <BarraDominio d={d} />
                    </div>
                  </button>
                  {abierto && (
                    <ul className="divide-y divide-slate-50 bg-slate-50/50 px-4 pb-2 pl-15 sm:px-5 sm:pl-16">
                      {visibles(d.programas).map((p) => (
                        <FilaPrograma key={p.id} p={p} />
                      ))}
                      {visibles(d.programas).length === 0 && (
                        <li className="py-1.5 text-sm text-slate-400">Todavía no se ha empezado ningún programa de este dominio.</li>
                      )}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </Panel>
        )
      )}

      {fueraDelCurriculo.length > 0 && (
        <Panel className="p-4 sm:p-5">
          <h3 className="font-semibold text-slate-800">Programas complementarios</h3>
          <p className="text-xs text-slate-500">Programas fuera del currículo. No cuentan en los porcentajes.</p>
          <ul className="mt-2 divide-y divide-slate-100">
            {fueraDelCurriculo.map((p) => (
              <FilaPrograma key={p.id} p={p} />
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}
