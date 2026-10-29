// Reglas de administración de la evaluación inicial estandarizada: nivel de
// inicio por el cribado, techo por dominio, requisitos entre ítems, suelo y
// paso de nivel. Funciones puras: las usan la pantalla y el servidor.

export type ItemEvaluacion = {
  id: string
  codigo: string
  tipo: 'cribado' | 'item'
  nivel: number
  dominioId: string | null
  dominioCodigo: string | null
  dominioNombre: string | null
  orden: number
  titulo: string
  formatos: string[]
  relacional: boolean
  indicador: boolean
  consigna: string
  materiales: string | null
  ensayos: number | null
  criterio2: string | null
  criterio1: string | null
  criterio0: string | null
  preguntaFamilia: string | null
  requiereItemId: string | null
  requierePuntuacion: number | null
  // Ensayos predefinidos para la pantalla del alumno (ver guion.ts)
  guion: unknown
}

export type FaseEnsayo = 'entrenamiento' | 'test'
// respuesta: índice (o índices) de la opción tocada, en el orden del guion;
// control: ensayo sobre una relación enunciada tal cual
export type Ensayo = {
  fase: FaseEnsayo
  correcto: boolean
  control?: boolean
  respuesta?: number | number[]
  latenciaMs?: number
}
export type Fuente = 'observado' | 'informado'

export type RespuestaEvaluacion = {
  itemId: string
  puntuacion: number | null
  noAplicado: string | null
  fuente: Fuente
  ensayos: Ensayo[]
  notas: string | null
}

export type EstadoItem = 'puntuado' | 'no_procede' | 'techo' | 'requisito' | 'pendiente' | 'fuera'

// Techo: tras N ceros seguidos en un dominio no se aplican sus ítems restantes
export const RACHA_TECHO = 2
// Entrenamiento de los ítems relacionales: bloques de 6 hasta 5 de 6, máximo 3
export const TAM_BLOQUE = 6
export const CRITERIO_BLOQUE = 5
export const MAX_BLOQUES = 3
// Se pasa al nivel siguiente si el nivel completo alcanza este porcentaje
export const UMBRAL_PASO_NIVEL = 0.5

export function ordenarItems(items: ItemEvaluacion[]) {
  return [...items].sort(
    (a, b) =>
      a.nivel - b.nivel ||
      (a.dominioCodigo ?? '').localeCompare(b.dominioCodigo ?? '', 'es', { numeric: true }) ||
      a.orden - b.orden
  )
}

// Aciertos mínimos de un criterio escrito ("4-5 de 5 ensayos…", "En 2-3 de
// 5", "6-8"); null si es cualitativo y la puntuación la elige el evaluador
export function umbralCriterio(criterio: string | null): number | null {
  if (!criterio) return null
  const conTotal = /(\d+)(?:-\d+)? de \d+/.exec(criterio)
  if (conTotal) return Number(conTotal[1])
  const inicial = /^(?:En )?(\d+)(?:-\d+)?\b/.exec(criterio)
  return inicial ? Number(inicial[1]) : null
}

export function estadoEntrenamiento(ensayos: Ensayo[]) {
  const entrenamiento = ensayos.filter((e) => e.fase === 'entrenamiento')
  const bloques: Ensayo[][] = []
  for (let i = 0; i < entrenamiento.length; i += TAM_BLOQUE) bloques.push(entrenamiento.slice(i, i + TAM_BLOQUE))
  const completos = bloques.filter((b) => b.length === TAM_BLOQUE)
  const superadoEn = completos.findIndex((b) => b.filter((e) => e.correcto).length >= CRITERIO_BLOQUE)
  // true: superado; false: agotó los bloques sin criterio; null: en curso o sin entrenamiento
  const superado = superadoEn >= 0 ? true : completos.length >= MAX_BLOQUES ? false : null
  return { bloques, superado, superadoEn: superadoEn >= 0 ? superadoEn + 1 : null }
}

export function puntuacionPropuesta(item: ItemEvaluacion, ensayos: Ensayo[]): number | null {
  if (item.relacional && estadoEntrenamiento(ensayos).superado === false) return 0
  const test = ensayos.filter((e) => e.fase === 'test')
  if (test.length === 0) return null
  const u2 = umbralCriterio(item.criterio2)
  const u1 = umbralCriterio(item.criterio1)
  if (u2 === null || u1 === null) return null
  const aciertos = test.filter((e) => e.correcto).length
  const puntuacion = aciertos >= u2 ? 2 : aciertos >= u1 ? 1 : 0
  return falloControl(ensayos) ? Math.min(puntuacion, 1) : puntuacion
}

// Fallar una relación enunciada impide interpretar la derivación: máximo 1
export function falloControl(ensayos: Ensayo[]) {
  return ensayos.some((e) => e.fase === 'test' && e.control && !e.correcto)
}

// Nivel del primer ítem de cribado que no obtiene un 2; null si falta alguno
export function nivelPorCribado(cribado: ItemEvaluacion[], respuestas: Map<string, RespuestaEvaluacion>) {
  const ordenados = [...cribado].sort((a, b) => a.orden - b.orden)
  for (const item of ordenados) {
    const puntuacion = respuestas.get(item.id)?.puntuacion
    if (puntuacion === null || puntuacion === undefined) return null
    if (puntuacion < 2) return item.nivel
  }
  return ordenados.at(-1)?.nivel ?? null
}

export type Ruta = {
  estados: Map<string, EstadoItem>
  nivelesActivos: number[]
  siguiente: string | null
  // El primer dominio del nivel de inicio quedó por debajo de la mitad
  sugerirBajar: boolean
  // Nivel completo por debajo del umbral: la ruta termina en él
  nivelCortado: number | null
}

function puntos(items: ItemEvaluacion[], estados: Map<string, EstadoItem>, respuestas: Map<string, RespuestaEvaluacion>) {
  const aplicables = items.filter((i) => estados.get(i.id) !== 'no_procede')
  const obtenidos = aplicables.reduce((s, i) => s + (respuestas.get(i.id)?.puntuacion ?? 0), 0)
  return { obtenidos, maximo: aplicables.length * 2 }
}

export function calcularRuta(
  items: ItemEvaluacion[],
  respuestas: Map<string, RespuestaEvaluacion>,
  nivelInicio: number | null
): Ruta {
  const ordenados = ordenarItems(items.filter((i) => i.tipo === 'item'))
  const estados = new Map<string, EstadoItem>()
  const rachaPorDominio = new Map<string, number>()

  for (const item of ordenados) {
    const r = respuestas.get(item.id)
    const clave = item.dominioId ?? ''
    const racha = rachaPorDominio.get(clave) ?? 0
    if (r && r.puntuacion !== null) {
      estados.set(item.id, 'puntuado')
      rachaPorDominio.set(clave, r.puntuacion === 0 ? racha + 1 : 0)
      continue
    }
    if (r?.noAplicado === 'no_procede') {
      estados.set(item.id, 'no_procede')
      continue
    }
    if (racha >= RACHA_TECHO) {
      estados.set(item.id, 'techo')
      continue
    }
    if (item.requiereItemId) {
      const estadoReq = estados.get(item.requiereItemId)
      const puntReq = respuestas.get(item.requiereItemId)?.puntuacion
      const noCumple =
        (estadoReq === 'puntuado' && (puntReq ?? 0) < (item.requierePuntuacion ?? 0)) ||
        estadoReq === 'techo' ||
        estadoReq === 'requisito' ||
        estadoReq === 'no_procede'
      if (noCumple) {
        estados.set(item.id, 'requisito')
        continue
      }
    }
    estados.set(item.id, 'pendiente')
  }

  const niveles = [...new Set(ordenados.map((i) => i.nivel))].sort((a, b) => a - b)
  const nivelesActivos: number[] = []
  let nivelCortado: number | null = null
  if (nivelInicio !== null) {
    for (const nivel of niveles.filter((n) => n >= nivelInicio)) {
      nivelesActivos.push(nivel)
      const delNivel = ordenados.filter((i) => i.nivel === nivel)
      if (delNivel.some((i) => estados.get(i.id) === 'pendiente')) break
      const { obtenidos, maximo } = puntos(delNivel, estados, respuestas)
      if (maximo > 0 && obtenidos / maximo < UMBRAL_PASO_NIVEL) {
        nivelCortado = nivel
        break
      }
    }
  }

  for (const item of ordenados) {
    if (estados.get(item.id) === 'pendiente' && !nivelesActivos.includes(item.nivel)) estados.set(item.id, 'fuera')
  }

  let sugerirBajar = false
  if (nivelInicio !== null && nivelInicio > niveles[0]) {
    const delInicio = ordenados.filter((i) => i.nivel === nivelInicio)
    const primerDominio = delInicio.filter((i) => i.dominioId === delInicio[0]?.dominioId)
    const completo = primerDominio.length > 0 && primerDominio.every((i) => estados.get(i.id) !== 'pendiente')
    const { obtenidos, maximo } = puntos(primerDominio, estados, respuestas)
    sugerirBajar = completo && maximo > 0 && obtenidos * 2 < maximo
  }

  const siguiente = ordenados.find((i) => estados.get(i.id) === 'pendiente')?.id ?? null
  return { estados, nivelesActivos, siguiente, sugerirBajar, nivelCortado }
}

// Normaliza los ensayos guardados (jsonb) descartando lo que no tenga forma válida
export function leerEnsayos(valor: unknown): Ensayo[] {
  if (!Array.isArray(valor)) return []
  return valor
    .filter(
      (e): e is Ensayo =>
        !!e &&
        typeof e === 'object' &&
        (e.fase === 'entrenamiento' || e.fase === 'test') &&
        typeof e.correcto === 'boolean'
    )
    .map((e) => {
      const ensayo: Ensayo = { fase: e.fase, correcto: e.correcto }
      if (e.control === true) ensayo.control = true
      if (typeof e.respuesta === 'number' || (Array.isArray(e.respuesta) && e.respuesta.every((n) => typeof n === 'number'))) {
        ensayo.respuesta = Array.isArray(e.respuesta) ? e.respuesta.slice(0, 20) : e.respuesta
      }
      if (typeof e.latenciaMs === 'number' && e.latenciaMs >= 0 && e.latenciaMs < 600000) ensayo.latenciaMs = Math.round(e.latenciaMs)
      return ensayo
    })
}
