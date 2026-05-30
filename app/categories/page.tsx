import Link from 'next/link'
import type { Metadata } from 'next'
import { CATEGORIES, formatCount } from '@/lib/data'

export const metadata: Metadata = {
  title: 'التصنيفات · قافية',
  description: 'تصفّح أغراض الشعر العربي: حكمة، غزل، فخر، رثاء وغيرها.',
}

export default function CategoriesPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <header className="pt-4">
        <h1 className="font-serif text-3xl font-bold text-gold-light">أغراض الشعر</h1>
        <p className="mt-2 text-sm text-text-secondary">
          تصفّح القصائد حسب غرضها ومعناها عبر العصور.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/search?q=${encodeURIComponent(c.name_ar)}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
          >
            <h3 className="font-serif text-2xl text-text-primary transition-colors group-hover:text-gold-light">
              {c.name_ar}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{c.desc}</p>
            <p className="mt-4 text-xs text-text-muted">{formatCount(c.count)} بيت</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
