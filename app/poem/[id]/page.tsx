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
  Check,
  Loader2,
} from "lucide-react"
import { getPoem, formatEra, type Poem } from "@/lib/api"

// The [id] segment is a poem slug (e.g. "qasida-fi-madh-sayf-aldawla")
export default function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params)
  const [poem, setPoem] = useState<Poem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readVerses, setReadVerses] = useState<string[]>([])
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

  const progress = poem.verses.length > 0
    ? (readVerses.length / poem.verses.length) * 100
    : 0

  const toggleVerseRead = (verseId: string) => {
    setReadVerses((prev) =>
      prev.includes(verseId) ? prev.filter((id) => id !== verseId) : [...prev, verseId]
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
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{readVerses.length}/{poem.verses.length}</span>
                  <span>بيت</span>
                </div>
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
            {/* Progress Bar */}
            <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
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
            <div className="space-y-2">
              {poem.verses
                .sort((a, b) => a.position - b.position)
                .map((verse, index) => (
                  <div
                    key={verse.id}
                    className={`group relative transition-all duration-300 ${
                      expandedVerse === verse.id ? "mb-4" : ""
                    }`}
                  >
                    <div
                      className={`relative p-6 lg:p-8 rounded-xl border transition-all cursor-pointer ${
                        readVerses.includes(verse.id)
                          ? "bg-card border-border/50"
                          : "bg-secondary/20 border-transparent"
                      } ${
                        expandedVerse === verse.id
                          ? "border-accent shadow-lg shadow-accent/5"
                          : "hover:border-border/50 hover:shadow-md"
                      }`}
                      onClick={() =>
                        setExpandedVerse(expandedVerse === verse.id ? null : verse.id)
                      }
                    >
                      {/* Verse Number */}
                      <div className="absolute top-4 right-4">
                        <span className="text-sm text-muted-foreground font-medium">
                          {index + 1}
                        </span>
                      </div>

                      {/* Read Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVerseRead(verse.id)
                        }}
                        className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          readVerses.includes(verse.id)
                            ? "bg-accent border-accent text-white"
                            : "border-border hover:border-accent"
                        }`}
                      >
                        {readVerses.includes(verse.id) && <Check className="w-3 h-3" />}
                      </button>

                      {/* Verse Content */}
                      <div className="text-center pt-4">
                        <div className="font-serif text-xl lg:text-2xl leading-loose">
                          <p className="text-verse mb-2">{verse.hemistich_1}</p>
                          <p className="text-muted-foreground">{verse.hemistich_2}</p>
                        </div>
                        {verse.is_famous && (
                          <span className="mt-2 inline-block px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs">
                            مشهور
                          </span>
                        )}
                      </div>

                      {/* Expanded Actions */}
                      {expandedVerse === verse.id && (
                        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-center gap-4">
                          <Link
                            href={`/verse/${verse.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Sparkles className="w-4 h-4" />
                            الشرح والتحليل
                          </Link>
                          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                            <Share2 className="w-4 h-4" />
                            مشاركة
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
