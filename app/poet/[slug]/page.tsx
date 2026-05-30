import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MapPin, CalendarDays, ScrollText, Star, ChevronLeft } from 'lucide-react'
import { getPoet, getPoetPoems } from '@/lib/api'
import { eraLabel, formatCount, toArabicNumerals } from '@/lib/data'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { Pill } from '@/components/pill'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const poet = await getPoet(slug)
  if (!poet) return { title: 'قافية' }
  return { title: `${poet.name_ar} · قافية`, description: poet.bio_ar?.slice(0, 140) }
}

export default async function PoetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [poet, poemsData] = await Promise.all([
    getPoet(slug),
    getPoetPoems(slug, 1, 12),
  ])
  if (!poet) notFound()

  const poems = poemsData?.poems || []

  return (
    <div className="animate-fade-up mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <BreadcrumbNav
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'الشعراء', href: '/poets' },
          { label: poet.name_ar },
        ]}
      />

      <header className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-elevated">
            <span className="font-serif text-5xl text-gold-primary">{poet.name_ar.charAt(0)}</span>
          </div>

          <div className="flex-1">
            <h1 className="font-serif text-4xl font-bold text-text-primary">{poet.name_ar}</h1>
            {poet.name_en && <p className="mt-1 font-sans text-sm text-text-muted">{poet.name_en}</p>}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {poet.era && <Pill href={`/poets?era=${poet.era}`} variant="gold">{eraLabel(poet.era)}</Pill>}
              {poet.birth_place_ar && (
                <Pill variant="ghost"><MapPin className="size-3.5" />{poet.birth_place_ar}</Pill>
              )}
              {(poet.birth_year || poet.death_year) && (
                <Pill variant="ghost">
                  <CalendarDays className="size-3.5" />
                  {poet.birth_year && `${poet.birth_year}`}
                  {poet.birth_year && poet.death_year && '–'}
                  {poet.death_year && `${poet.death_year}`}م
                </Pill>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
              <div className="flex items-center gap-2">
                <ScrollText className="size-4 text-gold-muted" />
                <span className="text-sm text-text-secondary">
                  <span className="font-semibold text-gold-light">{formatCount(poet.poem_count)}</span> قصيدة
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold-muted">◆</span>
                <span className="text-sm text-text-secondary">
                  <span className="font-semibold text-gold-light">{formatCount(poet.verse_count)}</span> بيت
                </span>
              </div>
            </div>
          </div>
        </div>

        {poet.bio_ar && (
          <p className="mt-8 border-t border-border pt-6 text-pretty font-serif text-lg leading-relaxed text-text-secondary">
            {poet.bio_ar}
          </p>
        )}
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {poet.famous_verses?.length > 0 && (
          <section>
            <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-gold-light">
              <Star className="size-5 fill-gold-primary text-gold-primary" />
              أشهر الأبيات
            </h2>
            <div className="flex flex-col gap-4">
              {poet.famous_verses.map((v: any) => (
                <Link key={v.id} href={`/verse/${v.id}`}
                  className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated">
                  <p className="verse-text text-right text-lg text-gold-light">{v.full_verse}</p>
                  {v.poem_title_ar && <p className="mt-2 text-xs text-text-muted">من: {v.poem_title_ar}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {poems.length > 0 && (
          <section>
            <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-gold-light">
              <ScrollText className="size-5 text-gold-primary" />
              القصائد
            </h2>
            <div className="flex flex-col gap-3">
              {poems.map((poem: any) => (
                <Link key={poem.id} href={`/poem/${poem.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-lg text-text-primary transition-colors group-hover:text-gold-light">{poem.title_ar}</h3>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {toArabicNumerals(poem.verse_count)} أبيات
                      {poem.meter && <> · {poem.meter}</>}
                    </p>
                  </div>
                  <ChevronLeft className="size-5 shrink-0 text-text-muted transition-colors group-hover:text-gold-light" />
                </Link>
              ))}
            </div>
            {poet.poem_count > 12 && (
              <Link
                href={`/search?q=${encodeURIComponent(poet.name_ar)}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-gold-light"
              >
                عرض جميع القصائد ({formatCount(poet.poem_count)})
                <ChevronLeft className="size-4" />
              </Link>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
