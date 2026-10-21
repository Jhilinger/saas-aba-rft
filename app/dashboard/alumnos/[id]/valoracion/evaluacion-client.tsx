'use client'

import { useState, useMemo, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { guardarValoracion, importarNoDominados } from './actions'
import { UMBRAL_NIVEL } from '../../../curriculo/secuencia'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'

export type ProgramaValoracion = {
  id: string
  nombre: string
  tipo: string
  objetivo: string | null
  codigo: string | null
  dominioId: string
  nivel: number
}
export type NivelValoracion = {
  numero: number
  nombre: string
  dominios: { id: string; codigo: string; nombre: string }[]
}
type ValorValoracion = 'dominado' | 'parcial' | 'no'
type Valoracion = { programa_base_id: string; valoracion: ValorValoracion }

// Techo de un dominio: tras N programas seguidos sin dominar se deja de
// valorar ese dominio y se pasa al siguiente
const RACHA_DOMINIO = 3

const ETIQUETA: Record<ValorValoracion, { label: string; color: string }> = {
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  parcial: { label: 'Parcial', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  no: { label: 'No', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

function BotonesValoracion({ onValorar, disabled }: { onValorar: (v: ValorValoracion) => void; disabled: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button variant="success" onClick={() => onValorar('dominado')} disabled={disabled} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
        Dominado
      </Button>
      <Button variant="warning" onClick={() => onValorar('parcial')} disabled={disabled} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
        Parcial
      </Button>
      <Button variant="danger" onClick={() => onValorar('no')} disabled={disabled} className="flex-1 py-4 sm:py-3 text-base active:scale-[0.98]">
        No
      </Button>
    </div>
  )
}

function TarjetaPrograma({
  programa,
  contexto,
  pregunta,
  children,
}: {
  programa: ProgramaValoracion
  contexto: string
  pregunta: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8 text-center space-y-4">
      <span className="inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-indigo-600">{contexto}</span>
      <p className="text-xl sm:text-2xl font-bold text-slate-800">
        {programa.codigo && <span className="mr-2 font-mono text-indigo-600">{programa.codigo}</span>}
        {programa.nombre}
      </p>
      <p className="text-xs text-slate-500">{programa.tipo === 'rft' ? 'Aprendizaje Relacional' : 'Aprendizaje Directo'}</p>
      {programa.objetivo && <p className="text-sm text-slate-600 whitespace-pre-wrap">{programa.objetivo}</p>}
      <p className="text-sm font-medium text-slate-500 pt-2">{pregunta}</p>
      {children}
    </div>
  )
}

export default function EvaluacionClient({
  alumnoId,
  programas,
  niveles,
  valoracionesIniciales,
  dominadosPei,
}: {
  alumnoId: string
  programas: ProgramaValoracion[]
  niveles: NivelValoracion[]
  valoracionesIniciales: Valoracion[]
  // Programas base ya dominados en el PEI: cuentan como dominados sin preguntar
  dominadosPei: string[]
}) {
  const [mapa, setMapa] = useState<Record<string, ValorValoracion>>(
    Object.fromEntries(valoracionesIniciales.map((v) => [v.programa_base_id, v.valoracion]))
  )
  const [isPending, startTransition] = useTransition()
  const [importando, setImportando] = useState(false)
  const [resultadoImport, setResultadoImport] = useState<{ importados: number } | null>(null)
  const toast = useToast()
  const router = useRouter()

  const dominadosPeiSet = useMemo(() => new Set(dominadosPei), [dominadosPei])
  // Niveles por debajo del umbral en los que el terapeuta decidió seguir
  // valorando el siguiente (la parada por nivel es una recomendación)
  const [nivelesSuperados, setNivelesSuperados] = useState<Set<number>>(new Set())
  const estadoDe = (id: string): ValorValoracion | undefined => (dominadosPeiSet.has(id) ? 'dominado' : mapa[id])

  const porDominio = useMemo(() => {
    const m = new Map<string, ProgramaValoracion[]>()
    for (const p of programas) m.set(p.dominioId, [...(m.get(p.dominioId) ?? []), p])
    return m
  }, [programas])

  const dominioPorId = useMemo(
    () => new Map(niveles.flatMap((n) => n.dominios.map((d) => [d.id, { ...d, nivel: n }] as const))),
    [niveles]
  )

  // --- Modo "continuar valorando pendientes" (revisión manual, sin paradas) ---
  const [continuando, setContinuando] = useState(false)
  const [listaContinuacion, setListaContinuacion] = useState<string[]>([])
  const [indiceContinuacion, setIndiceContinuacion] = useState(0)

  const iniciarContinuacion = () => {
    setListaContinuacion(programas.filter((p) => estadoDe(p.id) !== 'dominado').map((p) => p.id))
    setIndiceContinuacion(0)
    setContinuando(true)
  }

  const guardar = (programaId: string, valoracion: ValorValoracion) => {
    setMapa((prev) => ({ ...prev, [programaId]: valoracion }))
    startTransition(async () => {
      const res = await guardarValoracion(alumnoId, programaId, valoracion)
      if (res?.error) toast(res.error, 'error')
    })
  }

  const valorarContinuacion = (programaId: string, valoracion: ValorValoracion) => {
    guardar(programaId, valoracion)
    if (indiceContinuacion + 1 >= listaContinuacion.length) setContinuando(false)
    else setIndiceContinuacion((i) => i + 1)
  }

  // Primera pasada, en orden del currículo:
  // - dentro de un dominio, RACHA_DOMINIO seguidos sin dominar = techo del
  //   dominio (se salta el resto y se pasa al siguiente dominio)
  // - al terminar un nivel, si no llega a UMBRAL_NIVEL (media de sus dominios,
  //   igual que en progreso y PEI) se recomienda parar ahí; el terapeuta puede
  //   seguir con el nivel siguiente (nivelesSuperados)
  const { siguiente, techos, detenidaEnNivel, porcentajes } = useMemo(() => {
    const techos = new Set<string>()
    const porcentajes = new Map<number, number | null>()

    const porcentajeNivel = (nivel: NivelValoracion) => {
      const conProgramas = nivel.dominios.map((d) => porDominio.get(d.id) ?? []).filter((l) => l.length > 0)
      if (conProgramas.length === 0) return null
      const suma = conProgramas.reduce(
        (s, l) => s + (l.filter((p) => estadoDe(p.id) === 'dominado').length / l.length) * 100,
        0
      )
      return Math.round(suma / conProgramas.length)
    }
    for (const n of niveles) porcentajes.set(n.numero, porcentajeNivel(n))

    for (const nivel of niveles) {
      for (const dominio of nivel.dominios) {
        const lista = porDominio.get(dominio.id) ?? []
        let racha = 0
        for (let i = 0; i < lista.length; i++) {
          const estado = estadoDe(lista[i].id)
          if (!estado) {
            return {
              siguiente: { programa: lista[i], dominio, nivel, indice: i, total: lista.length, racha },
              techos,
              detenidaEnNivel: null,
              porcentajes,
            }
          }
          racha = estado === 'dominado' ? 0 : racha + 1
          if (racha >= RACHA_DOMINIO) {
            techos.add(dominio.id)
            break
          }
        }
      }
      const pct = porcentajes.get(nivel.numero) ?? null
      if (pct !== null && pct < UMBRAL_NIVEL && !nivelesSuperados.has(nivel.numero)) {
        return { siguiente: null, techos, detenidaEnNivel: { numero: nivel.numero, porcentaje: pct }, porcentajes }
      }
    }
    return { siguiente: null, techos, detenidaEnNivel: null, porcentajes }
    // estadoDe depende de mapa y dominadosPeiSet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapa, dominadosPeiSet, niveles, porDominio, nivelesSuperados])

  const resumen = useMemo(() => {
    const r = { dominado: 0, parcial: 0, no: 0, sinEvaluar: 0 }
    for (const p of programas) {
      const e = estadoDe(p.id)
      if (e) r[e]++
      else r.sinEvaluar++
    }
    return r
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapa, dominadosPeiSet, programas])

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
      toast(
        `${res.importados} programa(s) importado(s) al PEI como línea base` +
          (res.bloqueados
            ? `. ${res.bloqueados} no se importaron porque su nivel o dominio previo aún no está conseguido.`
            : ''),
        'exito'
      )
      router.refresh()
    })
  }

  if (programas.length === 0) {
    return (
      <p className="text-center text-slate-500 py-8">
        No hay programas en el currículo (base o de clínica) para evaluar todavía.
      </p>
    )
  }

  // --- MODO: continuando (revisión manual de pendientes) ---
  if (continuando) {
    const programaActual = programas.find((p) => p.id === listaContinuacion[indiceContinuacion])
    if (!programaActual) {
      setContinuando(false)
      return null
    }
    const dominio = dominioPorId.get(programaActual.dominioId)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Revisando pendiente <strong>{indiceContinuacion + 1}</strong> / {listaContinuacion.length}
          </span>
          <button onClick={() => setContinuando(false)} className="text-slate-500 hover:text-slate-600">
            Detener y ver resumen
          </button>
        </div>
        <TarjetaPrograma
          programa={programaActual}
          contexto={dominio ? `Nivel ${dominio.nivel.numero} · ${dominio.codigo} ${dominio.nombre}` : ''}
          pregunta="¿Cómo está el alumno en esta habilidad ahora?"
        >
          <BotonesValoracion onValorar={(v) => valorarContinuacion(programaActual.id, v)} disabled={isPending} />
        </TarjetaPrograma>
      </div>
    )
  }

  // --- MODO: primera pasada ---
  if (siguiente) {
    const { programa, dominio, nivel, indice, total, racha } = siguiente
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>
            Programa <strong>{indice + 1}</strong> / {total} del dominio
          </span>
          <span>{racha > 0 && `${racha} seguido${racha > 1 ? 's' : ''} sin dominar (techo en ${RACHA_DOMINIO})`}</span>
        </div>

        <TarjetaPrograma
          programa={programa}
          contexto={`Nivel ${nivel.numero} · ${dominio.codigo} ${dominio.nombre}`}
          pregunta="¿Cómo está el alumno en esta habilidad?"
        >
          <BotonesValoracion onValorar={(v) => guardar(programa.id, v)} disabled={isPending} />
        </TarjetaPrograma>

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
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-xs ${ETIQUETA[mapa[p.id]].color}`}
                  >
                    <span>
                      <span className="mr-2 font-mono">{p.codigo}</span>
                      {p.nombre}
                    </span>
                    <span className="font-medium">{ETIQUETA[mapa[p.id]].label}</span>
                  </li>
                ))}
            </ul>
          </details>
        )}
      </div>
    )
  }

  // --- MODO: resumen ---
  const totalNoOParcial = resumen.parcial + resumen.no
  const pendientesRestantes = programas.filter((p) => estadoDe(p.id) !== 'dominado').length
  const nivelSiguiente = detenidaEnNivel
    ? niveles.find((n) => n.numero > detenidaEnNivel.numero && n.dominios.some((d) => porDominio.has(d.id)))
    : undefined

  return (
    <div className="space-y-4">
      <Panel className="p-4 sm:p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">
          {detenidaEnNivel ? 'Recomendamos parar aquí' : 'Evaluación completa'}
        </h2>
        {detenidaEnNivel && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              El Nivel {detenidaEnNivel.numero} está al {detenidaEnNivel.porcentaje}% (por debajo del {UMBRAL_NIVEL}%
              necesario para pasar al siguiente). Es un buen punto para parar y trabajar con lo ya identificado.
            </p>
            {nivelSiguiente && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="text-slate-600">
                  Si sospechas que domina habilidades del Nivel {nivelSiguiente.numero}, puedes seguir valorándolo.
                  Lo que salga dominado quedará registrado, aunque sus programas seguirán bloqueados en el PEI hasta
                  que el Nivel {detenidaEnNivel.numero} llegue al {UMBRAL_NIVEL}% (salvo excepción del administrador).
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setNivelesSuperados((prev) => new Set(prev).add(detenidaEnNivel.numero))}
                  className="mt-2 px-3 py-1.5 font-medium"
                >
                  Seguir valorando el Nivel {nivelSiguiente.numero}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{resumen.dominado}</p>
            <p className="text-xs text-emerald-700">Dominado</p>
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
          <Button onClick={importar} disabled={importando} className="w-full py-3">
            {importando ? 'Importando...' : `Importar al PEI como línea base (${totalNoOParcial} programas)`}
          </Button>
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
          <p className="text-sm text-emerald-700 text-center">
            ✓ {resultadoImport.importados} programa(s) añadidos al PEI. Ya puedes empezar a tomar datos de línea base
            con ellos.
          </p>
        )}
      </Panel>

      {niveles
        .filter((n) => n.dominios.some((d) => porDominio.has(d.id)))
        .map((n) => {
          const pct = porcentajes.get(n.numero) ?? null
          return (
            <Panel key={n.numero} className="overflow-hidden">
              <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 p-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Nivel {n.numero}</p>
                  <h3 className="font-semibold text-slate-800">{n.nombre}</h3>
                </div>
                <span className="text-xl font-bold tabular-nums text-slate-800">{pct === null ? '—' : `${pct}%`}</span>
              </div>
              <ul>
                {n.dominios
                  .filter((d) => porDominio.has(d.id))
                  .map((d) => {
                    const lista = porDominio.get(d.id)!
                    const cuenta = { dominado: 0, parcial: 0, no: 0 }
                    for (const p of lista) {
                      const e = estadoDe(p.id)
                      if (e) cuenta[e]++
                    }
                    const pctDe = (x: number) => `${(x / lista.length) * 100}%`
                    return (
                      <li key={d.id} className="space-y-1.5 border-b border-slate-100 px-4 py-2.5 last:border-0 sm:px-5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <span className="w-8 shrink-0 font-mono text-xs text-indigo-600">{d.codigo}</span>
                          <span className="min-w-0 flex-1 text-slate-700">{d.nombre}</span>
                          {techos.has(d.id) && (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">Techo</span>
                          )}
                          <span className="text-xs tabular-nums text-slate-500">
                            {cuenta.dominado}/{lista.length} dominados
                          </span>
                        </div>
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:ml-11 sm:w-auto">
                          <div className="bg-emerald-500" style={{ width: pctDe(cuenta.dominado) }} />
                          <div className="bg-amber-400" style={{ width: pctDe(cuenta.parcial) }} />
                          <div className="bg-rose-400" style={{ width: pctDe(cuenta.no) }} />
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </Panel>
          )
        })}
    </div>
  )
}
