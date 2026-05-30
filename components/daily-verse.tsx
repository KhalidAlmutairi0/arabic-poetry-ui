"use client"

import { RefreshCw, Share2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

interface DailyVerseData {
  id: string
  hemistich_1: string
  hemistich_2: string
  poet_name_ar: string
  poet_slug: string
  poem_title_ar: string | null
  explanation?: string
}

const FALLBACK: DailyVerseData = {
  id: "fallback",
  hemistich_1: "ألا ليت الشباب يعود يوماً",
  hemistich_2: "فأُخبره بما فعل المشيب",
  poet_name_ar: "أبو العتاهية",
  poet_slug: "abu-al-atahiya",
  poem_title_ar: null,
  explanation:
    "يتمنى الشاعر عودة أيام الشباب ليخبرها بما فعله الكبر والشيب به من تغيير، وهو تعبير عن الحنين للماضي والأسى على ما فات.",
}

export function DailyVerse() {
  const [verse, setVerse] = useState<DailyVerseData>(FALLBACK)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const offset = seed % 20

    fetch(`${API_BASE}/api/v1/search/?q=%D8%B4%D8%B9%D8%B1&is_famous=true&limit=1&page=${offset + 1}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const hit = data?.hits?.[0]
        if (hit) {
          setVerse({
            id: hit.id,
            hemistich_1: hit.hemistich_1,
            hemistich_2: hit.hemistich_2,
            poet_name_ar: hit.poet_name_ar,
            poet_slug: hit.poet_slug,
            poem_title_ar: hit.poem_title_ar,
          })
        }
      })
      .catch(() => {})
  }, [])

  const fullText = `${verse.hemistich_1}  ${verse.hemistich_2}\n— ${verse.poet_name_ar}`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: fullText })
    } else {
      navigator.clipboard?.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const verseLink = verse.id !== "fallback"
    ? `/verse/${verse.id}`
    : `/search?q=${encodeURIComponent(verse.hemistich_1)}`

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-accent font-medium mb-1">بيت اليوم</p>
              <h2 className="text-xl lg:text-2xl font-semibold">تأمل يومي</h2>
            </div>
            <Link
              href={verseLink}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              title="عرض التفاصيل"
            >
              <RefreshCw className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative p-8 lg:p-12 bg-card rounded-2xl border border-border/50 shadow-sm">
            <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-accent/5" />
            <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-accent/5" />

            <div className="relative">
              <div className="text-center mb-8">
                <p className="font-serif text-2xl lg:text-4xl leading-loose text-verse mb-2">
                  {verse.hemistich_1}
                </p>
                <p className="font-serif text-2xl lg:text-4xl leading-loose text-muted-foreground">
                  {verse.hemistich_2}
                </p>
              </div>

              <Link
                href={verse.poet_slug ? `/poet/${verse.poet_slug}` : "#"}
                className="block text-center text-lg font-medium text-foreground mb-6 hover:text-accent transition-colors"
              >
                — {verse.poet_name_ar}
              </Link>

              {verse.explanation && (
                <div className="max-w-2xl mx-auto p-4 bg-secondary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {verse.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-8">
                <Link
                  href={verseLink}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm font-medium transition-colors"
                >
                  اقرأ الشرح
                </Link>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  {copied ? "تم النسخ" : "نسخ"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-lg text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
