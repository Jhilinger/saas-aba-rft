'use client'

import { rutaConsignaGrabada, textoParaVoz } from './consignas-grabadas'

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

export function decir(texto: string, ajustes: AjustesVoz = leerAjustesVoz()) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const frase = new SpeechSynthesisUtterance(texto)
  frase.lang = 'es-ES'
  const voz = vocesEspanol().find((v) => v.voiceURI === ajustes.voz)
  if (voz) {
    frase.voice = voz
    frase.lang = voz.lang
  }
  frase.rate = ajustes.velocidad
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(frase)
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
}

function urlGrabacion(texto: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/biblioteca/${rutaConsignaGrabada(texto)}`
}

// Descarga y decodifica la grabación (una vez por consigna); null si no hay
export function precargarConsigna(texto: string) {
  const ctx = contextoAudio()
  if (!ctx) return Promise.resolve(null)
  let grabacion = grabaciones.get(texto)
  if (!grabacion) {
    grabacion = fetch(urlGrabacion(texto))
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((datos) => (datos ? ctx.decodeAudioData(datos) : null))
      .catch(() => null)
    grabaciones.set(texto, grabacion)
  }
  return grabacion
}

let sonando: AudioBufferSourceNode | null = null

export async function decirConsigna(texto: string) {
  const ctx = contextoAudio()
  const buffer = await precargarConsigna(texto)
  if (!ctx || !buffer) {
    decir(textoParaVoz(texto))
    return
  }
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {})
  sonando?.stop()
  window.speechSynthesis?.cancel()
  const fuente = ctx.createBufferSource()
  fuente.buffer = buffer
  fuente.connect(ctx.destination)
  fuente.start()
  sonando = fuente
}
