"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Search, Filter, Loader2 } from "lucide-react"
import { getPoets, formatEra, type Poet } from "@/lib/api"

const ERAS = [
  { value: "", label: "الجميع" },
  { value: "pre_islamic", label: "الجاهلي" },
  { value: "islamic", label: "الإسلامي" },
  { value: "umayyad", label: "الأموي" },
  { value: "abbasid", label: "العباسي" },
  { value: "andalusian", label: "الأندلسي" },
  { value: "modern", label: "الحديث" },
  { value: "contemporary", label: "المعاصر" },
]

// Fallback poets
const FALLBACK: Poet[] = [
  { id: "1", name_ar: "المتنبي", name_en: null, slug: "almutanabbi", bio_ar: null, era: "abbasid", birth_year: 303, death_year: 354, birth_place_ar: "الكوفة", image_url: null, poem_count: 326, verse_count: 5200, is_verified: true },
  { id: "2", name_ar: "امرؤ القيس", name_en: null, slug: "imru-al-qays", bio_ar: null, era: "pre_islamic", birth_year: null, death_year: null, birth_place_ar: null, image_url: null, poem_count: 189, verse_count: 2100, is_verified: true },
  { id: "3", name_ar: "أحمد شوقي", name_en: null, slug: "ahmad-shawqi", bio_ar: null, era: "modern", birth_year: null, death_year: null, birth_place_ar: "القاهرة", image_url: null, poem_count: 412, verse_count: 8400, is_verified: true },
  { id: "4", name_ar: "نزار قباني", name_en: null, slug: "nizar-qabbani", bio_ar: null, era: "contemporary", birth_year: null, death_year: null, birth_place_ar: "دمشق", image_url: null, poem_count: 538, verse_count: 9800, is_verified: true },
  { id: "5", name_ar: "محمود درويش", name_en: null, slug: "mahmoud-darwish", bio_ar: null, era: "contemporary", birth_year: null, death_year: null, birth_place_ar: "فلسطين", image_url: null, poem_count: 467, verse_count: 7600, is_verified: true },
  { id: "6", name_ar: "أبو القاسم الشابي", name_en: null, slug: "abu-al-qasim-al-shabbi", bio_ar: null, era: "modern", birth_year: null, death_year: null, birth_place_ar: "تونس", image_url: null, poem_count: 178, verse_count: 3200, is_verified: true },
]

export default function PoetsPage() {
  const [poets, setPoets] = useState<Poet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEra, setSelectedEra] = useState("")
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const load = useCallback(async (era: string, pg: number, append = false) => {
    setIsLoading(true)
    try {
      const data = await getPoets({ era: era || undefined, page: pg, limit: 24 })
      if (data) {
        setPoets((prev) => (append ? [...prev, ...data.items] : data.items))
        setTotal(data.total)
        setHasMore(pg * 24 < data.total)
      } else {
        // API not available — show fallback
        if (!append) {
          setPoets(FALLBACK)
          setHasMore(false)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    load(selectedEra, 1, false)
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEra])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    load(selectedEra, next, true)
  }

  // Client-side name filter
  const filtered = searchText
    ? poets.filter((p) =>
        p.name_ar.includes(searchText) ||
        (p.name_en?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
      )
    : poets

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="py-12 lg:py-16 bg-secondary/30 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">الشعراء</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              استكشف أعمال أعظم شعراء العربية عبر العصور المختلفة
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث عن شاعر..."
                dir="rtl"
                className="w-full py-3 px-12 bg-card border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="appearance-none py-3 px-12 pr-12 bg-card border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all min-w-[180px]"
              >
                {ERAS.map((era) => (
                  <option key={era.value} value={era.value}>
                    {era.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-6">
              {total > 0 ? `${total} شاعر` : `${filtered.length} شاعر`}
            </p>
          )}

          {/* Loading */}
          {isLoading && poets.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          )}

          {/* Poets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((poet) => {
              const famousLine = poet.famous_verses?.[0]?.full_verse ?? ""
              const preview = famousLine.length > 50 ? famousLine.slice(0, 50) + "…" : famousLine

              return (
                <Link
                  key={poet.id}
                  href={`/poet/${poet.slug}`}
                  className="group p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-xl font-serif font-bold text-foreground">
                        {poet.name_ar.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                        {poet.name_ar}
                      </h3>
                      <p className="text-sm text-muted-foreground">{formatEra(poet.era)}</p>
                      <p className="text-sm text-muted-foreground">{poet.poem_count} قصيدة</p>
                    </div>
                  </div>
                  {preview && (
                    <p className="text-sm text-muted-foreground font-serif line-clamp-2 leading-relaxed">
                      {"«"} {preview} {"»"}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-colors disabled:opacity-60 inline-flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                تحميل المزيد
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h2 className="text-xl font-semibold mb-2">لم يتم العثور على شعراء</h2>
              <p className="text-muted-foreground">جرّب بكلمات مختلفة</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
