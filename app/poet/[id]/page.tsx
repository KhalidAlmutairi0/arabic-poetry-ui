import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Calendar, BookOpen, ArrowLeft } from "lucide-react"
import { getPoet, getPoetPoems, formatEra } from "@/lib/api"
import { notFound } from "next/navigation"

// The [id] segment is actually a slug (e.g. "almutanabbi")
export default async function PoetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: slug } = await params

  const [poetData, poemsData] = await Promise.all([
    getPoet(slug),
    getPoetPoems(slug, 1, 12),
  ])

  if (!poetData) notFound()

  const poems = poemsData?.poems ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Avatar */}
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-card border border-border/50 flex items-center justify-center shrink-0">
                  <span className="text-5xl lg:text-6xl font-serif font-bold text-foreground">
                    {poetData.name_ar.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {formatEra(poetData.era)}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{poetData.name_ar}</h1>
                  {poetData.name_en && (
                    <p className="text-muted-foreground mb-4">{poetData.name_en}</p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    {(poetData.birth_year || poetData.death_year) && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {poetData.birth_year && `${poetData.birth_year} هـ`}
                        {poetData.birth_year && poetData.death_year && " - "}
                        {poetData.death_year && `${poetData.death_year} هـ`}
                      </span>
                    )}
                    {poetData.birth_place_ar && (
                      <span className="text-muted-foreground">{poetData.birth_place_ar}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8">
                    <div>
                      <p className="text-2xl font-bold">{poetData.poem_count}</p>
                      <p className="text-sm text-muted-foreground">قصيدة</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {poetData.verse_count.toLocaleString("ar-SA")}
                      </p>
                      <p className="text-sm text-muted-foreground">بيت</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Bio */}
            {poetData.bio_ar && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">نبذة</h2>
                <p className="text-muted-foreground leading-relaxed">{poetData.bio_ar}</p>
              </section>
            )}

            {/* Famous Verses */}
            {poetData.famous_verses && poetData.famous_verses.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">أشهر الأبيات</h2>
                <div className="space-y-4">
                  {poetData.famous_verses.map((v) => {
                    const [first, second] = v.full_verse.split(/\s{2,}|\n/)
                    return (
                      <Link
                        key={v.id}
                        href={`/verse/${v.id}`}
                        className="block p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all group"
                      >
                        <div className="font-serif text-lg lg:text-xl leading-loose">
                          <p className="text-verse">{first ?? v.full_verse}</p>
                          {second && (
                            <p className="text-muted-foreground">{second}</p>
                          )}
                        </div>
                        {v.poem_title_ar && (
                          <p className="text-sm text-muted-foreground mt-2">
                            من: {v.poem_title_ar}
                          </p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Poems */}
            {poems.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">القصائد</h2>
                  <Link
                    href={`/search?q=${encodeURIComponent(poetData.name_ar)}`}
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    عرض الكل
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {poems.map((poem) => (
                    <Link
                      key={poem.id}
                      href={`/poem/${poem.slug}`}
                      className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all group"
                    >
                      <div className="p-2 bg-secondary/50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-accent transition-colors line-clamp-1">
                          {poem.title_ar}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {poem.verse_count} بيتاً
                          {poem.meter && ` · ${poem.meter}`}
                        </p>
                      </div>
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
