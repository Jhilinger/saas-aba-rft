'use client'

import { rutaConsignaGrabada, rutaFraseRft, textoParaVoz } from './consignas-grabadas'

// Voz sintética de las pantallas de tableta. Usa las voces del dispositivo
// (Web Speech API); la voz y la velocidad elegidas se guardan en el propio
// dispositivo, porque cada tableta tiene sus voces.

const CLAVE = 'abacontext:voz'
const VELOCIDAD_POR_DEFECTO = 0.9

export type AjustesVoz = { voz: string | null; velocidad: number }

export function leerAjustesVoz(): AjustesVoz {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? 'null')
    return {
      voz: typeof guardado?.voz === 'string' ? guardado.voz : null,
      velocidad: typeof guardado?.velocidad === 'number' ? guardado.velocidad : VELOCIDAD_POR_DEFECTO,
    }
  } catch {
    return { voz: null, velocidad: VELOCIDAD_POR_DEFECTO }
  }
}

export function guardarAjustesVoz(ajustes: AjustesVoz) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(ajustes))
  } catch {
    // Sin almacenamiento (modo privado): se usa la voz por defecto
  }
}

// Voces en español del dispositivo, primero las de España
export function vocesEspanol(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
    .sort((a, b) => Number(b.lang === 'es-ES') - Number(a.lang === 'es-ES') || a.name.localeCompare(b.name, 'es'))
}

// Se resuelve al terminar de hablar (o, si el dispositivo no avisa, pasado un
// tiempo máximo según la longitud)
export function decir(texto: string, ajustes: AjustesVoz = leerAjustesVoz()): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve()
  const frase = new SpeechSynthesisUtterance(texto)
  frase.lang = 'es-ES'
  const voz = vocesEspanol().find((v) => v.voiceURI === ajustes.voz)
  if (voz) {
    frase.voice = voz
    frase.lang = voz.lang
  }
  frase.rate = ajustes.velocidad
  const fin = new Promise<void>((resolver) => {
    const tope = setTimeout(resolver, 2000 + (texto.length * 120) / ajustes.velocidad)
    frase.onend = frase.onerror = () => {
      clearTimeout(tope)
      resolver()
    }
  })
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(frase)
  return fin
}

// Consignas grabadas (consignas-grabadas.ts). Se reproducen con Web Audio:
// el contexto se desbloquea con un toque del evaluador y después la
// grabación puede sonar al aparecer la muestra, sin otro toque (iPad).
// Si no hay grabación de una consigna, se dice con la voz del dispositivo.

let contexto: AudioContext | null = null
const grabaciones = new Map<string, Promise<AudioBuffer | null>>()

function contextoAudio() {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  contexto ??= new AudioContext()
  return contexto
}

// Llamar desde un toque (gesto del usuario)
export function desbloquearAudio() {
  const ctx = contextoAudio()
  if (ctx?.state === 'suspended') void ctx.resume()
  // iPad: la voz del dispositivo solo habla fuera de un toque si ya ha hablado
  // una vez dentro de uno; una frase vacía la desbloquea para las frases sin
  // grabación, que se dicen tras descargar (sin gesto)
  if (!vozDesbloqueada && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const vacia = new SpeechSynthesisUtterance('')
    vacia.volume = 0
    window.speechSynthesis.speak(vacia)
    vozDesbloqueada = true
  }
}

let vozDesbloqueada = false

function urlGrabacion(ruta: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/biblioteca/${ruta}`
}

// Descarga y decodifica una grabación (una vez por ruta); null si no hay
function precargar(ruta: string) {
  const ctx = contextoAudio()
  if (!ctx) return Promise.resolve(null)
  let grabacion = grabaciones.get(ruta)
  if (!grabacion) {
    grabacion = fetch(urlGrabacion(ruta))
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((datos) => (datos ? ctx.decodeAudioData(datos) : null))
      .catch(() => null)
    grabaciones.set(ruta, grabacion)
  }
  return grabacion
}

export function precargarConsigna(texto: string) {
  return precargar(rutaConsignaGrabada(texto))
}

// Claves relacionales de la tableta RFT (grabadas con otra voz)
export function precargarFraseRft(texto: string) {
  return precargar(rutaFraseRft(texto))
}

let sonando: AudioBufferSourceNode | null = null

// Se resuelve al terminar la frase (también si la corta otra)
async function reproducir(texto: string, ruta: string): Promise<void> {
  const ctx = contextoAudio()
  const buffer = await precargar(ruta)
  if (!ctx || !buffer) return decir(textoParaVoz(texto))
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {})
  sonando?.stop()
  window.speechSynthesis?.cancel()
  const fuente = ctx.createBufferSource()
  fuente.buffer = buffer
  fuente.connect(ctx.destination)
  const fin = new Promise<void>((resolver) => {
    fuente.onended = () => resolver()
  })
  fuente.start()
  sonando = fuente
  return fin
}

export function decirConsigna(texto: string) {
  return reproducir(texto, rutaConsignaGrabada(texto))
}

// Dice una frase de la tableta RFT con su grabación o, si no la hay (ej. una
// clave editada o un estímulo propio), con la voz del dispositivo
export function decirFraseRft(texto: string) {
  return reproducir(texto, rutaFraseRft(texto))
}
