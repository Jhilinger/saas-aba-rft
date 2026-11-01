'use client'

import { useState } from 'react'
import BotonLargo from '../../../boton-largo'
import { useEtapasEnsayo } from '../../../etapas-ensayo'
import { decir } from '../../../voz'
import AjustesVoz from '../../../ajustes-voz'
import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from '../../../secuencia-rft'
import ContenidoEstimulo from '../../../contenido-estimulo'
import { parsearEstimuloPantalla } from '../../../estimulo-pantalla'

// Pantalla del alumno para un bloque RFT en la tableta: la muestra arriba y
// las comparaciones en tarjetas. El toque del alumno registra el ensayo; el
// terapeuta da las ayudas y el refuerzo y las anota con controles que hay que
// mantener pulsados. Si las comparaciones son palabras que el alumno dice (ej.
// test B→A), la pantalla solo muestra la muestra y el terapeuta puntúa.

// pantalla: columna jsonb (texto, figura SVG, n imágenes…); se valida al pintar
export type EstimuloTablet = { id: string; nombre: string; concepto_imagen: string | null; pantalla: unknown }
export type ComparativoTablet = { claseId: string; estimulo: EstimuloTablet; esCorrecto: boolean }
// concepto → ejemplar → URL pública
export type ImagenesBanco = Record<string, Record<string, string>>

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

// Nombre entre comillas («"Agua"»): palabra que se dice, no se ve
export function esOido(e: { nombre: string; concepto_imagen: string | null; pantalla: unknown }) {
  return !esVisible(e) && /^["“«].*["”»]$/.test(e.nombre.trim())
}

// Se ve en la pantalla: foto del banco o presentación propia (texto, figura…)
export function esVisible(e: { concepto_imagen: string | null; pantalla: unknown }) {
  return !!e.concepto_imagen || parsearEstimuloPantalla(e.pantalla) !== null
}

function textoOido(nombre: string) {
  return nombre.trim().replace(/^["“«]|["”»]$/g, '')
}

// Ejemplar de la imagen: en las sondas de generalización, el reservado (3);
// en el resto, alterna los de entrenamiento (1 y 2)
export function urlImagen(imagenes: ImagenesBanco, concepto: string | null, fase: string, ensayo: number) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  if (fase === 'generalizacion') return ejemplares['3'] ?? ejemplares['1'] ?? null
  return ejemplares[ensayo % 2 === 0 ? '1' : '2'] ?? ejemplares['1'] ?? null
}


function lado(n: number, maxVh: number, margenRem = 4) {
  return `min(calc((100vw - ${margenRem}rem) / ${n} - 2.5vmin), ${maxVh}vh)`
}

function Tarjeta({
  estimulo,
  url,
  lado: l,
  urlConcepto,
}: {
  estimulo: EstimuloTablet
  url: string | null
  lado: string
  urlConcepto: (concepto: string) => string | null
}) {
  const pantalla = parsearEstimuloPantalla(estimulo.pantalla)
  if (pantalla) return <ContenidoEstimulo estimulo={pantalla} lado={l} urlImagen={urlConcepto} />
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" draggable={false} className="h-[88%] w-[88%] object-contain" />
  }
  return (
    <span className="px-3 text-center font-serif font-bold leading-tight text-slate-800" style={{ fontSize: `calc(${l} * 0.16)` }}>
      {textoOido(estimulo.nombre)}
    </span>
  )
}

// Un ensayo: pausa, comparaciones y después la muestra (se monta de nuevo en
// cada ensayo). Los toques antes de que aparezca la muestra no cuentan.
function EnsayoTablet({
  origen,
  comparativos,
  fase,
  ensayo,
  imagenes,
  onResponder,
  onMuestra,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  imagenes: ImagenesBanco
  onResponder: (correcto: boolean, respuesta: string | null) => void
  onMuestra: () => void
}) {
  const muestraOida = esOido(origen)
  const respuestaOral = comparativos.some((c) => esOido(c.estimulo))
  const etapa = useEtapasEnsayo(!respuestaOral, () => {
    onMuestra()
    if (muestraOida) decir(textoOido(origen.nombre))
  })
  const ladoOpcion = lado(Math.max(comparativos.length, 2), 34)
  const ladoMuestra = lado(1, respuestaOral ? 44 : 26, 7)
  const ladoAudio = lado(1, 16, 7)
  const urlMuestra = urlImagen(imagenes, origen.concepto_imagen, fase, ensayo)
  const urlConcepto = (concepto: string) => urlImagen(imagenes, concepto, fase, ensayo)
  const conMuestra = etapa === 'muestra'

  return (
    <>
      <div className={`flex flex-1 flex-col items-center justify-center gap-[2.5vmin] overflow-hidden px-4 pb-2 ${etapa === 'pausa' ? 'invisible' : ''}`}>
        {/* El recuadro de la muestra ocupa su sitio desde el principio para que las opciones no se muevan */}
        <div className="flex items-center justify-center rounded-[3vmin] border-2 border-indigo-200 bg-indigo-50/70 px-[3vmin] py-[2.5vmin]">
          {muestraOida ? (
            <button
              type="button"
              onClick={() => conMuestra && decir(textoOido(origen.nombre))}
              style={{ width: ladoAudio, height: ladoAudio }}
              className={`flex flex-col items-center justify-center gap-2 rounded-[2.5vmin] border-2 border-indigo-300 bg-white ${conMuestra ? '' : 'invisible'}`}
              aria-label="Escuchar de nuevo"
            >
              <span className="leading-none" style={{ fontSize: `calc(${ladoAudio} * 0.38)` }}>
                🔊
              </span>
              <span className="text-slate-500" style={{ fontSize: `calc(${ladoAudio} * 0.1)` }}>
                Escuchar
              </span>
            </button>
          ) : (
            <span
              style={{ width: ladoMuestra, height: ladoMuestra }}
              className={`flex items-center justify-center rounded-[2.5vmin] border-2 border-indigo-300 bg-white ${conMuestra ? '' : 'invisible'}`}
            >
              <Tarjeta estimulo={origen} url={urlMuestra} lado={ladoMuestra} urlConcepto={urlConcepto} />
            </span>
          )}
        </div>

        {!respuestaOral && (
          <>
            <span className="text-[3vmin] font-semibold leading-none text-slate-400">=</span>
            <div className="flex flex-wrap justify-center gap-[2.5vmin]">
              {comparativos.map((c) => (
                <button
                  key={c.claseId}
                  type="button"
                  onClick={() => conMuestra && onResponder(c.esCorrecto, textoOido(c.estimulo.nombre))}
                  style={{ width: ladoOpcion, height: ladoOpcion }}
                  className="flex items-center justify-center rounded-[2.5vmin] border-2 border-slate-200 bg-white shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Tarjeta
                    estimulo={c.estimulo}
                    url={urlImagen(imagenes, c.estimulo.concepto_imagen, fase, ensayo)}
                    lado={ladoOpcion}
                    urlConcepto={urlConcepto}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-12 justify-end gap-2 px-3 pb-2">
        {respuestaOral && conMuestra && (
          <>
            <BotonLargo onActivar={() => onResponder(true, null)}>✓ Correcto</BotonLargo>
            <BotonLargo onActivar={() => onResponder(false, null)}>✗ Incorrecto</BotonLargo>
          </>
        )}
      </div>
    </>
  )
}

export default function PantallaTablet({
  origen,
  comparativos,
  fase,
  ensayo,
  total,
  imagenes,
  onResponder,
  onMuestra,
  onSalir,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  total: number
  imagenes: ImagenesBanco
  onResponder: (correcto: boolean, ayuda: string, respuesta: string | null) => void
  // Aparece la muestra: desde aquí se mide la latencia
  onMuestra: () => void
  onSalir: () => void
}) {
  const [ayuda, setAyuda] = useState<string | null>(null)
  const [menuAyuda, setMenuAyuda] = useState(false)
  const [menuVoz, setMenuVoz] = useState(false)

  const responder = (correcto: boolean, respuesta: string | null) => {
    // La ayuda anotada solo cuenta en un acierto (un error se registra sin ayuda)
    onResponder(correcto, correcto && ayuda ? ayuda : 'independiente', respuesta)
    setAyuda(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col bg-[#F5F2EC]">
      <div className="flex items-start justify-between gap-2 px-3 pt-2">
        <p className="text-[11px] text-slate-300">
          {NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? (fase === 'generalizacion' ? 'Sonda de generalización' : fase === 'mantenimiento' ? 'Sonda de mantenimiento' : fase)} ·{' '}
          {ensayo + 1}/{total}
          {ayuda && <span className="ml-2 font-semibold text-amber-500">ayuda: {AYUDAS.find((a) => a.value === ayuda)?.label}</span>}
        </p>
        <span className="flex gap-2">
          <BotonLargo onActivar={() => setMenuAyuda(true)} className="border border-slate-200 !bg-transparent">
            Ayuda
          </BotonLargo>
          <BotonLargo onActivar={() => setMenuVoz(true)} className="border border-slate-200 !bg-transparent">
            Voz
          </BotonLargo>
          <BotonLargo onActivar={onSalir} className="border border-slate-200 !bg-transparent">
            Salir
          </BotonLargo>
        </span>
      </div>

      <EnsayoTablet
        key={ensayo}
        origen={origen}
        comparativos={comparativos}
        fase={fase}
        ensayo={ensayo}
        imagenes={imagenes}
        onResponder={responder}
        onMuestra={onMuestra}
      />

      {menuVoz && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <AjustesVoz />
            <button onClick={() => setMenuVoz(false)} className="w-full rounded-lg px-3 py-2 text-slate-500">
              Volver
            </button>
          </div>
        </div>
      )}

      {menuAyuda && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <p className="font-semibold text-slate-800">Ayuda en este ensayo</p>
            <p className="text-xs text-slate-500">Se anota en la siguiente respuesta correcta.</p>
            <div className="grid grid-cols-2 gap-2">
              {AYUDAS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => {
                    setAyuda(a.value)
                    setMenuAyuda(false)
                  }}
                  className={`rounded-lg px-3 py-2 text-left ${ayuda === a.value ? 'bg-amber-100 text-amber-800' : 'bg-slate-100'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setAyuda(null)
                setMenuAyuda(false)
              }}
              className="w-full rounded-lg px-3 py-2 text-slate-500"
            >
              Sin ayuda
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
