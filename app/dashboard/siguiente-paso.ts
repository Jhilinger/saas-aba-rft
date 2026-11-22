// «Siguiente paso»: qué hacer con un grupo según sus datos, para que el terapeuta no
// tenga que decidirlo solo. Reglas acordadas con el usuario (2026-11-22), basadas en
// Luciano et al. (2009): ante un fallo con relaciones arbitrarias, volver al apoyo no
// arbitrario (fichas iguales) y, si no basta, al paso anterior del marco; el marco se
// da por establecido cuando se deriva con estímulos nuevos (dos grupos distintos);
// sondas de generalización y de mantenimiento a las 2 y 4 semanas (Barry et al., 2024).
// Funciones puras: los datos llegan ya cargados (ver siguiente-paso-datos.ts).

export type Forma = 'oyente' | 'hablante'

export type BloquePaso = {
  fecha: string
  fase: string
  grupo: string
  origen: string
  destino: string
  forma: Forma
  porcentaje: number
  apoyoVisual: boolean
  // Algún ensayo del bloque se dio con ayuda
  conAyudas: boolean
}

export type DominioPaso = { grupo: string; fase: string; origen: string; destino: string; forma: Forma; dominado: boolean; viaEntrenamiento: boolean }

export type PasoSecuencia = { fase: string; origen: string; destino: string }

// Lo que el panel ofrece preparar (el bloque que propone)
export type AccionPaso = { grupo: string; fase: string; origen: string; destino: string; forma: Forma; apoyoVisual: boolean }

export type TipoPaso =
  | 'repetir_test'
  | 'probar_fichas'
  | 'entrenar_direccion'
  | 'volver_paso_anterior'
  | 'operante_generalizada'
  | 'estancado'
  | 'mas_ejemplares_clave'
  | 'mas_orden_inverso'
  | 'probar_hablante'
  | 'probar_oyente'
  | 'sonda_generalizacion'
  | 'sonda_mantenimiento'

export type Paso = { tipo: TipoPaso; grupo: string | null; titulo: string; detalle: string; accion?: AccionPaso }

export type DatosPaso = {
  bloques: BloquePaso[]
  dominio: DominioPaso[]
  // Secuencia de cada grupo (depende de las posiciones del grupo)
  secuencias: { grupo: string; pasos: PasoSecuencia[] }[]
  porcentajeDominio: number
  // Programa verbal del nivel 3: se puede practicar con fichas iguales
  conFichas: boolean
  sinErrorActivo: boolean
  // Requisitos del programa que el alumno no tiene dominados
  requisitosPendientes: string[]
  // Programa anterior del mismo marco (para retroceder)
  programaAnterior: string | null
  // Patrones de error ya calculados (clave más baja, orden de mención inverso)
  clavesBajas: { grupo: string; clave: string }[]
  ordenInversoBajo: string[]
  hoy?: Date
}

export const REPETIR_DESDE = 70
export const GRUPOS_PARA_RETROCEDER = 2
export const GRUPOS_PARA_AVANZAR = 2
export const BLOQUES_ESTANCADO = 8
export const MEJORA_MINIMA = 10
const DIAS_MANTENIMIENTO = [14, 28]

const NOMBRE_FASE: Record<string, string> = {
  entrenamiento: 'entrenamiento',
  test_mutuo: 'test de vínculo mutuo',
  test_combinatorio: 'test de vínculo combinatorio',
  transformacion_funciones: 'test de transformación de funciones',
}
const nombreCombo = (p: { fase: string; origen: string; destino: string }) => `${NOMBRE_FASE[p.fase] ?? p.fase} ${p.origen}→${p.destino}`
const formaTexto = (f: Forma) => (f === 'hablante' ? ' (como hablante)' : '')
const mismo = (a: { fase: string; origen: string; destino: string }, b: { fase: string; origen: string; destino: string }) =>
  a.fase === b.fase && a.origen === b.origen && a.destino === b.destino
const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(xs.length, 1)

export function siguientesPasos(d: DatosPaso): Paso[] {
  const pasos: Paso[] = []
  const formas: Forma[] = ['oyente', 'hablante']
  const grupos = d.secuencias.map((s) => s.grupo)
  const pasosDe = (g: string) => d.secuencias.find((s) => s.grupo === g)?.pasos ?? []
  const testsDe = (g: string) => pasosDe(g).filter((p) => p.fase !== 'entrenamiento')
  const entrenamientosDe = (g: string) => pasosDe(g).filter((p) => p.fase === 'entrenamiento')
  // Tests distintos de todo el programa
  const tests: PasoSecuencia[] = []
  for (const g of grupos) for (const t of testsDe(g)) if (!tests.some((x) => mismo(x, t))) tests.push(t)
  const dominioDe = (g: string, p: PasoSecuencia, f: Forma) => d.dominio.find((x) => x.grupo === g && x.forma === f && mismo(x, p))
  const bloquesDe = (g: string, p: PasoSecuencia, f: Forma) => d.bloques.filter((b) => b.grupo === g && b.forma === f && mismo(b, p))

  // Programa: el marco ya se deriva en grupos distintos → avanzar
  for (const t of tests) {
    for (const f of formas) {
      const derivados = new Set(d.dominio.filter((x) => x.forma === f && mismo(x, t) && x.dominado && !x.viaEntrenamiento).map((x) => x.grupo))
      if (derivados.size >= GRUPOS_PARA_AVANZAR) {
        pasos.push({
          tipo: 'operante_generalizada',
          grupo: null,
          titulo: `El ${nombreCombo(t)} ya se deriva en ${derivados.size} grupos${formaTexto(f)}`,
          detalle: 'Se deriva a la primera con estímulos nuevos: la relación se comporta como operante generalizada. No hace falta entrenar más grupos para este test: pase a la siguiente fase de la secuencia o al siguiente programa.',
        })
      }
    }
  }

  // Programa: el mismo test falla en dos grupos → volver al paso anterior del marco
  for (const t of tests) {
    for (const f of formas) {
      const fallidos = new Set(
        grupos.filter((g) => {
          const bs = bloquesDe(g, t, f).filter((b) => !b.apoyoVisual)
          const dom = dominioDe(g, t, f)
          return bs.length > 0 && (dom?.viaEntrenamiento || (!dom?.dominado && bs.length >= 2))
        })
      )
      if (fallidos.size >= GRUPOS_PARA_RETROCEDER) {
        pasos.push({
          tipo: 'volver_paso_anterior',
          grupo: null,
          titulo: `El ${nombreCombo(t)} no se deriva en ${fallidos.size} grupos${formaTexto(f)}`,
          detalle: `Falta base para esta relación. Vuelva al paso anterior del marco${d.programaAnterior ? ` («${d.programaAnterior}»)` : ''} y refuércelo con más ejemplares antes de seguir (Luciano et al., 2009).`,
        })
      }
    }
  }

  for (const g of grupos) {
    const entrenamientos = entrenamientosDe(g)
    const secuencia = pasosDe(g)
    for (const f of formas) {
      // Un test sin derivar ni dominar en este grupo
      for (const t of testsDe(g)) {
        const dom = dominioDe(g, t, f)
        if (dom?.dominado) continue
        const bs = bloquesDe(g, t, f)
        const sinApoyo = bs.filter((b) => !b.apoyoVisual)
        if (sinApoyo.length === 0) continue
        const accion = (apoyoVisual: boolean): AccionPaso => ({ grupo: g, fase: t.fase, origen: t.origen, destino: t.destino, forma: f, apoyoVisual })
        const ultimo = sinApoyo[sinApoyo.length - 1]
        if (sinApoyo.length === 1 && !ultimo.conAyudas && ultimo.porcentaje >= REPETIR_DESDE) {
          pasos.push({
            tipo: 'repetir_test',
            grupo: g,
            titulo: `Repetir el ${nombreCombo(t)} sin ayudas${formaTexto(f)}`,
            detalle: `Ha quedado cerca del criterio (${ultimo.porcentaje} %). Un solo bloque es poca muestra: repítalo una vez más sin ayudas antes de enseñarlo.`,
            accion: accion(false),
          })
        } else if (d.conFichas && !bs.some((b) => b.apoyoVisual)) {
          pasos.push({
            tipo: 'probar_fichas',
            grupo: g,
            titulo: `Practicar el ${nombreCombo(t)} con fichas iguales${formaTexto(f)}`,
            detalle: 'Vuelva al apoyo visual: una ficha igual por cada nombre, que se ve y se señala. Esos bloques no cuentan para el dominio; después, vuelva a probar sin fichas (Luciano et al., 2009).',
            accion: accion(true),
          })
        } else {
          pasos.push({
            tipo: 'entrenar_direccion',
            grupo: g,
            titulo: `Enseñar el ${nombreCombo(t)} con ayudas${formaTexto(f)}`,
            detalle: 'No se ha derivado: enséñelo directamente, marcando «Correcto con ayuda» cuando haga falta. Quedará como dominado, no derivado, y se le pedirá el mismo criterio que a un entrenamiento. Después, pruebe el mismo test con un grupo nuevo.',
            accion: accion(false),
          })
        }
      }

      // Entrenamiento estancado
      for (const e of entrenamientos) {
        if (dominioDe(g, e, f)?.dominado) continue
        const bs = bloquesDe(g, e, f).filter((b) => !b.apoyoVisual)
        if (bs.length < BLOQUES_ESTANCADO) continue
        const primeros = media(bs.slice(0, 3).map((b) => b.porcentaje))
        const ultimos = media(bs.slice(-3).map((b) => b.porcentaje))
        if (ultimos - primeros >= MEJORA_MINIMA) continue
        const opciones = [
          d.requisitosPendientes.length ? `comprobar los requisitos que no tiene dominados (${d.requisitosPendientes.map((r) => `«${r}»`).join(', ')})` : null,
          !d.sinErrorActivo ? 'activar el aprendizaje sin error' : null,
          'reducir el número de opciones',
          d.conFichas ? 'practicar con fichas iguales' : null,
        ].filter(Boolean)
        pasos.push({
          tipo: 'estancado',
          grupo: g,
          titulo: `El ${nombreCombo(e)} no avanza${formaTexto(f)}`,
          detalle: `${bs.length} bloques sin mejora clara (${Math.round(primeros)} % → ${Math.round(ultimos)} %). Pruebe a ${opciones.join('; ')}.`,
          accion: d.conFichas ? { grupo: g, fase: e.fase, origen: e.origen, destino: e.destino, forma: f, apoyoVisual: true } : undefined,
        })
      }
    }

    // La otra forma de respuesta
    const dominaEntreno = (f: Forma) => entrenamientos.some((e) => dominioDe(g, e, f)?.dominado)
    const tieneBloques = (f: Forma) => d.bloques.some((b) => b.grupo === g && b.forma === f)
    const primero = entrenamientos[0]
    if (primero) {
      if (dominaEntreno('oyente') && !tieneBloques('hablante')) {
        pasos.push({
          tipo: 'probar_hablante',
          grupo: g,
          titulo: 'Trabajarlo también como hablante',
          detalle: 'Ya responde como oyente: pruebe ahora a que responda sin opciones (usted marca la respuesta). Oyente y hablante se dominan por separado (Luciano et al., 2009).',
          accion: { grupo: g, fase: primero.fase, origen: primero.origen, destino: primero.destino, forma: 'hablante', apoyoVisual: false },
        })
      } else if (dominaEntreno('hablante') && !tieneBloques('oyente')) {
        pasos.push({
          tipo: 'probar_oyente',
          grupo: g,
          titulo: 'Trabajarlo también como oyente',
          detalle: 'Ya responde como hablante: pruebe también la respuesta de elegir entre opciones.',
          accion: { grupo: g, fase: primero.fase, origen: primero.origen, destino: primero.destino, forma: 'oyente', apoyoVisual: false },
        })
      }
    }

    // Secuencia completa del grupo → sondas
    for (const f of formas) {
      if (!secuencia.length || !secuencia.every((p) => dominioDe(g, p, f)?.dominado)) continue
      const delGrupo = d.bloques.filter((b) => b.grupo === g && b.forma === f)
      const sondasGen = delGrupo.filter((b) => b.fase === 'generalizacion')
      if (!sondasGen.length) {
        pasos.push({
          tipo: 'sonda_generalizacion',
          grupo: g,
          titulo: `Sonda de generalización${formaTexto(f)}`,
          detalle: 'La secuencia del grupo está dominada: haga una sonda con estímulos nuevos (otro grupo o materiales nuevos), sin ayudas ni refuerzo diferencial.',
        })
        continue
      }
      const ultimaFecha = new Date(delGrupo.filter((b) => b.fase !== 'mantenimiento').map((b) => b.fecha).sort().at(-1)!)
      const dias = ((d.hoy ?? new Date()).getTime() - ultimaFecha.getTime()) / 86400000
      const mantenimientos = delGrupo.filter((b) => b.fase === 'mantenimiento' && new Date(b.fecha) > ultimaFecha).length
      const toca = DIAS_MANTENIMIENTO.findIndex((umbral, i) => dias >= umbral && mantenimientos <= i)
      if (toca >= 0) {
        pasos.push({
          tipo: 'sonda_mantenimiento',
          grupo: g,
          titulo: `Sonda de mantenimiento (${DIAS_MANTENIMIENTO[toca] / 7} semanas)${formaTexto(f)}`,
          detalle: `Han pasado ${Math.floor(dias)} días desde que se dominó: compruebe que se mantiene, sin ayudas ni refuerzo diferencial (Barry et al., 2024; Neufeld et al., 2023).`,
        })
      }
    }
  }

  // Patrones de error
  for (const { grupo, clave } of d.clavesBajas) {
    pasos.push({
      tipo: 'mas_ejemplares_clave',
      grupo,
      titulo: `Más ejemplares con ${clave}`,
      detalle: 'Esta clave queda bastante por debajo de las otras: puede estar respondiendo por una sola clave y no por la relación. Dé más ejemplares de ella antes de dar el nivel por dominado.',
    })
  }
  for (const grupo of d.ordenInversoBajo) {
    pasos.push({
      tipo: 'mas_orden_inverso',
      grupo,
      titulo: 'Más frases en orden inverso',
      detalle: 'Falla sobre todo cuando la frase nombra los hechos al revés de como ocurren: responde por el orden de las palabras (Clark, 1971). Insista en esas frases.',
    })
  }

  return pasos
}
