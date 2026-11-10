'use server'

import { createClient } from '@/utils/supabase/server'
import type { Json } from '@/database.types'
import { moduloPorClave } from '../../../modulos'
import { importarPrograma } from '../../../../dashboard/alumnos/[id]/actions'
import { coerceNivelRft } from '../../../../dashboard/niveles-rft'
import { secuenciaDelGrupo, type PasoSecuencia } from '../../../../dashboard/secuencia-rft'
import { parsearEstimuloPantalla, conceptosDePantalla } from '../../../../dashboard/estimulo-pantalla'
import { cargarImagenes } from '../../../../dashboard/imagenes-estimulo'
import {
  CATEGORIAS_ENTRENAMIENTO,
  CATEGORIAS_GENERALIZACION,
  conceptosPropiosDe,
  leerActividadConceptos,
  type ActividadConceptos,
  type Concepto,
} from '../../../../dashboard/conceptos'

// Motor autónomo de la app infantil: decide la actividad de la sesión.
// - Recorre los programas del módulo en orden; importa el siguiente cuando el
//   grupo 1 del anterior está completo (en los de conceptos, el primer nivel).
// - Una de cada tres sesiones es de práctica: un grupo (o nivel) pendiente de
//   un programa ya abierto.
// - Tests: si uno no deriva, la sesión siguiente practica otra cosa y después
//   se repite como sonda limpia; al segundo fallo se enseña esa dirección con
//   ayuda en pantalla (queda aprendida, no derivada).
// - Solo pasos que se pueden hacer en la tableta.

type Estimulo = { id: string; nombre: string; posicion: string | null; concepto_imagen: string | null; pantalla: Json | null }
type Clase = { id: string; nombre: string; grupo: string; consignas: Json | null; estimulos_rft: Estimulo[] }
type Bloque = { programa_alumno_id: string; grupo: string | null; fase: string; posicion_origen: string | null; posicion_destino: string | null; porcentaje: number | null; fecha: string }

export type PlanSesion =
  | {
      tipo: 'clases'
      programaAlumnoId: string
      programa: string
      grupo: string
      paso: PasoSecuencia
      ensenar: boolean
      clases: Clase[]
      consignas: Json | null
      opcionesClase: boolean
      imagenes: Record<string, Record<string, string>>
      sesionesHechas: number
    }
  | {
      tipo: 'conceptos'
      programaAlumnoId: string
      programa: string
      actividad: ActividadConceptos
      nivel: number
      conceptos: { entrenamiento: Concepto[]; generalizacion: Concepto[] }
      imagenes: Record<string, Record<string, string>>
      sesionesHechas: number
    }

const oido = (e: Estimulo) => !e.concepto_imagen && !parsearEstimuloPantalla(e.pantalla) && /^["“«].*["”»]$/.test(e.nombre.trim())
const visible = (e: Estimulo) => !!e.concepto_imagen || !!parsearEstimuloPantalla(e.pantalla)
const ordenGrupo = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true })

// Un paso se puede hacer en la tableta si todos sus estímulos se ven o se oyen
// y al menos uno se ve (las respuestas orales se hacen eligiendo entre palabras oídas)
function enTableta(clases: Clase[], paso: PasoSecuencia) {
  const de = (c: Clase, pos: string) => c.estimulos_rft.find((e) => e.posicion === pos)
  const validas = clases.filter((c) => de(c, paso.origen) && de(c, paso.destino))
  if (validas.length < 2) return false
  const estimulos = validas.flatMap((c) => [de(c, paso.origen)!, de(c, paso.destino)!])
  return estimulos.every((e) => visible(e) || oido(e)) && estimulos.some(visible)
}

export async function prepararSesion(alumnoId: string, claveModulo: string): Promise<{ error: string } | { plan: PlanSesion } | { terminado: true }> {
  const supabase = await createClient()
  const modulo = moduloPorClave(claveModulo)
  if (!modulo) return { error: 'Módulo no encontrado' }
  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', alumnoId).single()
  if (!alumno) return { error: 'Niño no encontrado' }

  const { data: bases } = await supabase.from('programas_base').select('id, nombre').is('clinica_id', null).in('nombre', modulo.programas)
  const basePorNombre = new Map((bases ?? []).map((b) => [b.nombre, b.id]))
  const ordenBases = modulo.programas.map((n) => basePorNombre.get(n)).filter((x): x is string => !!x)

  const cargar = async () => {
    const { data: copias } = await supabase
      .from('programas_alumno')
      .select('id, nombre, programa_base_id, nivel_rft, secuencia_rft, consignas, actividad_tablet, porcentaje_dominio, opciones_clase')
      .eq('alumno_id', alumnoId)
      .in('programa_base_id', ordenBases)
    const ids = (copias ?? []).map((c) => c.id)
    const [{ data: clases }, { data: dominio }, { data: bloques }] = await Promise.all([
      ids.length
        ? supabase.from('clases_rft').select('id, nombre, grupo, consignas, programa_alumno_id, estimulos_rft(id, nombre, posicion, concepto_imagen, pantalla)').in('programa_alumno_id', ids)
        : Promise.resolve({ data: [] }),
      ids.length
        ? supabase.from('dominio_rft_fases').select('programa_alumno_id, grupo, fase, posicion_origen, posicion_destino').in('programa_alumno_id', ids).eq('dominado', true)
        : Promise.resolve({ data: [] }),
      ids.length
        ? supabase.from('bloques_ensayo_rft').select('programa_alumno_id, grupo, fase, posicion_origen, posicion_destino, porcentaje, fecha').in('programa_alumno_id', ids).order('fecha')
        : Promise.resolve({ data: [] }),
    ])
    return { copias: copias ?? [], clases: (clases ?? []) as (Clase & { programa_alumno_id: string })[], dominio: dominio ?? [], bloques: (bloques ?? []) as Bloque[] }
  }

  let datos = await cargar()
  const sesionesHechas = datos.bloques.length
  const practica = sesionesHechas % 3 === 2
  const ultimo = datos.bloques[datos.bloques.length - 1]

  type Eleccion = { copiaId: string; grupo: string; paso: PasoSecuencia; ensenar: boolean } | { copiaId: string; conceptos: ActividadConceptos; nivel: number }

  // Pendientes de una copia: el del grupo 1 (o primer nivel) y los de práctica
  const pendientes = (copiaId: string) => {
    const copia = datos.copias.find((c) => c.id === copiaId)!
    const hecho = new Set(datos.dominio.filter((d) => d.programa_alumno_id === copiaId).map((d) => `${d.grupo}|${d.fase}|${d.posicion_origen}|${d.posicion_destino}`))
    const actividad = leerActividadConceptos(copia.actividad_tablet)
    if (actividad) {
      const niveles = actividad.niveles.map((n, i) => ({ i, hecho: hecho.has(`${n.nombre}|entrenamiento|A|A`) }))
      const primero: Eleccion | null = niveles[0].hecho ? null : { copiaId, conceptos: actividad, nivel: 0 }
      const otro = niveles.find((n) => n.i > 0 && !n.hecho)
      return { primero, practica: otro ? ({ copiaId, conceptos: actividad, nivel: otro.i } as Eleccion) : null }
    }
    const nivel = coerceNivelRft(copia.nivel_rft)
    const clasesCopia = datos.clases.filter((c) => c.programa_alumno_id === copiaId)
    const grupos = [...new Set(clasesCopia.map((c) => c.grupo))].sort(ordenGrupo)
    const pendienteDe = (grupo: string): Eleccion | null => {
      const delGrupo = clasesCopia.filter((c) => c.grupo === grupo)
      const posiciones = [...new Set(delGrupo.flatMap((c) => c.estimulos_rft.map((e) => e.posicion).filter((p): p is string => !!p)))]
      const paso = secuenciaDelGrupo(copia.secuencia_rft, nivel, posiciones).filter((p) => enTableta(delGrupo, p)).find((p) => !hecho.has(`${grupo}|${p.fase}|${p.origen}|${p.destino}`))
      if (!paso) return null
      // Regla de los dos intentos en los tests
      const fallidos = datos.bloques.filter(
        (b) => b.programa_alumno_id === copiaId && b.grupo === grupo && b.fase === paso.fase && b.posicion_origen === paso.origen && b.posicion_destino === paso.destino && Number(b.porcentaje) < Number(copia.porcentaje_dominio)
      ).length
      return { copiaId, grupo, paso, ensenar: paso.fase !== 'entrenamiento' && fallidos >= 2 }
    }
    const primero = grupos.length ? pendienteDe(grupos[0]) : null
    const practicaGrupo = grupos.slice(1).map(pendienteDe).find((e) => e) ?? null
    return { primero, practica: practicaGrupo }
  }

  // ¿El último bloque fue un primer test fallido de esta misma elección? Entonces
  // esta sesión se practica otra cosa y el test se repite después
  const esperaTrasFallo = (e: Eleccion) =>
    'paso' in e &&
    e.paso.fase !== 'entrenamiento' &&
    !e.ensenar &&
    !!ultimo &&
    ultimo.programa_alumno_id === e.copiaId &&
    ultimo.grupo === e.grupo &&
    ultimo.fase === e.paso.fase &&
    ultimo.posicion_origen === e.paso.origen &&
    ultimo.posicion_destino === e.paso.destino &&
    Number(ultimo.porcentaje) < Number(datos.copias.find((c) => c.id === e.copiaId)?.porcentaje_dominio ?? 90)

  const practicaDisponible = (excluir?: Eleccion) => {
    for (const baseId of ordenBases) {
      const copia = datos.copias.find((c) => c.programa_base_id === baseId)
      if (!copia) continue
      const p = pendientes(copia.id)
      if (p.practica && p.practica !== excluir) return p.practica
    }
    return null
  }

  let eleccion: Eleccion | null = practica ? practicaDisponible() : null
  if (!eleccion) {
    for (const baseId of ordenBases) {
      let copia = datos.copias.find((c) => c.programa_base_id === baseId)
      if (!copia) {
        // Siguiente programa del módulo: se importa ahora (sin pasar por los bloqueos del currículo profesional)
        const res = await importarPrograma(alumnoId, baseId, 'App infantil: orden del módulo')
        if ('error' in res && res.error) return { error: res.error }
        datos = await cargar()
        copia = datos.copias.find((c) => c.programa_base_id === baseId)
        if (!copia) continue
      }
      const p = pendientes(copia.id)
      if (p.primero) {
        eleccion = esperaTrasFallo(p.primero) ? (practicaDisponible(p.primero) ?? p.primero) : p.primero
        break
      }
    }
  }
  if (!eleccion) eleccion = practicaDisponible()
  if (!eleccion) return { terminado: true }

  const copia = datos.copias.find((c) => c.id === eleccion.copiaId)!
  if ('conceptos' in eleccion) {
    const categorias = [...CATEGORIAS_ENTRENAMIENTO, ...CATEGORIAS_GENERALIZACION]
    const { data: banco } = await supabase
      .from('biblioteca_imagenes')
      .select('concepto, nombre')
      .is('clinica_id', null)
      .eq('ejemplar', '1')
      .or(categorias.map((c) => `concepto.like.${c}/%`).join(','))
    const de = (lista: string[]) => (banco ?? []).filter((b) => lista.includes(b.concepto.split('/')[0]))
    const imagenes = await cargarImagenes(supabase, conceptosPropiosDe(eleccion.conceptos) ?? (banco ?? []).map((b) => b.concepto))
    return {
      plan: {
        tipo: 'conceptos',
        programaAlumnoId: copia.id,
        programa: copia.nombre,
        actividad: eleccion.conceptos,
        nivel: eleccion.nivel,
        conceptos: { entrenamiento: de(CATEGORIAS_ENTRENAMIENTO), generalizacion: de(CATEGORIAS_GENERALIZACION) },
        imagenes,
        sesionesHechas,
      },
    }
  }

  const clasesGrupo = datos.clases.filter((c) => c.programa_alumno_id === copia.id && c.grupo === eleccion.grupo)
  const imagenes = await cargarImagenes(
    supabase,
    clasesGrupo.flatMap((c) => c.estimulos_rft.flatMap((e) => [e.concepto_imagen, ...conceptosDePantalla(parsearEstimuloPantalla(e.pantalla))]))
  )
  return {
    plan: {
      tipo: 'clases',
      programaAlumnoId: copia.id,
      programa: copia.nombre,
      grupo: eleccion.grupo,
      paso: eleccion.paso,
      ensenar: eleccion.ensenar,
      clases: clasesGrupo.map(({ id, nombre, grupo, consignas, estimulos_rft }) => ({ id, nombre, grupo, consignas, estimulos_rft })),
      consignas: copia.consignas,
      opcionesClase: copia.opciones_clase,
      imagenes,
      sesionesHechas,
    },
  }
}
