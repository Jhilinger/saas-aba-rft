// Consignas grabadas de la evaluación: cada consigna se graba una vez con la
// misma voz (scripts/voz/grabar.mjs) y se guarda en el bucket «biblioteca»
// con un nombre derivado del texto. La app y el script usan este módulo, así
// que una consigna editada no encuentra grabación y se dice con la voz del
// dispositivo hasta que se vuelva a grabar.

export const VOZ_GRABADA = 'es-es-tutor-12'

// Hash de 53 bits (cyrb53) del texto, en base 36
function hash(texto: string) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761)
    h2 = Math.imul(h2 ^ c, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

export function rutaConsignaGrabada(texto: string) {
  return `voz/${VOZ_GRABADA}/${hash(texto.trim())}.m4a`
}

// Texto que se manda a la voz: las palabras en mayúsculas (pseudopalabras
// como MELO o DOVI) se pasan a minúsculas para que se lean como palabras y
// no letra a letra
export function textoParaVoz(texto: string) {
  return texto.trim().replace(/\p{Lu}{2,}/gu, (palabra) => palabra.toLowerCase())
}
