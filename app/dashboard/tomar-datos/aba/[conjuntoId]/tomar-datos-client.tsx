'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueAba } from './actions'

type Estimulo = { id: string; nombre: string }

type EnsayoRegistrado = {
  estimuloId: string
  estimuloNombre: string
  correcto: boolean
  ayuda: string
}

const AYUDAS = [
  { value: 'verbal', label: 'Verbal' },
  { value: 'verbal_parcial', label: 'Verbal parcial' },
  { value: 'gestual', label: 'Gestual' },
  { value: 'visual', label: 'Visual' },
  { value: 'modelado', label: 'Modelado' },
  { value: 'fisica_parcial', label: 'Física parcial' },
  { value: 'fisica_total', label: 'Física total' },
  { value: 'textual', label: 'Textual' },
]

function generarSecuencia(estimulos: Estimulo[], n: number): Estimulo[] {
  const k = estimulos.length
  const base = Math.floor(n / k)
  const remainder = n % k
  const barajados = [...estimulos].sort(() => Math.random() - 0.5)

  let pool: Estimulo[] = []
  barajados.forEach((e, idx) => {
    const count = base + (idx < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) pool.push(e)
  })

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  for (let i = 1; i < pool.length; i++) {
    if (pool[i].id === pool[i - 1].id) {
      const j = pool.findIndex((e, idx) => idx > i && e.id !== pool[i - 1].id)
      if (j !== -1) {
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }
  }

  return pool
}

export default function TomarDatosClient({
  conjuntoId,
  programaAlumnoId,
  alumnoId,
  estimulos,
  ensayosPorBloque,
  instrucciones,
  ayudasPosibles,
}: {
  conjuntoId: string
  programaAlumnoId: string
  alumnoId: string
  estimulos: Estimulo[]
  ensayosPorBloque: number
  instrucciones: string | null
  ayudasPosibles: string | null
}) {
  const [tamanoBloque, setTamanoBloque] = useState<number>(ensayosPorBloque)
  const [secuencia, setSecuencia] = useState<Estimulo[] | null>(null)
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  const [ensayos, setEnsayos] = useState<EnsayoRegistrado[]>([])
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{ porcentaje: number; dominioLogrado: boolean } | null>(null)
  const router = useRouter()

  const empezarBloque = () => {
    setSecuencia(generarSecuencia(estimulos, tamanoBloque))
    setEnsayos([])
    setNotas('')
    setResultado(null)
  }

  const registrar = (correcto: boolean, ayuda: string) => {
    if (!secuencia) return
    const actual = secuencia[ensayos.length]
    const nuevos = [
      ...ensayos,
      { estimuloId: actual.id, estimuloNombre: actual.nombre, correcto, ayuda },
    ]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)

    if (nuevos.length === secuencia.length) {
      startTransition(async () => {
        const res = await guardarBloqueAba(
          conjuntoId,
          programaAlumnoId,
          alumnoId,
          nuevos.map(({ estimuloId, correcto, ayuda }) => ({ estimuloId, correcto, ayuda })),
          notas
        )
        if (res.error) {
          alert('Error: ' + res.error)
          return
        }
        setResultado({ porcentaje: res.porcentaje ?? 0, dominioLogrado: res.dominioLogrado ?? false })
      })
    }
  }

  const deshacerUltimo = () => {
    setEnsayos((prev) => prev.slice(0, -1))
  }

  if (resultado) {
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${
        resultado.dominioLogrado
          ? 'border-amber-300 bg-amber-50'
          : 'border-emerald-200 bg-emerald-50'
      }`}>
        {resultado.dominioLogrado && (
          <p className="text-2xl">🎉</p>
        )}
        <p className={`text-base sm:text-lg font-semibold ${
          resultado.dominioLogrado ? 'text-amber-800' : 'text-emerald-800'
        }`}>
          {resultado.dominioLogrado
            ? '¡Dominio conseguido! Este conjunto acaba de superar el criterio'
            : `Bloque guardado — ${resultado.porcentaje}% de acierto independiente`}
        </p>
        {resultado.dominioLogrado && (
          <p className="text-sm text-amber-700">{resultado.porcentaje}% de acierto en este último bloque</p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              setResultado(null)
              setSecuencia(null)
            }}
            className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Registrar otro bloque
          </button>
          <button
            onClick={() => router.push(`/dashboard/programas/${programaAlumnoId}`)}
            className="rounded-lg bg-slate-100 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Volver al programa
          </button>
        </div>
      </div>
    )
  }

  if (!secuencia) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <p className="text-sm font-medium text-slate-600">Tamaño del bloque</p>
        <div className="flex gap-2">
          {[10, 20].map((n) => (
            <button
              key={n}
              onClick={() => setTamanoBloque(n)}
              className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                tamanoBloque === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {n} ensayos
            </button>
          ))}
        </div>
        <button
          onClick={empezarBloque}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700"
        >
          Generar secuencia y empezar
        </button>
      </div>
    )
  }

  const estimuloActual = secuencia[ensayos.length]

  if (!estimuloActual) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">Guardando bloque...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Ensayo <strong>{ensayos.length + 1}</strong> / {secuencia.length}
        </span>
        {ensayos.length > 0 && (
          <button onClick={deshacerUltimo} className="text-rose-500 hover:text-rose-700">
            Deshacer último
          </button>
        )}
      </div>

      {(instrucciones || ayudasPosibles) && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-2">
          {instrucciones && (
            <div>
              <strong>Instrucciones:</strong>
              <p className="whitespace-pre-wrap">{instrucciones}</p>
            </div>
          )}
          {ayudasPosibles && (
            <div>
              <strong>Ayudas sugeridas:</strong>
              <p className="whitespace-pre-wrap">{ayudasPosibles}</p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
        <p className="text-xl sm:text-2xl font-bold text-slate-800">{estimuloActual.nombre}</p>

        {!mostrandoAyudas ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => registrar(true, 'independiente')}
              disabled={isPending}
              className="flex-1 rounded-lg bg-emerald-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
            >
              ✓ Correcto sin ayuda
            </button>
            <button
              onClick={() => setMostrandoAyudas(true)}
              disabled={isPending}
              className="flex-1 rounded-lg bg-amber-500 py-4 sm:py-3 text-base font-semibold text-white hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98]"
            >
              ✓ Correcto con ayuda
            </button>
            <button
              onClick={() => registrar(false, 'independiente')}
              disabled={isPending}
              className="flex-1 rounded-lg bg-rose-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-rose-500 disabled:opacity-50 active:scale-[0.98]"
            >
              ✗ Incorrecto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">¿Qué tipo de ayuda?</p>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
              {AYUDAS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => registrar(true, a.value)}
                  disabled={isPending}
                  className="rounded-lg bg-white border border-amber-300 px-3 py-3 sm:py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 active:scale-[0.98]"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMostrandoAyudas(false)}
              className="text-sm text-slate-400 hover:text-slate-600 py-2"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-600">Notas (opcional)</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Observaciones sobre este bloque: motivación, distracciones, contexto..."
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>

      {ensayos.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-600">Ensayos registrados</p>
          <ul className="space-y-1 max-h-40 sm:max-h-48 overflow-y-auto">
            {ensayos.map((e, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>
                  {i + 1}. {e.estimuloNombre}
                  {e.ayuda !== 'independiente' ? ` (${e.ayuda})` : ''}
                </span>
                <span className={e.correcto ? 'text-emerald-600' : 'text-rose-600'}>
                  {e.correcto ? '✓' : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isPending && (
        <p className="text-center text-sm text-slate-500">Guardando bloque...</p>
      )}
    </div>
  )
}