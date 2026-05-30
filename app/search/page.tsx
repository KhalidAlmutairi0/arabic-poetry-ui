"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Loader2, SlidersHorizontal, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"
import { searchPoetry, type SearchHit } from "@/lib/api"

interface PoemGroup {
  poem_slug: string
  poem_title_ar: string
  poet_name_ar: string
  poet_slug: string
  verses: SearchHit[]
}

function groupByPoem(hits: SearchHit[]): PoemGroup[] {
  const map = new Map<string, PoemGroup>()
  for (const hit of hits) {
    const key = hit.poem_slug || hit.id
    if (!map.has(key)) {
      map.set(key, {
        poem_slug: hit.poem_slug,
        poem_title_ar: hit.poem_title_ar,
        poet_name_ar: hit.poet_name_ar,
        poet_slug: hit.poet_slug,
        verses: [],
      })
    }
    map.get(key)!.verses.push(hit)
  }
  return Array.from(map.values())
}

const ERAS = [
  { value: "", label: "جميع العصور" },
  { value: "pre_islamic", label: "الجاهلي" },
  { value: "islamic", label: "الإسلامي" },
  { value: "umayyad", label: "الأموي" },
  { value: "abbasid", label: "العباسي" },
  { value: "andalusian", label: "الأندلسي" },
  { value: "modern", label: "الحديث" },
  { value: "contemporary", label: "المعاصر" },
]

const MODES = [
  { value: "hybrid", label: "🔮 ذكي" },
  { value: "keyword", label: "🔤 نص" },
  { value: "semantic", label: "💡 معنى" },
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get("q") ?? ""

  const [inputValue, setInputValue] = useState(initialQ)
  const [activeQuery, setActiveQuery] = useState(initialQ)
  const [era, setEra] = useState("")
  const [mode, setMode] = useState<"hybrid" | "keyword" | "semantic">("hybrid")
  const [isFamous, setIsFamous] = useState<boolean | undefined>(undefined)
  const [results, setResults] = useState<SearchHit[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const doSearch = useCallback(
    async (q: string, pg = 1) => {
      if (!q.trim()) return
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      setIsLoading(true)
      setSearched(true)
      try {
        const data = await searchPoetry({
          q,
          mode,
          era: era || undefined,
          is_famous: isFamous,
          page: pg,
          limit: 20,
        })
        if (data) {
          setResults(pg === 1 ? data.hits : (prev) => [...prev, ...data.hits])
          setTotal(data.estimated_total_hits)
          setTotalPages(data.total_pages)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [mode, era, isFamous]
  )

  // On mount, trigger search if URL has query
  useEffect(() => {
    if (initialQ) doSearch(initialQ, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-search when filters change (only after first search)
  useEffect(() => {
    if (searched && activeQuery) {
      setPage(1)
      doSearch(activeQuery, 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, era, isFamous])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return
    setActiveQuery(q)
    setPage(1)
    router.push(`/search?q=${encodeURIComponent(q)}`)
    doSearch(q, 1)
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    doSearch(activeQuery, next)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Search Bar */}
        <div className="border-b border-border/50 bg-secondary/20 py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="ابحث عن بيت شعر، قصيدة، أو شاعر..."
                  dir="rtl"
                  className="w-full py-3.5 px-14 bg-card border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                بحث
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-3 border rounded-xl transition-colors shrink-0 ${
                  showFilters
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card border-border hover:bg-secondary/50"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </form>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 max-w-3xl mx-auto p-4 bg-card rounded-xl border border-border/50 flex flex-wrap gap-6">
                {/* Mode */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">طريقة البحث</p>
                  <div className="flex gap-2">
                    {MODES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMode(m.value as typeof mode)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          mode === m.value
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Era */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">العصر</p>
                  <select
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    className="px-3 py-1.5 bg-secondary/50 rounded-lg text-sm focus:outline-none border border-border/50"
                  >
                    {ERAS.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Famous */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">النوع</p>
                  <div className="flex gap-2">
                    {[
                      { value: undefined, label: "الكل" },
                      { value: true, label: "المشهورة" },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setIsFamous(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isFamous === opt.value
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results count */}
          {searched && !isLoading && total > 0 && (
            <p className="text-sm text-muted-foreground mb-6">
              {total.toLocaleString("ar-SA")} نتيجة لـ &quot;{activeQuery}&quot;
            </p>
          )}

          {/* Loading skeleton */}
          {isLoading && results.length === 0 && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 bg-card rounded-xl border border-border/50 animate-pulse">
                  <div className="h-6 bg-secondary rounded w-3/4 mb-3" />
                  <div className="h-5 bg-secondary rounded w-2/3 mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {/* Results — grouped by poem */}
          {results.length > 0 && (
            <div className="space-y-4">
              {groupByPoem(results).map((group) => (
                <Link
                  key={group.poem_slug || group.verses[0].id}
                  href={group.poem_slug ? `/poem/${group.poem_slug}` : `/verse/${group.verses[0].id}`}
                  className="group block p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
                >
                  {/* Poem title + poet */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2.5 bg-secondary/50 rounded-xl shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-accent transition-colors line-clamp-1">
                        {group.poem_title_ar && group.poem_title_ar !== "قصيدة"
                          ? group.poem_title_ar
                          : group.verses[0].hemistich_1}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {group.poet_name_ar}
                        {group.verses.length > 1 && (
                          <span className="mr-2">· {group.verses.length} أبيات مطابقة</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Preview: first matching verse */}
                  <div className="font-serif text-base lg:text-lg leading-loose pr-14 text-muted-foreground">
                    <p>{group.verses[0].hemistich_1}</p>
                    {group.verses[0].hemistich_2 && (
                      <p>{group.verses[0].hemistich_2}</p>
                    )}
                  </div>

                  {/* Show second verse preview if multiple matches */}
                  {group.verses.length > 1 && (
                    <div className="font-serif text-sm leading-loose pr-14 text-muted-foreground/60 mt-1">
                      <p>{group.verses[1].hemistich_1}</p>
                    </div>
                  )}
                </Link>
              ))}

              {/* Load more */}
              {page < totalPages && (
                <div className="pt-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-8 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    تحميل المزيد
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {searched && !isLoading && results.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-semibold mb-2">لا توجد نتائج</h2>
              <p className="text-muted-foreground">جرّب البحث بكلمات أخرى أو قم بتغيير الفلاتر</p>
            </div>
          )}

          {/* Initial / empty state */}
          {!searched && (
            <div className="text-center py-20">
              <p className="text-5xl mb-6">🌙</p>
              <h2 className="text-2xl font-semibold mb-3">ابحث في الشعر العربي</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                ابحث عن أي بيت شعر، قصيدة، أو شاعر في تراثنا الشعري العريق
              </p>
              <div>
                <h3 className="flex items-center justify-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  ابحث عن
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {["المتنبي", "الغزل", "الحكمة", "نزار قباني", "محمود درويش"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setInputValue(term)
                        setActiveQuery(term)
                        router.push(`/search?q=${encodeURIComponent(term)}`)
                        doSearch(term, 1)
                      }}
                      className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
