import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import {
  POEMS,
  POETS,
  ERA_ORDER,
  ERA_LABELS,
  eraLabel,
  toArabicNumerals,
} from '@/lib/data'
import { Ornament } from '@/components/ornament'

export const metadata: Metadata = {
  title: 'استكشف · قافية',
  description: 'استكشف روائع الشعر العربي وأشهر أبياته عبر العصور.',
}

export default function DiscoverPage() {
  const famous = POEMS.flatMap((p) =>
    p.verses.filter((v) => v.is_famous).map((v) => ({ verse: v, poem: p })),
  )

  return (
    <div className="animate-fade-up mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <header className="pt-4 text-center">
        <h1 className="font-serif text-4xl font-bold text-gold-light">استكشف</h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-text-secondary">
          جولةٌ في خزائن الشعر العربي — أبياتٌ خالدة، قصائدُ مختارة، وعصورٌ تروي حكاية أمّة.
        </p>
      </header>

      <div className="my-12">
        <Ornament />
      </div>

      {/* Famous verses showcase */}
      <section>
        <h2 className="mb-6 font-serif text-2xl text-gold-light">أبياتٌ خالدة</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {famous.map(({ verse, poem }) => (
            <Link
              key={verse.id}
              href={`/verse/${verse.id}`}
              className="group rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
            >
              <p className="verse-text text-right text-lg text-gold-light">{verse.hemistich_1}</p>
              <p className="verse-text text-right text-lg text-gold-light opacity-75">
                {verse.hemistich_2}
              </p>
              <p className="mt-4 text-sm text-text-secondary transition-colors group-hover:text-gold-light">
                — {poem.poet.name_ar}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Eras */}
      <section className="mt-16">
        <h2 className="mb-6 font-serif text-2xl text-gold-light">العصور الأدبية</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ERA_ORDER.map((era, i) => (
            <Link
              key={era}
              href={`/poets?era=${era}`}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
            >
              <span className="font-sans text-xs text-text-muted">
                العصر {toArabicNumerals(i + 1)}
              </span>
              <span className="mt-2 font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                {ERA_LABELS[era]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured poems */}
      <section className="mt-16">
        <h2 className="mb-6 font-serif text-2xl text-gold-light">قصائد مختارة</h2>
        <div className="flex flex-col gap-3">
          {POEMS.map((poem) => (
            <Link
              key={poem.id}
              href={`/poem/${poem.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
            >
              <div className="min-w-0">
                <h3 className="truncate font-serif text-lg text-text-primary transition-colors group-hover:text-gold-light">
                  {poem.title_ar}
                </h3>
                <p className="mt-0.5 text-xs text-text-muted">
                  {poem.poet.name_ar} · {eraLabel(poem.era)} · {toArabicNumerals(poem.verses.length)} أبيات
                </p>
              </div>
              <ChevronLeft className="size-5 shrink-0 text-text-muted transition-colors group-hover:text-gold-light" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
