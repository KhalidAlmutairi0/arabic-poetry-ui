import { cn } from '@/lib/utils'

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-1', className)} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--border-strong)]" />
      <span className="text-gold-muted">◆</span>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--border-strong)]" />
    </div>
  )
}
