import type { createClient } from '@/utils/supabase/server'

// Indicadores de aprendizaje del alumno, calculados con los datos de ensayo.
// Son orientativos para el terapeuta (no una valoración diagnóstica) y cada
// uno exige un mínimo de datos: por debajo se muestra "datos insuficientes".
//
// Ventana: últimas VENTANA_DIAS, con tendencia frente a la ventana anterior.
// - Generatividad: de los logros de la ventana, % sin enseñanza
//   directa. Logro = conjunto ABA dominado o relación RFT dominada (fase +
//   posiciones de un grupo). Derivado = test superado sin ayudas
//   (dominio_rft_fases.via_entrenamiento = false).
// - Independencia: ensayos ABA de intervención correctos sin ayuda / total.
// - Tests a la primera: tests RFT cuya primera sesión cae en la ventana y se
//   superó en ese primer bloque, sin ayudas.
// - Velocidad de aprendizaje (ensayos hasta el criterio): mediana de ensayos de intervención de los
//   últimos 3 conjuntos ABA dominados, frente a los anteriores.
// - Estancados: conjuntos ABA / relaciones RFT en entrenamiento sin dominar,
//   con >= BLOQUES_MIN_ESTANCAMIENTO bloques y sin mejora reciente.

export const VENTANA_DIAS = 56
const BLOQUES_MIN_ESTANCAMIENTO = 6
const MIN_LOGROS = 3
const MIN_ENSAYOS = 30
const MIN_TESTS = 3
const FASES_TEST = ['test_mutuo', 'test_combinatorio', 'transformacion_funciones']

type Supabase = Awaited<ReturnType<typeof createClient>>

export type Tendencia = 'mejora' | 'empeora' | 'estable' | null

export type Indicador = {
  clave: 'derivado' | 'independencia' | 'tests' | 'criterio'
  titulo: string
  valor: string | null // null = datos insuficientes
  detalle: string
  tendencia: Tendencia
  explicacion: string
}

export type Estancado = {
  programaId: string
  programaNombre: string
  tipo: string
  objetivo: string // conjunto o grupo/relación
  bloques: number
  ultimoPorcentaje: number
}

const DIA = 24 * 60 * 60 * 1000
const pct = (aciertos: number, total: number) => (total > 0 ? (aciertos / total) * 100 : 0)
const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
const mediana = (xs: number[]) => {
  const o = [...xs].sort((a, b) => a - b)
  const m = Math.floor(o.length / 2)
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2
}

// Diferencia mínima (en puntos o en %) para hablar de tendencia
function tendencia(actual: number | null, anterior: number | null, umbral: number, mayorEsMejor: boolean): Tendencia {
  if (actual === null || anterior === null) return null
  const diff = actual - anterior
  if (Math.abs(diff) < umbral) return 'estable'
  return diff > 0 === mayorEsMejor ? 'mejora' : 'empeora'
}

// Sin mejora: media de los 3 últimos bloques no supera en 5 puntos a la de
// los 3 anteriores, y ninguno de los 3 últimos llega al criterio
function estaEstancado(porcentajes: number[], criterio: number) {
  if (porcentajes.length < BLOQUES_MIN_ESTANCAMIENTO) return false
  const ultimos = porcentajes.slice(-3)
  const previos = porcentajes.slice(-6, -3)
  return media(ultimos) <= media(previos) + 5 && Math.max(...ultimos) < criterio
}

export async function calcularIndicadores(
  supabase: Supabase,
  alumnoId: string
): Promise<{ indicadores: Indicador[]; estancados: Estancado[] }> {
  const ahora = Date.now()
  const desde = ahora - VENTANA_DIAS * DIA
  const desdeAnterior = ahora - 2 * VENTANA_DIAS * DIA
  const enVentana = (f: string) => new Date(f).getTime() >= desde
  const enAnterior = (f: string) => {
    const t = new Date(f).getTime()
    return t >= desdeAnterior && t < desde
  }

  const { data: programas } = await supabase
    .from('programas_alumno')
    .select('id, nombre, tipo, porcentaje_dominio')
    .eq('alumno_id', alumnoId)
  const programaPorId = new Map((programas ?? []).map((p) => [p.id, p]))
  const idsAba = (programas ?? []).filter((p) => p.tipo === 'aba_clasico').map((p) => p.id)
  const idsRft = (programas ?? []).filter((p) => p.tipo === 'rft').map((p) => p.id)

  const [{ data: conjuntos }, { data: bloquesRft }, { data: dominiosRft }] = await Promise.all([
    idsAba.length
      ? supabase
          .from('conjuntos_estimulos_alumno')
          .select('id, nombre, estado, programa_alumno_id, bloques_ensayo(id, fase, fecha, aciertos, total_ensayos)')
          .in('programa_alumno_id', idsAba)
      : Promise.resolve({ data: [] as never[] }),
    idsRft.length
      ? supabase
          .from('bloques_ensayo_rft')
          .select('id, programa_alumno_id, grupo, fase, posicion_origen, posicion_destino, fecha, aciertos, total_ensayos')
          .in('programa_alumno_id', idsRft)
          .order('fecha')
      : Promise.resolve({ data: [] as never[] }),
    idsRft.length
      ? supabase
          .from('dominio_rft_fases')
          .select('programa_alumno_id, grupo, fase, posicion_origen, posicion_destino, dominado, via_entrenamiento, updated_at')
          .in('programa_alumno_id', idsRft)
      : Promise.resolve({ data: [] as never[] }),
  ])

  // ---------- Aprendizaje directo (ABA) ----------
  type Bloque = { id: string; fase: string; fecha: string; aciertos: number; total_ensayos: number }
  const conjuntosAba = (conjuntos ?? []).map((c) => ({
    ...c,
    intervencion: ((c.bloques_ensayo ?? []) as Bloque[])
      .filter((b) => b.fase === 'intervencion')
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
  }))

  // Dominados: fecha aproximada de dominio = último bloque de intervención
  const dominadosAba = conjuntosAba
    .filter((c) => (c.estado === 'dominado' || c.estado === 'mantenimiento') && c.intervencion.length > 0)
    .map((c) => ({
      fecha: c.intervencion[c.intervencion.length - 1].fecha,
      ensayos: c.intervencion.reduce((s, b) => s + b.total_ensayos, 0),
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  // Ensayos de intervención recientes (para independencia)
  const bloquesRecientes = conjuntosAba.flatMap((c) => c.intervencion).filter((b) => new Date(b.fecha).getTime() >= desdeAnterior)
  const { data: ensayosAba } = bloquesRecientes.length
    ? await supabase.from('ensayos_aba_detalle').select('bloque_id, correcto, ayuda').in('bloque_id', bloquesRecientes.map((b) => b.id))
    : { data: [] }
  const fechaBloque = new Map(bloquesRecientes.map((b) => [b.id, b.fecha]))
  const independencia = (filtro: (f: string) => boolean) => {
    const ensayos = (ensayosAba ?? []).filter((e) => filtro(fechaBloque.get(e.bloque_id) ?? ''))
    if (ensayos.length < MIN_ENSAYOS) return { valor: null, n: ensayos.length }
    const indep = ensayos.filter((e) => e.correcto && e.ayuda === 'independiente').length
    return { valor: pct(indep, ensayos.length), n: ensayos.length }
  }

  // ---------- Aprendizaje relacional (RFT) ----------
  type BloqueRft = NonNullable<typeof bloquesRft>[number]
  const clave = (b: { programa_alumno_id: string; grupo: string | null; fase: string; posicion_origen: string | null; posicion_destino: string | null }) =>
    `${b.programa_alumno_id}|${b.grupo}|${b.fase}|${b.posicion_origen}|${b.posicion_destino}`
  const porCombinacion = new Map<string, BloqueRft[]>()
  for (const b of bloquesRft ?? []) porCombinacion.set(clave(b), [...(porCombinacion.get(clave(b)) ?? []), b])

  // Primer bloque de cada test (para "a la primera")
  const primerosTests = [...porCombinacion.values()]
    .filter((bs) => FASES_TEST.includes(bs[0].fase))
    .map((bs) => bs[0])
    .filter((b) => new Date(b.fecha).getTime() >= desdeAnterior)
  const { data: ayudasPrimeros } = primerosTests.length
    ? await supabase
        .from('ensayos_rft_detalle')
        .select('bloque_id')
        .in('bloque_id', primerosTests.map((b) => b.id))
        .neq('ayuda', 'independiente')
    : { data: [] }
  const conAyuda = new Set((ayudasPrimeros ?? []).map((e) => e.bloque_id))
  const testsALaPrimera = (filtro: (f: string) => boolean) => {
    const tests = primerosTests.filter((b) => filtro(b.fecha))
    if (tests.length < MIN_TESTS) return { valor: null, n: tests.length, ok: 0 }
    const ok = tests.filter((b) => {
      const criterio = programaPorId.get(b.programa_alumno_id)?.porcentaje_dominio ?? 90
      return !conAyuda.has(b.id) && pct(b.aciertos, b.total_ensayos) >= criterio
    }).length
    return { valor: pct(ok, tests.length), n: tests.length, ok }
  }

  // ---------- Logros (directo frente a derivado) ----------
  const logros = (filtro: (f: string) => boolean) => {
    let directos = dominadosAba.filter((d) => filtro(d.fecha)).length
    let derivados = 0
    for (const d of dominiosRft ?? []) {
      if (!d.dominado || !filtro(d.updated_at)) continue
      if (d.fase === 'entrenamiento' || d.via_entrenamiento) directos++
      else if (FASES_TEST.includes(d.fase)) derivados++
    }
    return { directos, derivados, total: directos + derivados }
  }

  // ---------- Indicadores ----------
  const logrosAhora = logros(enVentana)
  const logrosAntes = logros(enAnterior)
  const derivadoAhora = logrosAhora.total >= MIN_LOGROS ? pct(logrosAhora.derivados, logrosAhora.total) : null
  const derivadoAntes = logrosAntes.total >= MIN_LOGROS ? pct(logrosAntes.derivados, logrosAntes.total) : null

  const indepAhora = independencia(enVentana)
  const indepAntes = independencia(enAnterior)

  const testsAhora = testsALaPrimera(enVentana)
  const testsAntes = testsALaPrimera(enAnterior)

  const ultimos = dominadosAba.slice(-3).map((d) => d.ensayos)
  const anteriores = dominadosAba.slice(0, -3).map((d) => d.ensayos)
  const criterioAhora = dominadosAba.length >= 2 ? mediana(ultimos) : null
  const criterioAntes = anteriores.length > 0 ? mediana(anteriores) : null

  const indicadores: Indicador[] = [
    {
      clave: 'derivado',
      titulo: 'Generatividad',
      valor: derivadoAhora === null ? null : `${Math.round(derivadoAhora)}%`,
      detalle:
        derivadoAhora === null
          ? `Hacen falta al menos ${MIN_LOGROS} logros en el periodo (hay ${logrosAhora.total}).`
          : `${logrosAhora.derivados} de ${logrosAhora.total} logros sin enseñanza directa`,
      tendencia: tendencia(derivadoAhora, derivadoAntes, 10, true),
      explicacion:
        'De los objetivos conseguidos en el periodo, qué parte surgió sin enseñarla directamente (relaciones derivadas en los tests). En el Nivel 1 es normal que sea bajo.',
    },
    {
      clave: 'independencia',
      titulo: 'Independencia',
      valor: indepAhora.valor === null ? null : `${Math.round(indepAhora.valor)}%`,
      detalle:
        indepAhora.valor === null
          ? `Hacen falta al menos ${MIN_ENSAYOS} ensayos de intervención (hay ${indepAhora.n}).`
          : `de ${indepAhora.n} ensayos de intervención, correctos sin ayuda`,
      tendencia: tendencia(indepAhora.valor, indepAntes.valor, 5, true),
      explicacion: 'Aprendizaje directo: ensayos de intervención respondidos correctamente sin ninguna ayuda. Si sube, la retirada de ayudas funciona.',
    },
    {
      clave: 'tests',
      titulo: 'Tests a la primera',
      valor: testsAhora.valor === null ? null : `${Math.round(testsAhora.valor)}%`,
      detalle:
        testsAhora.valor === null
          ? `Hacen falta al menos ${MIN_TESTS} tests nuevos en el periodo (hay ${testsAhora.n}).`
          : `${testsAhora.ok} de ${testsAhora.n} tests superados en el primer bloque`,
      tendencia: tendencia(testsAhora.valor, testsAntes.valor, 10, true),
      explicacion:
        'Aprendizaje relacional: tests de vinculación y transformación de funciones superados en su primer bloque y sin ayudas, es decir, derivación real.',
    },
    {
      clave: 'criterio',
      titulo: 'Velocidad de aprendizaje',
      valor: criterioAhora === null ? null : `${Math.round(criterioAhora)}`,
      detalle:
        criterioAhora === null
          ? `Hacen falta al menos 2 conjuntos dominados (hay ${dominadosAba.length}).`
          : criterioAntes === null
            ? `ensayos hasta el criterio por conjunto (mediana de los últimos ${ultimos.length})`
            : `ensayos hasta el criterio por conjunto (antes ${Math.round(criterioAntes)})`,
      // Menos ensayos = aprende más rápido; umbral del 15% sobre el valor anterior
      tendencia:
        criterioAhora === null || criterioAntes === null
          ? null
          : tendencia(criterioAhora, criterioAntes, criterioAntes * 0.15, false),
      explicacion:
        'Aprender a aprender: ensayos de intervención que necesitaron los últimos conjuntos dominados hasta llegar al criterio. Cuantos menos, más rápido aprende. No usa la ventana de 8 semanas.',
    },
  ]

  // ---------- Estancados ----------
  const estancados: Estancado[] = []
  for (const c of conjuntosAba) {
    if (c.estado !== 'adquisicion') continue
    const programa = programaPorId.get(c.programa_alumno_id)
    const porcentajes = c.intervencion.map((b) => pct(b.aciertos, b.total_ensayos))
    if (programa && estaEstancado(porcentajes, programa.porcentaje_dominio)) {
      estancados.push({
        programaId: programa.id,
        programaNombre: programa.nombre,
        tipo: programa.tipo,
        objetivo: c.nombre,
        bloques: porcentajes.length,
        ultimoPorcentaje: Math.round(porcentajes[porcentajes.length - 1]),
      })
    }
  }
  const dominadoRft = new Set((dominiosRft ?? []).filter((d) => d.dominado).map((d) => clave(d)))
  for (const [k, bs] of porCombinacion) {
    if (bs[0].fase !== 'entrenamiento' || dominadoRft.has(k)) continue
    const programa = programaPorId.get(bs[0].programa_alumno_id)
    const porcentajes = bs.map((b) => pct(b.aciertos, b.total_ensayos))
    if (programa && estaEstancado(porcentajes, programa.porcentaje_dominio)) {
      estancados.push({
        programaId: programa.id,
        programaNombre: programa.nombre,
        tipo: programa.tipo,
        objetivo: `Grupo ${bs[0].grupo ?? '—'} · ${bs[0].posicion_origen}→${bs[0].posicion_destino}`,
        bloques: porcentajes.length,
        ultimoPorcentaje: Math.round(porcentajes[porcentajes.length - 1]),
      })
    }
  }

  return { indicadores, estancados }
}
