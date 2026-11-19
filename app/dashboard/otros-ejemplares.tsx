import type { ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

// Las demás fotos del concepto del banco que se usan al tomar datos: en
// entrenamiento se alternan la 1 y la 2, y en las sondas de generalización
// sale la 3. La ficha muestra la 1; aquí, en pequeño, las otras dos
export default function OtrosEjemplares({ imagenes, concepto }: { imagenes: ImagenesBanco; concepto: string | null }) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  const otros = [
    { clave: '2', etiqueta: 'También en entrenamiento' },
    { clave: '3', etiqueta: 'Sondas de generalización' },
  ].filter((o) => ejemplares[o.clave] && ejemplares[o.clave] !== ejemplares['1'])
  if (!otros.length) return null
  return (
    <span className="flex shrink-0 gap-1">
      {otros.map((o) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={o.clave}
          src={ejemplares[o.clave]}
          alt=""
          title={o.etiqueta}
          className={`h-8 w-8 rounded border bg-white object-contain ${o.clave === '3' ? 'border-dashed border-violet-300' : 'border-slate-200'}`}
        />
      ))}
    </span>
  )
}
