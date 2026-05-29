import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPoets, formatEra } from "@/lib/api"

// Fallback data shown while the backend is starting up
const FALLBACK_POETS = [
  { id: "1", name_ar: "المتنبي", slug: "almutanabbi", era: "abbasid", poem_count: 326, verse_count: 5200, famous_verses: [{ id: "1", full_verse: "على قدر أهل العزم تأتي العزائم وتأتي على قدر الكرام المكارم", poem_slug: null, poem_title_ar: null }] },
  { id: "2", name_ar: "امرؤ القيس", slug: "imru-al-qays", era: "pre_islamic", poem_count: 189, verse_count: 2100, famous_verses: [{ id: "2", full_verse: "قفا نبك من ذكرى حبيب ومنزل بسقط اللوى بين الدخول فحومل", poem_slug: null, poem_title_ar: null }] },
  { id: "3", name_ar: "أحمد شوقي", slug: "ahmad-shawqi", era: "modern", poem_count: 412, verse_count: 8400, famous_verses: [{ id: "3", full_verse: "وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا", poem_slug: null, poem_title_ar: null }] },
  { id: "4", name_ar: "نزار قباني", slug: "nizar-qabbani", era: "contemporary", poem_count: 538, verse_count: 9800, famous_verses: [{ id: "4", full_verse: "أحبك جداً وأعرف أن الطريق صعب", poem_slug: null, poem_title_ar: null }] },
  { id: "5", name_ar: "محمود درويش", slug: "mahmoud-darwish", era: "contemporary", poem_count: 467, verse_count: 7600, famous_verses: [{ id: "5", full_verse: "على هذه الأرض ما يستحق الحياة", poem_slug: null, poem_title_ar: null }] },
  { id: "6", name_ar: "أبو القاسم الشابي", slug: "abu-al-qasim-al-shabbi", era: "modern", poem_count: 178, verse_count: 3200, famous_verses: [{ id: "6", full_verse: "إذا الشعب يوماً أراد الحياة فلا بد أن يستجيب القدر", poem_slug: null, poem_title_ar: null }] },
]

export async function FeaturedPoets() {
  const data = await getPoets({ limit: 6 })
  const poets = data?.items ?? FALLBACK_POETS

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Poets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {poets.map((poet) => {
            const famousLine = poet.famous_verses?.[0]?.full_verse ?? ""
            const [firstHalf] = famousLine.split(/\s{2,}|\n/)

            return (
              <Link
                key={poet.id}
                href={`/poet/${poet.slug}`}
                className="group p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-xl font-serif font-bold text-foreground">
                      {poet.name_ar.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                      {poet.name_ar}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatEra(poet.era)} · {poet.poem_count} قصيدة
                    </p>
                  </div>
                </div>

                {/* Famous verse preview */}
                {famousLine && (
                  <p className="mt-4 text-sm text-muted-foreground font-serif line-clamp-2 leading-relaxed">
                    {"«"} {firstHalf || famousLine} {"»"}
                  </p>
                )}
              </Link>
            )
          })}
        </div>

        {/* Mobile View All */}
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
