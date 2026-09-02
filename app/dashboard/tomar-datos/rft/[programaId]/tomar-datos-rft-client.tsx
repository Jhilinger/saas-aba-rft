'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueRft } from './actions'
import VideoDiferido from '../../../video-diferido'

type Estimulo = { id: string; nombre: string; posicion: string | null }
type Clase = { id: string; nombre: string; grupo: string; estimulos_rft: Estimulo[] }

type EnsayoRft = {
  claseId: string
  claseNombre: string
  estimuloOrigenId: string
  estimuloOrigenNombre: string
  estimuloDestinoId: string
  estimuloDestinoNombre: string
  pregunta?: string
  correcto: boolean
  ayuda: string
}

const FASES = [
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'test_mutuo', label: 'Test de vínculo mutuo' },
  { value: 'test_combinatorio', label: 'Test de vínculo combinatorio' },
  { value: 'transformacion_funciones', label: 'Transformación de funciones' },
]

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

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function generarSecuenciaClases(clases: Clase[], n: number): Clase[] {
  const k = clases.length
  const base = Math.floor(n / k)
  const remainder = n % k
  const barajadas = barajar(clases)

  let pool: Clase[] = []
  barajadas.forEach((c, idx) => {
    const count = base + (idx < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) pool.push(c)
  })

  pool = barajar(pool)

  for (let i = 1; i < pool.length; i++) {
    if (pool[i].id === pool[i - 1].id) {
      const j = pool.findIndex((c, idx) => idx > i && c.id !== pool[i - 1].id)
      if (j !== -1) {
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }
  }

  return pool
}

function encontrarEstimulo(clase: Clase, posicion: string): Estimulo | undefined {
  return clase.estimulos_rft.find((e) => e.posicion === posicion)
}

export default function TomarDatosRftClient({
  programaAlumnoId,
  alumnoId,
  clases,
  ensayosPorBloqueDefecto,
  instrucciones,
  ayudasPosibles,
  videoUrl,
  grupoInicial,
}: {
  programaAlumnoId: string
  alumnoId: string
  clases: Clase[]
  ensayosPorBloqueDefecto: number
  instrucciones: string | null
  ayudasPosibles: string | null
  videoUrl: string | null
  grupoInicial?: string | null
}) {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(grupoInicial ?? null)
  const [fase, setFase] = useState('entrenamiento')
  const [posicionOrigen, setPosicionOrigen] = useState('')
  const [posicionDestino, setPosicionDestino] = useState('')
  const [tamanoBloque, setTamanoBloque] = useState(ensayosPorBloqueDefecto)
  const [secuencia, setSecuencia] = useState<Clase[] | null>(null)
  const [ensayos, setEnsayos] = useState<EnsayoRft[]>([])
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  const [preguntaActual, setPreguntaActual] = useState('')
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{ porcentaje: number; clasesDominadasAhora: string[] } | null>(null)
  const router = useRouter()

  const grupos = [...new Set(clases.map((c) => c.grupo))]
  const clasesDelGrupo = clases.filter((c) => c.grupo === grupoSeleccionado)
  const posicionesDisponibles = [
    ...new Set(
      clasesDelGrupo.flatMap((c) => c.estimulos_rft.map((e) => e.posicion).filter(Boolean) as string[])
    ),
  ].sort()

  const clasesValidas = clasesDelGrupo.filter(
    (c) => encontrarEstimulo(c, posicionOrigen) && encontrarEstimulo(c, posicionDestino)
  )

  const claseActualId = secuencia?.[ensayos.length]?.id

  const comparativos = useMemo(() => {
    if (!secuencia) return []
    const claseActual = secuencia[ensayos.length]
    if (!claseActual) return []
    return clasesValidas
      .map((c) => ({
        claseId: c.id,
        estimulo: encontrarEstimulo(c, posicionDestino)!,
        esCorrecto: c.id === claseActual.id,
      }))
      .sort(() => Math.random() - 0.5)
    // Solo recalculamos al cambiar de ensayo, no en cada tecla pulsada
  }, [claseActualId, posicionDestino])

  const empezarBloque = () => {
    if (clasesValidas.length < 2) {
      alert('Necesitas al menos 2 clases con esas posiciones en este grupo para poder comparar.')
      return
    }
    setSecuencia(generarSecuenciaClases(clasesValidas, tamanoBloque))
    setEnsayos([])
    setNotas('')
    setResultado(null)
  }

  const registrar = (correcto: boolean, ayuda: string, pregunta?: string) => {
    if (!secuencia) return
    const claseActual = secuencia[ensayos.length]
    const origen = encontrarEstimulo(claseActual, posicionOrigen)!
    const destino = encontrarEstimulo(claseActual, posicionDestino)!

    const nuevos = [
      ...ensayos,
      {
        claseId: claseActual.id,
        claseNombre: claseActual.nombre,
        estimuloOrigenId: origen.id,
        estimuloOrigenNombre: origen.nombre,
        estimuloDestinoId: destino.id,
        estimuloDestinoNombre: destino.nombre,
        pregunta,
        correcto,
        ayuda,
      },
    ]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)
    setPreguntaActual('')

    if (nuevos.length === secuencia.length) {
      startTransition(async () => {
        const res = await guardarBloqueRft(
          programaAlumnoId,
          alumnoId,
          grupoSeleccionado!,
          fase,
          posicionOrigen,
          posicionDestino,
          clasesValidas.length,
          nuevos.map(({ claseId, estimuloOrigenId, estimuloDestinoId, pregunta, correcto, ayuda }) => ({
            claseId,
            estimuloOrigenId,
            estimuloDestinoId,
            pregunta,
            correcto,
            ayuda,
          })),
          notas
        )
        if (res.error) {
          alert('Error: ' + res.error)
          return
        }
        setResultado({ porcentaje: res.porcentaje ?? 0, clasesDominadasAhora: res.clasesDominadasAhora ?? [] })
      })
    }
  }

  const deshacerUltimo = () => setEnsayos((prev) => prev.slice(0, -1))

  if (resultado) {
    const hayDominio = resultado.clasesDominadasAhora.length > 0
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${
        hayDominio ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
      }`}>
        {hayDominio && <p className="text-2xl">🎉</p>}
        <p className={`text-base sm:text-lg font-semibold ${hayDominio ? 'text-amber-800' : 'text-emerald-800'}`}>
          {hayDominio
            ? `¡Dominio conseguido en ${resultado.clasesDominadasAhora.join(', ')}!`
            : `Bloque guardado — ${resultado.porcentaje}% de acierto`}
        </p>
        {hayDominio && (
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
            onClick={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
            className="rounded-lg bg-slate-100 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Volver al programa
          </button>
        </div>
      </div>
    )
  }

  if (!grupoSeleccionado) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <p className="text-sm font-medium text-slate-600">¿Qué grupo de clases vas a trabajar?</p>
        <div className="flex flex-wrap gap-2">
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoSeleccionado(g)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 sm:py-2 text-base sm:text-sm font-medium hover:bg-slate-50"
            >
              {g}
            </button>
          ))}
        </div>
        {grupos.length === 0 && (
          <p className="text-sm text-slate-400">No hay clases todavía en este programa.</p>
        )}
      </div>
    )
  }

  if (!secuencia) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{grupoSeleccionado}</p>
          {!grupoInicial && (
            <button
              onClick={() => setGrupoSeleccionado(null)}
              className="text-xs text-indigo-600 hover:underline"
            >
              Cambiar grupo
            </button>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Fase</label>
          <select
            value={fase}
            onChange={(e) => setFase(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            {FASES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
            {fase === 'entrenamiento' &&
              'Elige la posición que enseñas como muestra (Origen) y con la que se relaciona (Destino). Ej.: para entrenar A→B, Origen=A, Destino=B. Para abstracción de clave relacional, usa la MISMA posición en ambos (ej. A→A).'}
            {fase === 'test_mutuo' &&
              'Usa la posición INVERSA a la que entrenaste. Ej.: si entrenaste A→B, aquí Origen=B, Destino=A.'}
            {fase === 'test_combinatorio' &&
              'Usa las posiciones que NO entrenaste directamente, pero que deberían emerger. Ej.: si entrenaste A→B y B→C, aquí Origen=A, Destino=C (o al revés).'}
            {fase === 'transformacion_funciones' &&
              'Origen = posición conocida (con significado real). Destino = posición desconocida, sobre la que preguntas.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-slate-600 block min-h-[40px] sm:min-h-[20px]">
              {fase === 'transformacion_funciones' ? 'Posición conocida' : 'Posición muestra'}
            </label>
            <select
              value={posicionOrigen}
              onChange={(e) => setPosicionOrigen(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="">-</option>
              {posicionesDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600 block min-h-[40px] sm:min-h-[20px]">
              {fase === 'transformacion_funciones' ? 'Posición desconocida' : 'Posición comparativos'}
            </label>
            <select
              value={posicionDestino}
              onChange={(e) => setPosicionDestino(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="">-</option>
              {posicionesDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {posicionOrigen && posicionDestino && (
          <p className="text-xs text-slate-500">
            {clasesValidas.length} clase(s) del grupo tienen ambas posiciones — se usarán como
            comparativos entre sí.
          </p>
        )}

        <div className="space-y-1">
          <p className="text-sm text-slate-600">Tamaño del bloque</p>
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
        </div>

        <button
          onClick={empezarBloque}
          disabled={!posicionOrigen || !posicionDestino}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Generar secuencia y empezar
        </button>
      </div>
    )
  }

  const claseActual = secuencia[ensayos.length]

  if (!claseActual) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">Guardando bloque...</p>
      </div>
    )
  }

  const origenActual = encontrarEstimulo(claseActual, posicionOrigen)!
  const esTransformacion = fase === 'transformacion_funciones'
  const esEntrenamiento = fase === 'entrenamiento'

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

            {(instrucciones || ayudasPosibles || videoUrl) && (
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
          {videoUrl && (
            <div>
              <strong>Vídeo de ejemplo:</strong>
              <VideoDiferido url={videoUrl} />
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
        {esTransformacion ? (
          <>
            <p className="text-sm text-slate-500">
              Pregunta sobre: <strong>{origenActual.nombre}</strong> ({claseActual.nombre})
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {comparativos.map((c) => (
                <span
                  key={c.claseId}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    c.esCorrecto
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                  title={c.esCorrecto ? 'Respuesta correcta (solo visible para ti)' : ''}
                >
                  {c.estimulo.nombre}
                </span>
              ))}
            </div>
            <textarea
              value={preguntaActual}
              onChange={(e) => setPreguntaActual(e.target.value)}
              placeholder="Escribe aquí la pregunta que le haces al alumno..."
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => registrar(true, 'independiente', preguntaActual)}
                disabled={isPending}
                className="flex-1 rounded-lg bg-emerald-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
              >
                ✓ Correcto
              </button>
              <button
                onClick={() => registrar(false, 'independiente', preguntaActual)}
                disabled={isPending}
                className="flex-1 rounded-lg bg-rose-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-rose-500 disabled:opacity-50 active:scale-[0.98]"
              >
                ✗ Incorrecto
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{origenActual.nombre}</p>
            <p className="text-xs text-slate-400">{claseActual.nombre}</p>

            <div className="flex flex-wrap justify-center gap-2">
              {comparativos.map((c) => (
                <span
                  key={c.claseId}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    c.esCorrecto
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                  title={c.esCorrecto ? 'Respuesta correcta (solo visible para ti)' : ''}
                >
                  {c.estimulo.nombre}
                </span>
              ))}
            </div>

            {esEntrenamiento && !mostrandoAyudas && (
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
            )}

            {esEntrenamiento && mostrandoAyudas && (
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

            {!esEntrenamiento && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => registrar(true, 'independiente')}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-emerald-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
                >
                  ✓ Correcto
                </button>
                <button
                  onClick={() => registrar(false, 'independiente')}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-rose-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-rose-500 disabled:opacity-50 active:scale-[0.98]"
                >
                  ✗ Incorrecto
                </button>
              </div>
            )}
          </>
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
                  {i + 1}. {e.claseNombre}
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

      {isPending && <p className="text-center text-sm text-slate-500">Guardando bloque...</p>}
    </div>
  )
}