// Pegatinas de la app infantil: una por sesión terminada. La de cada sesión
// sale del número de sesiones hechas en ese módulo, así el álbum y la
// pantalla final coinciden.
export const PEGATINAS = ['🌟', '🚀', '🦄', '🌈', '🎈', '🐳', '🍦', '⚽', '🎨', '🦖', '🌻', '🍓', '🚂', '🧸', '🎁', '🐞', '🦋', '🍉', '🏰', '🎵']

export function pegatinaDeSesion(indice: number) {
  return PEGATINAS[indice % PEGATINAS.length]
}
