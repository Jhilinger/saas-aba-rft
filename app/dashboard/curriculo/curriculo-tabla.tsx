'use client'

import { useState, useMemo, useTransition, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProgramaRowActions from './row-actions'
import { moverPrograma } from './actions'
import { crearCodificador, type EstructuraCurriculo } from './estructura'
import { useToast } from '../../providers/toast-provider'
import { Panel } from '../../ui'

export type Programa = {
  id: string
  nombre: string
  tipo: string
  tipo_relacion: string | null
  dominio_id: string | null
  activo: boolean
  orden: number | null
  clinica_id: string | null
  visibilidad: string
  creado_por: string
}

const SIN_DOMINIO = 'sin-dominio'

export function origenBadge(p: Programa) {
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

export function tipoBadge(p: Programa) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
        p.tipo === 'rft' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
      }`}
    >
      {p.tipo === 'rft' ? `Relacional · ${p.tipo_relacion ?? 'sin definir'}` : 'Directo'}
    </span>
  )
}

function FlechasOrden({ id, esPrimero, esUltimo }: { id: string; esPrimero: boolean; esUltimo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const mover = (direccion: -1 | 1) =>
    startTransition(async () => {
      const res = await moverPrograma(id, direccion)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      router.refresh()
    })

  const clase =
    'flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <div className="flex">
      <button type="button" aria-label="Subir" onClick={() => mover(-1)} disabled={isPending || esPrimero} className={clase}>
        ↑
      </button>
      <button type="button" aria-label="Bajar" onClick={() => mover(1)} disabled={isPending || esUltimo} className={clase}>
        ↓
      </button>
    </div>
  )
}

export default function CurriculoTabla({
  programas,
  estructura,
  miPerfilId,
  miRol,
}: {
  programas: Programa[]
  estructura: EstructuraCurriculo
  miPerfilId: string
  miRol: string
}) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set())

  const codificador = useMemo(() => crearCodificador(estructura), [estructura])
  const filtrando = busqueda.trim() !== '' || filtroTipo !== ''

  const puedeGestionar = (p: Programa) => {
    if (miRol === 'superadmin') return true
    if (p.clinica_id === null) return false
    return p.creado_por === miPerfilId || miRol === 'clinica_admin'
  }

  // Programas agrupados por dominio, ordenados por posición
  const porDominio = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const mapa = new Map<string, Programa[]>()
    for (const p of programas) {
      if (filtroTipo && p.tipo !== filtroTipo) continue
      if (texto) {
        const codigo = codificador.codigo(p) ?? ''
        if (!p.nombre.toLowerCase().includes(texto) && !codigo.startsWith(texto)) continue
      }
      const clave = p.dominio_id ?? SIN_DOMINIO
      if (!mapa.has(clave)) mapa.set(clave, [])
      mapa.get(clave)!.push(p)
    }
    for (const lista of mapa.values()) {
      lista.sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity) || a.nombre.localeCompare(b.nombre))
    }
    return mapa
  }, [programas, busqueda, filtroTipo, codificador])

  const totalVisibles = [...porDominio.values()].reduce((n, l) => n + l.length, 0)

  const alternar = (clave: string) =>
    setAbiertos((prev) => {
      const next = new Set(prev)
      if (next.has(clave)) next.delete(clave)
      else next.add(clave)
      return next
    })

  const todasLasClaves = [...estructura.dominios.map((d) => d.id), SIN_DOMINIO]
  const todoAbierto = todasLasClaves.every((c) => abiertos.has(c) || !porDominio.has(c))

  const grupo = (clave: string, titulo: ReactNode, lista: Programa[]) => {
    // Al filtrar se muestran abiertos solo los dominios con resultados
    if (filtrando && lista.length === 0) return null
    const abierto = filtrando || abiertos.has(clave)
    const ordenables = lista.filter((p) => p.orden !== null)

    return (
      <div key={clave} className="border-b border-slate-100 last:border-0">
        <button
          type="button"
          onClick={() => alternar(clave)}
          disabled={filtrando}
          aria-expanded={abierto}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 disabled:hover:bg-transparent"
        >
          <span className={`text-xs text-slate-400 transition-transform ${abierto ? 'rotate-90' : ''}`}>▶</span>
          <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{titulo}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              lista.length ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
            }`}
          >
            {lista.length}
          </span>
        </button>

        {abierto && (
          <div className="pb-2">
            {lista.length === 0 && <p className="px-4 pb-3 pl-11 text-sm text-slate-400">Sin programas todavía.</p>}
            {lista.map((p) => {
              const codigo = codificador.codigo(p)
              const posicion = ordenables.indexOf(p)
              const reordenable = !filtrando && p.orden !== null && puedeGestionar(p)
              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm hover:bg-slate-50 sm:pl-11"
                >
                  <span className="w-14 shrink-0 font-mono text-xs text-slate-500">{codigo ?? '—'}</span>
                  <Link
                    href={`/dashboard/curriculo/${p.id}`}
                    className={`min-w-0 flex-1 font-medium hover:underline ${p.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}
                  >
                    {p.nombre}
                  </Link>
                  {/* En móvil, las etiquetas y acciones bajan a su propia línea */}
                  <div className="flex w-full flex-wrap items-center gap-2 pl-[4.25rem] sm:w-auto sm:pl-0">
                    {tipoBadge(p)}
                    {origenBadge(p)}
                    {!p.activo && <span className="text-xs text-slate-500">Inactivo</span>}
                    {reordenable && (
                      <FlechasOrden id={p.id} esPrimero={posicion === 0} esUltimo={posicion === ordenables.length - 1} />
                    )}
                    {puedeGestionar(p) && <ProgramaRowActions id={p.id} activo={p.activo} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const sinDominio = porDominio.get(SIN_DOMINIO) ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o código (ej. 2.1)..."
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
        {!filtrando && (
          <button
            type="button"
            onClick={() => setAbiertos(todoAbierto ? new Set() : new Set(todasLasClaves))}
            className="whitespace-nowrap px-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {todoAbierto ? 'Contraer todo' : 'Expandir todo'}
          </button>
        )}
      </div>

      {estructura.niveles.map((nivel) => {
        const dominios = estructura.dominios.filter((d) => d.nivel === nivel.numero)
        const grupos = dominios.map((d) =>
          grupo(
            d.id,
            <>
              <span className="mr-2 font-mono text-indigo-600">{d.codigo}</span>
              {d.nombre}
            </>,
            porDominio.get(d.id) ?? []
          )
        )
        if (filtrando && grupos.every((g) => g === null)) return null

        return (
          <section key={nivel.numero} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Nivel {nivel.numero} · <span className="normal-case tracking-normal">{nivel.nombre}</span>
            </h2>
            <Panel className="overflow-hidden">{grupos}</Panel>
          </section>
        )
      })}

      {sinDominio.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Sin clasificar</h2>
          <Panel className="overflow-hidden">
            {grupo(SIN_DOMINIO, 'Programas sin dominio asignado — edítalos para colocarlos', sinDominio)}
          </Panel>
        </section>
      )}

      {totalVisibles === 0 && (
        <p className="p-6 text-center text-slate-500">
          {filtrando ? 'Ningún programa coincide con la búsqueda.' : 'Todavía no hay programas en el currículo.'}
        </p>
      )}
    </div>
  )
}
