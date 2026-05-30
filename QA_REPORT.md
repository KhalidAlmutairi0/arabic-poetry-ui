# QA Report — arabic-poetry-ui (ديوان)

**Date**: 2026-05-30
**Codebase**: Next.js 16 frontend (standalone UI repo)
**Backend**: FastAPI at `arabic-poetry` repo (fixes already applied)

---

## Summary

| Metric | Count |
|--------|-------|
| Total issues found | **21** |
| Critical (must fix before launch) | **5** |
| Medium (fix soon) | **9** |
| Minor (nice to fix) | **7** |

---

## Critical Issues

### C-01: Dead links — `/category/[id]`, `/collection/[id]`, `/era/[id]` routes don't exist
**Files**: `app/discover/page.tsx:173,194,210,237`

The Discover page links to:
- `/category/wisdom`, `/category/love`, `/category/pride` (6 links)
- `/collection/1`, `/collection/2`, etc. (4 links)
- `/era/jahili`, `/era/abbasi`, etc. (6 links)

**None of these routes exist.** Every click is a 404. This is 16 dead links on a single page.

**Fix**: Create these routes, or change links to use existing routes (e.g., `/search?q=...` or `/poets?era=...`).

---

### C-02: No `ThemeProvider` wrapper in layout — dark mode toggle is broken
**Files**: `app/layout.tsx`, `components/theme-provider.tsx`, `components/theme-toggle.tsx`

`ThemeProvider` component exists but is never used in `layout.tsx`. The `ThemeToggle` directly manipulates `document.documentElement.classList` which works, but:
- No SSR-safe theme detection (flash of wrong theme on load)
- `next-themes` is installed and `ThemeProvider` is written but not wired up
- The `.dark` CSS class variant is defined in `globals.css` but body never gets the class on SSR

**Fix**: Wrap `{children}` in `layout.tsx` with `<ThemeProvider attribute="class" defaultTheme="system">`.

---

### C-03: TypeScript build errors silently ignored
**File**: `next.config.mjs:3-5`

```javascript
typescript: { ignoreBuildErrors: true }
```

All type errors are swallowed. Runtime crashes from null access, wrong prop shapes, or missing fields won't be caught until they hit users.

**Fix**: Remove `ignoreBuildErrors: true` and fix the type errors.

---

### C-04: Fake engagement numbers displayed as real data
**File**: `components/trending-verses.tsx:31-32`

```tsx
const LIKES = [2847, 2156, 3421, 1987, 2654]
const COMMENTS = [156, 98, 234, 87, 145]
```

Hardcoded fake like/comment counts are rendered next to real verses from the API. Users see `٢,٨٤٧` likes on a verse that has no engagement system. This is misleading.

**Fix**: Remove the fake counts, or display actual `view_count` from the API.

---

### C-05: Homepage stats are hardcoded lies
**File**: `app/page.tsx:51-66`

```tsx
<p>١٢,٥٠٠+</p> <p>قصيدة</p>
<p>٨٥٠+</p> <p>شاعر</p>
<p>٥٠,٠٠٠+</p> <p>بيت شعري</p>
```

These numbers are hardcoded and may not match actual database counts. If the platform launches with 100 poems, showing "١٢,٥٠٠+" is deceptive.

**Fix**: Fetch real counts from a stats API endpoint, or remove the stats section until real data is available.

---

## Medium Issues

### M-01: No error boundaries — React errors crash entire page
No `error.tsx`, `loading.tsx`, or `not-found.tsx` files exist in the app directory. Any component error = white screen.

### M-02: Poem page uses client-side `use(params)` — breaks with React strict mode
**File**: `app/poem/[id]/page.tsx:21`
```tsx
const { id: slug } = use(params)
```
Using `use()` to unwrap the params Promise in a client component works but `useEffect` then fetches data client-side. This means no SSR, no SEO metadata, and a loading spinner for every poem page. The poet page does this correctly as a server component.

### M-03: Verse page has same client-side rendering issue
**File**: `app/verse/[id]/page.tsx:203`
Same as M-02 — no SSR, no metadata for individual verses. Search engines can't index verse content.

### M-04: `getTrendingVerses` uses `q=*` wildcard
**File**: `lib/api.ts:249`
```tsx
`/search/?q=*&is_famous=true&limit=${limit}&page=1`
```
The `*` is not a valid Meilisearch query. Falls back to PostgreSQL where `ILIKE '%*%'` searches for literal asterisk.

### M-05: Footer links to non-existent pages
**File**: `components/footer.tsx:36-39`
Links to `/ai`, `/meanings`, `/analysis`, `/collections`, `/about`, `/contact`, `/privacy`, `/terms` — none of these routes exist.

### M-06: Search results use `poet_slug` for links but route is `/poet/[id]`
**File**: `app/search/page.tsx:254`
```tsx
href={`/poet/${hit.poet_slug}`}
```
This works because the poet page treats the `[id]` param as a slug. But `hit.poet_slug` may be undefined for some search results (e.g., discovery results), causing a link to `/poet/undefined`.

### M-07: Discover page has entirely static data — not connected to API
**File**: `app/discover/page.tsx`
The "trending today" verses, curated lists, and era data are all hardcoded. No API calls. The page is decorative, not functional.

### M-08: No pagination on categories page
**File**: `app/categories/page.tsx`
All categories are displayed but category links go to `/search?q=category_name`. There's no `/categories/[slug]` route to show poems in a category.

### M-09: `Bookmark`, `Like`, `Share` buttons are non-functional
**Files**: `app/poem/[id]/page.tsx`, `app/verse/[id]/page.tsx`
Bookmark and Like toggle local state but never persist to any API. Share button doesn't call `navigator.share()`. Users click and nothing actually happens.

---

## Minor Issues

### m-01: `images: { unoptimized: true }` disables Next.js image optimization
**File**: `next.config.mjs:6`

### m-02: Unused `styles/` directory with old CSS
**File**: `styles/` directory exists but isn't imported anywhere.

### m-03: Duplicate `use-mobile` and `use-toast` hooks
Both exist in `hooks/` and `components/ui/`, creating import confusion.

### m-04: 70+ unused shadcn/ui component files
The `components/ui/` directory has ~70 component files (dialog, drawer, carousel, etc.) that are never imported. They add to bundle size during development.

### m-05: `@vercel/analytics` conditionally loaded but not in layout tree properly
**File**: `app/layout.tsx:67`
```tsx
{process.env.NODE_ENV === 'production' && <Analytics />}
```
This conditional works but `Analytics` should ideally always render (it no-ops in dev).

### m-06: Hardcoded `⌘K` keyboard shortcut hint but no keyboard handler
**File**: `components/header.tsx:59`
Shows `⌘K` keyboard shortcut UI but no keyboard event listener implements it.

### m-07: No `robots.txt` or `sitemap.xml` generation
No `app/robots.ts` or `app/sitemap.ts` files exist. Search engines have no guidance.

---

## Security Assessment

| Check | Status |
|-------|--------|
| XSS via dangerouslySetInnerHTML | **PASS** — not used anywhere |
| Input sanitization | PASS — all inputs are plain text, no HTML rendering |
| API key exposure | PASS — `.env.local` is gitignored |
| CORS | N/A — handled by backend |
| Auth | N/A — no auth in frontend |

---

## Recommendations — Priority Order

1. **Fix dead links on Discover page** (C-01) — 16 broken links, most visible page after home
2. **Wire up ThemeProvider** (C-02) — dark mode flashes on load
3. **Remove fake engagement numbers** (C-04) — misleading users
4. **Replace hardcoded stats** (C-05) — or remove until real data exists
5. **Add error boundaries** (M-01) — prevent white-screen crashes
6. **Convert poem/verse pages to server components** (M-02, M-03) — SEO critical
7. **Fix footer dead links** (M-05) — remove or point to real pages
8. **Add robots.ts and sitemap.ts** (m-07) — SEO basics

---

*Static analysis only — no runtime tests executed.*
