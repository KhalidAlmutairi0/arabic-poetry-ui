import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { 
  Heart, 
  Feather, 
  Sword, 
  Moon, 
  Mountain, 
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"

// Collections data
const collections = [
  {
    id: "wisdom",
    name: "حكم وأمثال",
    description: "أبيات خالدة تحمل حكمة الأجيال",
    count: 245,
    icon: BookOpen,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    featured: true,
  },
  {
    id: "love",
    name: "في الحب والغزل",
    description: "أجمل ما قيل في الحب والعشق",
    count: 312,
    icon: Heart,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    featured: true,
  },
  {
    id: "pride",
    name: "الفخر والحماسة",
    description: "قصائد العزة والكرامة",
    count: 189,
    icon: Sword,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    featured: true,
  },
  {
    id: "nature",
    name: "وصف الطبيعة",
    description: "جماليات الطبيعة بعيون الشعراء",
    count: 156,
    icon: Mountain,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    featured: false,
  },
  {
    id: "elegy",
    name: "الرثاء",
    description: "مراثٍ تخلد ذكرى الراحلين",
    count: 134,
    icon: Moon,
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    featured: false,
  },
  {
    id: "satire",
    name: "الهجاء",
    description: "فن النقد اللاذع",
    count: 98,
    icon: Feather,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    featured: false,
  },
]

// Curated lists
const curatedLists = [
  {
    id: 1,
    title: "أبيات للتأمل الصباحي",
    description: "ابدأ يومك بحكمة الشعراء",
    versesCount: 30,
    image: "morning",
  },
  {
    id: 2,
    title: "أجمل ما قيل في الصداقة",
    description: "قصائد تحتفي برفقة الأصدقاء",
    versesCount: 25,
    image: "friendship",
  },
  {
    id: 3,
    title: "شعر للأوقات الصعبة",
    description: "كلمات تمنحك القوة والأمل",
    versesCount: 40,
    image: "strength",
  },
  {
    id: 4,
    title: "روائع الشعر الجاهلي",
    description: "أصالة اللغة وقوة التعبير",
    versesCount: 50,
    image: "classic",
  },
]

// Eras
const eras = [
  { id: "jahili", name: "العصر الجاهلي", period: "قبل الإسلام", poets: 45 },
  { id: "islami", name: "العصر الإسلامي", period: "1-40 هـ", poets: 32 },
  { id: "umawi", name: "العصر الأموي", period: "41-132 هـ", poets: 58 },
  { id: "abbasi", name: "العصر العباسي", period: "132-656 هـ", poets: 124 },
  { id: "andalusi", name: "العصر الأندلسي", period: "92-897 هـ", poets: 87 },
  { id: "hadith", name: "العصر الحديث", period: "1800م - الآن", poets: 156 },
]

// Trending verses for discovery
const trendingToday = [
  {
    id: 1,
    verse: "ألا ليت الشباب يعود يوماً",
    poet: "أبو العتاهية",
    likes: 1234,
  },
  {
    id: 2,
    verse: "وما من كاتب إلا سيفنى",
    poet: "علي بن أبي طالب",
    likes: 987,
  },
  {
    id: 3,
    verse: "تعلم فليس المرء يولد عالماً",
    poet: "الشافعي",
    likes: 876,
  },
]

export default function DiscoverPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm text-accent font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                اكتشف عوالم الشعر
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">استكشف الشعر العربي</h1>
              <p className="text-muted-foreground text-lg">
                تصفح المجموعات المنسقة والموضوعات الشعرية واكتشف كنوز الأدب العربي
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Collections */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-semibold">مجموعات مميزة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.filter(c => c.featured).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/category/${collection.id}`}
                  className="group relative p-8 bg-card rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className={`inline-flex p-3 rounded-xl ${collection.color} mb-4 transition-transform group-hover:scale-110`}>
                    <collection.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{collection.description}</p>
                  <p className="text-sm font-medium text-accent">{collection.count} بيت</p>
                </Link>
              ))}
            </div>
          </section>

          {/* All Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">جميع الموضوعات</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {collections.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-xl ${category.color} mb-3 transition-transform group-hover:scale-110`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-sm text-center">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{category.count} بيت</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Curated Lists */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">قوائم منسقة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {curatedLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/collection/${list.id}`}
                  className="group p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                    {list.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{list.description}</p>
                  <p className="text-xs text-accent font-medium">{list.versesCount} بيت</p>
                </Link>
              ))}
            </div>
          </section>

          {/* By Era */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">حسب العصر الأدبي</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eras.map((era) => (
                <Link
                  key={era.id}
                  href={`/era/${era.id}`}
                  className="group flex items-center justify-between p-5 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="font-semibold group-hover:text-accent transition-colors">{era.name}</h3>
                    <p className="text-sm text-muted-foreground">{era.period}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">{era.poets}</p>
                    <p className="text-xs text-muted-foreground">شاعر</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Trending Today */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-semibold">رائج اليوم</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingToday.map((verse, index) => (
                <Link
                  key={verse.id}
                  href={`/verse/${verse.id}`}
                  className="group p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-serif text-lg leading-relaxed text-verse mb-3 line-clamp-2">
                        {verse.verse}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{verse.poet}</p>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          {verse.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Daily Inspiration CTA */}
          <section>
            <div className="p-8 lg:p-12 bg-secondary/30 rounded-2xl text-center">
              <Clock className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">بيت اليوم</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                احصل على بيت شعري جديد كل يوم لإلهامك وتعميق معرفتك بالشعر العربي
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                اطلع على بيت اليوم
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
