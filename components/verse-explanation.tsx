'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Explanations {
  simple: string
  literary: string
  linguistic: string
}

const TABS = [
  { id: 'simple', label: 'تبسيط' },
  { id: 'literary', label: 'تحليل أدبي' },
  { id: 'linguistic', label: 'تحليل لغوي' },
] as const

function Streamer({ text }: { text: string }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef(text)

  useEffect(() => {
    ref.current = text
    setShown('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 2
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 18)
    return () => clearInterval(id)
  }, [text])

  return (
    <p
      className={cn(
        'font-serif text-lg leading-loose text-text-secondary',
        !done && 'typing-cursor',
      )}
    >
      {shown}
    </p>
  )
}

export function VerseExplanation({ explanations }: { explanations: Explanations }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('simple')

  return (
    <section className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-gold-light">
        <Sparkles className="size-5 text-gold-primary" />
        شرح البيت
      </h2>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
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
            <Streamer text={explanations[t.id]} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
