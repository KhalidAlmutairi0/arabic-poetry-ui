"use client"

import { useState, useEffect, useRef } from "react"
import { use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  ArrowRight,
  Bookmark,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { getVerse, getExplanationStreamUrl, type Verse, type VerseExplanation } from "@/lib/api"

// ─── AI Explanation Panel ────────────────────────────────────────────────────

type ExplainType = "simple" | "literary" | "linguistic"

const TAB_LABELS: Record<ExplainType, string> = {
  simple: "تبسيط",
  literary: "تحليل أدبي",
  linguistic: "تحليل لغوي",
}

function ExplanationPanel({
  verseId,
  cached,
}: {
  verseId: string
  cached: VerseExplanation[]
}) {
  const [tab, setTab] = useState<ExplainType>("simple")
  const [texts, setTexts] = useState<Record<ExplainType, string>>({
    simple: "",
    literary: "",
    linguistic: "",
  })
  const [loading, setLoading] = useState<Record<ExplainType, boolean>>({
    simple: false,
    literary: false,
    linguistic: false,
  })
  const [started, setStarted] = useState<Record<ExplainType, boolean>>({
    simple: false,
    literary: false,
    linguistic: false,
  })
  const abortRefs = useRef<Record<ExplainType, AbortController | null>>({
    simple: null,
    literary: null,
    linguistic: null,
  })

  // Pre-fill from cached explanations
  useEffect(() => {
    if (!cached?.length) return
    const newTexts: Record<ExplainType, string> = { ...texts }
    const newStarted: Record<ExplainType, boolean> = { ...started }
    for (const e of cached) {
      const t = e.type as ExplainType
      if (e.explanation_ar) {
        newTexts[t] = e.explanation_ar
        newStarted[t] = true
      }
    }
    setTexts(newTexts)
    setStarted(newStarted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const streamExplanation = async (type: ExplainType) => {
    if (started[type] && texts[type]) return // Already have it

    abortRefs.current[type]?.abort()
    const ctrl = new AbortController()
    abortRefs.current[type] = ctrl

    setStarted((p) => ({ ...p, [type]: true }))
    setLoading((p) => ({ ...p, [type]: true }))
    setTexts((p) => ({ ...p, [type]: "" }))

    try {
      const url = getExplanationStreamUrl(verseId, type)
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok || !res.body) {
        setTexts((p) => ({
          ...p,
          [type]: "حدث خطأ أثناء توليد الشرح. تأكد من تشغيل الخادم.",
        }))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Parse SSE lines
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const raw = line.slice(6).trim()
          if (raw === "[DONE]") break
          try {
            const json = JSON.parse(raw)
            if (json.text) {
              setTexts((p) => ({ ...p, [type]: p[type] + json.text }))
            } else if (json.full_text) {
              setTexts((p) => ({ ...p, [type]: json.full_text }))
            }
          } catch {
            /* ignore malformed chunks */
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setTexts((p) => ({
          ...p,
          [type]: "حدث خطأ أثناء الاتصال بالخادم.",
        }))
      }
    } finally {
      setLoading((p) => ({ ...p, [type]: false }))
    }
  }

  const handleTabClick = (type: ExplainType) => {
    setTab(type)
    streamExplanation(type)
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold">الشرح بالذكاء الاصطناعي</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["simple", "literary", "linguistic"] as ExplainType[]).map((t) => (
          <button
            key={t}
            onClick={() => handleTabClick(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t
                ? "bg-accent text-accent-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 bg-card rounded-xl border border-border/50 min-h-[120px]">
        {!started[tab] ? (
          <button
            onClick={() => streamExplanation(tab)}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            توليد الشرح
          </button>
        ) : loading[tab] && !texts[tab] ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري التوليد...</span>
          </div>
        ) : (
          <p className="leading-loose text-base whitespace-pre-line">
            {texts[tab]}
            {loading[tab] && (
              <span className="inline-block w-0.5 h-5 bg-accent ml-0.5 animate-pulse" />
            )}
          </p>
        )}
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [verse, setVerse] = useState<Verse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showWordMeanings, setShowWordMeanings] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const data = await getVerse(id)
      setVerse(data)
      setIsLoading(false)
    }
    load()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!verse) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-6xl">📜</p>
          <h1 className="text-2xl font-semibold">البيت غير موجود</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على البيت المطلوب أو الخادم غير متاح
          </p>
          <Link href="/" className="text-accent hover:underline">
            العودة للرئيسية
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const wordMeanings =
    verse.explanations
      .filter((e) => e.type === "simple")
      .flatMap((e) => e.difficult_words ?? []) ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
              <Link href="/" className="hover:text-foreground transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              {verse.poem_slug && (
                <>
                  <Link
                    href={`/poem/${verse.poem_slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {verse.poem_title_ar}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground line-clamp-1">{verse.hemistich_1}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Verse Display */}
            <div className="text-center mb-12">
              {/* Verse */}
              <div className="relative py-8 lg:py-12">
                <span className="absolute top-0 right-0 text-8xl lg:text-9xl font-serif text-accent/10 leading-none select-none">
                  {"«"}
                </span>
                <div className="relative font-serif text-3xl sm:text-4xl lg:text-5xl leading-loose">
                  <p className="text-verse mb-4">{verse.hemistich_1}</p>
                  <p className="text-muted-foreground">{verse.hemistich_2}</p>
                </div>
                <span className="absolute bottom-0 left-0 text-8xl lg:text-9xl font-serif text-accent/10 leading-none select-none">
                  {"»"}
                </span>
              </div>

              {/* Poet Info */}
              <div className="inline-flex items-center gap-3 mt-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-serif font-bold">
                    {verse.poet_name_ar.charAt(0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{verse.poet_name_ar}</p>
                  {verse.poem_title_ar && (
                    <p className="text-sm text-muted-foreground">{verse.poem_title_ar}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                    isLiked
                      ? "bg-rose-500/10 text-rose-500"
                      : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">إعجاب</span>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                    isBookmarked
                      ? "bg-accent/10 text-accent"
                      : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">حفظ</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">مشاركة</span>
                </button>
              </div>
            </div>

            {/* AI Explanation */}
            <ExplanationPanel verseId={verse.id} cached={verse.explanations} />

            {/* Word Meanings (from cached explanations) */}
            {wordMeanings.length > 0 && (
              <section className="mb-10">
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <button
                    onClick={() => setShowWordMeanings(!showWordMeanings)}
                    className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <BookOpen className="w-5 h-5 text-accent" />
                      معاني الكلمات
                    </span>
                    {showWordMeanings ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {showWordMeanings && (
                    <div className="px-6 pb-6 border-t border-border/50 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wordMeanings.map((item, i) => (
                          <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                            <p className="font-serif text-base font-medium text-accent mb-0.5">
                              {item.word}
                            </p>
                            <p className="text-sm text-muted-foreground">{item.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* View Full Poem */}
            {verse.poem_slug && (
              <section className="mb-10">
                <Link
                  href={`/poem/${verse.poem_slug}`}
                  className="flex items-center justify-between p-6 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">من قصيدة</p>
                    <p className="font-semibold text-lg">{verse.poem_title_ar}</p>
                    <p className="text-sm text-muted-foreground mt-1">{verse.poet_name_ar}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
                </Link>
              </section>
            )}

            {/* Similar Verses */}
            {verse.related_verses?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-6">أبيات مشابهة</h2>
                <div className="space-y-4">
                  {verse.related_verses.map((rv) => (
                    <Link
                      key={rv.id}
                      href={`/verse/${rv.id}`}
                      className="block p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all group"
                    >
                      <div className="font-serif text-lg leading-loose mb-3">
                        <p className="text-verse">{rv.hemistich_1}</p>
                        <p className="text-muted-foreground">{rv.hemistich_2}</p>
                      </div>
                      <p className="text-sm font-medium">{rv.poet_name_ar}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
