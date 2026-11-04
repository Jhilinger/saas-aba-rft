// Sube las imágenes procesadas (web/) al bucket «biblioteca» y las registra en
// biblioteca_imagenes. Idempotente: sobrescribe el archivo y actualiza la fila.
//
//   node --env-file=.env.local scripts/imagenes/subir.mjs [--solo objetos/rueda,objetos/ventana]
//
// --solo limita la subida a esos conceptos (categoría/concepto, en slug).
//
// Ejemplares 1 y 2 → entrenamiento; 3 → generalización; eval → evaluación.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const web = path.join(aqui, 'web')

const indiceSolo = process.argv.indexOf('--solo')
const solo = indiceSolo > -1 ? new Set(process.argv[indiceSolo + 1].split(',')) : null

const USO = { 1: 'entrenamiento', 2: 'entrenamiento', 3: 'generalizacion', eval: 'evaluacion' }

function slug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: clave } = process.env
  if (!url || !clave) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (ejecuta con --env-file=.env.local).')
    process.exit(1)
  }
  const supabase = createClient(url, clave, { auth: { persistSession: false } })
  const procesadas = JSON.parse(await readFile(path.join(web, 'procesadas.json'), 'utf8'))

  let hechas = 0
  for (const p of procesadas) {
    const uso = USO[p.ejemplar]
    if (!uso) throw new Error(`Ejemplar desconocido: ${p.relativo}`)
    const concepto = `${slug(p.categoria)}/${slug(p.concepto)}`
    if (solo && !solo.has(concepto)) continue
    const ruta = `${concepto}-${p.ejemplar}.webp`
    const { error: errorSubida } = await supabase.storage
      .from('biblioteca')
      .upload(ruta, await readFile(path.join(web, p.relativo)), { contentType: 'image/webp', upsert: true, cacheControl: '31536000' })
    if (errorSubida) throw new Error(`${ruta}: ${errorSubida.message}`)
    const { error } = await supabase.from('biblioteca_imagenes').upsert(
      {
        concepto,
        categoria: p.categoria,
        nombre: p.concepto,
        ejemplar: p.ejemplar,
        uso,
        ruta,
        descripcion: p.descripcion,
        prompt: p.prompt,
        modelo: p.modelo,
      },
      { onConflict: 'concepto,ejemplar' }
    )
    if (error) throw new Error(`${ruta}: ${error.message}`)
    hechas++
  }
  console.log(`${hechas} imágenes subidas y registradas.`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
