'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'

type OpcionesConfirm = {
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  peligroso?: boolean
}

type ConfirmContextType = (opciones: OpcionesConfirm) => Promise<boolean>

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm debe usarse dentro de ConfirmProvider')
  return ctx
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opciones, setOpciones] = useState<OpcionesConfirm | null>(null)
  const resolverRef = useRef<(valor: boolean) => void>(() => {})

  const confirmar = useCallback((op: OpcionesConfirm) => {
    setOpciones(op)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const cerrar = (resultado: boolean) => {
    resolverRef.current(resultado)
    setOpciones(null)
  }

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}

      {opciones && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6 space-y-4 shadow-xl">
            <div>
              <h2 className="text-base font-semibold text-slate-800">{opciones.titulo}</h2>
              <p className="mt-1 text-sm text-slate-600">{opciones.mensaje}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => cerrar(false)}
                className="rounded-lg bg-slate-100 px-4 py-2.5 sm:py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                {opciones.textoCancelar ?? 'Cancelar'}
              </button>
              <button
                onClick={() => cerrar(true)}
                className={`rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold text-white ${
                  opciones.peligroso ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {opciones.textoConfirmar ?? 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}