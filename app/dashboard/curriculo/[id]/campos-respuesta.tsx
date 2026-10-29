'use client'

import { useState } from 'react'
import type { Json } from '@/database.types'
import {
  leerRespuestaPorFase,
  NOMBRE_TIPO_RESPUESTA,
  TIPOS_RESPUESTA,
  type ConfigRespuesta,
  type TipoRespuesta,
} from '../../respuestas-rft'
import { coerceNivelRft, FASES_POR_NIVEL } from '../../niveles-rft'

const NOMBRE_FASE: Record<string, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test de vínculo mutuo',
  test_combinatorio: 'Test de vínculo combinatorio',
  transformacion_funciones: 'Transformación de funciones',
}

const claseCampo = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm'

// Tipo de respuesta de un programa RFT: uno general y, si hace falta, otro
// distinto en alguna fase. Se envía al formulario como campos ocultos.
export default function CamposRespuesta({
  nivelRft,
  inicial,
}: {
  nivelRft: string
  inicial: { tipo_respuesta: string; opciones_respuesta: string[] | null; respuesta_por_fase: Json }
}) {
  const [tipo, setTipo] = useState<TipoRespuesta>(
    (TIPOS_RESPUESTA as readonly string[]).includes(inicial.tipo_respuesta) ? (inicial.tipo_respuesta as TipoRespuesta) : 'seleccion'
  )
  const [opciones, setOpciones] = useState((inicial.opciones_respuesta ?? []).join(', '))
  const [porFase, setPorFase] = useState<Record<string, { tipo: TipoRespuesta; opciones: string }>>(() =>
    Object.fromEntries(
      Object.entries(leerRespuestaPorFase(inicial.respuesta_por_fase)).map(([fase, c]: [string, ConfigRespuesta]) => [
        fase,
        { tipo: c.tipo, opciones: c.opciones.join(', ') },
      ])
    )
  )

  const fases = FASES_POR_NIVEL[coerceNivelRft(nivelRft)]
  const porFaseJson = JSON.stringify(
    Object.fromEntries(
      Object.entries(porFase)
        .filter(([fase]) => fases.includes(fase))
        .map(([fase, c]) => [fase, { tipo: c.tipo, opciones: c.opciones.split(',').map((o) => o.trim()).filter(Boolean) }])
    )
  )

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
      <input type="hidden" name="tipo_respuesta" value={tipo} />
      <input type="hidden" name="opciones_respuesta" value={tipo === 'opciones' ? opciones : ''} />
      <input type="hidden" name="respuesta_por_fase" value={porFaseJson} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Tipo de respuesta del alumno</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoRespuesta)} className={claseCampo}>
            {TIPOS_RESPUESTA.map((t) => (
              <option key={t} value={t}>
                {NOMBRE_TIPO_RESPUESTA[t]}
              </option>
            ))}
          </select>
        </div>
        {tipo === 'opciones' && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Opciones (separadas por comas)</label>
            <input
              value={opciones}
              onChange={(e) => setOpciones(e.target.value)}
              placeholder="ej. Igual, Diferente, No se sabe"
              className={claseCampo}
            />
          </div>
        )}
      </div>

      {fases.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Si en alguna fase el alumno responde de otra forma, indícalo aquí:</p>
          {fases.map((fase) => {
            const actual = porFase[fase]
            return (
              <div key={fase} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <span className="text-sm text-slate-600">{NOMBRE_FASE[fase] ?? fase}</span>
                <select
                  value={actual?.tipo ?? ''}
                  onChange={(e) => {
                    const valor = e.target.value
                    setPorFase((prev) => {
                      const siguiente = { ...prev }
                      if (!valor) delete siguiente[fase]
                      else siguiente[fase] = { tipo: valor as TipoRespuesta, opciones: prev[fase]?.opciones ?? '' }
                      return siguiente
                    })
                  }}
                  className={claseCampo}
                >
                  <option value="">Igual que el general</option>
                  {TIPOS_RESPUESTA.map((t) => (
                    <option key={t} value={t}>
                      {NOMBRE_TIPO_RESPUESTA[t]}
                    </option>
                  ))}
                </select>
                {actual?.tipo === 'opciones' ? (
                  <input
                    value={actual.opciones}
                    onChange={(e) =>
                      setPorFase((prev) => ({ ...prev, [fase]: { tipo: 'opciones', opciones: e.target.value } }))
                    }
                    placeholder="Opciones, separadas por comas"
                    className={claseCampo}
                  />
                ) : (
                  <span />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
