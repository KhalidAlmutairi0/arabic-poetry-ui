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

          {/* Eras */}
          <div>
            <h4 className="font-semibold mb-4">العصور الشعرية</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/poets?era=pre_islamic" className="hover:text-foreground transition-colors">الشعر الجاهلي</Link></li>
              <li><Link href="/poets?era=abbasid" className="hover:text-foreground transition-colors">الشعر العباسي</Link></li>
              <li><Link href="/poets?era=andalusian" className="hover:text-foreground transition-colors">الشعر الأندلسي</Link></li>
              <li><Link href="/poets?era=modern" className="hover:text-foreground transition-colors">الشعر الحديث</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-semibold mb-4">المزيد</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/search?q=%D8%AD%D9%83%D9%85%D8%A9" className="hover:text-foreground transition-colors">أبيات حكمة</Link></li>
              <li><Link href="/search?q=%D8%BA%D8%B2%D9%84" className="hover:text-foreground transition-colors">شعر الغزل</Link></li>
              <li><Link href="/search?q=%D9%81%D8%AE%D8%B1" className="hover:text-foreground transition-colors">شعر الفخر</Link></li>
              <li><Link href="/search?q=%D8%B1%D8%AB%D8%A7%D8%A1" className="hover:text-foreground transition-colors">شعر الرثاء</Link></li>
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
