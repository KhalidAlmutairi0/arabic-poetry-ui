import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, ChevronLeft } from 'lucide-react'
import { findVerse, getRelatedVerses, POEMS } from '@/lib/data'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { VerseExplanation } from '@/components/verse-explanation'
import { VerseDetailActions } from '@/components/verse-detail-actions'

export function generateStaticParams() {
  return POEMS.flatMap((p) => p.verses.map((v) => ({ id: v.id })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const found = findVerse(id)
  if (!found) return { title: 'قافية' }
  return {
    title: `${found.poem.poet.name_ar} — بيت شعري · قافية`,
    description: found.verse.full_verse,
  }
}

export default async function VersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const found = findVerse(id)
  if (!found) notFound()
  const { verse, poem } = found
  const related = getRelatedVerses(id, 4)

  const explanations = {
    simple: `يقول الشاعر إنّ ما يبلغه المرءُ من عزائمَ ومآثرَ يكون على قدرِ همّته ومعدنه؛ فأصحابُ النفوس الكبيرة تأتيهم المكارمُ الكبيرة، وكلٌّ يُنال على قدرِ صاحبه. بيتٌ يلخّص فلسفةَ الطموح: المجدُ ثمرةُ الإرادة، ولا تُعطى المعالي إلّا لمن يستحقّها بعزمه.`,
    literary: `يبني ${poem.poet.name_ar} المعنى على مقابلةٍ بديعةٍ بين «العزم/العزائم» و«الكرام/المكارم»، فيخلق توازنًا موسيقيًّا ودلاليًّا يرسّخ الحكمة في الذهن. أسلوب الشرط المضمر يمنح البيت طابعَ القانون الكوني الثابت، فيرتقي من تجربةٍ فرديةٍ إلى حقيقةٍ عامة. هذا التكثيفُ هو سرُّ خلودِ حِكَمِه.`,
    linguistic: `«على قدرِ» جارٌّ ومجرور متعلّق بالفعل «تأتي»، و«أهلِ» مضافٌ إليه مجرور. الجناسُ الاشتقاقيّ بين «العزم» و«العزائم»، و«الكرام» و«المكارم» يضاعف الإيقاع. وردَ البيتُ على بحر الطويل، وهو أوسعُ البحور نَفَسًا، فناسبَ المعنى الفخريَّ الممتد.`,
  }

  return (
    <div className="animate-fade-up mx-auto max-w-[820px] px-4 py-10 sm:px-6">
      <BreadcrumbNav
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: poem.poet.name_ar, href: `/poet/${poem.poet.slug}` },
          { label: poem.title_ar, href: `/poem/${poem.slug}` },
          { label: 'بيت شعري' },
        ]}
      />

      {/* Hero verse */}
      <section className="relative mt-10 rounded-2xl border border-border bg-surface/60 px-6 py-14 text-center sm:px-12">
        <span
          className="pointer-events-none absolute right-5 top-3 select-none font-serif text-7xl leading-none text-gold-primary opacity-15"
          aria-hidden="true"
        >
          ﴿
        </span>
        <span
          className="pointer-events-none absolute bottom-0 left-5 select-none font-serif text-7xl leading-none text-gold-primary opacity-15"
          aria-hidden="true"
        >
          ﴾
        </span>

        <p className="verse-text text-[length:clamp(1.6rem,5vw,2.4rem)] font-medium text-gold-light">
          {verse.hemistich_1}
        </p>
        <p className="verse-text mt-2 text-[length:clamp(1.6rem,5vw,2.4rem)] font-medium text-gold-light opacity-85">
          {verse.hemistich_2}
        </p>

        <div className="mt-8 flex flex-col items-center gap-1">
          <Link
            href={`/poet/${poem.poet.slug}`}
            className="font-serif text-lg text-text-primary transition-colors hover:text-gold-light"
          >
            — {poem.poet.name_ar}
          </Link>
          <Link
            href={`/poem/${poem.slug}`}
            className="text-sm text-text-muted transition-colors hover:text-gold-light"
          >
            من قصيدة «{poem.title_ar}»
          </Link>
        </div>

        <div className="mt-8">
          <VerseDetailActions text={verse.full_verse} />
        </div>
      </section>

      {/* AI explanation */}
      <div className="mt-8">
        <VerseExplanation explanations={explanations} />
      </div>

      {/* Read full poem */}
      <Link
        href={`/poem/${poem.slug}`}
        className="group mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-elevated text-gold-primary">
            <BookOpen className="size-5" />
          </span>
          <div>
            <p className="text-xs text-text-muted">اقرأ القصيدة كاملة</p>
            <p className="font-serif text-lg text-text-primary transition-colors group-hover:text-gold-light">
              {poem.title_ar} — {poem.poet.name_ar}
            </p>
          </div>
        </div>
        <ChevronLeft className="size-5 text-text-muted transition-colors group-hover:text-gold-light" />
      </Link>

      {/* Related verses */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-serif text-2xl text-gold-light">أبيات مشابهة</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/verse/${r.id}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated"
              >
                <p className="verse-text text-right text-base text-gold-light">{r.hemistich_1}</p>
                <p className="verse-text text-right text-base text-gold-light opacity-75">
                  {r.hemistich_2}
                </p>
                <p className="mt-3 text-xs text-text-muted">{r.poet_name_ar}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
