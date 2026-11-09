// Avatares de los niños en la app infantil: un animal por niño, para que se
// reconozcan en una tableta compartida sin fotos ni nombres completos
export const AVATARES: Record<string, { emoji: string; nombre: string; color: string }> = {
  perro: { emoji: '🐶', nombre: 'Perro', color: '#FDE7C8' },
  gato: { emoji: '🐱', nombre: 'Gato', color: '#FCE1E4' },
  leon: { emoji: '🦁', nombre: 'León', color: '#FFF1BF' },
  rana: { emoji: '🐸', nombre: 'Rana', color: '#DCF5D3' },
  mono: { emoji: '🐵', nombre: 'Mono', color: '#EFE1D1' },
  panda: { emoji: '🐼', nombre: 'Panda', color: '#E8ECEF' },
  koala: { emoji: '🐨', nombre: 'Koala', color: '#E3E8F3' },
  tigre: { emoji: '🐯', nombre: 'Tigre', color: '#FFE3C2' },
  conejo: { emoji: '🐰', nombre: 'Conejo', color: '#F6E6F5' },
  zorro: { emoji: '🦊', nombre: 'Zorro', color: '#FFDCC7' },
  oso: { emoji: '🐻', nombre: 'Oso', color: '#EADBCB' },
  pollito: { emoji: '🐥', nombre: 'Pollito', color: '#FFF6C2' },
}

export function avatar(clave: string | null | undefined) {
  return AVATARES[clave ?? ''] ?? AVATARES.perro
}
