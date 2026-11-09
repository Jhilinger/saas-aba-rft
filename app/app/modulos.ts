// Módulos de la app infantil (familias y escuelas, 3–6 años): cada uno es una
// lista ordenada de programas del currículo global que funcionan en la tableta.
// La app los importa sola al PEI del niño y avanza al siguiente cuando el
// grupo 1 del anterior está completo (los demás grupos se intercalan después).
// Orden aprobado por el usuario el 2026-11-09. Las relaciones arbitrarias del
// nivel 3 se añadirán más adelante.

export type ClaveModulo = 'leer' | 'vocabulario' | 'numeros'
export type Modulo = { clave: ClaveModulo; nombre: string; emoji: string; color: string; programas: string[] }

const vincular = (que: string) => `Vincular Mutuamente ${que} con sus Nombres`

export const MODULOS: Modulo[] = [
  {
    clave: 'leer',
    nombre: 'Aprender a leer',
    emoji: '📖',
    color: '#FFE8D6',
    programas: [
      vincular('Letras'),
      'Vincular Mutuamente Letras con sus Grafías',
      vincular('Sílabas'),
      'Vincular Mutuamente Sílabas con sus Grafías',
      vincular('Palabras Impresas'),
      'Vincular Mutuamente Palabras con sus Grafías',
      'Vincular Mutuamente Oraciones y Textos con sus Grafías',
      'Leer Oraciones y Textos',
    ],
  },
  {
    clave: 'vocabulario',
    nombre: 'Vocabulario y conceptos básicos',
    emoji: '🧩',
    color: '#DCF2E6',
    programas: [
      'Igualar Imágenes',
      vincular('Alimentos'),
      vincular('Animales de Granja'),
      'Abstraer Claves de Distinción',
      vincular('Vehículos'),
      vincular('Prendas de Vestir'),
      vincular('Partes del Cuerpo'),
      vincular('Colores'),
      vincular('Figuras Geométricas'),
      'Abstraer Claves de Comparación',
      vincular('Animales Salvajes'),
      vincular('Animales Marinos'),
      vincular('Utensilios de Cocina'),
      vincular('Muebles'),
      'Abstraer Claves de Oposición',
      vincular('Acciones'),
      vincular('Emociones'),
      vincular('Características'),
      'Abstraer Claves Espaciales',
      vincular('Profesiones'),
      vincular('Funciones de los Objetos'),
      vincular('Materiales Escolares'),
      vincular('Dependencias de una Casa'),
      'Abstraer Claves Temporales',
      vincular('Instrumentos Musicales'),
      vincular('Plantas'),
      vincular('Deportes'),
      vincular('Herramientas'),
      vincular('Electrodomésticos'),
      vincular('Climas'),
      vincular('Estaciones del Año'),
      vincular('Partes del Universo'),
      vincular('Sensaciones Corporales'),
      vincular('Cuentos'),
      'Responder a Preguntas sobre Características',
      'Responder a Preguntas sobre Funciones de los Objetos',
      'Responder a Preguntas ¿Quién?',
      'Responder a Preguntas ¿Dónde?',
      'Responder a Preguntas ¿Cuándo?',
      'Responder a Preguntas ¿Cómo?',
    ],
  },
  {
    clave: 'numeros',
    nombre: 'Números y cantidades',
    emoji: '🔢',
    color: '#E3E9FB',
    programas: [vincular('Números'), 'Vincular Mutuamente Números con sus Grafías', 'Vincular Números, Grafías y Cantidades'],
  },
]

export function moduloPorClave(clave: string) {
  return MODULOS.find((m) => m.clave === clave) ?? null
}
