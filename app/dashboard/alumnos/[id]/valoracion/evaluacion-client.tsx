'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { guardarValoracion, importarNoDominados } from './actions'
import { useToast } from '../../../../providers/toast-provider'

type Programa = { id: string; nombre: string; tipo: string; area: string | null; objetivo: string | null; orden: number }
type Valoracion = { programa_base_id: string; valoracion: 'dominado' | 'parcial' | 'no' }

const RACHA_LIMITE_DEFECTO = 3
const TOTAL_LIMITE_DEFECTO = 5

const ETIQUETA: Record<string, { label: string; color: string }> = {
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  parcial: { label: 'Parcial', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  no: { label: 'No', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export default function EvaluacionClient({
  alumnoId,
  programas,
  valoracionesIniciales,
  rachaLimite = RACHA_LIMITE_DEFECTO,
  totalLimite = TOTAL_LIMITE_DEFECTO,
}: {
  alumnoId: string
  programas: Programa[]
  valoracionesIniciales: Valoracion[]
  rachaLimite?: number
  totalLimite?: number
}) {
  const [mapa, setMapa] = useState<Record<string, 'dominado' | 'parcial' | 'no'>>(
    Object.fromEntries(valoracionesIniciales.map((v) => [v.programa_base_id, v.valoracion]))
  )
  const [isPending, startTransition] = useTransition()
  const [importando, setImportando] = useState(false)
  const [resultadoImport, setResultadoImport] = useState<{ importados: number } | null>(null)
  const toast = useToast()
  const router = useRouter()

  // --- Modo "continuar valorando pendientes" (revisión manual, sin límite
  // automático de parada, ya que el usuario ha decidido seguir a propósito) ---
  const [continuando, setContinuando] = useState(false)
  const [listaContinuacion, setListaContinuacion] = useState<string[]>([])
  const [indiceContinuacion, setIndiceContinuacion] = useState(0)

  const iniciarContinuacion = () => {
    const pendientes = programas.filter((p) => mapa[p.id] !== 'dominado').map((p) => p.id)
    setListaContinuacion(pendientes)
    setIndiceContinuacion(0)
    setContinuando(true)
  }

  const valorarContinuacion = (programaId: string, valoracion: 'dominado' | 'parcial' | 'no') => {
    setMapa((prev) => ({ ...prev, [programaId]: valoracion }))
    startTransition(async () => {
      const res = await guardarValoracion(alumnoId, programaId, valoracion)
      if (res?.error) toast(res.error, 'error')
    })
    if (indiceContinuacion + 1 >= listaContinuacion.length) {
      setContinuando(false)
    } else {
      setIndiceContinuacion((i) => i + 1)
    }
  }
  // Calculamos: hasta dónde llega la PRIMERA pasada (racha de 3 seguidos sin
  // dominar, o 5 en total, o fin del currículo), y cuál es el siguiente
  // programa a valorar — esto no cambia respecto a como ya lo teníamos
  const { detenida, motivoParada, siguienteIndex, racha, resumen } = useMemo(() => {
    let racha = 0
    let detenida = false
    let motivoParada: 'racha' | 'total' | null = null
    let siguienteIndex: number | null = null

    const resumen = { dominado: 0, parcial: 0, no: 0, sinEvaluar: 0 }

    for (let i = 0; i < programas.length; i++) {
      const v = mapa[programas[i].id]
      if (!v) {
        if (siguienteIndex === null) siguienteIndex = i
        break
      }
      resumen[v]++
      if (v === 'dominado') {
        racha = 0
      } else {
        racha++
        if (racha >= rachaLimite) {
          detenida = true
          motivoParada = 'racha'
          break
        }
      }
      if (resumen.parcial + resumen.no >= totalLimite) {
        detenida = true
        motivoParada = 'total'
        break
      }
    }

    // El contador de "sin evaluar" se calcula siempre sobre el currículo
    // completo, independientemente de por qué se haya detenido el bucle
    // (si no, al pararse por racha/total, se quedaba erróneamente en 0)
    resumen.sinEvaluar = programas.filter((p) => !mapa[p.id]).length

    return { detenida, motivoParada, siguienteIndex, racha, resumen }
  }, [mapa, programas])

  const finalizadaPrimeraPasada = detenida || siguienteIndex === null

  const valorar = (programaId: string, valoracion: 'dominado' | 'parcial' | 'no') => {
    setMapa((prev) => ({ ...prev, [programaId]: valoracion }))
    startTransition(async () => {
      const res = await guardarValoracion(alumnoId, programaId, valoracion)
      if (res?.error) toast(res.error, 'error')
    })
  }

  const importar = () => {
    setImportando(true)
    startTransition(async () => {
      const res = await importarNoDominados(alumnoId)
      setImportando(false)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      setResultadoImport({ importados: res.importados ?? 0 })
      toast(`${res.importados} programa(s) importado(s) al PEI como línea base`, 'exito')
      router.refresh()
    })
  }

  if (programas.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        No hay programas en el currículo (base o de clínica) para evaluar todavía.
      </p>
    )
  }
  // --- MODO: continuando (revisión manual de pendientes) ---
  if (continuando) {
    const idActual = listaContinuacion[indiceContinuacion]
    const programaActual = programas.find((p) => p.id === idActual)

    if (!programaActual) {
      setContinuando(false)
      return null
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Revisando pendiente <strong>{indiceContinuacion + 1}</strong> / {listaContinuacion.length}
          </span>
          <button onClick={() => setContinuando(false)} className="text-slate-400 hover:text-slate-600">
            Detener y ver resumen
          </button>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8 text-center space-y-4">
          {programaActual.area && (
            <span className="inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-indigo-600">
              {programaActual.area}
            </span>
          )}
          <p className="text-xl sm:text-2xl font-bold text-slate-800">{programaActual.nombre}</p>
          {programaActual.objetivo && (
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{programaActual.objetivo}</p>
          )}

          <p className="text-sm font-medium text-slate-500 pt-2">
            ¿Cómo está el alumno en esta habilidad ahora?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => valorarContinuacion(programaActual.id, 'dominado')}
              disabled={isPending}
              className="flex-1 rounded-lg bg-emerald-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
            >
              Dominado
            </button>
            <button
              onClick={() => valorarContinuacion(programaActual.id, 'parcial')}
              disabled={isPending}
              className="flex-1 rounded-lg bg-amber-500 py-4 sm:py-3 text-base font-semibold text-white hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98]"
            >
              Parcial
            </button>
            <button
              onClick={() => valorarContinuacion(programaActual.id, 'no')}
              disabled={isPending}
              className="flex-1 rounded-lg bg-rose-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-rose-500 disabled:opacity-50 active:scale-[0.98]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- MODO: resumen (primera pasada terminada, o revisión de pendientes
  // ya recorrida entera) ---
  if (finalizadaPrimeraPasada) {
    const totalNoOParcial = resumen.parcial + resumen.no
    const pendientesRestantes = programas.filter((p) => mapa[p.id] !== 'dominado').length

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">
            {detenida ? 'Evaluación detenida automáticamente' : 'Evaluación completa'}
          </h2>
          {detenida && (
            <p className="text-sm text-slate-500">
              {motivoParada === 'racha'
                ? `Se han encontrado ${rachaLimite} programa${rachaLimite > 1 ? 's' : ''} seguido${rachaLimite > 1 ? 's' : ''} sin dominar — es un buen punto para parar.`
                : `Se han acumulado ${totalLimite} programas sin dominar en total — es un buen punto para parar y trabajar con lo ya identificado.`}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <p className="text-xl font-bold text-emerald-700">{resumen.dominado}</p>
              <p className="text-xs text-emerald-600">Dominado</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <p className="text-xl font-bold text-amber-700">{resumen.parcial}</p>
              <p className="text-xs text-amber-600">Parcial</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 text-center">
              <p className="text-xl font-bold text-rose-700">{resumen.no}</p>
              <p className="text-xs text-rose-600">No</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-slate-600">{resumen.sinEvaluar}</p>
              <p className="text-xs text-slate-500">Sin evaluar</p>
            </div>
          </div>

          {totalNoOParcial > 0 && (
            <button
              onClick={importar}
              disabled={importando}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {importando
                ? 'Importando...'
                : `Importar al PEI como línea base (${totalNoOParcial} programas)`}
            </button>
          )}

          {pendientesRestantes > 0 && (
            <button
              onClick={iniciarContinuacion}
              className="w-full rounded-lg bg-sky-600 py-3 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Continuar valorando pendientes ({pendientesRestantes})
            </button>
          )}

          {resultadoImport && (
            <p className="text-sm text-emerald-600 text-center">
              ✓ {resultadoImport.importados} programa(s) añadidos al PEI. Ya puedes empezar a tomar
              datos de línea base con ellos.
            </p>
          )}
        </div>
      </div>
    )
  }

  // --- MODO: primera pasada (secuencial, tal como ya la teníamos) ---
  const programaActual = programas[siguienteIndex!]
  const posicion = siguienteIndex! + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Programa <strong>{posicion}</strong> / {programas.length}
        </span>
        <span>{racha > 0 && `${racha} seguido${racha > 1 ? 's' : ''} sin dominar`}</span>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8 text-center space-y-4">
        {programaActual.area && (
          <span className="inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-indigo-600">
            {programaActual.area}
          </span>
        )}
        <p className="text-xl sm:text-2xl font-bold text-slate-800">{programaActual.nombre}</p>
        {programaActual.objetivo && (
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{programaActual.objetivo}</p>
        )}

        <p className="text-sm font-medium text-slate-500 pt-2">
          ¿Cómo está el alumno en esta habilidad?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => valorar(programaActual.id, 'dominado')}
            disabled={isPending}
            className="flex-1 rounded-lg bg-emerald-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
          >
            Dominado
          </button>
          <button
            onClick={() => valorar(programaActual.id, 'parcial')}
            disabled={isPending}
            className="flex-1 rounded-lg bg-amber-500 py-4 sm:py-3 text-base font-semibold text-white hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98]"
          >
            Parcial
          </button>
          <button
            onClick={() => valorar(programaActual.id, 'no')}
            disabled={isPending}
            className="flex-1 rounded-lg bg-rose-600 py-4 sm:py-3 text-base font-semibold text-white hover:bg-rose-500 disabled:opacity-50 active:scale-[0.98]"
          >
            No
          </button>
        </div>
      </div>

      {Object.keys(mapa).length > 0 && (
        <details className="text-sm text-slate-500">
          <summary className="cursor-pointer hover:text-slate-700">
            Ver valoraciones ya registradas ({Object.keys(mapa).length})
          </summary>
          <ul className="mt-2 space-y-1">
            {programas
              .filter((p) => mapa[p.id])
              .map((p) => (
                <li
                  key={p.id}
                  className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs ${ETIQUETA[mapa[p.id]].color}`}
                >
                  <span>{p.nombre}</span>
                  <span className="font-medium">{ETIQUETA[mapa[p.id]].label}</span>
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  )
}