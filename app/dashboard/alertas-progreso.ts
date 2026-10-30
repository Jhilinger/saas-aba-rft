// Alertas de estancamiento: reglas sobre los bloques de una unidad de trabajo
// (un conjunto ABA en intervención, o una combinación grupo + fase +
// posiciones RFT aún no dominada). Funciones puras; los bloques llegan en
// orden cronológico y sin sondas.

export type BloqueAlerta = {
  fecha: string
  porcentaje: number
  fase: string
  latenciaMediaMs: number | null
  aciertos: number
  // Aciertos que necesitaron alguna ayuda
  aciertosConAyuda: number
  controlesTotal: number
  controlesAciertos: number
}

export type TipoAlerta = 'sin_progreso' | 'retroceso' | 'dependencia_ayudas' | 'test_no_deriva' | 'controles' | 'fluidez'

export type Alerta = { tipo: TipoAlerta; detalle: string }

export const BLOQUES_SIN_PROGRESO = 8
export const MEJORA_MINIMA = 10
export const CAIDA_RETROCESO = 15
export const BLOQUES_AYUDAS = 5
export const PROPORCION_AYUDAS = 0.5
export const BLOQUES_TEST = 3
export const ACIERTO_CONTROLES = 0.8
export const ACIERTO_FLUIDEZ = 80
export const AUMENTO_LATENCIA = 1.5

export const ALERTA: Record<TipoAlerta, { titulo: string; sugerencia: string }> = {
  sin_progreso: {
    titulo: 'Sin progreso',
    sugerencia: 'Revisar el refuerzo y la motivación, dividir el objetivo, reducir el número de comparaciones y comprobar los requisitos previos.',
  },
  retroceso: {
    titulo: 'Retroceso',
    sugerencia: 'Revisar qué ha cambiado (terapeuta, estímulos, contexto, salud) y volver al último paso con éxito.',
  },
  dependencia_ayudas: {
    titulo: 'Dependencia de ayudas',
    sugerencia: 'Plan de desvanecimiento (demora progresiva, ayuda menos intrusiva) y reforzar diferencialmente las respuestas independientes.',
  },
  test_no_deriva: {
    titulo: 'Test que no se deriva',
    sugerencia: 'Reforzar el entrenamiento base (sobreaprendizaje), entrenamiento con múltiples ejemplares y comprobar la discriminación entre estímulos.',
  },
  controles: {
    titulo: 'Controles fallados',
    sugerencia: 'Posible respuesta por sesgo o por costumbre: revisarlo antes de interpretar los tests.',
  },
  fluidez: {
    titulo: 'Fluidez',
    sugerencia: 'Trabajar la fluidez antes de dar el objetivo por consolidado.',
  },
}

const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
const redondear = (x: number) => Math.round(x)

export function alertasDeUnidad(bloques: BloqueAlerta[], esTest: boolean): Alerta[] {
  const alertas: Alerta[] = []
  const pct = bloques.map((b) => b.porcentaje)

  if (esTest && bloques.length >= BLOQUES_TEST) {
    alertas.push({ tipo: 'test_no_deriva', detalle: `${bloques.length} bloques de test sin derivar ni dominar` })
  }

  if (bloques.length >= BLOQUES_SIN_PROGRESO) {
    const inicio = media(pct.slice(0, 3))
    const final = media(pct.slice(-3))
    if (final - inicio <= MEJORA_MINIMA) {
      alertas.push({
        tipo: 'sin_progreso',
        detalle: `${bloques.length} bloques sin criterio; media ${redondear(inicio)} % → ${redondear(final)} %`,
      })
    }
  }

  if (bloques.length >= 6) {
    const anteriores = media(pct.slice(-6, -3))
    const ultimos = media(pct.slice(-3))
    if (anteriores - ultimos >= CAIDA_RETROCESO) {
      alertas.push({ tipo: 'retroceso', detalle: `media ${redondear(anteriores)} % → ${redondear(ultimos)} % en los últimos bloques` })
    }
  }

  if (bloques.length >= BLOQUES_AYUDAS) {
    const recientes = bloques.slice(-BLOQUES_AYUDAS)
    const aciertos = recientes.reduce((s, b) => s + b.aciertos, 0)
    const conAyuda = recientes.reduce((s, b) => s + b.aciertosConAyuda, 0)
    const proporcion = (b: BloqueAlerta) => (b.aciertos ? b.aciertosConAyuda / b.aciertos : 0)
    const primera = media(recientes.slice(0, 2).map(proporcion))
    const ultima = media(recientes.slice(-2).map(proporcion))
    if (aciertos > 0 && conAyuda / aciertos >= PROPORCION_AYUDAS && ultima >= primera) {
      alertas.push({
        tipo: 'dependencia_ayudas',
        detalle: `${redondear((conAyuda / aciertos) * 100)} % de los aciertos con ayuda en los últimos ${BLOQUES_AYUDAS} bloques, sin bajar`,
      })
    }
  }

  const conControles = bloques.filter((b) => b.controlesTotal > 0).slice(-3)
  if (conControles.length > 0) {
    const total = conControles.reduce((s, b) => s + b.controlesTotal, 0)
    const aciertos = conControles.reduce((s, b) => s + b.controlesAciertos, 0)
    if (aciertos / total < ACIERTO_CONTROLES) {
      alertas.push({ tipo: 'controles', detalle: `${aciertos}/${total} controles correctos en los últimos bloques` })
    }
  }

  const conLatencia = bloques.filter((b) => b.latenciaMediaMs !== null)
  if (conLatencia.length >= 6) {
    const ultimos = conLatencia.slice(-3)
    const anteriores = conLatencia.slice(-6, -3)
    const latUlt = media(ultimos.map((b) => b.latenciaMediaMs!))
    const latAnt = media(anteriores.map((b) => b.latenciaMediaMs!))
    if (media(ultimos.map((b) => b.porcentaje)) >= ACIERTO_FLUIDEZ && latAnt > 0 && latUlt >= latAnt * AUMENTO_LATENCIA) {
      alertas.push({
        tipo: 'fluidez',
        detalle: `latencia media ${(latAnt / 1000).toFixed(1)} s → ${(latUlt / 1000).toFixed(1)} s con ${redondear(media(ultimos.map((b) => b.porcentaje)))} % de acierto`,
      })
    }
  }

  return alertas
}
