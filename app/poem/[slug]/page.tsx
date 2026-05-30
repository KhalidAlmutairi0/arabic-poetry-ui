import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPoem } from '@/lib/api'
import { eraLabel, toArabicNumerals, formatCount } from '@/lib/data'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { VerseList } from '@/components/verse-list'
import { PoemActions } from '@/components/poem-actions'
import { Pill } from '@/components/pill'
import { Eye } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const poem = await getPoem(slug)
  if (!poem) return { title: 'قافية' }
  return {
    title: `${poem.title_ar} — ${poem.poet.name_ar} · قافية`,
    description: poem.verses?.[0]?.full_verse,
  }
}

export default async function PoemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poem = await getPoem(slug)
  if (!poem) notFound()

  const fullText = (poem.verses || [])
    .map((v: any) => `${v.hemistich_1}    ${v.hemistich_2}`)
    .join('\n')

  return (
    <div className="animate-fade-up mx-auto max-w-[820px] px-4 py-10 sm:px-6">
      <BreadcrumbNav
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'الشعراء', href: '/poets' },
          { label: poem.poet.name_ar, href: `/poet/${poem.poet.slug}` },
          { label: poem.title_ar },
        ]}
      />

      <header className="mt-10 text-center">
        <h1 className="verse-text text-balance text-3xl font-bold text-gold-light sm:text-4xl md:text-5xl">
          {poem.title_ar}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={`/poet/${poem.poet.slug}`}
            className="font-serif text-lg text-text-primary transition-colors hover:text-gold-light"
          >
            {poem.poet.name_ar}
          </Link>
          <span className="text-text-muted">·</span>
          {poem.era && <Pill href={`/poets?era=${poem.era}`}>{eraLabel(poem.era)}</Pill>}
          {poem.meter && <Pill variant="gold">{poem.meter}</Pill>}
          <Pill variant="ghost">{toArabicNumerals(poem.verses?.length || 0)} أبيات</Pill>
        </div>

        {poem.categories?.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {poem.categories.map((c: any) => (
              <Pill key={c.id} href={`/search?q=${encodeURIComponent(c.name_ar)}`} variant="ghost">
                {c.name_ar}
              </Pill>
            ))}
          </div>
        )}

        {poem.view_count > 0 && (
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
            <Eye className="size-3.5" />
            <span>{formatCount(poem.view_count)} مشاهدة</span>
          </div>
        )}

        <div className="mt-8">
          <PoemActions title={poem.title_ar} poet={poem.poet.name_ar} fullText={fullText} />
        </div>
      </header>

      <article className="mt-12 rounded-2xl border border-border bg-surface/50 p-2 sm:p-6">
        <VerseList verses={poem.verses || []} />
      </article>

      <p className="mt-8 text-center font-serif text-sm text-gold-muted">
        تمّت القصيدة · انقر على أيِّ بيتٍ لقراءة شرحه
      </p>
    </div>
  )
}
