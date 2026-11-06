// Genera las escenas de los conceptos espaciales y las secuencias temporales:
// la primera imagen de cada serie se genera y las demás se editan a partir de
// ella (espaciales) o de la anterior (secuencias), para que los objetos sean
// idénticos y solo cambie la relación.
//
//   node --env-file=.env.local scripts/imagenes/escenas-conceptos.mjs
//
// Guarda en scripts/imagenes/salida/<categoria>/<slug>-1.jpg (salta las que
// existen), las registra en el manifiesto del banco y deja láminas de revisión.

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const MODELO = 'gemini-nano-banana-2.1'
const ESTILO = 'Realistic photograph on a pure white seamless background, soft even studio lighting, both objects fully visible and easy to recognize. No text, letters or logos. No people, no hands. Square composition.'
const ESTILO_SECUENCIA = 'Realistic photograph on a plain light background, soft even lighting, the subject centered and easy to recognize. No text, letters or logos. No people, no hands. Square composition.'

// Espaciales: [objeto, referencia, uso]; relaciones en el mismo orden para todas
const RELACIONES = [
  ['encima', 'on top of'],
  ['debajo', 'directly underneath'],
  ['dentro', 'inside, partly visible over the rim'],
  ['fuera', 'outside and next to'],
  ['delante', 'in front of, closer to the camera, both clearly visible'],
  ['detras', 'behind, partly hidden but recognizable'],
]
// base: relación que se genera primero (el resto se edita desde ella);
// ajustes: instrucción propia de una relación; mantener: lo que no debe
// cambiar en ninguna edición; sin: relaciones que no tienen sentido
export const PAREJAS_ESPACIALES = [
  { objeto: ['pelota', 'a small red ball'], referencia: ['caja', 'an open brown cardboard box'], uso: 'entrenamiento' },
  { objeto: ['osito', 'a small brown teddy bear'], referencia: ['cesta', 'a wicker basket'], uso: 'entrenamiento' },
  {
    objeto: ['manzana', 'a green apple'], referencia: ['bol', 'a large blue bowl'], uso: 'entrenamiento', base: 'dentro',
    ajustes: { encima: 'now the bowl is turned upside down and the apple is resting on top of its base' },
  },
  {
    objeto: ['coche', 'a small yellow toy car'], referencia: ['cubo', 'a red plastic beach bucket standing upright with its opening facing up'], uso: 'entrenamiento',
    mantener: 'The bucket always stays upright with its opening facing up, in exactly the same place.',
  },
  { objeto: ['gato', 'a small grey cat soft toy'], referencia: ['caja', 'an open white shoe box without lid'], uso: 'generalizacion', slugReferencia: 'caja-zapatos' },
  { objeto: ['perro', 'a small white toy dog'], referencia: ['caseta', 'a small wooden dog house'], uso: 'generalizacion', sin: ['debajo'] },
]

// Secuencias temporales de 3 viñetas: [slug, descripción de la primera, cambios siguientes]
export const SECUENCIAS = [
  { slug: 'globo', inicio: 'a deflated red balloon lying flat', pasos: ['the same balloon half inflated', 'the same balloon fully inflated and round, tied'] },
  { slug: 'hielo', inicio: 'a single ice cube on a white plate', pasos: ['the same ice cube half melted with some water around it on the same plate', 'only a small puddle of water on the same plate, the ice completely melted'] },
  { slug: 'vela', inicio: 'a tall new white candle, lit, in a holder', pasos: ['the same candle burnt down to half its height, still lit', 'the same holder with only a tiny stub of candle left, blown out'] },
  { slug: 'manzana', inicio: 'a whole red apple', pasos: ['the same apple with one big bite taken out of it', 'only the core of the same apple left'] },
  { slug: 'torre', inicio: 'six colorful wooden toy blocks scattered on the floor', pasos: ['the same blocks with three of them stacked into a short tower', 'all six blocks stacked into a tall tower'] },
  { slug: 'vaso', inicio: 'an empty clear glass next to a carton of milk', pasos: ['the same glass half full of milk', 'the same glass full of milk to the top'] },
  { slug: 'dibujo', inicio: 'a blank sheet of white paper with colored crayons beside it', pasos: ['the same paper with a half-drawn simple house in crayon', 'the same paper with a finished colorful house, sun and tree drawn in crayon'] },
  { slug: 'tostada', inicio: 'a slice of white bread on a plate', pasos: ['the same slice toasted golden brown on the same plate', 'the same toast with butter and strawberry jam spread on it'] },
  { slug: 'planta', inicio: 'a small pot with soil and a tiny green sprout', pasos: ['the same pot with a small plant with a few leaves', 'the same pot with a tall plant with a big yellow flower'] },
]

const existe = (f) => access(f).then(() => true, () => false)

function imagen(json) {
  if (json?.output_image?.data) return json.output_image.data
  for (const paso of json.steps ?? []) for (const b of paso.content ?? []) if (b.type === 'image' && b.data) return b.data
  return null
}

async function pedir(input) {
  for (let intento = 1; intento <= 4; intento++) {
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODELO, input, store: false, response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '1:1', image_size: '1K' } }),
    })
    const texto = await res.text()
    if (res.ok) {
      const datos = imagen(JSON.parse(texto))
      if (datos) return datos
    }
    if (intento === 4) throw new Error(`HTTP ${res.status}: ${texto.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

const editar = async (fichero, instruccion, estilo) =>
  pedir([{ type: 'user_input', content: [
    { type: 'image', data: (await readFile(fichero)).toString('base64'), mime_type: 'image/jpeg' },
    { type: 'text', text: `Edit this photograph keeping exactly the same objects, sizes, colors, camera angle, lighting and background: ${instruccion}. Change nothing else. ${estilo}` },
  ] }])

async function lamina(ficheros, columnas, destino) {
  const lado = 240
  const filas = Math.ceil(ficheros.length / columnas)
  const composicion = await Promise.all(ficheros.map(async (f, i) => ({ input: await sharp(f).resize(lado, lado).toBuffer(), left: (i % columnas) * lado, top: Math.floor(i / columnas) * lado })))
  await sharp({ create: { width: columnas * lado, height: filas * lado, channels: 3, background: '#fff' } }).composite(composicion).jpeg().toFile(destino)
}

async function main() {
  const registros = []
  // Espaciales: la escena «encima» se genera; el resto se edita desde ella
  const dirE = path.join(aqui, 'salida', 'espaciales')
  await mkdir(dirE, { recursive: true })
  const fichE = []
  for (const p of PAREJAS_ESPACIALES) {
    const ref = p.slugReferencia ?? p.referencia[0]
    const relBase = p.base ?? 'encima'
    const base = path.join(dirE, `${p.objeto[0]}-${relBase}-${ref}-1.jpg`)
    const relaciones = [...RELACIONES.filter(([r]) => r === relBase), ...RELACIONES.filter(([r]) => r !== relBase && !(p.sin ?? []).includes(r))]
    for (const [i, [rel, ingles]] of relaciones.entries()) {
      const f = path.join(dirE, `${p.objeto[0]}-${rel}-${ref}-1.jpg`)
      try {
        if (!(await existe(f))) {
          const el = (t) => t.replace(/^an? /, 'the ')
          const instruccion = (p.ajustes?.[rel] ?? `now ${el(p.objeto[1])} is ${ingles} ${el(p.referencia[1])}`) + (p.mantener ? `. ${p.mantener}` : '')
          const datos = i === 0
            ? await pedir(`A realistic photograph of ${p.objeto[1]} ${ingles} ${p.referencia[1]}. ${p.mantener ?? ''} ${ESTILO}`)
            : await editar(base, instruccion, ESTILO)
          await writeFile(f, Buffer.from(datos, 'base64'))
        }
        fichE.push(f)
        registros.push({ relativo: `espaciales/${path.basename(f)}`, categoria: 'espaciales', grupo: `${p.objeto[0]} / ${ref}`, uso: p.uso, descripcion: `${p.objeto[1]} ${ingles} ${p.referencia[1]}`, concepto: `${p.objeto[0]} ${rel} ${ref.replace(/-/g, ' ')}` })
        console.log(`✓ ${path.basename(f)}`)
      } catch (e) {
        console.error(`✗ ${path.basename(f)}: ${e.message}`)
      }
    }
  }
  await lamina(fichE, 6, path.join(dirE, 'lamina.jpg'))

  // Secuencias: cada viñeta se edita desde la anterior
  const dirS = path.join(aqui, 'salida', 'secuencias')
  await mkdir(dirS, { recursive: true })
  const fichS = []
  for (const s of SECUENCIAS) {
    let anterior = null
    for (const [i, desc] of [s.inicio, ...s.pasos].entries()) {
      const f = path.join(dirS, `${s.slug}-${i + 1}-1.jpg`)
      try {
        if (!(await existe(f))) {
          const datos = i === 0 ? await pedir(`A realistic photograph of ${desc}. ${ESTILO_SECUENCIA}`) : await editar(anterior, `show what happens next: ${desc}`, ESTILO_SECUENCIA)
          await writeFile(f, Buffer.from(datos, 'base64'))
        }
        anterior = f
        fichS.push(f)
        registros.push({ relativo: `secuencias/${path.basename(f)}`, categoria: 'secuencias', grupo: s.slug, uso: 'entrenamiento', descripcion: desc, concepto: `${s.slug} ${i + 1}` })
        console.log(`✓ ${path.basename(f)}`)
      } catch (e) {
        console.error(`✗ ${path.basename(f)}: ${e.message}`)
        break
      }
    }
  }
  await lamina(fichS, 3, path.join(dirS, 'lamina.jpg'))

  // Registro en el manifiesto del banco
  const ficheroManifiesto = path.join(aqui, 'salida', 'manifiesto.json')
  const manifiesto = JSON.parse(await readFile(ficheroManifiesto, 'utf8'))
  for (const r of registros) {
    manifiesto[r.relativo] = { programa: 'Conceptos básicos', grupo: r.grupo, categoria: r.categoria, concepto: r.concepto, ejemplar: 1, uso: r.uso, descripcion: r.descripcion, modelo: MODELO }
  }
  await writeFile(ficheroManifiesto, JSON.stringify(manifiesto, null, 2))
  console.log(`${fichE.length} escenas espaciales y ${fichS.length} viñetas.`)
}

main()
