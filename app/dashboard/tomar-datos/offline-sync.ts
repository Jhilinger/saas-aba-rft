// Evita perder los datos de un bloque de ensayos si se corta la conexión a
// mitad de sesión: el progreso se guarda en el dispositivo según se registra
// cada ensayo, y si el guardado final en el servidor falla por red (no por
// un error real de validación), los datos quedan a salvo para reintentar en
// cuanto vuelva la conexión.

const PREFIJO = 'abacontext:tomar-datos:'

export function leerProgreso<T>(clave: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PREFIJO + clave)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function guardarProgreso<T>(clave: string, valor: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
  } catch {
    // almacenamiento lleno o bloqueado (modo privado): en el peor caso se
    // pierde la protección offline, nunca los datos ya guardados en memoria
  }
}

export function borrarProgreso(clave: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(PREFIJO + clave)
  } catch {
    // ignorar
  }
}

// Distingue un fallo de red (hay que reintentar solo cuando vuelva la
// conexión, sin tocar los datos) de un error real del servidor.
export function esFalloDeRed(e: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true
  return e instanceof TypeError
}
