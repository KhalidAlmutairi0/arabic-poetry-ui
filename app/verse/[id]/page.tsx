import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, ChevronLeft } from 'lucide-react'
import { getVerse, getRelatedVerses as fetchRelated } from '@/lib/api'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { VerseExplanation } from '@/components/verse-explanation'
import { VerseDetailActions } from '@/components/verse-detail-actions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const verse = await getVerse(id)
  if (!verse) return { title: 'قافية' }
  return {
    title: `${verse.poet_name_ar} — بيت شعري · قافية`,
    description: verse.full_verse,
  }
}

export default async function VersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const verse = await getVerse(id)
  if (!verse) notFound()

  const relatedData = await fetchRelated(id, 4)
  const related = relatedData?.related || []

  const preloaded: Record<string, string> = {}
  if (verse.explanations?.length) {
    for (const e of verse.explanations) {
      preloaded[e.type] = e.explanation_ar
    }
  }

  return (
    <div className="animate-fade-up mx-auto max-w-[820px] px-4 py-10 sm:px-6">
      <BreadcrumbNav
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: verse.poet_name_ar, href: `/poet/${verse.poet_slug || verse.poet_id}` },
          ...(verse.poem_slug ? [{ label: verse.poem_title_ar, href: `/poem/${verse.poem_slug}` }] : []),
          { label: 'بيت شعري' },
        ]}
      />

      {/* Hero verse */}
      <section className="relative mt-10 rounded-2xl border border-border bg-surface/60 px-6 py-14 text-center sm:px-12">
        <span className="pointer-events-none absolute right-5 top-3 select-none font-serif text-7xl leading-none text-gold-primary opacity-15" aria-hidden="true">﴿</span>
        <span className="pointer-events-none absolute bottom-0 left-5 select-none font-serif text-7xl leading-none text-gold-primary opacity-15" aria-hidden="true">﴾</span>

        <p className="verse-text text-[length:clamp(1.6rem,5vw,2.4rem)] font-medium text-gold-light">
          {verse.hemistich_1}
        </p>
        <p className="verse-text mt-2 text-[length:clamp(1.6rem,5vw,2.4rem)] font-medium text-gold-light opacity-85">
          {verse.hemistich_2}
        </p>

        <div className="mt-8 flex flex-col items-center gap-1">
          <Link
            href={`/poet/${verse.poet_slug || verse.poet_id}`}
            className="font-serif text-lg text-text-primary transition-colors hover:text-gold-light"
          >
            — {verse.poet_name_ar}
          </Link>
          {verse.poem_slug && (
            <Link
              href={`/poem/${verse.poem_slug}`}
              className="text-sm text-text-muted transition-colors hover:text-gold-light"
            >
              من قصيدة «{verse.poem_title_ar}»
            </Link>
          )}
        </div>

        <div className="mt-8">
          <VerseDetailActions text={verse.full_verse} />
        </div>
      </section>

      {/* AI explanation — connected to real SSE endpoint */}
      <div className="mt-8">
        <VerseExplanation verseId={verse.id} preloaded={preloaded} />
      </div>

      {/* Read full poem */}
      {verse.poem_slug && (
        <Link
          href={`/poem/${verse.poem_slug}`}
          className="group mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
        >
          <div className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-elevated text-gold-primary">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-xs text-text-muted">اقرأ القصيدة كاملة</p>
              <p className="font-serif text-lg text-text-primary transition-colors group-hover:text-gold-light">
                {verse.poem_title_ar} — {verse.poet_name_ar}
              </p>
            </div>
          </div>
          <ChevronLeft className="size-5 text-text-muted transition-colors group-hover:text-gold-light" />
        </Link>
      )}

      {/* Related verses */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-serif text-2xl text-gold-light">أبيات مشابهة</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r: any) => (
              <Link
                key={r.id}
                href={`/verse/${r.id}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <p className="verse-text text-right text-base text-gold-light">{r.full_verse}</p>
                <p className="mt-3 text-xs text-text-muted">{r.poet_name_ar}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
