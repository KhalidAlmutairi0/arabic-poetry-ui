"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react"
import { getPoem, formatEra, type Poem } from "@/lib/api"

// The [id] segment is a poem slug (e.g. "qasida-fi-madh-sayf-aldawla")
export default function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params)
  const [poem, setPoem] = useState<Poem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedVerse, setExpandedVerse] = useState<string | null>(null)
  const [showPoemInfo, setShowPoemInfo] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const data = await getPoem(slug)
      setPoem(data)
      setIsLoading(false)
    }
    load()
  }, [slug])

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

  if (!poem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-6xl">📜</p>
          <h1 className="text-2xl font-semibold">القصيدة غير موجودة</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على القصيدة المطلوبة أو الخادم غير متاح
          </p>
          <Link href="/" className="text-accent hover:underline">
            العودة للرئيسية
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Sticky Header with Progress */}
        <div className="sticky top-16 lg:top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="font-semibold text-lg lg:text-xl line-clamp-1">{poem.title_ar}</h1>
                <Link
                  href={`/poet/${poem.poet.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {poem.poet.name_ar}
                </Link>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {poem.verses.length} بيتاً
                </span>
                <button
                  onClick={() => {
                    const url = window.location.href
                    if (navigator.share) {
                      navigator.share({ title: poem.title_ar, text: `${poem.title_ar} — ${poem.poet.name_ar}`, url })
                    } else {
                      navigator.clipboard?.writeText(url)
                    }
                  }}
                  className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="مشاركة"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Poem Info Toggle */}
            <div className="mb-8">
              <button
                onClick={() => setShowPoemInfo(!showPoemInfo)}
                className="w-full flex items-center justify-between p-5 bg-card rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <span className="font-medium">معلومات القصيدة</span>
                {showPoemInfo ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {showPoemInfo && (
                <div className="mt-2 p-6 bg-card rounded-xl border border-border/50 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الشاعر</p>
                    <p className="font-medium">{poem.poet.name_ar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">العصر</p>
                    <p className="font-medium">{formatEra(poem.poet.era)}</p>
                  </div>
                  {poem.meter && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">البحر</p>
                      <p className="font-medium">{poem.meter}</p>
                    </div>
                  )}
                  {poem.rhyme_char && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">حرف الروي</p>
                      <p className="font-medium">{poem.rhyme_char}</p>
                    </div>
                  )}
                  {poem.categories.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">التصنيفات</p>
                      <div className="flex gap-2 flex-wrap">
                        {poem.categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs"
                          >
                            {c.name_ar}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verses */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {poem.verses
                .sort((a, b) => a.position - b.position)
                .map((verse, index) => (
                  <div
                    key={verse.id}
                    className="group"
                  >
                    <div
                      className={`relative py-6 px-6 lg:px-10 transition-all cursor-pointer hover:bg-secondary/30 ${
                        expandedVerse === verse.id ? "bg-secondary/20" : ""
                      } ${index > 0 ? "border-t border-border/30" : ""}`}
                      onClick={() =>
                        setExpandedVerse(expandedVerse === verse.id ? null : verse.id)
                      }
                      dir="rtl"
                    >
                      {/* Verse Number */}
                      <span className="absolute top-3 right-3 text-xs text-muted-foreground/40 font-medium">
                        {index + 1}
                      </span>

                      {/* Verse — both hemistiches on one line */}
                      <div className="text-center font-serif text-xl lg:text-2xl leading-[2.4]">
                        {verse.hemistich_1 && verse.hemistich_2 ? (
                          <div className="flex justify-center items-baseline gap-6 lg:gap-10 flex-wrap">
                            <span className="text-foreground">{verse.hemistich_1}</span>
                            <span className="text-muted-foreground/30 text-sm hidden sm:inline">◆</span>
                            <span className="text-foreground/70">{verse.hemistich_2}</span>
                          </div>
                        ) : (
                          <span className="text-foreground">{verse.hemistich_1 || verse.full_verse}</span>
                        )}
                      </div>

                      {verse.is_famous && (
                        <div className="flex justify-center mt-2">
                          <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs">
                            مشهور
                          </span>
                        </div>
                      )}

                      {/* Expanded Actions */}
                      {expandedVerse === verse.id && (
                        <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-center gap-3">
                          <Link
                            href={`/verse/${verse.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Sparkles className="w-4 h-4" />
                            الشرح والتحليل
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const text = `${verse.hemistich_1}  ${verse.hemistich_2}`
                              navigator.clipboard?.writeText(text)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            نسخ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
