import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Heart, Feather, Sword, Moon, Mountain, BookOpen, ArrowLeft, Star } from "lucide-react"
import { getCategories } from "@/lib/api"

// Map icon names from backend to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  heart: Heart,
  feather: Feather,
  sword: Sword,
  moon: Moon,
  mountain: Mountain,
  book: BookOpen,
  star: Star,
  default: BookOpen,
}

// Color palette for categories
const COLORS = [
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-red-500/10 text-red-600 dark:text-red-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "bg-pink-500/10 text-pink-600 dark:text-pink-400",
]

// Fallback categories
const FALLBACK_CATEGORIES = [
  { id: "1", name_ar: "الغزل والحب", name_en: "Love", slug: "love", icon: "heart", color: null, description_ar: "أجمل ما قيل في الحب والعشق والهوى", poem_count: 4523 },
  { id: "2", name_ar: "الحكمة", name_en: "Wisdom", slug: "wisdom", icon: "book", color: null, description_ar: "حكم وأمثال من تجارب الشعراء", poem_count: 3891 },
  { id: "3", name_ar: "الفخر والحماسة", name_en: "Pride", slug: "pride", icon: "sword", color: null, description_ar: "قصائد العزة والشجاعة والكرامة", poem_count: 2876 },
  { id: "4", name_ar: "وصف الطبيعة", name_en: "Nature", slug: "nature", icon: "mountain", color: null, description_ar: "جماليات الطبيعة في عيون الشعراء", poem_count: 2134 },
  { id: "5", name_ar: "الرثاء", name_en: "Elegy", slug: "elegy", icon: "moon", color: null, description_ar: "مراثٍ تخلد ذكرى الراحلين", poem_count: 1876 },
  { id: "6", name_ar: "الهجاء", name_en: "Satire", slug: "satire", icon: "feather", color: null, description_ar: "فن النقد الساخر واللاذع", poem_count: 1543 },
]

export default async function CategoriesPage() {
  const apiCategories = await getCategories()
  const categories = apiCategories ?? FALLBACK_CATEGORIES

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="py-12 lg:py-16 bg-secondary/30 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">التصنيفات</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              تصفح الأبيات والقصائد حسب الموضوعات الشعرية المختلفة
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent =
                ICON_MAP[category.icon?.toLowerCase() ?? ""] ?? ICON_MAP.default
              const colorClass = COLORS[index % COLORS.length]

              return (
                <Link
                  key={category.id}
                  href={`/search?q=${encodeURIComponent(category.name_ar)}`}
                  className="group p-8 bg-card rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all"
                >
                  <div
                    className={`inline-flex p-4 rounded-xl ${colorClass} mb-5 transition-transform group-hover:scale-110`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {category.name_ar}
                  </h2>
                  {category.description_ar && (
                    <p className="text-muted-foreground text-sm mb-4">
                      {category.description_ar}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">
                      {category.poem_count.toLocaleString("ar-SA")} بيت
                    </span>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
