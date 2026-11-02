// Genera el banco de imágenes de estímulos con la API de Gemini.
//
//   node --env-file=.env.local scripts/imagenes/generar.mjs [--datos piloto.json] [--solo N] [--limite-euros 10]
//
// Lee los conceptos y ejemplares de un fichero de datos (por defecto
// piloto.json), compone el prompt con la guía de estilo de cada categoría y
// guarda cada imagen en scripts/imagenes/salida/<categoría>/<concepto>-<n>.jpg
// (el ejemplar reservado para la evaluación, como -eval.jpg). Salta las que ya
// existen, así que se puede interrumpir y reanudar. Antes de llamar a la API
// calcula el coste y se para si supera el límite.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const MODELO = 'gemini-nano-banana-2.1'
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
// Precio oficial por imagen 1K (USD); se toma 1 USD = 1 € para quedar del lado seguro
const PRECIO_IMAGEN = 0.0336
const CONCURRENCIA = 2
const REINTENTOS = 4

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pares, a, i, todos) => (a.startsWith('--') ? [...pares, [a.slice(2), todos[i + 1]]] : pares), [])
)
const ficheroDatos = path.resolve(aqui, args.datos ?? 'piloto.json')
const solo = args.solo ? Number(args.solo) : Infinity
const limiteEuros = Number(args['limite-euros'] ?? 10)
const salida = path.join(aqui, 'salida')

const ESTILO_COMUN =
  'Exactly one subject, centered, fully visible with a comfortable margin, on a pure white seamless background. ' +
  'Soft, even studio lighting; at most a very faint contact shadow. ' +
  'No text, letters, numbers, logos or brand marks anywhere. No people, no hands, no other objects. Square composition.'

const ESTILO_CATEGORIA = {
  alimentos: 'Show the food on its own, without plates, cutlery or tablecloth unless the description itself includes a container.',
  'animales de granja': 'Show the whole body of the animal, standing naturally, preferably seen from the side. No ground, grass, fences or scenery.',
  vehículos: 'Show the whole vehicle from a three-quarter side view. No road, scenery or visible people.',
  'prendas de vestir': 'Show the garment laid flat or on an invisible mannequin, never worn by a person. Paired items are shown as a pair.',
  'evaluación objetos': 'Animals are shown whole and standing naturally; objects are shown whole.',
  'animales salvajes': 'Show the whole body of the animal in a natural pose. No ground, scenery or other animals.',
  'animales marinos': 'Show the whole animal. No water, sand or scenery.',
  'animales de granja': 'Show the whole body of the animal, standing naturally, preferably seen from the side. No ground, grass, fences or scenery.',
  plantas: 'Show the whole plant (with its pot if it has one). Trees are shown as a whole full-size tree standing alone, not a bonsai and not in a pot. No garden or scenery.',
  'material escolar': 'Show the object whole, as a child would use it at school.',
  herramientas: 'Show the tool whole.',
  'electrodomésticos': 'Show the whole appliance, front three-quarter view, not built into any kitchen.',
  muebles: 'Show the whole piece of furniture, three-quarter view, with nothing on it. No room.',
  'utensilios de cocina': 'Show the utensil whole and empty.',
  'instrumentos musicales': 'Show the whole instrument, nobody playing it.',
  objetos: 'Show the object whole.',
  alimentos: 'Show the food on its own, without plates, cutlery or tablecloth unless the description itself includes a container.',
  peligros: 'The danger must be obvious at a glance. Show only what is described.',
  'características': 'The state (wet, broken, dirty, open, full…) must be obvious at a glance.',
}

// Categorías con personas, acciones o varias piezas: plantilla propia, sin la
// regla de «un solo objeto, sin personas»
const PLANTILLA = {
  'evaluación emociones': (d) =>
    `A realistic close-up portrait photograph of ${d}. Head and shoulders, facing the camera, on a pure white background. ` +
    'The emotion must be obvious and unambiguous at a glance. Natural, friendly look. No text, letters or logos. Square composition.',
  'evaluación escenas': (d) =>
    `A clear, simple realistic photograph of ${d}. The action must be obvious at a glance; the main subject is large and centered. ` +
    'Plain, uncluttered light background with only what the scene needs. No text, letters, numbers or logos. Square composition.',
  'evaluación secuencias': (d) =>
    `A clear, simple realistic photograph of ${d}, centered on a pure white background, soft even lighting. ` +
    'Only the elements described. No people except, if needed, a hand. No text, letters, numbers or logos. Square composition.',
}
// Categorías del inventario con personas o escenas: mismas plantillas
const escena = PLANTILLA['evaluación escenas']
Object.assign(PLANTILLA, {
  emociones: PLANTILLA['evaluación emociones'],
  profesiones: (d) => `A realistic photograph of ${d}, whole body, the profession obvious at a glance from clothes and tools. Plain, light, uncluttered background. Friendly look. No text, letters or logos. Square composition.`,
  acciones: (d) => `A realistic photograph of ${d}. The action must be obvious at a glance; the person is large and centered. Plain, light, uncluttered background. No text, letters or logos. Square composition.`,
  deportes: escena,
  sensaciones: (d) => `A realistic photograph of ${d}. The feeling must be obvious at a glance from face and body. Plain, light background. No text, letters or logos. Square composition.`,
  'partes del cuerpo': (d) => `A realistic close-up photograph of ${d}, on a pure white background, soft even lighting. Only that body part, clearly recognizable. Natural and tasteful. No text, letters or logos. Square composition.`,
  lugares: (d) => `A clear, realistic photograph of ${d}, easy to recognize at a glance, bright and tidy, without people in the foreground. No readable text, signs or logos. Square composition.`,
  'dependencias de la casa': (d) => `A clear, realistic photograph of ${d} in an ordinary family home, bright and tidy, easy to recognize at a glance. No people. No text or logos. Square composition.`,
  estaciones: escena,
  'tiempo atmosférico': (d) => `A realistic landscape photograph of ${d}; the weather must be obvious at a glance. No people, no text. Square composition.`,
  momentos: escena,
  transportes: escena,
  escenas: escena,
  universo: (d) => `A clear, realistic image of ${d}, centered, easy to recognize at a glance, on a plain background. No text. Square composition.`,
  cuentos: (d) => `${d}. Warm, colorful picture-book illustration for young children, simple and clear, one main scene. Original style, not imitating any studio. No text, no title, no letters. Square composition.`,
  'señales': (d) => /pictogram/i.test(d)
    ? `${d}. Flat pictogram in the style of an augmentative communication symbol: thick black outlines, flat bright colors, white background, no shading. No text or letters. Square composition.`
    : /sign|traffic light/i.test(d)
      ? `A realistic photograph of ${d}, centered on a plain light background, easy to recognize at a glance. No other text. Square composition.`
      : `A realistic photograph of ${d}, upper body facing the camera, the gesture obvious at a glance, on a pure white background. Friendly look. No text or logos. Square composition.`,
})

function prompt(categoria, descripcion) {
  if (PLANTILLA[categoria]) return PLANTILLA[categoria](descripcion)
  return `A realistic studio product photograph of ${descripcion}. ${ESTILO_CATEGORIA[categoria] ?? ''} ${ESTILO_COMUN}`
}

function slug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function existe(fichero) {
  try {
    await access(fichero)
    return true
  } catch {
    return false
  }
}

function imagenDeRespuesta(json) {
  if (json?.output_image?.data) return json.output_image.data
  for (const paso of json?.steps ?? []) {
    for (const bloque of paso.content ?? []) if (bloque.type === 'image' && bloque.data) return bloque.data
  }
  return null
}

async function generar(tarea) {
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODELO,
        input: tarea.prompt,
        store: false,
        response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '1:1', image_size: '1K' },
      }),
    })
    if (res.ok) {
      const datos = imagenDeRespuesta(await res.json())
      if (!datos) throw new Error('La respuesta no trae imagen')
      return Buffer.from(datos, 'base64')
    }
    const cuerpo = await res.text()
    const reintentable = res.status === 429 || res.status >= 500
    if (!reintentable || intento === REINTENTOS) throw new Error(`HTTP ${res.status}: ${cuerpo.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Falta GEMINI_API_KEY (ejecuta con --env-file=.env.local).')
    process.exit(1)
  }
  const datos = JSON.parse(await readFile(ficheroDatos, 'utf8'))

  const tareas = []
  for (const p of datos.programas) {
    p.grupos.forEach((grupo, g) => {
      for (const c of grupo) {
        const variantes = c.ejemplares.map((descripcion, i) => ({ sufijo: String(i + 1), descripcion, uso: 'intervencion' }))
        if (c.evaluacion) variantes.push({ sufijo: 'eval', descripcion: c.evaluacion, uso: 'evaluacion' })
        for (const v of variantes) {
          tareas.push({
            programa: p.programa,
            categoria: p.categoria,
            grupo: g + 1,
            concepto: c.concepto,
            ejemplar: v.sufijo,
            uso: v.uso,
            descripcion: v.descripcion,
            prompt: prompt(p.categoria, v.descripcion),
            fichero: path.join(salida, slug(p.categoria), `${slug(c.concepto)}-${v.sufijo}.jpg`),
          })
        }
      }
    })
  }

  const pendientes = []
  for (const t of tareas) if (!(await existe(t.fichero))) pendientes.push(t)
  const aGenerar = pendientes.slice(0, solo)
  const coste = aGenerar.length * PRECIO_IMAGEN
  console.log(`${tareas.length} imágenes en total, ${pendientes.length} pendientes, se generan ${aGenerar.length}.`)
  console.log(`Coste estimado: ${coste.toFixed(2)} € (límite ${limiteEuros} €).`)
  if (coste > limiteEuros) {
    console.error('El coste estimado supera el límite: no se genera nada. Sube --limite-euros o usa --solo.')
    process.exit(1)
  }

  const manifiestoFichero = path.join(salida, 'manifiesto.json')
  const manifiesto = (await existe(manifiestoFichero)) ? JSON.parse(await readFile(manifiestoFichero, 'utf8')) : {}
  let hechas = 0
  let fallos = 0
  const cola = [...aGenerar]
  async function trabajador() {
    while (cola.length) {
      const t = cola.shift()
      try {
        const imagen = await generar(t)
        await mkdir(path.dirname(t.fichero), { recursive: true })
        await writeFile(t.fichero, imagen)
        const { fichero, ...resto } = t
        manifiesto[path.relative(salida, fichero)] = { ...resto, modelo: MODELO, generada: new Date().toISOString() }
        hechas++
        console.log(`✓ ${path.relative(salida, t.fichero)}`)
      } catch (e) {
        fallos++
        console.error(`✗ ${path.relative(salida, t.fichero)}: ${e.message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCIA }, trabajador))
  await mkdir(salida, { recursive: true })
  await writeFile(manifiestoFichero, JSON.stringify(manifiesto, null, 2))
  console.log(`Hechas ${hechas}, fallos ${fallos}. Coste aproximado: ${(hechas * PRECIO_IMAGEN).toFixed(2)} €.`)
}

main()
