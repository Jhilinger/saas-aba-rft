import type { EstadoItem } from './logica'

export const ESTADO_EVALUACION: Record<string, { label: string; color: string }> = {
  en_curso: { label: 'En curso', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  finalizada: { label: 'Finalizada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  anulada: { label: 'Anulada', color: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export const ESTADO_ITEM: Record<EstadoItem, { label: string; color: string }> = {
  puntuado: { label: 'Puntuado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  no_procede: { label: 'No procede', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  techo: { label: 'Techo', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  requisito: { label: 'Sin requisito', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  pendiente: { label: 'Pendiente', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  fuera: { label: 'Fuera de la ruta', color: 'bg-white text-slate-400 border-slate-200' },
}

export const ICONO_FORMATO: Record<string, string> = { tableta: '🖥', fisico: '🧸', familia: '👪' }
