'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type ExplainTab = 'simple' | 'literary' | 'linguistic'

const TABS = [
  { id: 'simple' as const, label: 'تبسيط' },
  { id: 'literary' as const, label: 'تحليل أدبي' },
  { id: 'linguistic' as const, label: 'تحليل لغوي' },
]

export function VerseExplanation({
  verseId,
  preloaded,
}: {
  verseId: string
  preloaded?: Record<string, string>
}) {
  const [tab, setTab] = useState<ExplainTab>('simple')
  const [texts, setTexts] = useState<Record<ExplainTab, string>>({
    simple: preloaded?.simple || '',
    literary: preloaded?.literary || '',
    linguistic: preloaded?.linguistic || '',
  })
  const [loading, setLoading] = useState<Record<ExplainTab, boolean>>({
    simple: false, literary: false, linguistic: false,
  })
  const [started, setStarted] = useState<Record<ExplainTab, boolean>>({
    simple: !!preloaded?.simple,
    literary: !!preloaded?.literary,
    linguistic: !!preloaded?.linguistic,
  })
  const abortRefs = useRef<Record<ExplainTab, AbortController | null>>({
    simple: null, literary: null, linguistic: null,
  })

  const streamExplanation = useCallback(async (type: ExplainTab) => {
    if (started[type] && texts[type]) return

    abortRefs.current[type]?.abort()
    const ctrl = new AbortController()
    abortRefs.current[type] = ctrl

    setStarted(p => ({ ...p, [type]: true }))
    setLoading(p => ({ ...p, [type]: true }))
    setTexts(p => ({ ...p, [type]: '' }))

    try {
      const res = await fetch(`/api/v1/ai/verses/${verseId}/explain?type=${type}`, {
        signal: ctrl.signal,
      })
      if (!res.ok || !res.body) {
        setTexts(p => ({ ...p, [type]: 'حدث خطأ أثناء توليد الشرح. تأكد من تشغيل الخادم.' }))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const json = JSON.parse(line.slice(6))
            if (json.done) break
            if (json.text) {
              setTexts(p => ({ ...p, [type]: p[type] + json.text }))
            }
            if (json.error) {
              setTexts(p => ({ ...p, [type]: json.error }))
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setTexts(p => ({ ...p, [type]: 'حدث خطأ أثناء الاتصال بالخادم.' }))
      }
    } finally {
      setLoading(p => ({ ...p, [type]: false }))
    }
  }, [verseId, started, texts])

  const handleTab = (type: ExplainTab) => {
    setTab(type)
    if (!started[type]) streamExplanation(type)
  }

  const regenerate = (type: ExplainTab) => {
    setStarted(p => ({ ...p, [type]: false }))
    setTexts(p => ({ ...p, [type]: '' }))
    setTimeout(() => streamExplanation(type), 50)
  }

  return (
    <section className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-gold-light">
        <Sparkles className="size-5 text-gold-primary" />
        شرح البيت
      </h2>

      <Tabs value={tab} onValueChange={(v) => handleTab(v as ExplainTab)}>
        <TabsList className="mb-6 flex w-full gap-1 rounded-full border border-border bg-surface p-1">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="flex-1 rounded-full text-sm font-medium text-text-secondary transition-all data-[state=active]:bg-gold-primary data-[state=active]:text-primary-foreground"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id} className="mt-0">
            {!started[t.id] ? (
              <button
                onClick={() => streamExplanation(t.id)}
                className="flex items-center gap-2 rounded-xl bg-[rgba(200,164,85,0.08)] px-4 py-2.5 text-sm font-medium text-gold-light transition-all hover:bg-[rgba(200,164,85,0.15)]"
              >
                <Sparkles className="size-4" />
                توليد الشرح
              </button>
            ) : (
              <div>
                <p className={cn(
                  'font-serif text-lg leading-loose text-text-secondary',
                  loading[t.id] && 'typing-cursor',
                )}>
                  {texts[t.id]}
                </p>
                {!loading[t.id] && texts[t.id] && (
                  <button
                    onClick={() => regenerate(t.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-gold-light"
                  >
                    <RefreshCw className="size-3" />
                    توليد شرح آخر
                  </button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
