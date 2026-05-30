import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchExperience } from '@/components/search-experience'

export const metadata: Metadata = {
  title: 'البحث · قافية',
  description: 'ابحث في ديوان الشعر العربي بالنص أو المعنى.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return (
    <div className="mx-auto max-w-[900px] px-4 pb-16 sm:px-6">
      <div className="pt-10">
        <h1 className="font-serif text-3xl font-bold text-gold-light">البحث في الديوان</h1>
        <p className="mt-2 text-sm text-text-secondary">
          ابحث عبر ١٤٣٬٠٠٠ قصيدة بالكلمة أو المعنى الدلالي.
        </p>
      </div>
      <Suspense>
        <SearchExperience initialQuery={q ?? ''} />
      </Suspense>
    </div>
  )
}
