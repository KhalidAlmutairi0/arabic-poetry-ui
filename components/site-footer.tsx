import Link from 'next/link'
import { ERA_ORDER, ERA_LABELS } from '@/lib/data'

const NAV = [
  { href: '/search', label: 'البحث' },
  { href: '/poets', label: 'الشعراء' },
  { href: '/discover', label: 'استكشف' },
  { href: '/categories', label: 'التصنيفات' },
]

const TOPICS = [
  { q: 'حكمة', label: 'حكمة' },
  { q: 'غزل', label: 'غزل' },
  { q: 'فخر', label: 'فخر' },
  { q: 'رثاء', label: 'رثاء' },
  { q: 'مديح', label: 'مديح' },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="font-logo text-[30px] font-bold text-gold-primary"
              style={{ textShadow: '0 0 20px rgba(200,164,85,0.15)' }}
            >
              قافية
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              ديوانٌ رقميٌّ يجمع تراث الشعر العربي عبر العصور، بشروحاتٍ ذكية وبحثٍ
              دلاليّ يقرّب الكلمة من قارئها.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">التصفّح</h3>
            <ul className="flex flex-col gap-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Eras */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">العصور الأدبية</h3>
            <ul className="flex flex-col gap-3">
              {ERA_ORDER.slice(0, 6).map((era) => (
                <li key={era}>
                  <Link
                    href={`/poets?era=${era}`}
                    className="text-sm text-text-secondary transition-colors hover:text-gold-light"
                  >
                    {ERA_LABELS[era]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">أغراض الشعر</h3>
            <ul className="flex flex-col gap-3">
              {TOPICS.map((t) => (
                <li key={t.q}>
                  <Link
                    href={`/search?q=${encodeURIComponent(t.q)}`}
                    className="text-sm text-text-secondary transition-colors hover:text-gold-light"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            قافية · ١٤٣٬٠٠٠+ قصيدة · ٦٬٨٠٠+ شاعر · ١٠ عصور
          </p>
          <p className="font-serif text-sm text-gold-muted">«وما اللذّةُ إلّا بعد التعب»</p>
        </div>
      </div>
    </footer>
  )
}
