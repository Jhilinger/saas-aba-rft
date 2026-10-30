// Glosario de términos RFT para el equipo: definiciones breves, en lenguaje
// de sesión. Se muestran junto a cada término (AyudaTermino) y completas en
// Ayuda → Glosario RFT.

export type EntradaGlosario = { termino: string; definicion: string; grupo: 'Estructura' | 'Fases' | 'Resultados y bloques especiales' | 'Conceptos' }

export const GLOSARIO_RFT = {
  clase: {
    grupo: 'Estructura',
    termino: 'Clase',
    definicion:
      'Estímulos que «van juntos» porque se relacionan entre sí (el dibujo de un plátano, la palabra «plátano», la palabra escrita). Cada miembro ocupa una posición.',
  },
  posicion: {
    grupo: 'Estructura',
    termino: 'Posición (A, B, C…)',
    definicion:
      'El lugar de un estímulo dentro de su clase. Se entrena la relación entre dos posiciones (A→B) y se comprueban las que no se enseñaron.',
  },
  grupo: {
    grupo: 'Estructura',
    termino: 'Grupo',
    definicion: 'Clases que se trabajan juntas: en cada ensayo, las otras clases del grupo hacen de comparaciones incorrectas.',
  },
  muestra_comparacion: {
    grupo: 'Estructura',
    termino: 'Muestra → comparación (origen → destino)',
    definicion: 'Se presenta la muestra y el alumno elige entre varias comparaciones; la correcta es la de su misma clase.',
  },
  secuencia: {
    grupo: 'Estructura',
    termino: 'Secuencia de bloques',
    definicion: 'El orden de fases y relaciones del programa. La app recomienda el primer paso que no está dominado.',
  },
  entrenamiento: {
    grupo: 'Fases',
    termino: 'Entrenamiento',
    definicion: 'Se enseña la relación directamente, con ayudas y refuerzo diferencial, hasta el criterio.',
  },
  test_mutuo: {
    grupo: 'Fases',
    termino: 'Test de vínculo mutuo',
    definicion: 'Se comprueba, sin enseñarla, la relación inversa a la entrenada: si se entrenó A→B, se prueba B→A.',
  },
  test_combinatorio: {
    grupo: 'Fases',
    termino: 'Test de vínculo combinatorio',
    definicion:
      'Se comprueba la relación entre estímulos que nunca se relacionaron directamente, a través de otros: entrenadas A→B y B→C, se prueban A→C y C→A.',
  },
  transformacion_funciones: {
    grupo: 'Fases',
    termino: 'Transformación de funciones',
    definicion:
      'Un estímulo adquiere una función (un uso, que guste, que se evite…) sin enseñarla, por estar relacionado con otro que ya la tiene.',
  },
  abstraccion: {
    grupo: 'Fases',
    termino: 'Abstracción de clave relacional',
    definicion:
      'Aprender a responder a la relación (igual, contrario, más grande…) con estímulos físicos, antes de aplicarla a estímulos arbitrarios.',
  },
  relacion_relaciones: {
    grupo: 'Fases',
    termino: 'Relacionar relaciones (analogía)',
    definicion: 'Comparar dos relaciones entre sí: «perro es a cachorro como gato es a gatito».',
  },
  derivado: {
    grupo: 'Resultados y bloques especiales',
    termino: 'Derivado',
    definicion: 'La relación sale bien en el test, sin ayudas, en el primer bloque: ha surgido sin enseñarla.',
  },
  dominado: {
    grupo: 'Resultados y bloques especiales',
    termino: 'Dominado',
    definicion: 'Alcanza el criterio del programa, en entrenamiento o tras entrenar un test que necesitó ayudas.',
  },
  sonda_mantenimiento: {
    grupo: 'Resultados y bloques especiales',
    termino: 'Sonda de mantenimiento',
    definicion: 'Bloque sin enseñanza sobre algo ya dominado, pasado un tiempo. No cambia el dominio.',
  },
  sonda_generalizacion: {
    grupo: 'Resultados y bloques especiales',
    termino: 'Sonda de generalización',
    definicion: 'Bloque sin enseñanza sobre algo ya dominado, con estímulos, personas o contextos nuevos. No cambia el dominio.',
  },
  ensayo_control: {
    grupo: 'Resultados y bloques especiales',
    termino: 'Ensayo de control',
    definicion:
      'Pregunta sobre una relación enseñada o enunciada tal cual, intercalada para comprobar que el alumno atiende y no responde por costumbre (por ejemplo, contestar siempre «diferente»). No cuenta para el dominio.',
  },
  clave_contextual: {
    grupo: 'Conceptos',
    termino: 'Clave contextual',
    definicion: 'La señal que indica qué relación aplica: «igual», «contrario», «más que», «antes de».',
  },
  relacion_arbitraria: {
    grupo: 'Conceptos',
    termino: 'Relación arbitraria',
    definicion:
      'La que depende del contexto o la convención y no del aspecto físico: la moneda de 10 céntimos es más pequeña que la de 5, pero vale más.',
  },
  deicticas: {
    grupo: 'Conceptos',
    termino: 'Relaciones deícticas',
    definicion: 'Las de perspectiva: yo–tú, aquí–allí, ahora–entonces.',
  },
} satisfies Record<string, EntradaGlosario>

export type ClaveGlosario = keyof typeof GLOSARIO_RFT

// Término del glosario para cada fase de los bloques RFT
export const GLOSARIO_POR_FASE: Record<string, ClaveGlosario> = {
  entrenamiento: 'entrenamiento',
  test_mutuo: 'test_mutuo',
  test_combinatorio: 'test_combinatorio',
  transformacion_funciones: 'transformacion_funciones',
  mantenimiento: 'sonda_mantenimiento',
  generalizacion: 'sonda_generalizacion',
}
