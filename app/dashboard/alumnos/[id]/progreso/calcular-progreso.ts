import { crearCodificador, type EstructuraCurriculo } from '../../../curriculo/estructura'
import type { EstadoPrograma, NivelProgreso, ProgramaProgreso } from './progreso-curriculo'

type ProgramaBase = {
  id: string
  nombre: string
  tipo: string
  dominio_id: string | null
  orden: number | null
  clinica_id: string | null
}

type ProgramaAsignado = {
  id: string
  nombre: string
  tipo: string
  estado: string | null
  programa_base_id: string | null
  programas_base: (ProgramaBase & { activo: boolean }) | null
}

export function simplificarEstado(estado: string | null): EstadoPrograma {
  if (!estado) return 'sin_ensenar'
  if (estado === 'dominado' || estado === 'mantenimiento') return 'dominado'
  return 'adquisicion'
}

// Progreso por nivel y dominio:
// - % de dominio = programas dominados / programas del dominio
// - % de nivel = media de los % de sus dominios con programas (cada dominio
//   pesa lo mismo, tenga 1 programa o 24); dominios vacíos no cuentan
// Cuentan el currículo activo recibido + los privados asignados al alumno.
export function calcularProgreso<A extends ProgramaAsignado>({
  estructura,
  curriculo,
  asignados,
  dominadoEnValoracion = new Set(),
  hrefAsignado,
  mostrarFueraDelCurriculo = () => true,
}: {
  estructura: EstructuraCurriculo
  curriculo: ProgramaBase[]
  asignados: A[]
  dominadoEnValoracion?: Set<string>
  hrefAsignado: (a: { id: string; tipo: string }) => string | null
  mostrarFueraDelCurriculo?: (a: A) => boolean
}): { niveles: NivelProgreso[]; fueraDelCurriculo: ProgramaProgreso[] } {
  const codificador = crearCodificador(estructura)
  const asignadoPorBase = new Map(asignados.filter((a) => a.programa_base_id).map((a) => [a.programa_base_id!, a]))

  const base = new Map(curriculo.map((p) => [p.id, p]))
  for (const a of asignados) {
    const pb = a.programas_base
    if (pb && pb.activo && !base.has(pb.id)) base.set(pb.id, pb)
  }

  const programasPorDominio = new Map<string, ProgramaProgreso[]>()
  const ordenPorPrograma = new Map<string, number | null>()
  for (const p of base.values()) {
    if (!p.dominio_id) continue
    // Prioridad: si está en el PEI manda su estado real; si no, la
    // valoración inicial puede haberlo marcado ya como dominado
    const asignado = asignadoPorBase.get(p.id)
    const estado: EstadoPrograma = asignado
      ? simplificarEstado(asignado.estado)
      : dominadoEnValoracion.has(p.id)
        ? 'dominado'
        : 'sin_ensenar'

    const lista = programasPorDominio.get(p.dominio_id) ?? []
    lista.push({
      id: p.id,
      codigo: codificador.codigo(p),
      nombre: p.nombre,
      tipo: p.tipo,
      estado,
      href: asignado ? hrefAsignado(asignado) : null,
    })
    programasPorDominio.set(p.dominio_id, lista)
    ordenPorPrograma.set(p.id, codificador.ordenGlobal(p))
  }

  const niveles: NivelProgreso[] = estructura.niveles.map((n) => {
    const dominios = estructura.dominios
      .filter((d) => d.nivel === n.numero)
      .map((d) => {
        const programas = (programasPorDominio.get(d.id) ?? []).sort(
          (a, b) =>
            (ordenPorPrograma.get(a.id) ?? Infinity) - (ordenPorPrograma.get(b.id) ?? Infinity) ||
            a.nombre.localeCompare(b.nombre)
        )
        const dominados = programas.filter((p) => p.estado === 'dominado').length
        const adquisicion = programas.filter((p) => p.estado === 'adquisicion').length
        return {
          id: d.id,
          codigo: d.codigo,
          nombre: d.nombre,
          total: programas.length,
          dominados,
          adquisicion,
          porcentaje: programas.length ? Math.round((dominados / programas.length) * 100) : null,
          programas,
        }
      })

    const conProgramas = dominios.filter((d) => d.total > 0)
    const porcentaje = conProgramas.length
      ? Math.round(conProgramas.reduce((s, d) => s + (d.dominados / d.total) * 100, 0) / conProgramas.length)
      : null

    return { numero: n.numero, nombre: n.nombre, porcentaje, dominios }
  })

  // Programas del PEI sin plantilla del currículo (o cuya plantilla no tiene dominio)
  const fueraDelCurriculo: ProgramaProgreso[] = asignados
    .filter((a) => !a.programas_base?.dominio_id && mostrarFueraDelCurriculo(a))
    .map((a) => ({
      id: a.id,
      codigo: null,
      nombre: a.nombre,
      tipo: a.tipo,
      estado: simplificarEstado(a.estado),
      href: hrefAsignado(a),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  return { niveles, fueraDelCurriculo }
}
