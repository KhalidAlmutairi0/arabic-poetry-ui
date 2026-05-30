'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, Sparkles, Star } from 'lucide-react'
import { toast } from 'sonner'
import type { Verse } from '@/lib/data'
import { toArabicNumerals } from '@/lib/data'
import { cn } from '@/lib/utils'

function CopyInline({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('تم نسخ البيت')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error('تعذّر النسخ')
    }
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-text-primary"
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      نسخ
    </button>
  )
}

export function VerseList({ verses }: { verses: Verse[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="flex flex-col">
      {verses.map((verse, i) => {
        const active = activeId === verse.id
        return (
          <div key={verse.id}>
            <div
              role="button"
              tabIndex={0}
              aria-expanded={active}
              onClick={() => setActiveId(active ? null : verse.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveId(active ? null : verse.id)
                }
              }}
              className={cn(
                'group relative cursor-pointer rounded-xl px-3 py-6 transition-all duration-200 sm:px-6',
                active ? 'bg-[rgba(200,164,85,0.06)]' : 'hover:bg-[rgba(200,164,85,0.04)]',
                verse.is_famous && 'border-r-2 border-r-gold-primary',
              )}
            >
              {verse.is_famous && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[var(--border-strong)] bg-[rgba(200,164,85,0.08)] px-2 py-0.5 text-[11px] font-medium text-gold-light sm:left-6">
                  <Star className="size-3 fill-gold-primary text-gold-primary" />
                  مشهور
                </span>
              )}

              {/* verse number */}
              <span className="absolute right-1 top-1/2 hidden -translate-y-1/2 font-sans text-xs text-text-muted sm:block">
                {toArabicNumerals(verse.position)}
              </span>

              {/* Desktop: two hemistiches side by side */}
              <div className="hidden items-center md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
                <p className="verse-text text-right text-[length:clamp(1.25rem,2.4vw,1.6rem)] text-gold-light">
                  {verse.hemistich_1}
                </p>
                <span className="h-8 w-px bg-[var(--border-strong)]" aria-hidden="true" />
                <p className="verse-text text-left text-[length:clamp(1.25rem,2.4vw,1.6rem)] text-gold-light opacity-75">
                  {verse.hemistich_2}
                </p>
              </div>

              {/* Mobile: stacked */}
              <div className="flex flex-col items-center gap-3 md:hidden">
                <p className="verse-text text-center text-[length:clamp(1.25rem,5vw,1.6rem)] text-gold-light">
                  {verse.hemistich_1}
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-muted" aria-hidden="true" />
                <p className="verse-text text-center text-[length:clamp(1.25rem,5vw,1.6rem)] text-gold-light opacity-80">
                  {verse.hemistich_2}
                </p>
              </div>

              {/* Expanded actions */}
              {active && (
                <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={`/verse/${verse.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-xl bg-gold-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
                  >
                    <Sparkles className="size-4" />
                    شرح البيت
                  </Link>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CopyInline text={verse.full_verse} />
                  </div>
                </div>
              )}
            </div>

            {i < verses.length - 1 && (
              <div className="mx-auto h-px w-full bg-[rgba(200,164,85,0.08)]" />
            )}
          </div>
        )
      })}
    </div>
  )
}
