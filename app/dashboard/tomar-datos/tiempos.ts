// Validación en el servidor: descarta valores imposibles (negativos o de más de
// 10 minutos por ensayo / 4 horas por bloque, normalmente pausas largas)
export function latenciaValida(ms: unknown): number | null {
  return typeof ms === 'number' && Number.isFinite(ms) && ms >= 0 && ms <= 10 * 60 * 1000 ? Math.round(ms) : null
}

export function duracionValida(segundos: unknown): number | null {
  return typeof segundos === 'number' && Number.isFinite(segundos) && segundos >= 0 && segundos <= 4 * 60 * 60
    ? Math.round(segundos)
    : null
}

export function latenciaMedia(latencias: (number | null)[]): number | null {
  const validas = latencias.filter((l): l is number => l !== null)
  return validas.length ? Math.round(validas.reduce((s, l) => s + l, 0) / validas.length) : null
}
