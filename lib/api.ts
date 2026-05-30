/**
 * قافية — API client connecting to the FastAPI backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const V1 = `${API_BASE}/api/v1`

interface NextFetchConfig {
  revalidate?: number | false
  tags?: string[]
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: NextFetchConfig },
): Promise<T | null> {
  try {
    const res = await fetch(`${V1}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

// ─── Poems ───

export async function getPoem(slug: string) {
  return apiFetch<any>(`/poems/${slug}`, {
    next: { revalidate: 86400, tags: [`poem-${slug}`] },
  })
}

// ─── Poets ───

export async function getPoets(params?: { era?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.era) qs.set('era', params.era)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch<any>(`/poets/${query}`, {
    next: { revalidate: 60, tags: ['poets'] },
  })
}

export async function getPoet(slug: string) {
  return apiFetch<any>(`/poets/${slug}`, {
    next: { revalidate: 86400, tags: [`poet-${slug}`] },
  })
}

export async function getPoetPoems(slug: string, page = 1, limit = 20) {
  return apiFetch<any>(`/poets/${slug}/poems?page=${page}&limit=${limit}`, {
    next: { revalidate: 3600, tags: [`poet-poems-${slug}`] },
  })
}

// ─── Verses ───

export async function getVerse(id: string) {
  return apiFetch<any>(`/verses/${id}`, {
    next: { revalidate: 86400, tags: [`verse-${id}`] },
  })
}

export async function getFamousVerses(limit = 5) {
  return apiFetch<any[]>(`/verses/famous?limit=${limit}`, {
    next: { revalidate: 3600, tags: ['famous'] },
  })
}

export async function getRelatedVerses(verseId: string, limit = 4) {
  return apiFetch<{ related: any[] }>(`/verses/${verseId}/related?limit=${limit}`, {
    next: { revalidate: 3600 },
  })
}

// ─── Search ───

export async function searchPoetry(params: {
  q: string
  mode?: string
  era?: string
  is_famous?: boolean
  page?: number
  limit?: number
}) {
  const qs = new URLSearchParams({ q: params.q })
  if (params.mode) qs.set('mode', params.mode)
  if (params.era) qs.set('era', params.era)
  if (params.is_famous != null) qs.set('is_famous', String(params.is_famous))
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  return apiFetch<any>(`/search/?${qs}`)
}

// ─── Categories ───

export async function getCategories() {
  return apiFetch<any[]>('/categories/', {
    next: { revalidate: 86400, tags: ['categories'] },
  })
}

// ─── AI Explanation SSE URL ───

export function getExplanationStreamUrl(
  verseId: string,
  type: 'simple' | 'literary' | 'linguistic' = 'simple',
): string {
  return `${V1}/ai/verses/${verseId}/explain?type=${type}`
}
