import ContenidoEstimulo from './contenido-estimulo'
import { parsearEstimuloPantalla } from './estimulo-pantalla'
import { urlImagen, type ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

// Miniatura de un estímulo que se dibuja en pantalla (figura, texto,
// cantidad, color…) en las fichas de las clases; las fotos del banco o
// propias las muestra ImagenEstimulo
export default function MiniaturaEstimulo({ pantalla, imagenes }: { pantalla: unknown; imagenes: ImagenesBanco }) {
  const estimulo = parsearEstimuloPantalla(pantalla)
  if (!estimulo) return null
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
      <ContenidoEstimulo estimulo={estimulo} lado="3rem" urlImagen={(c) => urlImagen(imagenes, c, 'entrenamiento', 0)} />
    </span>
  )
}
