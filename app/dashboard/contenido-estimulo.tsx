import Figura from './figuras'
import type { EstimuloPantalla } from './estimulo-pantalla'

// Contenido de un estímulo dentro de una tarjeta de lado `lado` (expresión
// CSS): emoji, figuras y textos se dimensionan como fracción de ese lado
export default function ContenidoEstimulo({
  estimulo,
  lado,
  urlImagen,
}: {
  estimulo: EstimuloPantalla
  lado: string
  // concepto del banco → URL del ejemplar que toca
  urlImagen: (concepto: string) => string | null | undefined
}) {
  const f = (k: number) => `calc(${lado} * ${k})`
  if ('par' in estimulo) {
    return (
      <span className="flex items-center justify-center" style={{ gap: f(0.05) }}>
        {estimulo.par.map((e, i) => (
          <span key={i} className="flex items-center justify-center rounded-xl bg-slate-50" style={{ width: f(0.46), height: f(0.46) }}>
            <ContenidoEstimulo estimulo={e} lado={f(0.46)} urlImagen={urlImagen} />
          </span>
        ))}
      </span>
    )
  }
  if ('externo' in estimulo) {
    return (
      <span className="px-2 text-center text-slate-400" style={{ fontSize: f(0.08) }}>
        {estimulo.externo}
      </span>
    )
  }
  if ('img' in estimulo) {
    const url = urlImagen(estimulo.img)
    const n = Math.max(1, Math.min(estimulo.n ?? 1, 9))
    if (url && n > 1) {
      // Cantidades: n copias de la misma imagen en una cuadrícula
      const porFila = Math.ceil(Math.sqrt(n))
      const tam = f(0.88 / porFila - 0.02)
      return (
        <span className="flex flex-wrap items-center justify-center" style={{ width: f(0.9), gap: f(0.02) }}>
          {Array.from({ length: n }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" draggable={false} className="object-contain" style={{ width: tam, height: tam }} />
          ))}
        </span>
      )
    }
    return (
      <span className="flex flex-col items-center justify-center" style={{ gap: f(0.03) }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" draggable={false} className="object-contain" style={{ width: f(estimulo.etiqueta ? 0.68 : 0.88), height: f(estimulo.etiqueta ? 0.68 : 0.88) }} />
        ) : (
          <span className="text-slate-400" style={{ fontSize: f(0.08) }}>
            {estimulo.img}
          </span>
        )}
        {estimulo.etiqueta && (
          <span className="font-bold text-slate-700" style={{ fontSize: f(0.13) }}>
            {estimulo.etiqueta}
          </span>
        )}
      </span>
    )
  }
  if ('color' in estimulo) {
    return <span className="block rounded-2xl" style={{ width: f(0.8), height: f(0.8), backgroundColor: estimulo.color }} />
  }
  if ('t' in estimulo) {
    return (
      <span
        className="text-center font-serif font-bold leading-tight text-slate-800"
        style={{ fontSize: f(estimulo.t.length > 12 ? 0.11 : estimulo.t.length > 7 ? 0.15 : 0.2), padding: `0 ${f(0.06)}` }}
      >
        {estimulo.t}
      </span>
    )
  }
  const etiqueta = 'etiqueta' in estimulo ? estimulo.etiqueta : undefined
  return (
    <span className="flex flex-col items-center justify-center" style={{ gap: f(0.03) }}>
      {'e' in estimulo ? (
        <span className="whitespace-nowrap leading-none" style={{ fontSize: f((etiqueta ? 0.46 : 0.6) / Math.max(1, numGrafemas(estimulo.e) * 0.85)) }}>
          {estimulo.e}
        </span>
      ) : (
        <span style={{ width: f(etiqueta ? 0.66 : 0.82), height: f(etiqueta ? 0.66 : 0.82) }}>
          <Figura tipo={estimulo.fig} semilla={estimulo.s} variante={estimulo.v} tono={estimulo.c} className="h-full w-full" />
        </span>
      )}
      {etiqueta && (
        <span className="font-bold text-slate-700" style={{ fontSize: f(0.13) }}>
          {etiqueta}
        </span>
      )}
    </span>
  )
}

// Emoji que forman el texto (🐕🍖 son 2): se reparten el ancho de la tarjeta
function numGrafemas(texto: string) {
  return [...new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(texto)].length
}
