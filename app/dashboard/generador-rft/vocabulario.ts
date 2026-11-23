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
