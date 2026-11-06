// Genera los pares de opuestos de «Abstraer Claves de Oposición»: el mismo
// objeto en los dos polos de una dimensión física (la misma caja abierta y
// cerrada). Primero se genera un polo y después se edita esa misma imagen para
// obtener el otro, para que la única diferencia sea la dimensión opuesta.
//
//   node --env-file=.env.local scripts/imagenes/pares-oposicion.mjs
//
// Guarda en scripts/imagenes/salida/oposicion/<objeto-polo>-1.jpg (salta los
// que existen) y una lámina de revisión en scripts/imagenes/salida/oposicion/pares.jpg.

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const salida = path.join(aqui, 'salida', 'oposicion')
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const MODELO = 'gemini-nano-banana-2.1'
const ESTILO = 'Exactly one subject, centered, fully visible, on a pure white seamless background. Soft even studio lighting. No text, letters or logos. No people, no hands. Square composition.'

// uso: entrenamiento o generalización (dimensiones no entrenadas, como pide el currículo)
export const PARES = [
  { dimension: 'abierto/cerrado', uso: 'entrenamiento', a: ['caja-abierta', 'a plain brown cardboard box with its four top flaps wide open, empty inside, three-quarter view'], b: ['caja-cerrada', 'with all its top flaps closed'] },
  { dimension: 'abierto/cerrado', uso: 'entrenamiento', a: ['puerta-abierta', 'a single white wooden interior door in its frame, standing alone, the door wide open'], b: ['puerta-cerrada', 'with the door completely closed'] },
  { dimension: 'abierto/cerrado', uso: 'entrenamiento', a: ['libro-abierto', "a children's hardcover book with a red cover, lying open in the middle, pages without any text or pictures"], b: ['libro-cerrado', 'closed, lying with the red cover up'] },
  { dimension: 'abierto/cerrado', uso: 'entrenamiento', a: ['paraguas-abierto', 'a yellow umbrella fully open, seen from the side'], b: ['paraguas-cerrado', 'closed and folded, standing upright'] },
  { dimension: 'lleno/vacío', uso: 'entrenamiento', a: ['vaso-lleno', 'a clear drinking glass filled to the top with bright orange juice'], b: ['vaso-vacio', 'completely empty, no juice at all, clean and transparent'] },
  { dimension: 'lleno/vacío', uso: 'entrenamiento', a: ['cesta-llena', 'a wicker basket filled to the brim with red apples'], b: ['cesta-vacia', 'completely empty, no apples at all'] },
  { dimension: 'lleno/vacío', uso: 'entrenamiento', a: ['bote-lleno', 'a round metal pencil cup full of colored pencils'], b: ['bote-vacio', 'completely empty, no pencils at all'] },
  { dimension: 'lleno/vacío', uso: 'entrenamiento', a: ['bol-lleno', 'a white ceramic bowl full of cereal'], b: ['bol-vacio', 'completely empty, no cereal at all'] },
  { dimension: 'encendido/apagado', uso: 'entrenamiento', a: ['lampara-encendida', 'a table lamp with a white shade, switched on, glowing warmly'], b: ['lampara-apagada', 'switched off, no light at all'] },
  { dimension: 'encendido/apagado', uso: 'entrenamiento', a: ['linterna-encendida', 'a blue flashlight switched on, with a bright beam of light'], b: ['linterna-apagada', 'switched off, no light and no beam at all'] },
  { dimension: 'encendido/apagado', uso: 'entrenamiento', a: ['television-encendida', 'a flat television switched on, the screen showing a bright colorful cartoon landscape without text'], b: ['television-apagada', 'switched off, the screen completely black'] },
  { dimension: 'encendido/apagado', uso: 'entrenamiento', a: ['bombilla-encendida', 'a single light bulb switched on, glowing brightly'], b: ['bombilla-apagada', 'switched off, not glowing at all'] },
  { dimension: 'mojado/seco', uso: 'generalizacion', a: ['toalla-mojada', 'a folded bright yellow towel soaking wet, visibly dripping water, with a clear puddle of water underneath it'], b: ['toalla-seca', 'completely dry and fluffy, no drops and no puddle at all'] },
  { dimension: 'mojado/seco', uso: 'generalizacion', a: ['camiseta-mojada', "a child's green t-shirt laid flat, soaking wet and dripping water"], b: ['camiseta-seca', 'completely dry, no water at all'] },
  { dimension: 'mojado/seco', uso: 'generalizacion', a: ['perro-seco', 'a small golden dog with very fluffy, voluminous, clean dry fur, standing'], b: ['perro-mojado', 'completely drenched after a bath, the fur flattened and stuck to its body, water dripping, a puddle underneath'] },
  { dimension: 'limpio/sucio', uso: 'generalizacion', a: ['plato-limpio', 'a white ceramic plate, perfectly clean and shiny'], b: ['plato-sucio', 'dirty, with food leftovers and sauce stains'] },
  { dimension: 'limpio/sucio', uso: 'generalizacion', a: ['zapatilla-limpia', "a child's white sneaker, perfectly clean"], b: ['zapatilla-sucia', 'covered in mud, very dirty'] },
  { dimension: 'limpio/sucio', uso: 'generalizacion', a: ['camiseta-limpia', "a child's white t-shirt laid flat, perfectly clean"], b: ['camiseta-sucia', 'covered in mud and food stains, very dirty'] },
  { dimension: 'caliente/frío', uso: 'generalizacion', a: ['taza-caliente', 'a white mug of hot chocolate with clear steam rising from it'], b: ['taza-fria', 'with no steam, with ice cubes floating in the drink and frost on the outside of the mug'] },
  { dimension: 'caliente/frío', uso: 'generalizacion', a: ['olla-caliente', 'a metal cooking pot with water boiling, bubbles and lots of steam'], b: ['olla-fria', 'with no steam and no bubbles, with ice cubes floating in the cold water'] },
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
    if (intento === 4 || (res.status !== 429 && res.status < 500 && res.ok === false)) throw new Error(`HTTP ${res.status}: ${texto.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

async function main() {
  await mkdir(salida, { recursive: true })
  for (const par of PARES) {
    const fa = path.join(salida, `${par.a[0]}-1.jpg`)
    const fb = path.join(salida, `${par.b[0]}-1.jpg`)
    try {
      if (!(await existe(fa))) await writeFile(fa, Buffer.from(await pedir(`A realistic photograph of ${par.a[1]}. ${ESTILO}`), 'base64'))
      if (!(await existe(fb))) {
        const base = (await readFile(fa)).toString('base64')
        const datos = await pedir([{ type: 'user_input', content: [
          { type: 'image', data: base, mime_type: 'image/jpeg' },
          { type: 'text', text: `Edit this photograph: show exactly the same object, same size, color, angle, lighting and background, but ${par.b[1]}. Change nothing else. ${ESTILO}` },
        ] }])
        await writeFile(fb, Buffer.from(datos, 'base64'))
      }
      console.log(`✓ ${par.a[0]} / ${par.b[0]}`)
    } catch (e) {
      console.error(`✗ ${par.a[0]}: ${e.message}`)
    }
  }
  // Registro en el manifiesto del banco (lo leen procesar.mjs y subir.mjs)
  const ACENTOS = { vacio: 'vacío', vacia: 'vacía', fria: 'fría', television: 'televisión', lampara: 'lámpara' }
  const nombre = (slug) => {
    const palabras = slug.split('-').map((p) => ACENTOS[p] ?? p)
    return palabras.join(' ').replace(/^./, (c) => c.toUpperCase())
  }
  const ficheroManifiesto = path.join(aqui, 'salida', 'manifiesto.json')
  const manifiesto = JSON.parse(await readFile(ficheroManifiesto, 'utf8'))
  for (const par of PARES) {
    for (const [slug, descripcion] of [par.a, [par.b[0], `${par.a[1]}, ${par.b[1]}`]]) {
      if (!(await existe(path.join(salida, `${slug}-1.jpg`)))) continue
      manifiesto[`oposicion/${slug}-1.jpg`] = {
        programa: 'Abstraer Claves de Oposición',
        grupo: par.dimension,
        categoria: 'oposicion',
        concepto: nombre(slug),
        ejemplar: 1,
        uso: par.uso,
        descripcion,
        modelo: MODELO,
      }
    }
  }
  await writeFile(ficheroManifiesto, JSON.stringify(manifiesto, null, 2))

  // Lámina de revisión: cada fila es un par
  const lado = 260
  const filas = []
  for (const par of PARES) {
    const fa = path.join(salida, `${par.a[0]}-1.jpg`)
    const fb = path.join(salida, `${par.b[0]}-1.jpg`)
    if ((await existe(fa)) && (await existe(fb))) filas.push([fa, fb])
  }
  const columnas = 4 // dos pares por fila
  const pares = Math.ceil(filas.length / 2)
  const composicion = []
  for (const [i, [fa, fb]] of filas.entries()) {
    const fila = Math.floor(i / 2)
    const col = (i % 2) * 2
    composicion.push({ input: await sharp(fa).resize(lado, lado).toBuffer(), left: col * lado + (i % 2) * 30, top: fila * lado })
    composicion.push({ input: await sharp(fb).resize(lado, lado).toBuffer(), left: (col + 1) * lado + (i % 2) * 30, top: fila * lado })
  }
  await sharp({ create: { width: columnas * lado + 30, height: pares * lado, channels: 3, background: '#fff' } })
    .composite(composicion)
    .jpeg()
    .toFile(path.join(salida, 'pares.jpg'))
  console.log(`${filas.length} pares. Lámina: ${path.join(salida, 'pares.jpg')}`)
}

main()
