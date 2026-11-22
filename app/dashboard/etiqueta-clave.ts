// Nombre legible de la clave de un ensayo generado (abstracción en la tableta)

const DIMENSION: Record<string, string> = { tamano: 'Tamaño', cantidad: 'Cantidad', longitud: 'Longitud', altura: 'Altura' }
const CLAVE: Record<string, string> = {
  igual: '«Igual»',
  diferente: '«Diferente»',
  intruso: '«Cuál es diferente»',
  contrario: '«Contrario»',
  antes: '«Antes»',
  despues: '«Después»',
  primero: '«Primero»',
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
}

export function etiquetaClave(clave: string) {
  const [a, b] = clave.split(':')
  if (b) return `${DIMENSION[a] ?? a} · «${CLAVE[b] ?? b}»`
  return CLAVE[a] ?? a
}
