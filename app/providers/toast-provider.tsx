'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type Tipo = 'error' | 'exito' | 'info'
type Toast = { id: number; tipo: Tipo; mensaje: string }

type ToastContextType = (mensaje: string, tipo?: Tipo) => void

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}

const ESTILOS: Record<Tipo, string> = {
  error: 'bg-rose-600',
  exito: 'bg-emerald-600',
  info: 'bg-slate-800',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const mostrarToast = useCallback((mensaje: string, tipo: Tipo = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, tipo, mensaje }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={mostrarToast}>
      {children}

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full sm:w-auto sm:max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${ESTILOS[t.tipo]}`}
          >
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}