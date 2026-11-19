// Caras y señales propias de cada grupo en «Transferir Funciones Emocionales…» y
// «Transferir Funciones Discriminativas…»: cada grupo tiene su persona (mujer,
// niño pequeño, abuela, dibujo) en vez de repetir las fotos del concepto
// general. Para que se reconozca a la misma persona con cada emoción, primero se
// genera un retrato neutro y después se edita esa imagen para cada emoción.
//
//   node --env-file=.env.local scripts/imagenes/caras-por-grupo.mjs
//
// Guarda en scripts/imagenes/salida/emociones/ y salida/senales/ (salta las que
// existen), las registra en el manifiesto del banco (categoría emociones o
// señales, ejemplar 1) y deja una lámina de revisión en salida/caras-por-grupo.jpg.

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const salida = path.join(aqui, 'salida')
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const MODELO = 'gemini-nano-banana-2.1'
const RETRATO = 'Head and shoulders, facing the camera, on a pure white background. Natural, friendly look. No text, letters or logos. Square composition.'

// Personas: retrato neutro de base (no se sube) y emociones que necesita
const PERSONAS = [
  { slug: 'mujer', nombre: 'mujer', base: 'A realistic close-up portrait photograph of the face of a woman about 30 years old with dark curly hair, with a calm neutral expression.', emociones: ['contento', 'triste', 'enfadado', 'asustado', 'sorprendido', 'asco'] },
  { slug: 'nino', nombre: 'niño', base: 'A realistic close-up portrait photograph of the face of a boy about 5 years old with straight light brown hair and light skin, with a calm neutral expression.', emociones: ['contento', 'triste', 'enfadado', 'asustado', 'sorprendido', 'asco'] },
  { slug: 'abuela', nombre: 'abuela', base: 'A realistic close-up portrait photograph of the face of a grandmother about 70 years old with short grey hair and glasses, with a calm neutral expression.', emociones: ['contento', 'triste', 'enfadado'] },
  { slug: 'dibujo', nombre: 'dibujo', base: "A simple flat children's book illustration of the face of a boy, clean outlines, flat soft colors, white background, with a calm neutral expression.", emociones: ['contento', 'triste', 'enfadado'] },
]
const EMOCION = {
  contento: ['Contento', 'clearly happy, with a big genuine smile'],
  triste: ['Triste', 'clearly sad, with downturned mouth and sad eyes'],
  enfadado: ['Enfadado', 'clearly angry, with frowning eyebrows and a tense mouth'],
  asustado: ['Asustado', 'clearly scared, with wide eyes and raised eyebrows'],
  sorprendido: ['Sorprendido', 'clearly surprised, with raised eyebrows and an open mouth'],
  asco: ['Asco', 'showing clear disgust, with a wrinkled nose and curled upper lip'],
}
// Caras que necesitaron una expresión más marcada (revisión del 2026-11-19)
const REFUERZO_EXPRESION = {
  'abuela/enfadado': 'furious and scolding: eyebrows pulled sharply down and together into a deep V, eyes narrowed and glaring, nostrils flared, mouth open showing clenched teeth as if telling someone off. The anger must be intense and unmistakable, clearly not sadness',
}
// Señales nuevas (se generan directamente)
const SENALES = [
  { slug: 'gesto-de-ven-mujer', nombre: 'Gesto de ven mujer', texto: 'A realistic photograph of a woman about 30 years old making a beckoning "come here" gesture with her hand, upper body facing the camera, the gesture obvious at a glance, on a pure white background. Friendly look. No text or logos. Square composition.' },
  { slug: 'gesto-de-ven-hombre-mayor', nombre: 'Gesto de ven hombre mayor', texto: 'A realistic photograph of a man about 65 years old with grey hair making a beckoning "come here" gesture with his hand, upper body facing the camera, the gesture obvious at a glance, on a pure white background. Friendly look. No text or logos. Square composition.' },
  { slug: 'pictograma-de-sientate-sillon', nombre: 'Pictograma de sientate sillon', texto: 'a simple pictogram of a person sitting on an armchair. Flat pictogram in the style of an augmentative communication symbol: thick black outlines, flat bright colors, white background, no shading. No text or letters. Square composition.' },
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
    if (intento === 4 || (res.status !== 429 && res.status < 500 && !res.ok)) throw new Error(`HTTP ${res.status}: ${texto.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

async function main() {
  await mkdir(path.join(salida, 'emociones'), { recursive: true })
  await mkdir(path.join(salida, 'senales'), { recursive: true })
  await mkdir(path.join(salida, 'bases'), { recursive: true })
  const manifiesto = JSON.parse(await readFile(path.join(salida, 'manifiesto.json'), 'utf8'))
  const filas = []

  for (const p of PERSONAS) {
    const fbase = path.join(salida, 'bases', `${p.slug}.jpg`)
    const fila = [fbase]
    try {
      if (!(await existe(fbase))) await writeFile(fbase, Buffer.from(await pedir(`${p.base} ${RETRATO}`), 'base64'))
      const base = (await readFile(fbase)).toString('base64')
      for (const emo of p.emociones) {
        const [nombreEmo, general] = EMOCION[emo]
        const descripcion = REFUERZO_EXPRESION[`${p.slug}/${emo}`] ?? general
        const clave = `emociones/${emo}-${p.slug}-1.jpg`
        const fichero = path.join(salida, clave)
        const prompt = `Edit this image: show exactly the same person, same hair, clothes, framing, lighting, style and white background, but now the face is ${descripcion}. The emotion must be obvious and unambiguous at a glance. Change nothing else. No text, letters or logos.`
        if (!(await existe(fichero))) {
          const datos = await pedir([{ type: 'user_input', content: [{ type: 'image', data: base, mime_type: 'image/jpeg' }, { type: 'text', text: prompt }] }])
          await writeFile(fichero, Buffer.from(datos, 'base64'))
        }
        manifiesto[clave] = {
          programa: 'Transferir Funciones Emocionales a Estímulos Arbitrarios',
          categoria: 'emociones',
          grupo: p.nombre,
          concepto: `${nombreEmo} ${p.nombre}`,
          ejemplar: '1',
          uso: 'intervencion',
          descripcion: `${p.base.replace(/ with a calm neutral expression\.$/, '')}, ${descripcion}`,
          prompt,
          modelo: MODELO,
          generada: new Date().toISOString(),
        }
        fila.push(fichero)
        console.log(`✓ ${clave}`)
      }
    } catch (e) {
      console.error(`✗ ${p.slug}: ${e.message}`)
    }
    filas.push(fila)
  }

  const filaSenales = []
  for (const s of SENALES) {
    const clave = `senales/${s.slug}-1.jpg`
    const fichero = path.join(salida, clave)
    try {
      if (!(await existe(fichero))) await writeFile(fichero, Buffer.from(await pedir(s.texto), 'base64'))
      manifiesto[clave] = {
        programa: 'Transferir Funciones Discriminativas a Estímulos Arbitrarios',
        categoria: 'señales',
        grupo: 'por grupo',
        concepto: s.nombre,
        ejemplar: '1',
        uso: 'intervencion',
        descripcion: s.texto.split('. ')[0],
        prompt: s.texto,
        modelo: MODELO,
        generada: new Date().toISOString(),
      }
      filaSenales.push(fichero)
      console.log(`✓ ${clave}`)
    } catch (e) {
      console.error(`✗ ${s.slug}: ${e.message}`)
    }
  }
  filas.push(filaSenales)
  await writeFile(path.join(salida, 'manifiesto.json'), JSON.stringify(manifiesto, null, 2))

  // Lámina de revisión: una fila por persona (el retrato neutro primero) y la de señales
  const lado = 220
  const columnas = Math.max(...filas.map((f) => f.length))
  const composicion = []
  for (const [i, fila] of filas.entries()) {
    for (const [j, f] of fila.entries()) {
      if (await existe(f)) composicion.push({ input: await sharp(f).resize(lado, lado).toBuffer(), left: j * (lado + 10), top: i * (lado + 10) })
    }
  }
  const lamina = path.join(salida, 'caras-por-grupo.jpg')
  await sharp({ create: { width: columnas * (lado + 10), height: filas.length * (lado + 10), channels: 3, background: '#fff' } })
    .composite(composicion)
    .jpeg()
    .toFile(lamina)
  console.log(`Lámina: ${lamina}`)
}

main()
