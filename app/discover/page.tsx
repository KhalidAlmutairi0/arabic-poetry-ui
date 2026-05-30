import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { getFamousVerses, getPoets } from '@/lib/api'
import { ERA_ORDER, ERA_LABELS, eraLabel, toArabicNumerals, formatCount } from '@/lib/data'
import { Ornament } from '@/components/ornament'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'استكشف · قافية',
  description: 'استكشف روائع الشعر العربي وأشهر أبياته عبر العصور.',
}

export default async function DiscoverPage() {
  const [famousData, poetsData] = await Promise.all([
    getFamousVerses(8),
    getPoets({ limit: 6 }),
  ])

  const famous = famousData || []
  const poets = poetsData?.items || []

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

      {/* Famous verses */}
      {famous.length > 0 && (
        <section>
          <h2 className="mb-6 font-serif text-2xl text-gold-light">أبياتٌ خالدة</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {famous.map((v: any) => (
              <Link
                key={v.id}
                href={`/verse/${v.id}`}
                className="group rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <p className="verse-text text-right text-lg text-gold-light">{v.hemistich_1}</p>
                <p className="verse-text text-right text-lg text-gold-light opacity-75">{v.hemistich_2}</p>
                <p className="mt-4 text-sm text-text-secondary transition-colors group-hover:text-gold-light">
                  — {v.poet_name_ar}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
              <span className="font-sans text-xs text-text-muted">العصر {toArabicNumerals(i + 1)}</span>
              <span className="mt-2 font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                {ERA_LABELS[era]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top poets */}
      {poets.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-gold-light">أبرز الشعراء</h2>
            <Link href="/poets" className="text-sm text-text-secondary transition-colors hover:text-gold-light">
              كل الشعراء
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {poets.map((poet: any) => (
              <Link
                key={poet.id}
                href={`/poet/${poet.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-elevated font-serif text-xl text-gold-primary">
                  {poet.name_ar.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg text-text-primary transition-colors group-hover:text-gold-light">
                    {poet.name_ar}
                  </h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {eraLabel(poet.era)} · {formatCount(poet.poem_count)} قصيدة
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
