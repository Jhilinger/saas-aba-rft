'use client'

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
