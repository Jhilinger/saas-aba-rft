// Lógica compartida (cliente y servidor) para saber qué combinaciones de
// posiciones se pueden probar en un grupo, según lo que ya esté dominado en
// entrenamiento. Un test de vínculo mutuo o combinatorio (y la
// transformación de funciones) solo tiene sentido clínico una vez que la
// relación directa que lo produciría ya se ha enseñado y dominado — si no,
// no se está probando nada emergente, solo adivinando.
//
// Se modela como un grafo NO dirigido: cada par entrenado y dominado
// (origen, destino) conecta esas dos posiciones. Dos posiciones son
// "probables" (test_mutuo/test_combinatorio/transformacion_funciones) en
// cuanto existe un camino entre ellas por relaciones dominadas — un salto
// es el caso de vínculo mutuo (A-B entrenado → B-A probable), y dos o más
// saltos es vínculo combinatorio (A-B y B-C entrenados → A-C y C-A
// probables, además de B-A y C-B).

export const FASES_QUE_REQUIEREN_CONEXION = ['test_mutuo', 'test_combinatorio', 'transformacion_funciones'] as const

export type ParEntrenado = { grupo: string; posicion_origen: string; posicion_destino: string }

export function construirGrafoEntrenado(pares: ParEntrenado[], grupo: string): Map<string, Set<string>> {
  const grafo = new Map<string, Set<string>>()
  const anadirArista = (a: string, b: string) => {
    if (!grafo.has(a)) grafo.set(a, new Set())
    if (!grafo.has(b)) grafo.set(b, new Set())
    grafo.get(a)!.add(b)
    grafo.get(b)!.add(a)
  }
  for (const p of pares) {
    if (p.grupo !== grupo) continue
    anadirArista(p.posicion_origen, p.posicion_destino)
  }
  return grafo
}

export function estanConectadas(grafo: Map<string, Set<string>>, origen: string, destino: string): boolean {
  if (!origen || !destino) return false
  if (origen === destino) return true
  if (!grafo.has(origen) || !grafo.has(destino)) return false

  const visitados = new Set([origen])
  const cola = [origen]
  while (cola.length > 0) {
    const actual = cola.shift()!
    if (actual === destino) return true
    for (const vecino of grafo.get(actual) ?? []) {
      if (!visitados.has(vecino)) {
        visitados.add(vecino)
        cola.push(vecino)
      }
    }
  }
  return false
}

export function relacionesDominadasTexto(pares: ParEntrenado[], grupo: string): string[] {
  return pares.filter((p) => p.grupo === grupo).map((p) => `${p.posicion_origen}→${p.posicion_destino}`)
}
