import Link from 'next/link'
import { Search, ArrowLeft, Star } from 'lucide-react'
import { getPoets, getFamousVerses, getCategories } from '@/lib/api'
import { ERA_ORDER, ERA_LABELS, eraLabel, formatCount } from '@/lib/data'
import { Pill } from '@/components/pill'
import { Ornament } from '@/components/ornament'

export const revalidate = 60

export default async function HomePage() {
  const [poetsData, famousData, categoriesData] = await Promise.all([
    getPoets({ limit: 4 }),
    getFamousVerses(1),
    getCategories(),
  ])

  const poets = poetsData?.items || []
  const totalPoets = poetsData?.total || 0
  const featuredVerse = famousData?.[0] || null
  const categories = (categoriesData || []).slice(0, 4)

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="mx-auto max-w-[900px] px-4 pt-20 text-center sm:px-6">
        <span
          className="font-logo text-6xl font-bold text-gold-primary sm:text-7xl"
          style={{ textShadow: '0 0 40px rgba(200,164,85,0.2)' }}
        >
          قافية
        </span>
        <p className="mx-auto mt-6 max-w-xl text-balance font-serif text-xl leading-relaxed text-text-secondary sm:text-2xl">
          ديوانُ الشعر العربي بين يديك — من الجاهليّةِ إلى اليوم.
        </p>
        {totalPoets > 0 && (
          <p className="mx-auto mt-3 text-sm text-text-muted">
            {formatCount(totalPoets)} شاعر · ١٠ عصور أدبية
          </p>
        )}

        <Link
          href="/search"
          className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 text-right transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
        >
          <Search className="size-5 shrink-0 text-gold-muted" />
          <span className="flex-1 text-text-muted">ابحث عن بيتٍ أو شاعرٍ أو معنى…</span>
          <ArrowLeft className="size-4 text-text-muted" />
        </Link>
      </section>

      <div className="mx-auto my-16 max-w-[900px] px-6">
        <Ornament />
      </div>

      {/* Featured verse */}
      {featuredVerse && (
        <section className="mx-auto max-w-[820px] px-4 sm:px-6">
          <p className="mb-6 text-center text-sm font-medium text-gold-muted">بيتُ اليوم</p>
          <Link
            href={`/verse/${featuredVerse.id}`}
            className="group block rounded-2xl border border-border bg-surface/60 px-6 py-12 text-center transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated sm:px-12"
          >
            <p className="verse-text text-[length:clamp(1.4rem,4vw,2rem)] text-gold-light">
              {featuredVerse.hemistich_1}
            </p>
            <p className="verse-text mt-2 text-[length:clamp(1.4rem,4vw,2rem)] text-gold-light opacity-80">
              {featuredVerse.hemistich_2}
            </p>
            <p className="mt-6 font-serif text-base text-text-secondary transition-colors group-hover:text-gold-light">
              — {featuredVerse.poet_name_ar}
            </p>
          </Link>
        </section>
      )}

      {/* Browse by era */}
      <section className="mx-auto mt-20 max-w-[1100px] px-4 sm:px-6">
        <h2 className="mb-6 font-serif text-2xl text-gold-light">تصفّح حسب العصر</h2>
        <div className="flex flex-wrap gap-3">
          {ERA_ORDER.map((era) => (
            <Pill key={era} href={`/poets?era=${era}`} variant="default" className="px-4 py-2 text-sm">
              {ERA_LABELS[era]}
            </Pill>
          ))}
        </div>
      </section>

      {/* Featured poets */}
      {poets.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1100px] px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-gold-light">شعراء مختارون</h2>
            <Link href="/poets" className="text-sm text-text-secondary transition-colors hover:text-gold-light">
              كل الشعراء
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {poets.map((poet: any) => (
              <Link
                key={poet.id}
                href={`/poet/${poet.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <span className="flex size-16 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-elevated font-serif text-3xl text-gold-primary">
                  {poet.name_ar.charAt(0)}
                </span>
                <h3 className="mt-4 font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                  {poet.name_ar}
                </h3>
                <p className="mt-1 text-xs text-text-muted">{eraLabel(poet.era)}</p>
                <p className="mt-2 text-xs text-text-secondary">
                  {formatCount(poet.poem_count)} قصيدة
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1100px] px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-gold-light">أغراض الشعر</h2>
            <Link href="/categories" className="text-sm text-text-secondary transition-colors hover:text-gold-light">
              كل التصنيفات
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`/search?q=${encodeURIComponent(c.name_ar)}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                    {c.name_ar}
                  </h3>
                  <Star className="size-4 text-gold-muted" />
                </div>
                {c.description_ar && <p className="mt-2 text-sm text-text-secondary">{c.description_ar}</p>}
                <p className="mt-3 text-xs text-text-muted">{formatCount(c.poem_count)} بيت</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
