"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { autocomplete, type AutocompleteResponse } from "@/lib/api"

const SUGGESTIONS = [
  "قفا نبك من ذكرى حبيب ومنزل",
  "على قدر أهل العزم تأتي العزائم",
  "إذا الشعب يوماً أراد الحياة",
  "أنا البحر في أحشائه الدر كامن",
]

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [acResults, setAcResults] = useState<AutocompleteResponse | null>(null)
  const [acLoading, setAcLoading] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // Autocomplete fetch with debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setAcResults(null)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setAcLoading(true)
      try {
        const data = await autocomplete(query)
        setAcResults(data)
      } finally {
        setAcLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSuggestion = (s: string) => {
    setQuery(s)
    setIsFocused(false)
    router.push(`/search?q=${encodeURIComponent(s)}`)
  }

  const showDropdown =
    isFocused &&
    query.length >= 2 &&
    (acResults?.verses?.length || acResults?.poets?.length)

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div ref={dropdownRef} className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`
            relative flex items-center bg-card border-2 rounded-2xl transition-all duration-300
            ${
              isFocused
                ? "border-accent shadow-lg shadow-accent/10"
                : "border-border hover:border-border/80"
            }
          `}
        >
          <Search className="absolute right-5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="ابحث عن بيت شعر، قصيدة، أو شاعر..."
            className="w-full py-5 px-14 bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute left-3 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2 disabled:opacity-70"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>ابحث</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && (
          <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            {acLoading && (
              <div className="p-3 flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري البحث...</span>
              </div>
            )}

            {acResults?.verses?.length ? (
              <div>
                <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground font-medium">أبيات</p>
                {acResults.verses.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSuggestion(v.full_verse)
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-secondary/50 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-sm font-serif line-clamp-1">{v.full_verse}</span>
                    <span className="text-xs text-muted-foreground">{v.poet_name_ar}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {acResults?.poets?.length ? (
              <div className="border-t border-border/50">
                <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground font-medium">شعراء</p>
                {acResults.poets.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      router.push(`/poet/${p.slug}`)
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-secondary/50 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-sm font-serif font-bold">{p.name_ar.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{p.name_ar}</span>
                      {p.era && (
                        <span className="mr-2 text-xs text-muted-foreground">{p.era}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </form>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="text-sm text-muted-foreground ml-2">جرّب:</span>
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestion(suggestion)}
            className="px-3 py-1.5 text-sm bg-secondary/50 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors duration-200 truncate max-w-[200px]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
