// Refuerzo en la tableta del terapeuta (entrenamiento): economía de fichas en la
// pantalla (una estrella por acierto y una pantalla de premio al acabar el bloque,
// cuando el terapeuta da el reforzador de respaldo) y un sonido breve al acertar.
// Se recuerda en el dispositivo, como el elogio hablado. En los tests no hay
// refuerzo diferencial: ni fichas ni sonido.

export type PreferenciasRefuerzo = { fichas: boolean; sonido: boolean }

const CLAVE = 'abacontext:refuerzo'
const POR_DEFECTO: PreferenciasRefuerzo = { fichas: true, sonido: true }

export function leerRefuerzo(): PreferenciasRefuerzo {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as Partial<PreferenciasRefuerzo> | null
    return { ...POR_DEFECTO, ...(guardado ?? {}) }
  } catch {
    return POR_DEFECTO
  }
}

export function guardarRefuerzo(preferencias: PreferenciasRefuerzo) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(preferencias))
  } catch {
    // Sin almacenamiento: se usan las de por defecto
  }
}

// Sonido de acierto: dos notas cortas ascendentes, generadas (sin archivo)
let contexto: AudioContext | null = null
export function sonarAcierto() {
  try {
    contexto ??= new AudioContext()
    if (contexto.state === 'suspended') void contexto.resume()
    const ahora = contexto.currentTime
    ;[880, 1320].forEach((frecuencia, i) => {
      const oscilador = contexto!.createOscillator()
      const volumen = contexto!.createGain()
      oscilador.type = 'sine'
      oscilador.frequency.value = frecuencia
      const inicio = ahora + i * 0.11
      volumen.gain.setValueAtTime(0.0001, inicio)
      volumen.gain.exponentialRampToValueAtTime(0.25, inicio + 0.02)
      volumen.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.16)
      oscilador.connect(volumen).connect(contexto!.destination)
      oscilador.start(inicio)
      oscilador.stop(inicio + 0.18)
    })
  } catch {
    // Sin audio: no suena
  }
}
