import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-xl font-bold">د</span>
              </div>
              <span className="text-xl font-semibold">ديوان</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              منصة رقمية فاخرة لاستكشاف الشعر العربي وفهمه بعمق
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">استكشف</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground transition-colors">البحث</Link></li>
              <li><Link href="/poets" className="hover:text-foreground transition-colors">الشعراء</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">التصنيفات</Link></li>
              <li><Link href="/discover" className="hover:text-foreground transition-colors">اكتشف</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">المميزات</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/ai" className="hover:text-foreground transition-colors">الشرح بالذكاء الاصطناعي</Link></li>
              <li><Link href="/meanings" className="hover:text-foreground transition-colors">معاني الكلمات</Link></li>
              <li><Link href="/analysis" className="hover:text-foreground transition-colors">التحليل الأدبي</Link></li>
              <li><Link href="/collections" className="hover:text-foreground transition-colors">المجموعات</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">عن ديوان</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">تواصل معنا</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">الشروط</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ديوان. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-muted-foreground font-serif">
            {"«"} وما الشعرُ إلا صورةٌ من حياتنا {"»"}
          </p>
        </div>
      </div>
    </footer>
  )
}
