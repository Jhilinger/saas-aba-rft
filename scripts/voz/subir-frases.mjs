// Sube al bucket «biblioteca» solo las frases indicadas (ya grabadas con grabar-rft.mjs)
//   node --env-file=.env.local scripts/voz/subir-frases.mjs "frase 1" "frase 2"
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { rutaFraseRft } from '../../app/dashboard/consignas-grabadas.ts'

const salida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'salida')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
for (const texto of process.argv.slice(2)) {
  const ruta = rutaFraseRft(texto)
  const { error } = await supabase.storage
    .from('biblioteca')
    .upload(ruta, await readFile(path.join(salida, ruta)), { contentType: 'audio/mpeg', upsert: true, cacheControl: '86400' })
  console.log(error ? `✗ ${texto}: ${error.message}` : `✓ ${texto} → ${ruta}`)
}
