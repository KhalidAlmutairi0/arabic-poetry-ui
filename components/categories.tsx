import Link from "next/link"
import { Heart, Feather, Sword, Moon, Mountain, BookOpen, Star } from "lucide-react"
import { getCategories } from "@/lib/api"

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

const COLORS = [
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-red-500/10 text-red-600 dark:text-red-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
]

const FALLBACK = [
  { id: "1", name_ar: "الغزل والحب", slug: "love", icon: "heart", poem_count: 4523, description_ar: null, name_en: null, color: null },
  { id: "2", name_ar: "الحكمة", slug: "wisdom", icon: "book", poem_count: 3891, description_ar: null, name_en: null, color: null },
  { id: "3", name_ar: "الفخر والحماسة", slug: "pride", icon: "sword", poem_count: 2876, description_ar: null, name_en: null, color: null },
  { id: "4", name_ar: "وصف الطبيعة", slug: "nature", icon: "mountain", poem_count: 2134, description_ar: null, name_en: null, color: null },
  { id: "5", name_ar: "الرثاء", slug: "elegy", icon: "moon", poem_count: 1876, description_ar: null, name_en: null, color: null },
  { id: "6", name_ar: "الهجاء", slug: "satire", icon: "feather", poem_count: 1543, description_ar: null, name_en: null, color: null },
]

export async function Categories() {
  const apiCategories = await getCategories()
  const categories = (apiCategories ?? FALLBACK).slice(0, 6)

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-3">استكشف حسب الموضوع</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            تصفح الأبيات والقصائد حسب الموضوعات الشعرية المختلفة
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent =
              ICON_MAP[category.icon?.toLowerCase() ?? ""] ?? ICON_MAP.default
            const colorClass = COLORS[index % COLORS.length]

            return (
              <Link
                key={category.id}
                href={`/search?q=${encodeURIComponent(category.name_ar)}`}
                className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`p-3 rounded-xl ${colorClass} mb-4 transition-transform group-hover:scale-110`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-center mb-1">{category.name_ar}</h3>
                <p className="text-xs text-muted-foreground">
                  {category.poem_count.toLocaleString("ar-SA")} بيت
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
