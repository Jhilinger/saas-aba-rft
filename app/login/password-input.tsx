'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        name="password"
        type={visible ? 'text' : 'password'}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 transition-colors focus:border-indigo-500"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
