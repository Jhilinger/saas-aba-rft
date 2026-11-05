import type { Json } from '@/database.types'

// Juego de los vasos («Seguir visualmente» en la tableta). Cada conjunto de
// estímulos del programa es un nivel (conjuntos_estimulos_*.actividad_tablet):
// cuántos vasos, cuántos intercambios y a qué velocidad. El objeto preferido
// se esconde bajo un vaso, los vasos se intercambian y el alumno toca el vaso
// donde cree que está.

export type Velocidad = 'lenta' | 'media' | 'rapida'
export type ActividadVasos = { tipo: 'vasos'; vasos: 2 | 3; intercambios: number; velocidad: Velocidad }

export const MAX_INTERCAMBIOS = 8
export const NOMBRE_VELOCIDAD: Record<Velocidad, string> = { lenta: 'lenta', media: 'media', rapida: 'rápida' }
// Duración de cada intercambio (ms)
export const DURACION_INTERCAMBIO: Record<Velocidad, number> = { lenta: 1100, media: 700, rapida: 420 }

export function leerActividad(valor: Json | null | undefined): ActividadVasos | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const o = valor as Record<string, unknown>
  if (o.tipo !== 'vasos') return null
  const vasos = o.vasos === 3 ? 3 : 2
  const intercambios = typeof o.intercambios === 'number' ? Math.min(MAX_INTERCAMBIOS, Math.max(0, Math.round(o.intercambios))) : 0
  const velocidad: Velocidad = o.velocidad === 'media' || o.velocidad === 'rapida' ? o.velocidad : 'lenta'
  return { tipo: 'vasos', vasos, intercambios, velocidad }
}

export function describirActividad(a: ActividadVasos): string {
  const intercambios = a.intercambios === 0 ? 'sin intercambios' : `${a.intercambios} intercambio${a.intercambios === 1 ? '' : 's'}`
  return `${a.vasos} vasos · ${intercambios} · velocidad ${NOMBRE_VELOCIDAD[a.velocidad]}`
}

// Intercambios al azar: pares de huecos distintos. Con 3 vasos, la mitad de
// las veces interviene el vaso del objeto, para que haya que seguirlo
export function generarIntercambios(vasos: number, n: number, huecoObjeto: number, azar = Math.random): [number, number][] {
  const lista: [number, number][] = []
  let objeto = huecoObjeto
  for (let i = 0; i < n; i++) {
    let a: number
    let b: number
    if (vasos === 2) {
      ;[a, b] = [0, 1]
    } else {
      a = azar() < 0.5 ? objeto : Math.floor(azar() * 3)
      do b = Math.floor(azar() * 3)
      while (b === a)
    }
    lista.push([a, b])
    if (objeto === a) objeto = b
    else if (objeto === b) objeto = a
  }
  return lista
}
