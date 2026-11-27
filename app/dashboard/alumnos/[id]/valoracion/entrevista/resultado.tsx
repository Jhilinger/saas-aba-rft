import { NOMBRE_DOMINIO } from './preguntas'

// Resumen de una entrevista: «Nivel 2 · empezar por 2.3 (…)», lagunas y dudas
export function textoResultado(dominio: string | null, lagunas: string[], pendientes: number[]) {
  const principal = dominio
    ? `Nivel ${dominio.split('.')[0]} · empezar por ${dominio} ${NOMBRE_DOMINIO[dominio] ?? ''}`.trim()
    : 'Sin dificultades en lo preguntado: elegir los programas según el criterio clínico'
  const extra = [
    lagunas.length ? `lagunas: ${lagunas.join(', ')}` : null,
    pendientes.length ? `${pendientes.length} ${pendientes.length === 1 ? 'pregunta' : 'preguntas'} sin saber (comprobar)` : null,
  ].filter(Boolean)
  return extra.length ? `${principal} · ${extra.join(' · ')}` : principal
}
