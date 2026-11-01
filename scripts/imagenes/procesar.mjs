// Prepara las imágenes generadas para la app y para su revisión.
//
//   node scripts/imagenes/procesar.mjs
//
// Por cada JPG de salida/: aclara el fondo hasta blanco puro (a partir del
// tono de las esquinas), lo reduce a 768 px y lo guarda como WebP en web/.
// Genera además web/contactos.html (hoja de contactos para revisar en el
// navegador) y web/laminas/*.png (una lámina por categoría).

import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const salida = path.join(aqui, 'salida')
const web = path.join(aqui, 'web')
const LADO = 768
const MINIATURA = 220

// Tono del fondo: mediana del brillo de ocho recuadros del borde (esquinas y
// puntos medios). El generador suele dejar un degradado, más claro en las
// esquinas; la mediana lo recoge sin dejarse engañar si el objeto toca un
// borde. (stats() de sharp no respeta extract(), así que se leen los píxeles.)
async function brilloFondo(imagen) {
  const { width, height } = await imagen.metadata()
  const t = Math.round(Math.min(width, height) * 0.05)
  const xs = [0, Math.round(width / 2 - t / 2), width - t]
  const ys = [0, Math.round(height / 2 - t / 2), height - t]
  const recuadros = xs.flatMap((left) => ys.map((top) => [left, top])).filter(([l, t2]) => !(l === xs[1] && t2 === ys[1]))
  const medias = []
  for (const [left, top] of recuadros) {
    const { data, info } = await imagen.clone().extract({ left, top, width: t, height: t }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    let suma = 0
    for (let i = 0; i < data.length; i++) suma += data[i]
    medias.push(suma / (info.width * info.height * info.channels))
  }
  medias.sort((a, b) => a - b)
  return (medias[3] + medias[4]) / 2
}

async function main() {
  const manifiesto = JSON.parse(await readFile(path.join(salida, 'manifiesto.json'), 'utf8'))
  const entradas = Object.entries(manifiesto).sort(([a], [b]) => a.localeCompare(b, 'es'))
  const procesadas = []

  for (const [relativo, info] of entradas) {
    const origen = sharp(path.join(salida, relativo))
    const fondo = await brilloFondo(origen)
    // Solo se aclara si el fondo ya es claro (no se toca una foto mal generada)
    const factor = fondo > 200 ? Math.min(255 / fondo, 1.2) : 1
    const destino = path.join(web, relativo.replace(/\.jpg$/, '.webp'))
    await mkdir(path.dirname(destino), { recursive: true })
    // Tras aclarar, los píxeles casi blancos y sin color pasan a blanco puro:
    // quita los restos del degradado del fondo sin tocar el objeto
    const { data, info: formato } = await origen
      .clone()
      .resize(LADO, LADO, { fit: 'contain', background: '#ffffff' })
      .linear(factor, 0)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    for (let i = 0; i < data.length; i += 3) {
      const minimo = Math.min(data[i], data[i + 1], data[i + 2])
      const maximo = Math.max(data[i], data[i + 1], data[i + 2])
      if (minimo >= 236 && maximo - minimo <= 10) data[i] = data[i + 1] = data[i + 2] = 255
    }
    await sharp(data, { raw: formato }).webp({ quality: 80 }).toFile(destino)
    procesadas.push({ relativo: path.relative(web, destino), fondo: Math.round(fondo), ...info })
  }

  await writeFile(path.join(web, 'procesadas.json'), JSON.stringify(procesadas, null, 2))

  // Hoja de contactos HTML, agrupada por programa, grupo y concepto
  const porPrograma = new Map()
  for (const p of procesadas) {
    const clave = `${p.programa}|${p.grupo}|${p.concepto}`
    porPrograma.set(clave, [...(porPrograma.get(clave) ?? []), p])
  }
  let html = `<!doctype html><meta charset="utf-8"><title>Banco de imágenes · revisión</title>
<style>body{font-family:system-ui;margin:24px;background:#F5F2EC;color:#1e293b}h2{margin-top:32px}
.fila{display:flex;gap:12px;align-items:flex-start;margin:8px 0;padding:8px;background:#fff;border-radius:12px}
.concepto{width:140px;font-weight:600}.c{font-size:12px;color:#475569;width:180px}.c img{width:180px;height:180px;border:1px solid #e2e8f0;border-radius:8px;display:block}
.eval{outline:3px solid #f59e0b;border-radius:10px}</style>
<h1>Banco de imágenes · revisión</h1><p>${procesadas.length} imágenes. Las de borde naranja son el ejemplar reservado para la evaluación.</p>`
  let programaActual = ''
  for (const [clave, lista] of porPrograma) {
    const [programa, grupo, concepto] = clave.split('|')
    if (programa !== programaActual) {
      html += `<h2>${programa}</h2>`
      programaActual = programa
    }
    html += `<div class="fila"><div class="concepto">G${grupo} · ${concepto}</div>`
    for (const p of lista) {
      html += `<div class="c ${p.uso === 'evaluacion' ? 'eval' : ''}"><img src="${p.relativo}" loading="lazy"><b>${p.ejemplar}</b> · ${p.descripcion}</div>`
    }
    html += `</div>`
  }
  await writeFile(path.join(web, 'contactos.html'), html)

  // Láminas PNG por categoría, para revisar muchas imágenes de un vistazo
  await mkdir(path.join(web, 'laminas'), { recursive: true })
  const porCategoria = new Map()
  for (const p of procesadas) porCategoria.set(p.categoria, [...(porCategoria.get(p.categoria) ?? []), p])
  for (const [categoria, lista] of porCategoria) {
    const columnas = 8
    const filas = Math.ceil(lista.length / columnas)
    const piezas = await Promise.all(
      lista.map(async (p, i) => ({
        input: await sharp(path.join(web, p.relativo)).resize(MINIATURA, MINIATURA).png().toBuffer(),
        left: (i % columnas) * (MINIATURA + 8),
        top: Math.floor(i / columnas) * (MINIATURA + 8),
      }))
    )
    await sharp({
      create: { width: columnas * (MINIATURA + 8), height: filas * (MINIATURA + 8), channels: 3, background: '#cbd5e1' },
    })
      .composite(piezas)
      .png()
      .toFile(path.join(web, 'laminas', `${categoria.replace(/\s+/g, '-')}.png`))
  }

  console.log(`${procesadas.length} imágenes procesadas. Hoja de contactos: ${path.join(web, 'contactos.html')}`)
}

main()
