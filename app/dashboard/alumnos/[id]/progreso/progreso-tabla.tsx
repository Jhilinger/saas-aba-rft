'use client'

import { useState, useMemo } from 'react'

type Fila = {
  id: string
  nombre: string
  tipo: string
  area: string
  orden: number
  estado: 'dominado' | 'adquisicion' | 'sin_ensenar'
}

type ClaveOrden = 'orden' | 'nombre' | 'tipo' | 'area' | 'estado'

const ETIQUETA_TIPO: Record<string, string> = {
  aba_clasico: 'Aprendizaje Directo',
  rft: 'Aprendizaje Relacional',
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string; rango: number }> = {
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700', rango: 2 },
  adquisicion: { label: 'En adquisición', color: 'bg-amber-50 text-amber-700', rango: 1 },
  sin_ensenar: { label: 'Sin enseñar', color: 'bg-slate-100 text-slate-500', rango: 0 },
}

const POR_PAGINA = 20

function flechaOrden(activa: boolean, dir: 'asc' | 'desc') {
  if (!activa) return null
  return <span className="ml-1">{dir === 'asc' ? '▲' : '▼'}</span>
}

export default function ProgresoTabla({ filas }: { filas: Fila[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
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

  const totales = useMemo(
    () => ({
      dominado: filas.filter((f) => f.estado === 'dominado').length,
      adquisicion: filas.filter((f) => f.estado === 'adquisicion').length,
      sin_ensenar: filas.filter((f) => f.estado === 'sin_ensenar').length,
    }),
    [filas]
  )

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return filas.filter((f) => {
      if (q && !f.nombre.toLowerCase().includes(q)) return false
      if (filtroTipo !== 'todos' && f.tipo !== filtroTipo) return false
      if (filtroEstado !== 'todos' && f.estado !== filtroEstado) return false
      return true
    })
  }, [filas, busqueda, filtroTipo, filtroEstado])

  const ordenadas = useMemo(() => {
    const copia = [...filtradas]
    copia.sort((a, b) => {
      let va: string | number
      let vb: string | number
      if (claveOrden === 'estado') {
        va = ETIQUETA_ESTADO[a.estado].rango
        vb = ETIQUETA_ESTADO[b.estado].rango
      } else if (claveOrden === 'orden') {
        va = a.orden
        vb = b.orden
      } else {
        va = String(a[claveOrden]).toLowerCase()
        vb = String(b[claveOrden]).toLowerCase()
      }
      if (va < vb) return direccion === 'asc' ? -1 : 1
      if (va > vb) return direccion === 'asc' ? 1 : -1
      return 0
    })
    return copia
  }, [filtradas, claveOrden, direccion])

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginadas = ordenadas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

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
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totales.dominado}</p>
          <p className="text-xs text-slate-500">Dominados</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{totales.adquisicion}</p>
          <p className="text-xs text-slate-500">En adquisición</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-slate-500">{totales.sin_ensenar}</p>
          <p className="text-xs text-slate-500">Sin enseñar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPagina(1)
          }}
          placeholder="Buscar programa..."
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value)
            setPagina(1)
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        >
          <option value="todos">Todos los tipos</option>
          <option value="aba_clasico">Aprendizaje Directo</option>
          <option value="rft">Aprendizaje Relacional</option>
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value)
            setPagina(1)
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        >
          <option value="todos">Todos los estados</option>
          <option value="dominado">Dominado</option>
          <option value="adquisicion">En adquisición</option>
          <option value="sin_ensenar">Sin enseñar</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              {th('orden', '#')}
              {th('nombre', 'Programa')}
              {th('tipo', 'Tipo')}
              {th('area', 'Área')}
              {th('estado', 'Estado')}
            </tr>
          </thead>
          <tbody>
            {paginadas.map((f) => (
              <tr key={f.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 text-slate-400">{f.orden < 999999 ? f.orden : '—'}</td>
                <td className="p-3 font-medium text-slate-800">{f.nombre}</td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{ETIQUETA_TIPO[f.tipo] ?? f.tipo}</td>
                <td className="p-3 text-slate-600">{f.area}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[f.estado].color}`}>
                    {ETIQUETA_ESTADO[f.estado].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ordenadas.length === 0 && (
          <p className="p-6 text-center text-slate-400">
            {filas.length === 0 ? 'No hay programas en el currículo todavía.' : 'Ningún programa coincide con los filtros.'}
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
            Página {paginaActual} de {totalPaginas} ({ordenadas.length} en total)
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