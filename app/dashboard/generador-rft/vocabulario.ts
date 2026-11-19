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
export const DIMENSIONES: { sintagma: (n: string) => string; polos: [string, string]; pregunta: string }[] = [
  { sintagma: (n) => n, polos: ['alto', 'bajo'], pregunta: '¿Quién es' },
  { sintagma: (n) => `el tren ${n}`, polos: ['largo', 'corto'], pregunta: '¿Qué tren es' },
  { sintagma: (n) => `la caja ${n}`, polos: ['pesada', 'ligera'], pregunta: '¿Qué caja es' },
  { sintagma: (n) => `el coche ${n}`, polos: ['rápido', 'lento'], pregunta: '¿Qué coche es' },
  { sintagma: (n) => `la pelota ${n}`, polos: ['grande', 'pequeña'], pregunta: '¿Qué pelota es' },
  { sintagma: (n) => `la torre ${n}`, polos: ['alta', 'baja'], pregunta: '¿Qué torre es' },
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
