'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface PoemActionsProps {
  title: string
  poet: string
  fullText: string
}

export function PoemActions({ title, poet, fullText }: PoemActionsProps) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = { title: `${title} — ${poet}`, text: `${title} — ${poet}`, url }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('تم نسخ رابط القصيدة')
      }
    } catch {
      /* user cancelled share */
    }
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(`${title}\n${poet}\n\n${fullText}`)
      setCopied(true)
      toast.success('تم نسخ القصيدة كاملة')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error('تعذّر النسخ')
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={share}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-surface px-5 py-2.5 text-sm font-medium text-gold-light transition-all duration-200 hover:bg-surface-elevated"
      >
        <Share2 className="size-4" />
        مشاركة
      </button>
      <button
        onClick={copyAll}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-text-primary"
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        نسخ الكل
      </button>
    </div>
  )
}
