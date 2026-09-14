import type { ButtonHTMLAttributes, FormHTMLAttributes, HTMLAttributes } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger' | 'success' | 'warning'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#0F4C5C] text-white shadow-sm hover:bg-[#0B3A47]',
  accent: 'bg-[#E07A5F] text-white shadow-sm hover:bg-[#C8644D]',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  warning: 'bg-amber-500 text-white hover:bg-amber-400',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

type PanelProps =
  | (HTMLAttributes<HTMLDivElement> & { as?: 'div' })
  | (FormHTMLAttributes<HTMLFormElement> & { as: 'form' })

export function Panel({ as = 'div', className = '', ...props }: PanelProps) {
  const classes = `rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`

  if (as === 'form') {
    const formProps = props as FormHTMLAttributes<HTMLFormElement>
    return <form className={classes} {...formProps} />
  }

  const divProps = props as HTMLAttributes<HTMLDivElement>
  return <div className={classes} {...divProps} />
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav aria-label="Migas de pan" className="flex min-w-0 items-center gap-1.5 overflow-x-auto text-sm">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-1.5">
          {index > 0 && <span className="text-slate-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-slate-500 transition-colors hover:text-indigo-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}