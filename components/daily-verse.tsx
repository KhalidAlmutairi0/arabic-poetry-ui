import { RefreshCw, Share2, Bookmark } from "lucide-react"
import Link from "next/link"

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

async function fetchDailyVerse(): Promise<DailyVerseData> {
  try {
    // Use a deterministic "random" verse based on the date
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const offset = seed % 20 // cycle through 20 famous verses

    const res = await fetch(
      `${API_BASE}/api/v1/search/?q=%D8%B4%D8%B9%D8%B1&is_famous=true&limit=1&page=${offset + 1}`,
      {
        next: {
          revalidate: 86400, // revalidate once per day
          tags: ["daily-verse"],
        },
      }
    )

    if (!res.ok) return FALLBACK

    const data = await res.json()
    const hit = data.hits?.[0]
    if (!hit) return FALLBACK

    return {
      id: hit.id,
      hemistich_1: hit.hemistich_1,
      hemistich_2: hit.hemistich_2,
      poet_name_ar: hit.poet_name_ar,
      poet_slug: hit.poet_slug,
      poem_title_ar: hit.poem_title_ar,
    }
  } catch {
    return FALLBACK
  }
}

export async function DailyVerse() {
  const verse = await fetchDailyVerse()

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-accent font-medium mb-1">بيت اليوم</p>
              <h2 className="text-xl lg:text-2xl font-semibold">تأمل يومي</h2>
            </div>
            <Link
              href={`/verse/${verse.id}`}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              title="عرض التفاصيل"
            >
              <RefreshCw className="w-5 h-5" />
            </Link>
          </div>

          {/* Card */}
          <div className="relative p-8 lg:p-12 bg-card rounded-2xl border border-border/50 shadow-sm">
            {/* Decorative Element */}
            <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-accent/5" />
            <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-accent/5" />

            {/* Content */}
            <div className="relative">
              {/* Verse */}
              <div className="text-center mb-8">
                <p className="font-serif text-2xl lg:text-4xl leading-loose text-verse mb-2">
                  {verse.hemistich_1}
                </p>
                <p className="font-serif text-2xl lg:text-4xl leading-loose text-muted-foreground">
                  {verse.hemistich_2}
                </p>
              </div>

              {/* Poet */}
              <Link
                href={verse.poet_slug !== "abu-al-atahiya" ? `/poet/${verse.poet_slug}` : "#"}
                className="block text-center text-lg font-medium text-foreground mb-6 hover:text-accent transition-colors"
              >
                — {verse.poet_name_ar}
              </Link>

              {/* Explanation (if available) */}
              {verse.explanation && (
                <div className="max-w-2xl mx-auto p-4 bg-secondary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {verse.explanation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4 mt-8">
                <Link
                  href={`/verse/${verse.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm font-medium transition-colors"
                >
                  اقرأ الشرح
                </Link>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-lg text-sm font-medium transition-colors">
                  <Bookmark className="w-4 h-4" />
                  حفظ
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 hover:bg-secondary rounded-lg text-sm font-medium transition-colors">
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
