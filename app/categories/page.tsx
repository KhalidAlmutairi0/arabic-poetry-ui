import Link from 'next/link'
import type { Metadata } from 'next'
import { getCategories } from '@/lib/api'
import { CATEGORIES as FALLBACK_CATEGORIES, formatCount } from '@/lib/data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'التصنيفات · قافية',
  description: 'تصفّح أغراض الشعر العربي: حكمة، غزل، فخر، رثاء وغيرها.',
}

export default async function CategoriesPage() {
  const apiCategories = await getCategories()
  const categories = apiCategories && apiCategories.length > 0
    ? apiCategories.map((c: any) => ({
        id: c.id,
        name_ar: c.name_ar,
        slug: c.slug,
        count: c.poem_count,
        desc: c.description_ar || '',
      }))
    : FALLBACK_CATEGORIES

  return (
    <div className="animate-fade-up mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <header className="pt-4">
        <h1 className="font-serif text-3xl font-bold text-gold-light">أغراض الشعر</h1>
        <p className="mt-2 text-sm text-text-secondary">
          تصفّح القصائد حسب غرضها ومعناها عبر العصور.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c: any) => (
          <Link
            key={c.id}
            href={`/search?q=${encodeURIComponent(c.name_ar)}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
          >
            <h3 className="font-serif text-2xl text-text-primary transition-colors group-hover:text-gold-light">
              {c.name_ar}
            </h3>
            {c.desc && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{c.desc}</p>}
            <p className="mt-4 text-xs text-text-muted">{formatCount(c.count)} بيت</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
