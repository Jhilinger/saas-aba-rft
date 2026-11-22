// Graba (si faltan) y sube solo las frases indicadas, con la voz de las claves RFT. Para frases
// nuevas de la tableta con audio, sin regrabar todo el currículo (los programas verbales del
// nivel 3 no usan audio y no hace falta grabar sus frases).
//   node --env-file=.env.local scripts/voz/grabar-frases.mjs "frase 1" "frase 2"
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { VOZ_RFT, rutaFraseRft, textoParaVoz } from '../../app/dashboard/consignas-grabadas.ts'

const salida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'salida')
const existe = (f) => access(f).then(() => true, () => false)

async function sintetizar(texto) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { text: texto }, voice: { languageCode: 'es-ES', name: VOZ_RFT }, audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 } }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return Buffer.from((await res.json()).audioContent, 'base64')
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
for (const texto of process.argv.slice(2)) {
  const ruta = rutaFraseRft(texto)
  const fichero = path.join(salida, ruta)
  if (!(await existe(fichero))) {
    await mkdir(path.dirname(fichero), { recursive: true })
    await writeFile(fichero, await sintetizar(textoParaVoz(texto)))
  }
  const { error } = await supabase.storage.from('biblioteca').upload(ruta, await readFile(fichero), { contentType: 'audio/mpeg', upsert: true, cacheControl: '86400' })
  console.log(error ? `✗ ${texto}: ${error.message}` : `✓ ${texto}`)
}
