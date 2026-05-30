import Link from 'next/link'
import type { Metadata } from 'next'
import { getPoets } from '@/lib/api'
import { ERA_ORDER, ERA_LABELS, eraLabel, formatCount, toArabicNumerals } from '@/lib/data'
import { cn } from '@/lib/utils'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'الشعراء · قافية',
  description: 'تصفّح شعراء العربية عبر العصور الأدبية.',
}

export default async function PoetsPage({
  searchParams,
}: {
  searchParams: Promise<{ era?: string; page?: string }>
}) {
  const { era, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)
  const activeEra = era && ERA_LABELS[era] ? era : null
  const data = await getPoets({ era: activeEra || undefined, page, limit: 24 })
  const poets = data?.items || []
  const total = data?.total || 0

  return (
    <div className="animate-fade-up mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <header className="pt-4">
        <h1 className="font-serif text-3xl font-bold text-gold-light">الشعراء</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {formatCount(total)} شاعرٍ من الجاهليّة إلى العصر الحديث.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/poets"
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
            !activeEra
              ? 'border-[var(--border-strong)] bg-gold-primary text-primary-foreground'
              : 'border-border bg-surface text-text-secondary hover:border-[var(--border-strong)] hover:text-gold-light',
          )}
        >
          الكل
        </Link>
        {ERA_ORDER.map((e) => (
          <Link
            key={e}
            href={`/poets?era=${e}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
              activeEra === e
                ? 'border-[var(--border-strong)] bg-gold-primary text-primary-foreground'
                : 'border-border bg-surface text-text-secondary hover:border-[var(--border-strong)] hover:text-gold-light',
            )}
          >
            {ERA_LABELS[e]}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {poets.map((poet: any) => (
          <Link
            key={poet.id}
            href={`/poet/${poet.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-elevated font-serif text-2xl text-gold-primary">
              {poet.name_ar.charAt(0)}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                {poet.name_ar}
              </h3>
              <p className="mt-0.5 text-xs text-text-muted">
                {eraLabel(poet.era)} · {formatCount(poet.poem_count)} قصيدة
              </p>
            </div>
          </Link>
        ))}
      </div>

      {poets.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <p className="font-serif text-xl text-text-secondary">لا يوجد شعراء بعد</p>
        </div>
      )}

      {/* Pagination */}
      {total > 24 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/poets?${activeEra ? `era=${activeEra}&` : ''}page=${page - 1}`}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-gold-light"
            >
              السابق
            </Link>
          )}
          <span className="text-sm text-text-muted">
            {toArabicNumerals(page)} / {toArabicNumerals(Math.ceil(total / 24))}
          </span>
          {page * 24 < total && (
            <Link
              href={`/poets?${activeEra ? `era=${activeEra}&` : ''}page=${page + 1}`}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-gold-light"
            >
              التالي
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
