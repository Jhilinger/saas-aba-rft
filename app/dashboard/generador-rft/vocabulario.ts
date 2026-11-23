// Vocabulario cerrado del generador de grupos (revisado a mano). Los nombres son
// inventados para que ninguna propiedad física ni conocida indique la relación.

export const NOMBRES = [
  'Pim', 'Tok', 'Lu', 'Bori', 'Tasi', 'Zup', 'Dax', 'Nok', 'Fen', 'Sami', 'Rul', 'Kiri', 'Tiko', 'Pal', 'Fi', 'Mo',
  'Lesu', 'Dun', 'Gor', 'Bavi', 'Rasu', 'Tin', 'Saro', 'Fito', 'Coli', 'Mepo', 'Gufi', 'Zaba', 'Kuli', 'Nub', 'Lipa',
  'Tuli', 'Pupi', 'Rof', 'Bimo', 'Sefa', 'Nilu', 'Toba', 'Mavi', 'Dofi', 'Keru', 'Lomi', 'Pefa', 'Ruto', 'Siba', 'Tavo',
  'Vemi', 'Zolu', 'Bek', 'Diru', 'Faki', 'Guno', 'Jopi', 'Kalo', 'Mupe', 'Nefo', 'Pori', 'Suki',
]

// Personajes de las relaciones temporales (uno por clase)
export const PERSONAJES = ['Pim', 'Tok', 'Lu', 'Mo', 'Kiri', 'Dax', 'Bo', 'Fi']

// Dimensiones de comparación: sintagma, polos y pregunta (todas abstraídas en
// «Abstraer Claves de Comparación»)
// Transformación de funciones (las mismas situaciones que los grupos del currículo):
// - justo: umbral para el vínculo mutuo. justo[0] nombra al del polo 0 (alto,
//   largo…) y la respuesta es el otro; justo[1] nombra al del polo 1.
// - mejor: situación que pide el extremo en la red. mejor[0] pide el del polo 0;
//   mejor[1], el del polo 1.
type Dimension = {
  sintagma: (n: string) => string
  polos: [string, string]
  pregunta: string
  justo: [(x: string) => string, (x: string) => string]
  mejor: [string, string]
}

export const DIMENSIONES: Dimension[] = [
  {
    sintagma: (n) => n,
    polos: ['alto', 'bajo'],
    pregunta: '¿Quién es',
    justo: [(x) => `${x} llega justo a la estantería de arriba. ¿Quién no llega?`, (x) => `${x} cabe justo por debajo de la rama. ¿Quién no cabe?`],
    mejor: ['Hay que coger un bote de la estantería más alta. ¿A quién sería mejor pedírselo?', 'Hay que pasar por debajo de una rama muy baja. ¿Quién pasaría mejor?'],
  },
  {
    sintagma: (n) => `el tren ${n}`,
    polos: ['largo', 'corto'],
    pregunta: '¿Qué tren es',
    justo: [(x) => `En el tren ${x} caben justo todos los niños. ¿En qué tren no caben?`, (x) => `El tren ${x} cabe justo en la estación pequeña. ¿Qué tren no cabe?`],
    mejor: ['Van de excursión muchísimos niños. ¿Qué tren sería mejor coger?', 'La estación es muy pequeña. ¿Qué tren cabría mejor?'],
  },
  {
    sintagma: (n) => `la caja ${n}`,
    polos: ['pesada', 'ligera'],
    pregunta: '¿Qué caja es',
    justo: [(x) => `La caja ${x} sujeta justo la puerta para que no se cierre. ¿Qué caja no la sujeta?`, (x) => `Ana levanta justo la caja ${x}. ¿Qué caja no puede levantar Ana?`],
    mejor: ['Hay que sujetar la puerta un día de mucho viento. ¿Qué caja sería mejor usar?', 'Ana tiene que llevar una caja muy lejos. ¿Qué caja sería mejor darle?'],
  },
  {
    sintagma: (n) => `el coche ${n}`,
    polos: ['rápido', 'lento'],
    pregunta: '¿Qué coche es',
    justo: [
      (x) => `El coche ${x} llega justo a tiempo a la tienda. ¿Qué coche no llega a tiempo?`,
      (x) => `El coche ${x} va justo a la velocidad que se permite en la calle del colegio. ¿Qué coche va demasiado deprisa para esa calle?`,
    ],
    mejor: ['Hay que llegar lo antes posible. ¿Qué coche sería mejor coger?', 'En la calle del colegio hay que ir muy despacio. ¿Qué coche iría mejor?'],
  },
  {
    sintagma: (n) => `la pelota ${n}`,
    polos: ['grande', 'pequeña'],
    pregunta: '¿Qué pelota es',
    justo: [(x) => `La pelota ${x} tapa justo el agujero de la valla. ¿Qué pelota no lo tapa?`, (x) => `La pelota ${x} cabe justo por el tubo. ¿Qué pelota no cabe?`],
    mejor: ['Hay que tapar un agujero muy grande. ¿Qué pelota sería mejor usar?', 'Hay que pasar una pelota por un tubo muy estrecho. ¿Qué pelota sería mejor usar?'],
  },
  {
    sintagma: (n) => `la torre ${n}`,
    polos: ['alta', 'baja'],
    pregunta: '¿Qué torre es',
    justo: [(x) => `La torre ${x} se ve justo desde el pueblo. ¿Qué torre no se ve?`, (x) => `La torre ${x} cabe justo debajo del puente. ¿Qué torre no cabe?`],
    mejor: ['La torre tiene que verse desde muy lejos. ¿Qué torre se vería mejor?', 'Hay que pasar una torre por debajo de un puente muy bajo. ¿Qué torre cabría mejor?'],
  },
]

// Objetos del banco de imágenes para las relaciones espaciales (con artículo)
export const OBJETOS: Record<string, string> = {
  'alimentos/galleta': 'la galleta', 'alimentos/manzana': 'la manzana', 'alimentos/pan': 'el pan',
  'alimentos/platano': 'el plátano', 'alimentos/queso': 'el queso', 'animales-de-granja/burro': 'el burro',
  'animales-de-granja/caballo': 'el caballo', 'animales-de-granja/cabra': 'la cabra', 'animales-de-granja/cerdo': 'el cerdo',
  'animales-de-granja/gallina': 'la gallina', 'animales-de-granja/gato': 'el gato', 'animales-de-granja/oveja': 'la oveja',
  'animales-de-granja/pato': 'el pato', 'animales-de-granja/perro': 'el perro', 'animales-de-granja/vaca': 'la vaca',
  'material-escolar/goma': 'la goma', 'material-escolar/lapiz': 'el lápiz', 'material-escolar/libro': 'el libro',
  'material-escolar/regla': 'la regla', 'material-escolar/rotulador': 'el rotulador', 'muebles/armario': 'el armario',
  'muebles/cama': 'la cama', 'muebles/comoda': 'la cómoda', 'muebles/estanteria': 'la estantería', 'muebles/mesa': 'la mesa',
  'muebles/silla': 'la silla', 'muebles/sofa': 'el sofá', 'objetos/globo': 'el globo', 'objetos/muneca': 'la muñeca',
  'objetos/pelota': 'la pelota', 'objetos/peluche': 'el peluche', 'objetos/reloj': 'el reloj', 'prendas-de-vestir/gorro': 'el gorro',
  'utensilios-de-cocina/bol': 'el bol', 'utensilios-de-cocina/cuchara': 'la cuchara', 'utensilios-de-cocina/plato': 'el plato',
  'utensilios-de-cocina/taza': 'la taza', 'utensilios-de-cocina/tenedor': 'el tenedor', 'utensilios-de-cocina/vaso': 'el vaso',
  'vehiculos/ambulancia': 'la ambulancia', 'vehiculos/autobus': 'el autobús', 'vehiculos/camion': 'el camión',
  'vehiculos/coche': 'el coche', 'vehiculos/moto': 'la moto', 'vehiculos/tractor': 'el tractor',
}

// Marcos espaciales trabajados (no se añaden otros): [relación, extremo] por polo
export const MARCOS: [[string, string], [string, string]][] = [
  [['encima', 'más arriba'], ['debajo', 'más abajo']],
  [['delante', 'más adelante'], ['detrás', 'más atrás']],
  [['a la izquierda', 'más a la izquierda'], ['a la derecha', 'más a la derecha']],
]

// Lado de cada relación para la transformación («Empiezas a pintar por arriba…»)
// y hacia dónde se avanza desde él
export const LADO: Record<string, { lado: string; avance: string }> = {
  encima: { lado: 'arriba', avance: 'vas bajando' },
  debajo: { lado: 'abajo', avance: 'vas subiendo' },
  delante: { lado: 'delante', avance: 'vas hacia atrás' },
  detrás: { lado: 'detrás', avance: 'vas hacia delante' },
  'a la izquierda': { lado: 'la izquierda', avance: 'vas hacia la derecha' },
  'a la derecha': { lado: 'la derecha', avance: 'vas hacia la izquierda' },
}

// Acciones con imagen del banco, sin orden habitual entre ellas: [3.ª persona, infinitivo]
export const ACCIONES: Record<string, [string, string]> = {
  abrazar: ['abraza', 'abrazar'], aplaudir: ['aplaude', 'aplaudir'], bailar: ['baila', 'bailar'],
  barrer: ['barre', 'barrer'], beber: ['bebe', 'beber'], cantar: ['canta', 'cantar'],
  cocinar: ['cocina', 'cocinar'], correr: ['corre', 'correr'], cortar: ['recorta', 'recortar'],
  escribir: ['escribe', 'escribir'], jugar: ['juega', 'jugar'], leer: ['lee', 'leer'],
  'montar-en-bici': ['monta en bici', 'montar en bici'], peinarse: ['se peina', 'peinarse'],
  pintar: ['pinta', 'pintar'], saltar: ['salta', 'saltar'], soplar: ['sopla', 'soplar'],
  'subir-escaleras': ['sube las escaleras', 'subir las escaleras'],
}

// ---------------------------------------------------------------- Distinción
// Objetos conocidos con su propiedad (vínculo mutuo de distinción). El nombre
// inventado (B) es siempre masculino («el tasi»): el adjetivo va en masculino.
export type ObjetoDistincion = { np: string; plural?: boolean; valor: string }
export const DISTINCION: {
  dimension: 'funcion' | 'color' | 'forma' | 'sabor'
  objetos: ObjetoDistincion[]
}[] = [
  {
    dimension: 'funcion',
    objetos: [
      { np: 'el balón', valor: 'jugar' },
      { np: 'la cuchara', valor: 'comer sopa' },
      { np: 'el vaso', valor: 'beber agua' },
      { np: 'el lápiz', valor: 'escribir' },
      { np: 'la llave', valor: 'abrir la puerta' },
      { np: 'las tijeras', plural: true, valor: 'cortar papel' },
      { np: 'el peine', valor: 'peinarse' },
      { np: 'la escoba', valor: 'barrer' },
      { np: 'la toalla', valor: 'secarse' },
    ],
  },
  {
    dimension: 'color',
    objetos: [
      { np: 'el plátano', valor: 'amarillo' },
      { np: 'el tomate', valor: 'rojo' },
      { np: 'la hierba', valor: 'verde' },
      { np: 'la nieve', valor: 'blanco' },
      { np: 'el cielo', valor: 'azul' },
      { np: 'el carbón', valor: 'negro' },
      { np: 'la fresa', valor: 'rojo' },
      { np: 'la leche', valor: 'blanco' },
    ],
  },
  {
    dimension: 'forma',
    objetos: [
      { np: 'la pelota', valor: 'redondo' },
      { np: 'el dado', valor: 'cuadrado' },
      { np: 'la regla', valor: 'alargado' },
      { np: 'el huevo', valor: 'ovalado' },
      { np: 'la moneda', valor: 'redondo' },
      { np: 'la ventana', valor: 'cuadrado' },
      { np: 'el plato', valor: 'redondo' },
    ],
  },
  {
    dimension: 'sabor',
    objetos: [
      { np: 'el limón', valor: 'ácido' },
      { np: 'el azúcar', valor: 'dulce' },
      { np: 'la sal', valor: 'salado' },
      { np: 'el café', valor: 'amargo' },
      { np: 'el caramelo', valor: 'dulce' },
      { np: 'el vinagre', valor: 'ácido' },
      { np: 'la miel', valor: 'dulce' },
    ],
  },
]

// Redes de distinción: palabras sin sentido en mayúsculas y contextos de la
// transformación (cualquiera con cualquier patrón, para que el contexto no
// anticipe la respuesta)
export const SILABAS_DISTINCION = {
  consonantes: ['B', 'D', 'F', 'G', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'],
  vocales: ['A', 'E', 'I', 'O', 'U'],
}
export const CONTEXTOS_DISTINCION = [
  { plural: 'zumos', dimension: 'el sabor', np: 'el zumo', propiedad: 'dulce' },
  { plural: 'cuerdas', dimension: 'la longitud', np: 'la cuerda', propiedad: 'larga' },
  { plural: 'pinturas', dimension: 'el color', np: 'la pintura', propiedad: 'roja' },
]

// ---------------------------------------------------------------- Oposición
// Objetos con dos efectos contrarios: efecto[i] es lo que hace (3.ª persona) y
// quiero[i], lo que se quiere cuando se busca ese efecto. Con «es», la relación se
// dice «es lo contrario de» (cosas); con «hace», «hace lo contrario que» (aparatos)
export const OPOSICION: {
  sustantivo: string
  femenino: boolean
  verbo: 'hace' | 'es'
  efecto: [string, string]
  quiero: [string, string]
  elegir: 'uso' | 'elijo'
}[] = [
  { sustantivo: 'botón', femenino: false, verbo: 'hace', efecto: ['enciende la luz', 'apaga la luz'], quiero: ['Quiero encender la luz', 'Quiero apagar la luz'], elegir: 'uso' },
  { sustantivo: 'palanca', femenino: true, verbo: 'hace', efecto: ['hace que el tren arranque', 'hace que el tren se pare'], quiero: ['Quiero que el tren arranque', 'Quiero que el tren se pare'], elegir: 'uso' },
  { sustantivo: 'llave', femenino: true, verbo: 'hace', efecto: ['abre la puerta', 'cierra la puerta'], quiero: ['Quiero abrir la puerta', 'Quiero cerrar la puerta'], elegir: 'uso' },
  { sustantivo: 'grifo', femenino: false, verbo: 'hace', efecto: ['echa agua fría', 'echa agua caliente'], quiero: ['Quiero agua fría', 'Quiero agua caliente'], elegir: 'uso' },
  { sustantivo: 'interruptor', femenino: false, verbo: 'hace', efecto: ['sube la persiana', 'baja la persiana'], quiero: ['Quiero subir la persiana', 'Quiero bajar la persiana'], elegir: 'uso' },
  { sustantivo: 'tecla', femenino: true, verbo: 'hace', efecto: ['sube el volumen', 'baja el volumen'], quiero: ['Quiero subir el volumen', 'Quiero bajar el volumen'], elegir: 'uso' },
  { sustantivo: 'mando', femenino: false, verbo: 'hace', efecto: ['enciende la tele', 'apaga la tele'], quiero: ['Quiero encender la tele', 'Quiero apagar la tele'], elegir: 'uso' },
  { sustantivo: 'pedal', femenino: false, verbo: 'hace', efecto: ['hace que la bici vaya más deprisa', 'hace que la bici vaya más despacio'], quiero: ['Quiero que la bici vaya más deprisa', 'Quiero que la bici vaya más despacio'], elegir: 'uso' },
  { sustantivo: 'poción', femenino: true, verbo: 'hace', efecto: ['hace crecer', 'hace encoger'], quiero: ['Quiero hacerme grande', 'Quiero hacerme pequeño'], elegir: 'uso' },
  { sustantivo: 'silbato', femenino: false, verbo: 'hace', efecto: ['hace que los perros vengan', 'hace que los perros se vayan'], quiero: ['Quiero que los perros vengan', 'Quiero que los perros se vayan'], elegir: 'uso' },
  { sustantivo: 'tambor', femenino: false, verbo: 'hace', efecto: ['despierta al dragón', 'duerme al dragón'], quiero: ['Quiero despertar al dragón', 'Quiero dormir al dragón'], elegir: 'uso' },
  { sustantivo: 'varita', femenino: true, verbo: 'hace', efecto: ['hace aparecer al conejo', 'hace desaparecer al conejo'], quiero: ['Quiero que el conejo aparezca', 'Quiero que el conejo desaparezca'], elegir: 'uso' },
  { sustantivo: 'bebida', femenino: true, verbo: 'es', efecto: ['está caliente', 'está fría'], quiero: ['Quiero beber algo caliente', 'Quiero beber algo frío'], elegir: 'elijo' },
  { sustantivo: 'caramelo', femenino: false, verbo: 'es', efecto: ['es dulce', 'es salado'], quiero: ['Quiero algo dulce', 'Quiero algo salado'], elegir: 'elijo' },
  { sustantivo: 'manta', femenino: true, verbo: 'es', efecto: ['da calor', 'refresca'], quiero: ['Tengo frío y quiero calentarme', 'Tengo calor y quiero refrescarme'], elegir: 'elijo' },
  { sustantivo: 'caja', femenino: true, verbo: 'es', efecto: ['tiene un premio dentro', 'está vacía'], quiero: ['Quiero una caja con premio', 'Quiero la caja vacía'], elegir: 'elijo' },
  { sustantivo: 'fruta', femenino: true, verbo: 'es', efecto: ['es blanda', 'es dura'], quiero: ['Quiero una fruta blanda', 'Quiero una fruta dura'], elegir: 'elijo' },
]

// ---------------------------------------------------------------- Condicionales
// Parejas de personajes (el que hace la condición y el que responde)
export const PAREJAS = [['Pim', 'Tok'], ['Lu', 'Mo'], ['Kiri', 'Dax'], ['Bo', 'Fi']] as const
