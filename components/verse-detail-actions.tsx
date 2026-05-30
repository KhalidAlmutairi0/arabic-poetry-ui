'use client'

import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { toast } from 'sonner'

export function VerseDetailActions({ text }: { text: string }) {
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

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'بيت من قافية', text, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('تم نسخ رابط البيت')
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-surface px-5 py-2.5 text-sm font-medium text-gold-light transition-all duration-200 hover:bg-surface-elevated"
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        نسخ البيت
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-[var(--border-strong)] hover:text-text-primary"
      >
        <Share2 className="size-4" />
        مشاركة
      </button>
    </div>
  )
}
