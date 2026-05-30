import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export interface Crumb {
  label: string
  href?: string
}

export function BreadcrumbNav({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-text-muted transition-colors hover:text-gold-light"
              >
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'text-text-secondary' : 'text-text-muted'}>
                {item.label}
              </span>
            )}
            {!last && <ChevronLeft className="size-4 text-text-muted" aria-hidden="true" />}
          </span>
        )
      })}
    </nav>
  )
}
