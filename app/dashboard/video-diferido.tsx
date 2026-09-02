'use client'

import { useState } from 'react'

function extraerIdYoutube(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1).split('/')[0] || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1]?.split('/')[0] || null
    }
    return null
  } catch {
    return null
  }
}

export default function VideoDiferido({ url }: { url: string }) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const id = extraerIdYoutube(url)

  if (!id) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
        Ver vídeo (enlace externo)
      </a>
    )
  }

  if (reproduciendo) {
    return (
      <div className="mt-1 aspect-video w-full max-w-md overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title="Vídeo de ejemplo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setReproduciendo(true)}
      className="group relative mt-1 block aspect-video w-full max-w-md overflow-hidden rounded-lg bg-slate-100"
    >
      <img
        src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
        alt="Miniatura del vídeo"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow">
          ▶
        </span>
      </span>
    </button>
  )
}
