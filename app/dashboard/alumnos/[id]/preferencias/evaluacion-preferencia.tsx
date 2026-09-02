'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  guardarEvaluacionPreferencia,
  eliminarEvaluacionPreferencia,
  anadirMasPreferidosAlRegistro,
} from './actions'
import { useConfirm } from '../../../../providers/confirm-provider'
import { useToast } from '../../../../providers/toast-provider'

type ResultadoMswo = { item: string; posicion: number }[]
type ResultadoMsw = { item: string; vecesElegido: number; porcentaje: number }[]

type Evaluacion = {
  id: string
  fecha: string
  tipo: 'mswo' | 'msw'
  items: string[]
  resultado: ResultadoMswo | ResultadoMsw
  numero_rondas: number | null
  notas: string | null
}

export default function EvaluacionPreferencia({
  alumnoId,
  evaluacionesIniciales,
}: {
  alumnoId: string
  evaluacionesIniciales: Evaluacion[]
}) {
  const [mostrandoConfig, setMostrandoConfig] = useState(false)
  const [tipo, setTipo] = useState<'mswo' | 'msw'>('mswo')
  const [itemsTexto, setItemsTexto] = useState('')
  const [numeroRondas, setNumeroRondas] = useState(5)

  // Estado del procedimiento en curso
  const [enCurso, setEnCurso] = useState(false)
  const [itemsOriginales, setItemsOriginales] = useState<string[]>([])
  const [itemsRestantes, setItemsRestantes] = useState<string[]>([])
  const [ordenElegido, setOrdenElegido] = useState<string[]>([])
  const [rondaActual, setRondaActual] = useState(0)
  const [conteos, setConteos] = useState<Map<string, number>>(new Map())

  const [resultado, setResultado] = useState<ResultadoMswo | ResultadoMsw | null>(null)
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()
    const empezar = () => {
    const items = itemsTexto
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean)

    if (items.length < 2) {
      toast('Necesitas al menos 2 ítems', 'error')
      return
    }

    setItemsOriginales(items)
    setItemsRestantes(items)
    setOrdenElegido([])
    setRondaActual(0)
    setConteos(new Map())
    setResultado(null)
    setMostrandoConfig(false)
    setEnCurso(true)
  }

  // --- MSWO: se elige un ítem, se retira, se repite con los que quedan ---
  const elegirMswo = (item: string) => {
    const nuevoOrden = [...ordenElegido, item]
    const nuevosRestantes = itemsRestantes.filter((i) => i !== item)

    if (nuevosRestantes.length <= 1) {
      // Si solo queda 1, se añade automáticamente al final (nunca fue "elegido"
      // porque no hubo comparación, pero cierra el ranking completo)
      const ordenFinal = nuevosRestantes.length === 1 ? [...nuevoOrden, nuevosRestantes[0]] : nuevoOrden
      finalizarMswo(ordenFinal)
      return
    }

    setOrdenElegido(nuevoOrden)
    setItemsRestantes(nuevosRestantes)
  }

  const finalizarMswo = (orden: string[]) => {
    const res: ResultadoMswo = orden.map((item, i) => ({ item, posicion: i + 1 }))
    setResultado(res)
    setEnCurso(false)
  }

  const terminarMswoAntes = () => {
    // El alumno dejó de responder: lo ya elegido se queda con su orden, el
    // resto se considera "no evaluado" y no entra en el ranking
    finalizarMswo(ordenElegido)
  }

  // --- MSW: se elige un ítem, NO se retira, se repite N rondas ---
  const elegirMsw = (item: string) => {
    const nuevosConteos = new Map(conteos)
    nuevosConteos.set(item, (nuevosConteos.get(item) ?? 0) + 1)
    const nuevaRonda = rondaActual + 1

    if (nuevaRonda >= numeroRondas) {
      finalizarMsw(nuevosConteos)
      return
    }

    setConteos(nuevosConteos)
    setRondaActual(nuevaRonda)
  }

  const finalizarMsw = (conteosFinal: Map<string, number>) => {
    const res: ResultadoMsw = itemsOriginales
      .map((item) => ({
        item,
        vecesElegido: conteosFinal.get(item) ?? 0,
        porcentaje: Math.round(((conteosFinal.get(item) ?? 0) / numeroRondas) * 100),
      }))
      .sort((a, b) => b.vecesElegido - a.vecesElegido)
    setResultado(res)
    setEnCurso(false)
  }
    const guardar = () => {
    if (!resultado) return
    startTransition(async () => {
      const res = await guardarEvaluacionPreferencia(
        alumnoId,
        tipo,
        itemsOriginales,
        resultado,
        tipo === 'msw' ? numeroRondas : null,
        notas
      )
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Evaluación guardada', 'exito')
      setResultado(null)
      setNotas('')
      router.refresh()
    })
  }

  const anadirMasPreferidos = () => {
    if (!resultado) return
    const top3 =
      tipo === 'mswo'
        ? (resultado as ResultadoMswo).slice(0, 3).map((r) => r.item)
        : (resultado as ResultadoMsw).slice(0, 3).map((r) => r.item)

    startTransition(async () => {
      const res = await anadirMasPreferidosAlRegistro(alumnoId, top3)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Añadidos al registro de preferencias', 'exito')
    })
  }

  const borrarEvaluacion = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar evaluación',
      mensaje: '¿Eliminar esta evaluación de preferencias? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarEvaluacionPreferencia(id, alumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Evaluación eliminada', 'exito')
      router.refresh()
    })
  }
    const guardarYAnadirTop3 = () => {
    if (!resultado) return
    startTransition(async () => {
      const res = await guardarEvaluacionPreferencia(
        alumnoId,
        tipo,
        itemsOriginales,
        resultado,
        tipo === 'msw' ? numeroRondas : null,
        notas
      )
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      const top3 =
        tipo === 'mswo'
          ? (resultado as ResultadoMswo).slice(0, 3).map((r) => r.item)
          : (resultado as ResultadoMsw).slice(0, 3).map((r) => r.item)
      await anadirMasPreferidosAlRegistro(alumnoId, top3)
      toast('Guardado y añadido al registro', 'exito')
      setResultado(null)
      setNotas('')
      router.refresh()
    })
  }
    return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Evaluación de preferencias (MSWO / MSW)</h2>

        {!mostrandoConfig && !enCurso && !resultado && (
          <button
            onClick={() => setMostrandoConfig(true)}
            className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Nueva evaluación
          </button>
        )}

        {mostrandoConfig && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setTipo('mswo')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${tipo === 'mswo' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                MSWO (sin reposición)
              </button>
              <button
                onClick={() => setTipo('msw')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${tipo === 'msw' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                MSW (con reposición)
              </button>
            </div>

            <div>
              <label className="text-sm text-slate-600">Ítems a evaluar (uno por línea, mínimo 2)</label>
              <textarea
                value={itemsTexto}
                onChange={(e) => setItemsTexto(e.target.value)}
                rows={5}
                placeholder={'Piruleta\niPad\nBurbujas\nColumpio'}
                className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            {tipo === 'msw' && (
              <div>
                <label className="text-sm text-slate-600">Número de rondas</label>
                <input
                  type="number"
                  value={numeroRondas}
                  onChange={(e) => setNumeroRondas(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={empezar}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Empezar
              </button>
              <button onClick={() => setMostrandoConfig(false)} className="text-sm text-slate-500 hover:text-slate-700">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {enCurso && tipo === 'mswo' && (
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-500">
              Elegido hasta ahora: {ordenElegido.length > 0 ? ordenElegido.join(' → ') : '—'}
            </p>
            <p className="font-medium text-slate-700">¿Qué eligió el alumno?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {itemsRestantes.map((item) => (
                <button
                  key={item}
                  onClick={() => elegirMswo(item)}
                  className="rounded-lg bg-indigo-50 px-3 py-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  {item}
                </button>
              ))}
            </div>
            <button onClick={terminarMswoAntes} className="text-sm text-slate-400 hover:text-slate-600">
              El alumno no respondió / terminar aquí
            </button>
          </div>
        )}

        {enCurso && tipo === 'msw' && (
          <div className="space-y-3 text-center">
            <p className="text-sm text-indigo-600 font-medium">
              Ronda {rondaActual + 1} / {numeroRondas}
            </p>
            <p className="font-medium text-slate-700">¿Qué eligió el alumno?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {itemsOriginales.map((item) => (
                <button
                  key={item}
                  onClick={() => elegirMsw(item)}
                  className="rounded-lg bg-indigo-50 px-3 py-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Resultado (de más a menos preferido)</p>
            <ol className="space-y-1">
              {resultado.map((r: any, i: number) => (
                <li key={r.item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span>
                    {i + 1}. {r.item}
                  </span>
                  <span className="text-xs text-slate-400">
                    {tipo === 'mswo' ? `posición ${r.posicion}` : `${r.vecesElegido}/${numeroRondas} · ${r.porcentaje}%`}
                  </span>
                </li>
              ))}
            </ol>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas (opcional)"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={guardar}
                disabled={isPending}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                onClick={guardarYAnadirTop3}
                disabled={isPending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Guardar y añadir los 3 más preferidos al registro
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700">Historial de evaluaciones</h3>
        {evaluacionesIniciales.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-700">
                {new Date(e.fecha).toLocaleDateString('es-ES')} ·{' '}
                <span className="font-medium">{e.tipo === 'mswo' ? 'MSWO' : 'MSW'}</span>
                {' · Top: '}
                {(e.resultado as any[]).slice(0, 3).map((r) => r.item).join(', ')}
              </p>
              <button onClick={() => borrarEvaluacion(e.id)} className="text-xs font-medium text-rose-500 hover:text-rose-700">
                Eliminar
              </button>
            </div>
            {e.notas && <p className="mt-1 text-xs text-slate-400 italic">{e.notas}</p>}
          </div>
        ))}
        {evaluacionesIniciales.length === 0 && (
          <p className="text-center text-slate-400 py-4">Sin evaluaciones todavía.</p>
        )}
      </div>
    </section>
  )
}