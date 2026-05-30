'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/search', label: 'البحث' },
  { href: '/poets', label: 'الشعراء' },
  { href: '/discover', label: 'استكشف' },
  { href: '/categories', label: 'التصنيفات' },
]

function Logo() {
  return (
    <Link
      href="/"
      className="font-logo text-[28px] font-bold leading-none text-gold-primary"
      style={{ textShadow: '0 0 20px rgba(200,164,85,0.15)' }}
    >
      قافية
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-surface-elevated text-gold-light'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/search')}
            className="group hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm text-text-muted transition-all duration-200 hover:border-[var(--border-strong)] hover:text-text-secondary sm:flex"
            aria-label="ابحث في الدواوين"
          >
            <Search className="size-4" />
            <span>ابحث في الدواوين…</span>
            <kbd className="rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 font-sans text-[11px] text-text-muted">
              /
            </kbd>
          </button>

          <Link
            href="/search"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-gold-light sm:hidden"
            aria-label="البحث"
          >
            <Search className="size-5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all duration-200 hover:text-gold-light md:hidden"
                aria-label="القائمة"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="border-border bg-surface">
              <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
              <div className="px-2 pb-4 pt-2">
                <span
                  className="font-logo text-[28px] font-bold text-gold-primary"
                  style={{ textShadow: '0 0 20px rgba(200,164,85,0.15)' }}
                >
                  قافية
                </span>
              </div>
              <nav className="flex flex-col gap-1 px-2">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + '/')
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-xl px-4 py-3 text-base font-medium transition-colors',
                        active
                          ? 'bg-surface-elevated text-gold-light'
                          : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
