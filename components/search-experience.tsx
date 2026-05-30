'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, BookOpen, Star, Sparkles, Type, Brain, X } from 'lucide-react'
import { searchPoetry } from '@/lib/api'
import {
  eraLabel,
  ERA_ORDER,
  toArabicNumerals,
  groupHitsByPoem,
} from '@/lib/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const MODES = [
  { id: 'smart', label: 'ذكي', icon: Sparkles },
  { id: 'text', label: 'نص', icon: Type },
  { id: 'meaning', label: 'معنى', icon: Brain },
] as const

export function SearchExperience({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('smart')
  const [era, setEra] = useState<string>('all')
  const [famousOnly, setFamousOnly] = useState(false)

  const [groups, setGroups] = useState<ReturnType<typeof groupHitsByPoem>>([])
  const [totalMatches, setTotalMatches] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useMemo(() => {
    if (!query.trim()) {
      setGroups([])
      setTotalMatches(0)
      return
    }
    setIsLoading(true)
    const modeMap: Record<string, string> = { smart: 'hybrid', text: 'keyword', meaning: 'semantic' }
    searchPoetry({
      q: query,
      mode: modeMap[mode] || 'hybrid',
      era: era !== 'all' ? era : undefined,
      is_famous: famousOnly || undefined,
      limit: 20,
    }).then((data) => {
      if (data?.hits) {
        const g = groupHitsByPoem(data.hits)
        setGroups(g)
        setTotalMatches(data.estimated_total_hits || data.hits.length)
      } else {
        setGroups([])
        setTotalMatches(0)
      }
      setIsLoading(false)
    })
  }, [query, mode, era, famousOnly])

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-16 z-40 -mx-4 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              router.replace(
                e.target.value ? `/search?q=${encodeURIComponent(e.target.value)}` : '/search',
                { scroll: false },
              )
            }}
            placeholder="ابحث عن بيتٍ أو شاعرٍ أو معنى…"
            className="w-full rounded-2xl border border-border bg-surface py-3.5 pr-12 pl-12 font-serif text-lg text-text-primary outline-none transition-all duration-200 placeholder:font-sans placeholder:text-base placeholder:text-text-muted focus:border-[var(--border-strong)]"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                router.replace('/search', { scroll: false })
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-gold-light"
              aria-label="مسح البحث"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
            {MODES.map((m) => {
              const Icon = m.icon
              const active = mode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-gold-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  <Icon className="size-3.5" />
                  {m.label}
                </button>
              )
            })}
          </div>

          <Select value={era} onValueChange={setEra}>
            <SelectTrigger className="w-36 rounded-full border-border bg-surface text-text-secondary">
              <SelectValue placeholder="كل العصور" />
            </SelectTrigger>
            <SelectContent className="border-border bg-surface text-text-primary">
              <SelectItem value="all">كل العصور</SelectItem>
              {ERA_ORDER.map((e) => (
                <SelectItem key={e} value={e}>
                  {eraLabel(e)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => setFamousOnly((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200',
              famousOnly
                ? 'border-[var(--border-strong)] bg-[rgba(200,164,85,0.08)] text-gold-light'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary',
            )}
          >
            <Star className={cn('size-3.5', famousOnly && 'fill-gold-primary text-gold-primary')} />
            المشهورة فقط
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-text-muted">
        {query ? (
          <>
            {toArabicNumerals(totalMatches)} نتيجة في {toArabicNumerals(groups.length)} قصيدة
            {' '}لـ «<span className="text-gold-light">{query}</span>»
          </>
        ) : (
          <>اكتب كلمةً للبحث، أو تصفّح {toArabicNumerals(totalMatches)} بيتٍ متاح</>
        )}
      </p>

      {/* Results */}
      <div className="mt-4 grid gap-4">
        {groups.map((g) => {
          const preview = g.matches[0]
          return (
            <Link
              key={g.poem_slug}
              href={`/poem/${g.poem_slug}`}
              className="group block rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-surface-elevated hover:shadow-lg hover:shadow-black/30 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated text-gold-primary">
                  <BookOpen className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl text-text-primary transition-colors group-hover:text-gold-light">
                      {g.poem_title_ar}
                    </h3>
                    {preview.is_famous && (
                      <Star className="size-4 fill-gold-primary text-gold-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {g.poet_name_ar} · {toArabicNumerals(g.matches.length)} أبيات مطابقة
                  </p>

                  <div className="mt-4 border-t border-border pt-4">
                    <p className="verse-text text-right text-lg text-gold-light">
                      {preview.hemistich_1}
                    </p>
                    <p className="verse-text text-right text-lg text-gold-light opacity-75">
                      {preview.hemistich_2}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {query && groups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
            <p className="font-serif text-xl text-text-secondary">لا توجد نتائج</p>
            <p className="mt-2 text-sm text-text-muted">
              جرّب كلماتٍ أخرى، أو تصفّح الشعراء والتصنيفات.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
