import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { getPoets, type SearchHit } from "@/lib/api"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// Fallback data
const FALLBACK: SearchHit[] = [
  { id: "1", hemistich_1: "على قدر أهل العزم تأتي العزائم", hemistich_2: "وتأتي على قدر الكرام المكارم", full_verse: "", poet_name_ar: "المتنبي", poem_title_ar: "", poem_slug: "", poet_slug: "almutanabbi", is_famous: true, era: "abbasid" },
  { id: "2", hemistich_1: "قفا نبك من ذكرى حبيب ومنزل", hemistich_2: "بسقط اللوى بين الدخول فحومل", full_verse: "", poet_name_ar: "امرؤ القيس", poem_title_ar: "", poem_slug: "", poet_slug: "imru-al-qays", is_famous: true, era: "pre_islamic" },
  { id: "3", hemistich_1: "إذا الشعب يوماً أراد الحياة", hemistich_2: "فلا بد أن يستجيب القدر", full_verse: "", poet_name_ar: "أبو القاسم الشابي", poem_title_ar: "", poem_slug: "", poet_slug: "abu-al-qasim-al-shabbi", is_famous: true, era: "modern" },
  { id: "4", hemistich_1: "أنا البحر في أحشائه الدر كامن", hemistich_2: "فهل سألوا الغواص عن صدفاتي", full_verse: "", poet_name_ar: "حافظ إبراهيم", poem_title_ar: "", poem_slug: "", poet_slug: "hafiz-ibrahim", is_famous: true, era: "modern" },
  { id: "5", hemistich_1: "وما نيل المطالب بالتمني", hemistich_2: "ولكن تؤخذ الدنيا غلابا", full_verse: "", poet_name_ar: "أحمد شوقي", poem_title_ar: "", poem_slug: "", poet_slug: "ahmad-shawqi", is_famous: true, era: "modern" },
]

async function fetchTrending(): Promise<SearchHit[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/search/?q=%D8%B4%D8%B9%D8%B1&is_famous=true&limit=5`,
      { next: { revalidate: 1800, tags: ["trending"] } }
    )
    if (!res.ok) return FALLBACK
    const data = await res.json()
    return data.hits?.length ? data.hits : FALLBACK
  } catch {
    return FALLBACK
  }
}

export async function TrendingVerses() {
  const verses = await fetchTrending()

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold">أبيات رائجة</h2>
            <p className="text-muted-foreground text-sm mt-1">الأبيات الأكثر تفاعلاً هذا الأسبوع</p>
          </div>
        </div>

        {/* Verses List */}
        <div className="space-y-4">
          {verses.map((verse, index) => (
            <Link
              key={verse.id}
              href={`/verse/${verse.id}`}
              className="group block p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-sm font-semibold shrink-0">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Verse */}
                  <div className="font-serif text-lg lg:text-xl leading-loose text-verse">
                    <p>{verse.hemistich_1}</p>
                    <p className="text-muted-foreground">{verse.hemistich_2}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <span className="font-medium">{verse.poet_name_ar}</span>
                    {verse.is_famous && (
                      <span className="mr-auto px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs">
                        مشهور
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
