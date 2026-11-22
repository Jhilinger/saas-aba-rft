// Genera las parejas causa → efecto de «Abstraer Claves Causales»: la causa se genera y el efecto
// se edita a partir de ella, para que los objetos sean idénticos y solo cambie lo que la causa
// produce. Guarda en salida/causales/<slug>-causa-1.jpg y <slug>-efecto-1.jpg (salta las que
// existen), las registra en el manifiesto y deja una lámina de revisión.
//
//   node --env-file=.env.local scripts/imagenes/causas-efectos.mjs

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const MODELO = 'gemini-nano-banana-2.1'
const ESTILO = "Realistic photograph on a plain light background, soft even lighting, the objects centered and easy to recognize. If the action needs a person, show only a child's hand or arm, never a face. No text, letters or logos. Square composition."

export const CAUSALES = [
  { slug: 'vela', uso: 'entrenamiento', causa: "a child's hand holding a small paper fan, blowing air at a lit white candle in a holder; the flame bends", efecto: 'the same candle blown out, with a thin trail of smoke and no flame; no hand' },
  { slug: 'torre', uso: 'entrenamiento', causa: "a child's hand pushing a tall tower of colorful wooden blocks, the tower starting to tip over", efecto: 'the same colorful wooden blocks fallen and scattered on the floor; no hand' },
  { slug: 'vaso', uso: 'entrenamiento', causa: "a child's hand bumping into a glass full of water standing on a wooden table", efecto: 'the same glass lying on its side on the same table with the water spilled around it; no hand' },
  { slug: 'globo', uso: 'entrenamiento', causa: "a child's hand holding a pin touching an inflated red balloon", efecto: 'only torn pieces of the same red balloon, burst; no hand, no pin' },
  { slug: 'huevo', uso: 'entrenamiento', causa: "a child's hand letting go of a white egg, the egg falling towards a tiled floor", efecto: 'the same egg broken on the tiled floor, with the yolk spilled; no hand' },
  { slug: 'lampara', uso: 'entrenamiento', causa: "a child's finger pressing the switch of a desk lamp that is switched off", efecto: 'the same desk lamp switched on and glowing brightly; no hand' },
  { slug: 'papel', uso: 'entrenamiento', causa: "a child's hand cutting a sheet of colored paper in half with child scissors", efecto: 'the same sheet of colored paper cut into two separate pieces lying on the table; no hand, no scissors' },
  { slug: 'ventana', uso: 'entrenamiento', causa: 'a football flying straight towards a closed window, seen from outside', efecto: 'the same window with its glass cracked and the ball lying on the ground below it' },
  { slug: 'castillo', uso: 'generalizacion', causa: 'a wave of sea water reaching a sand castle on the beach', efecto: 'the same sand castle washed away, only a low wet mound of sand left' },
  { slug: 'helado', uso: 'generalizacion', causa: 'an ice cream cone left under a strong hot summer sun', efecto: 'the same ice cream cone melted and dripping, with a puddle of ice cream under it' },
  { slug: 'planta', uso: 'generalizacion', causa: 'a watering can pouring water onto a wilted, drooping plant in a pot', efecto: 'the same plant in the same pot, upright, fresh and green; no watering can' },
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
const editar = async (fichero, instruccion) =>
  pedir([{ type: 'user_input', content: [
    { type: 'image', data: (await readFile(fichero)).toString('base64'), mime_type: 'image/jpeg' },
    { type: 'text', text: `Edit this photograph keeping exactly the same objects, colors, camera angle, lighting and background, and show the result of what is happening: ${instruccion}. Change nothing else. ${ESTILO}` },
  ] }])

async function main() {
  const dir = path.join(aqui, 'salida', 'causales')
  await mkdir(dir, { recursive: true })
  const registros = [], ficheros = []
  for (const c of CAUSALES) {
    const fc = path.join(dir, `${c.slug}-causa-1.jpg`), fe = path.join(dir, `${c.slug}-efecto-1.jpg`)
    try {
      if (!(await existe(fc))) await writeFile(fc, Buffer.from(await pedir(`A realistic photograph of ${c.causa}. ${ESTILO}`), 'base64'))
      if (!(await existe(fe))) await writeFile(fe, Buffer.from(await editar(fc, c.efecto), 'base64'))
      ficheros.push(fc, fe)
      registros.push({ f: fc, concepto: `${c.slug} causa`, descripcion: c.causa, uso: c.uso, grupo: c.slug })
      registros.push({ f: fe, concepto: `${c.slug} efecto`, descripcion: c.efecto, uso: c.uso, grupo: c.slug })
      console.log(`✓ ${c.slug}`)
    } catch (e) {
      console.error(`✗ ${c.slug}: ${e.message}`)
    }
  }
  const lado = 240
  const comp = await Promise.all(ficheros.map(async (f, i) => ({ input: await sharp(f).resize(lado, lado).toBuffer(), left: (i % 2) * lado, top: Math.floor(i / 2) * lado })))
  await sharp({ create: { width: 2 * lado, height: Math.ceil(ficheros.length / 2) * lado, channels: 3, background: '#fff' } }).composite(comp).jpeg().toFile(path.join(dir, 'lamina.jpg'))
  const fm = path.join(aqui, 'salida', 'manifiesto.json')
  const manifiesto = JSON.parse(await readFile(fm, 'utf8'))
  for (const r of registros) manifiesto[`causales/${path.basename(r.f)}`] = { programa: 'Conceptos básicos', grupo: r.grupo, categoria: 'causales', concepto: r.concepto, ejemplar: 1, uso: r.uso, descripcion: r.descripcion, modelo: MODELO }
  await writeFile(fm, JSON.stringify(manifiesto, null, 2))
  console.log(`${ficheros.length} imágenes. Lámina: ${path.join(dir, 'lamina.jpg')}`)
}
main()
