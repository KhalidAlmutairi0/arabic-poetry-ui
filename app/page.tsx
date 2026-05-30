import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSearch } from "@/components/hero-search"
import { FeaturedPoets } from "@/components/featured-poets"
import { TrendingVerses } from "@/components/trending-verses"
import { DailyVerse } from "@/components/daily-verse"
import { Categories } from "@/components/categories"
import { Sparkles, Search, BookOpen, Brain } from "lucide-react"
import { getPoets } from "@/lib/api"

export const revalidate = 60

export default async function Home() {
  const poetsData = await getPoets({ limit: 1 })
  const totalPoets = poetsData?.total ?? 0
  const hasStats = totalPoets > 0
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm text-accent font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>البحث الذكي بالذكاء الاصطناعي</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                ابحث في
                <span className="block text-accent mt-2">الشعر العربي</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                ابحث في آلاف الأبيات والقصائد من أعظم شعراء العربية، 
                مع شرح مدعوم بالذكاء الاصطناعي لفهم أعمق
              </p>
            </div>

            {/* Search */}
            <HeroSearch />

            {/* Stats — only show if we have real data */}
            {hasStats && (
              <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mt-16 pt-8 border-t border-border/50">
                <div className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-foreground">
                    {totalPoets.toLocaleString("ar-SA")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">شاعر</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-foreground">١٠+</p>
                  <p className="text-sm text-muted-foreground mt-1">عصور أدبية</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">بحث ذكي</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  ابحث بالمعنى أو بالكلمات، وستجد ما تبحث عنه في ثوانٍ
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">شرح بالذكاء الاصطناعي</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  احصل على شرح مفصل وتحليل أدبي عميق لكل بيت شعري
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">تجربة قراءة فاخرة</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  استمتع بقراءة هادئة مع تصميم مريح للعين وخطوط عربية أنيقة
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Poets */}
        <FeaturedPoets />

        {/* Trending Verses */}
        <TrendingVerses />

        {/* Daily Verse */}
        <DailyVerse />

        {/* Categories */}
        <Categories />

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ابدأ رحلتك في عالم الشعر
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                انضم إلى آلاف المهتمين بالشعر العربي واستكشف كنوز الأدب العربي
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/search" 
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  ابدأ البحث الآن
                </a>
                <a 
                  href="/discover" 
                  className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                >
                  استكشف المجموعات
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
