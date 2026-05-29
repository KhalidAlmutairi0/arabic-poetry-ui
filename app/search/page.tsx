"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Loader2, SlidersHorizontal, TrendingUp } from "lucide-react"
import Link from "next/link"
import { searchPoetry, type SearchHit } from "@/lib/api"

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

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((hit) => (
                /* Outer: div not Link — avoids nested <a> with poet link inside */
                <div
                  key={`${hit.id}-${hit.hemistich_1.slice(0, 10)}`}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/verse/${hit.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/verse/${hit.id}`)}
                  className="group block p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="font-serif text-lg lg:text-xl leading-loose mb-4">
                    <p className="text-verse">{hit.hemistich_1}</p>
                    <p className="text-muted-foreground">{hit.hemistich_2}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Link
                      href={`/poet/${hit.poet_slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {hit.poet_name_ar}
                    </Link>
                    {hit.poem_title_ar && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground line-clamp-1">
                          {hit.poem_title_ar}
                        </span>
                      </>
                    )}
                    {hit.is_famous && (
                      <span className="mr-auto px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs">
                        مشهور
                      </span>
                    )}
                  </div>
                </div>
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
