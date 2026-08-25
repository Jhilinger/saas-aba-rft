'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { guardarBloqueIntervalo, eliminarBloqueIntervalo } from './actions'
import { useConfirm } from '../../../../../providers/confirm-provider'
import { useToast } from '../../../../../providers/toast-provider'

type Bloque = {
  id: string
  fecha: string
  fase: 'linea_base' | 'intervencion'
  tipo_intervalo: 'parcial' | 'total' | 'momentaneo'
  duracion_intervalo_segundos: number
  total_intervalos: number
  intervalos_con_conducta: number
  porcentaje: number
  notas: string | null
}

const ETIQUETA_TIPO: Record<string, string> = {
  parcial: 'Parcial (conducta en cualquier momento del intervalo)',
  total: 'Total (conducta durante todo el intervalo)',
  momentaneo: 'Momentáneo (conducta justo al final del intervalo)',
}

export default function IntervaloClient({
  programaAlumnoId,
  bloquesIniciales,
}: {
  programaAlumnoId: string
  bloquesIniciales: Bloque[]
}) {
  const params = useParams()
  const alumnoId = params.id as string

  // Configuración
  const [duracionIntervalo, setDuracionIntervalo] = useState(30)
  const [tipoIntervalo, setTipoIntervalo] = useState<'parcial' | 'total' | 'momentaneo'>('parcial')
  const [totalIntervalosPlan, setTotalIntervalosPlan] = useState(10)

  // En curso
  const [enCurso, setEnCurso] = useState(false)
  const [intervaloActual, setIntervaloActual] = useState(1)
  const [segundosRestantes, setSegundosRestantes] = useState(30)
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
  const [intervalosConConducta, setIntervalosConConducta] = useState(0)

  const [notas, setNotas] = useState('')
  const [resultado, setResultado] = useState<{ total: number; conConducta: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()
    useEffect(() => {
    if (!enCurso || esperandoRespuesta) return
    const id = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          setEsperandoRespuesta(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [enCurso, esperandoRespuesta])

  const empezar = () => {
    setIntervaloActual(1)
    setSegundosRestantes(duracionIntervalo)
    setEsperandoRespuesta(false)
    setIntervalosConConducta(0)
    setResultado(null)
    setEnCurso(true)
  }

  const responder = (huboConducta: boolean) => {
    const nuevoConConducta = intervalosConConducta + (huboConducta ? 1 : 0)

    if (intervaloActual >= totalIntervalosPlan) {
      // Era el último intervalo planeado
      setIntervalosConConducta(nuevoConConducta)
      setResultado({ total: intervaloActual, conConducta: nuevoConConducta })
      setEnCurso(false)
      return
    }

    setIntervalosConConducta(nuevoConConducta)
    setIntervaloActual((i) => i + 1)
    setSegundosRestantes(duracionIntervalo)
    setEsperandoRespuesta(false)
  }

  const detenerAntes = () => {
    // Termina antes de completar todos los intervalos planeados; cuenta
    // solo los ya respondidos (el actual, si está esperando respuesta,
    // no cuenta todavía)
    const totalRespondidos = esperandoRespuesta ? intervaloActual - 1 : intervaloActual - 1
    setResultado({ total: Math.max(totalRespondidos, 0), conConducta: intervalosConConducta })
    setEnCurso(false)
  }

  const guardar = () => {
    if (!resultado || resultado.total === 0) return
    startTransition(async () => {
      const res = await guardarBloqueIntervalo(
        programaAlumnoId,
        alumnoId,
        tipoIntervalo,
        duracionIntervalo,
        resultado.total,
        resultado.conConducta,
        notas
      )
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque guardado', 'exito')
      setResultado(null)
      setNotas('')
      router.refresh()
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar bloque',
      mensaje: '¿Eliminar este bloque de intervalo? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarBloqueIntervalo(id, alumnoId, programaAlumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Bloque eliminado', 'exito')
      router.refresh()
    })
  }
    if (resultado) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
          <p className="text-slate-600">
            {resultado.conConducta} de {resultado.total} intervalos con conducta —{' '}
            <strong>{Math.round((resultado.conConducta / Math.max(resultado.total, 1)) * 100)}%</strong>
          </p>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas (opcional)"
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <button
              onClick={guardar}
              disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Guardar bloque
            </button>
            <button
              onClick={() => setResultado(null)}
              className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              Descartar
            </button>
          </div>
        </div>
        {historial(bloquesIniciales, borrar)}
      </div>
    )
  }

  if (enCurso) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8 text-center space-y-4">
          <p className="text-sm text-indigo-700">
            Intervalo {intervaloActual} / {totalIntervalosPlan}
          </p>

          {!esperandoRespuesta ? (
            <p className="text-6xl font-mono font-bold text-slate-800">{segundosRestantes}</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-700">¿Hubo conducta en este intervalo?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => responder(true)}
                  className="flex-1 rounded-lg bg-rose-600 py-6 text-xl font-bold text-white hover:bg-rose-500 active:scale-95"
                >
                  Sí
                </button>
                <button
                  onClick={() => responder(false)}
                  className="flex-1 rounded-lg bg-emerald-600 py-6 text-xl font-bold text-white hover:bg-emerald-500 active:scale-95"
                >
                  No
                </button>
              </div>
            </>
          )}

          <p className="text-sm text-slate-500">{intervalosConConducta} con conducta hasta ahora</p>

          <button onClick={detenerAntes} className="text-sm text-slate-400 hover:text-slate-600">
            Detener antes de tiempo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
        <h2 className="font-semibold text-slate-700">Configurar observación</h2>
        <div>
          <label className="text-sm text-slate-600">Tipo de intervalo</label>
          <select
            value={tipoIntervalo}
            onChange={(e) => setTipoIntervalo(e.target.value as any)}
            className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="parcial">{ETIQUETA_TIPO.parcial}</option>
            <option value="total">{ETIQUETA_TIPO.total}</option>
            <option value="momentaneo">{ETIQUETA_TIPO.momentaneo}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600">Duración del intervalo (seg)</label>
            <input
              type="number"
              value={duracionIntervalo}
              onChange={(e) => setDuracionIntervalo(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Nº de intervalos</label>
            <input
              type="number"
              value={totalIntervalosPlan}
              onChange={(e) => setTotalIntervalosPlan(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Observación total: {Math.round((duracionIntervalo * totalIntervalosPlan) / 60)} min aprox.
        </p>
        <button
          onClick={empezar}
          className="w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-500"
        >
          Empezar
        </button>
      </div>

      {historial(bloquesIniciales, borrar)}
    </div>
  )
}

function historial(bloques: Bloque[], borrar: (id: string) => void) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
      {bloques.map((b) => (
        <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-700">
              {new Date(b.fecha).toLocaleDateString('es-ES')} — {b.intervalos_con_conducta}/{b.total_intervalos} intervalos
              {b.fase === 'linea_base' && ' · Línea base'}
            </p>
            <p className="text-xs text-slate-400">
              {b.porcentaje}% · {ETIQUETA_TIPO[b.tipo_intervalo].split(' (')[0]} · {b.duracion_intervalo_segundos}s/intervalo
            </p>
          </div>
          <button onClick={() => borrar(b.id)} className="text-xs font-medium text-rose-500 hover:text-rose-700">
            Eliminar
          </button>
        </div>
      ))}
      {bloques.length === 0 && <p className="text-center text-slate-400 py-4">Sin bloques todavía.</p>}
    </div>
  )
}