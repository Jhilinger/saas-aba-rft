// Nombre legible de la clave de un ensayo generado (abstracción en la tableta)

const DIMENSION: Record<string, string> = { tamano: 'Tamaño', cantidad: 'Cantidad', longitud: 'Longitud', altura: 'Altura', color: 'Color', forma: 'Forma' }
const CLAVE: Record<string, string> = {
  igual: '«Igual»',
  diferente: '«Diferente»',
  intruso: '«Cuál es diferente»',
  contrario: '«Contrario»',
  antes: '«Antes»',
  despues: '«Después»',
  primero: '«Primero»',
  ultimo: '«Lo último»',
  mas: 'más',
  menos: 'menos',
  encima: '«Encima»',
  debajo: '«Debajo»',
  dentro: '«Dentro»',
  fuera: '«Fuera»',
  delante: '«Delante»',
  detras: '«Detrás»',
  efecto: '«¿Qué pasará?»',
  causa: '«¿Por qué ha pasado?»',
  color: '«Mismo color»',
  forma: '«Misma forma»',
  tamano: '«Mismo tamaño»',
  'color+forma': '«Color y forma»',
  'forma+tamano': '«Forma y tamaño»',
  'color+tamano': '«Color y tamaño»',
  asc: 'ordenar de menos a más',
  desc: 'ordenar de más a menos',
  // Analogía
  AB: 'Relación A–B',
  AC: 'Relación A–C',
  mutuo: 'Mutua',
  combinatorio: 'Combinatoria',
  grande_pequeno: '«Grande–pequeño»',
  pequeno_grande: '«Pequeño–grande»',
  creciente: '«De menor a mayor»',
  decreciente: '«De mayor a menor»',
  AAB: 'Patrón A-A-B',
  ABA: 'Patrón A-B-A',
  ABB: 'Patrón A-B-B',
  ABC: 'Patrón A-B-C',
}

export function etiquetaClave(clave: string) {
  const [a, b] = clave.split(':')
  if (b) return `${DIMENSION[a] ?? a} · «${(CLAVE[b] ?? b).replace(/[«»]/g, '')}»`
  return CLAVE[a] ?? a
}
