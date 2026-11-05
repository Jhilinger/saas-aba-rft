'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { subirImagenEstimulo, quitarImagenEstimulo } from './imagen-estimulo-actions'
import { useToast } from '../providers/toast-provider'

const LADO_MAX = 512

// Reduce la foto a LADO_MAX px y la codifica en webp (o jpeg en Safari, que
// no codifica webp desde un canvas)
async function comprimir(archivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo)
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const codificar = (tipo: string, calidad: number) =>
    new Promise<Blob | null>((resolver) => canvas.toBlob(resolver, tipo, calidad))
  const webp = await codificar('image/webp', 0.8)
  if (webp?.type === 'image/webp') return webp
  const jpeg = await codificar('image/jpeg', 0.82)
  if (!jpeg) throw new Error('No se pudo procesar la imagen')
  return jpeg
}

// Miniatura de la imagen del estímulo y, si se puede editar, subir o quitar
export default function ImagenEstimulo({
  tabla,
  estimuloId,
  url,
  editable,
}: {
  tabla: 'estimulos_rft' | 'estimulos_rft_base' | 'estimulos_alumno' | 'estimulos_base'
  estimuloId: string
  url: string | null
  editable: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  if (!url && !editable) return null

  const subir = (archivo: File) =>
    startTransition(async () => {
      try {
        const blob = await comprimir(archivo)
        const fd = new FormData()
        fd.set('tabla', tabla)
        fd.set('estimulo_id', estimuloId)
        fd.set('archivo', new File([blob], blob.type === 'image/webp' ? 'imagen.webp' : 'imagen.jpg', { type: blob.type }))
        const res = await subirImagenEstimulo(fd)
        if (res.error) {
          toast(res.error, 'error')
          return
        }
        toast('Imagen guardada', 'exito')
        router.refresh()
      } catch {
        toast('No se pudo leer la imagen. Prueba con otra foto.', 'error')
      }
    })

  const quitar = () =>
    startTransition(async () => {
      const res = await quitarImagenEstimulo(tabla, estimuloId)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      router.refresh()
    })

  return (
    <span className="flex shrink-0 items-center gap-2">
      {url && (
        // URL firmada o del banco: next/image no aporta nada en una miniatura
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-10 w-10 rounded-md border border-slate-200 bg-white object-contain" />
      )}
      {editable && (
        <>
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const archivo = e.target.files?.[0]
              e.target.value = ''
              if (archivo) subir(archivo)
            }}
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => input.current?.click()}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : url ? 'Cambiar imagen' : 'Imagen'}
          </button>
          {url && !isPending && (
            <button type="button" onClick={quitar} className="text-xs text-slate-500 hover:text-slate-700">
              Quitar imagen
            </button>
          )}
        </>
      )}
    </span>
  )
}
