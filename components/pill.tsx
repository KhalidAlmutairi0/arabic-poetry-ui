import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PillProps {
  children: React.ReactNode
  href?: string
  variant?: 'default' | 'gold' | 'ghost'
  className?: string
}

const variants = {
  default: 'border border-border bg-surface-elevated text-text-secondary',
  gold: 'border border-[var(--border-strong)] bg-[rgba(200,164,85,0.08)] text-gold-light',
  ghost: 'border border-transparent bg-transparent text-text-muted',
}

export function Pill({ children, href, variant = 'default', className }: PillProps) {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
    variants[variant],
    href && 'hover:border-[var(--border-strong)] hover:text-gold-light',
    className,
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return <span className={classes}>{children}</span>
}
