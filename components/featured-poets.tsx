"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getPoets, formatEra, type Poet } from "@/lib/api"

const FALLBACK_POETS: Poet[] = [
  { id: "1", name_ar: "المتنبي", name_en: null, slug: "almutanabbi", bio_ar: null, era: "abbasid", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 326, verse_count: 5200, is_verified: true },
  { id: "2", name_ar: "أحمد شوقي", name_en: null, slug: "ahmad-shawqi", bio_ar: null, era: "modern", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 412, verse_count: 8400, is_verified: true },
  { id: "3", name_ar: "نزار قباني", name_en: null, slug: "nizar-qabbani", bio_ar: null, era: "contemporary", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 538, verse_count: 9800, is_verified: true },
  { id: "4", name_ar: "محمود درويش", name_en: null, slug: "mahmoud-darwish", bio_ar: null, era: "contemporary", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 467, verse_count: 7600, is_verified: true },
  { id: "5", name_ar: "امرؤ القيس", name_en: null, slug: "imru-al-qays", bio_ar: null, era: "pre_islamic", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 189, verse_count: 2100, is_verified: true },
  { id: "6", name_ar: "أبو القاسم الشابي", name_en: null, slug: "abu-al-qasim-al-shabbi", bio_ar: null, era: "modern", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 178, verse_count: 3200, is_verified: true },
]

export function FeaturedPoets() {
  const [poets, setPoets] = useState<Poet[]>(FALLBACK_POETS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPoets({ limit: 6 })
      .then((data) => {
        if (data?.items?.length) setPoets(data.items)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-2">الشعراء المميزون</h2>
            <p className="text-muted-foreground">استكشف أعمال أعظم شعراء العربية</p>
          </div>
          <Link
            href="/poets"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            جميع الشعراء
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {poets.map((poet) => (
            <Link
              key={poet.id}
              href={`/poet/${poet.slug}`}
              className="group p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-xl font-serif font-bold text-foreground">
                    {poet.name_ar.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                    {poet.name_ar}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatEra(poet.era)} · {poet.poem_count.toLocaleString("ar-SA")} قصيدة
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/poets"
            className="flex items-center justify-center gap-2 w-full py-3 bg-secondary/50 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            جميع الشعراء
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
