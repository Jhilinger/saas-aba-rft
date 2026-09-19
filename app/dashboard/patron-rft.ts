// Cálculo del "patrón" de una clase para el nivel RFT "relacionar
// relaciones" (igualación a la muestra relacional): se agrupan los
// estímulos de la clase por su `elemento` (dos estímulos con el mismo
// elemento cuentan como "el mismo", aunque su nombre visible sea distinto
// — ej. "luna" y "moon"), se cuenta cuántos hay de cada elemento, y se
// ordena de mayor a menor. Círculo-Círculo-Cuadrado y Triángulo-Cuadrado-
// Triángulo dan ambos [2,1] aunque el contenido no tenga nada que ver —
// eso es lo que hace que dos clases "combinen".
//
// Los estímulos sin elemento asignado (o con elemento repetido pero null)
// se tratan como únicos entre sí, para no contarlos como duplicados por error.

export function calcularPatron(estimulos: { id: string; elemento: string | null }[]): number[] {
  const conteo = new Map<string, number>()
  for (const e of estimulos) {
    const clave = e.elemento?.trim() ? `e:${e.elemento.trim()}` : `id:${e.id}`
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1)
  }
  return [...conteo.values()].sort((a, b) => b - a)
}

export function formatearPatron(patron: number[]): string {
  return patron.join('-')
}

export function mismoPatron(a: number[], b: number[]): boolean {
  return formatearPatron(a) === formatearPatron(b)
}
