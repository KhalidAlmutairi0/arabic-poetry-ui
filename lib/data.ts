// ===== Types =====
export interface Verse {
  id: string
  position: number
  hemistich_1: string
  hemistich_2: string
  full_verse: string
  is_famous: boolean
}

export interface Category {
  id: string
  name_ar: string
  slug: string
}

export interface PoetRef {
  id: string
  name_ar: string
  slug: string
  era: string | null
}

export interface Poem {
  id: string
  title_ar: string
  slug: string
  meter: string | null
  era: string | null
  view_count: number
  poet: PoetRef
  categories: Category[]
  verses: Verse[]
}

export interface Poet {
  id: string
  name_ar: string
  name_en: string
  slug: string
  era: string | null
  birthplace: string | null
  dates: string | null
  bio: string
  poem_count: number
  verse_count: number
  famous_verses: { id: string; hemistich_1: string; hemistich_2: string; poem_slug: string }[]
  poems: { id: string; title_ar: string; slug: string; verse_count: number; meter: string | null }[]
}

export interface SearchHit {
  id: string
  hemistich_1: string
  hemistich_2: string
  full_verse: string
  poet_name_ar: string
  poem_title_ar: string
  poem_slug: string
  poet_slug: string
  is_famous: boolean
}

// ===== Era labels =====
export const ERA_LABELS: Record<string, string> = {
  pre_islamic: 'الجاهلي',
  islamic_early: 'صدر الإسلام',
  umayyad: 'الأموي',
  abbasid: 'العباسي',
  andalusian: 'الأندلسي',
  mamluk: 'المملوكي',
  ottoman: 'العثماني',
  modern: 'الحديث',
  contemporary: 'المعاصر',
}

export const ERA_ORDER: string[] = [
  'pre_islamic',
  'islamic_early',
  'umayyad',
  'abbasid',
  'andalusian',
  'mamluk',
  'ottoman',
  'modern',
  'contemporary',
]

export function eraLabel(era: string | null | undefined): string {
  if (!era) return ''
  return ERA_LABELS[era] ?? era
}

// ===== Arabic numerals =====
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
export function toArabicNumerals(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)])
}
export function formatCount(n: number): string {
  return toArabicNumerals(n.toLocaleString('en-US'))
}

// ===== Mock data =====
const mutanabbiVerses: Verse[] = [
  {
    id: 'v1',
    position: 1,
    hemistich_1: 'عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ',
    hemistich_2: 'وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ',
    full_verse: 'عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ',
    is_famous: true,
  },
  {
    id: 'v2',
    position: 2,
    hemistich_1: 'وَتَعظُمُ في عَينِ الصَغيرِ صِغارُها',
    hemistich_2: 'وَتَصغُرُ في عَينِ العَظيمِ العَظائِمُ',
    full_verse: 'وَتَعظُمُ في عَينِ الصَغيرِ صِغارُها وَتَصغُرُ في عَينِ العَظيمِ العَظائِمُ',
    is_famous: true,
  },
  {
    id: 'v3',
    position: 3,
    hemistich_1: 'يُكَلِّفُ سَيفُ الدَولَةِ الجَيشَ هَمَّهُ',
    hemistich_2: 'وَقَد عَجَزَت عَنهُ الجُيوشُ الخَضارِمُ',
    full_verse: 'يُكَلِّفُ سَيفُ الدَولَةِ الجَيشَ هَمَّهُ وَقَد عَجَزَت عَنهُ الجُيوشُ الخَضارِمُ',
    is_famous: false,
  },
  {
    id: 'v4',
    position: 4,
    hemistich_1: 'وَيَطلُبُ عِندَ الناسِ ما عِندَ نَفسِهِ',
    hemistich_2: 'وَذَلِكَ ما لا تَدَّعيهِ الضَراغِمُ',
    full_verse: 'وَيَطلُبُ عِندَ الناسِ ما عِندَ نَفسِهِ وَذَلِكَ ما لا تَدَّعيهِ الضَراغِمُ',
    is_famous: false,
  },
  {
    id: 'v5',
    position: 5,
    hemistich_1: 'هَلِ الحَدَثُ الحَمراءُ تَعرِفُ لَونَها',
    hemistich_2: 'وَتَعلَمُ أَيُّ الساقِيَينِ الغَمائِمُ',
    full_verse: 'هَلِ الحَدَثُ الحَمراءُ تَعرِفُ لَونَها وَتَعلَمُ أَيُّ الساقِيَينِ الغَمائِمُ',
    is_famous: false,
  },
  {
    id: 'v6',
    position: 6,
    hemistich_1: 'سَقَتها الغَمامُ الغُرُّ قَبلَ نُزولِهِ',
    hemistich_2: 'فَلَمّا دَنا مِنها سَقَتها الجَماجِمُ',
    full_verse: 'سَقَتها الغَمامُ الغُرُّ قَبلَ نُزولِهِ فَلَمّا دَنا مِنها سَقَتها الجَماجِمُ',
    is_famous: true,
  },
  {
    id: 'v7',
    position: 7,
    hemistich_1: 'فَأَوردَها خَوضَ الحِمامِ فَأَصدَرَت',
    hemistich_2: 'قَلوبَ رِجالٍ عِندَها في حَلاقِمِ',
    full_verse: 'فَأَوردَها خَوضَ الحِمامِ فَأَصدَرَت قَلوبَ رِجالٍ عِندَها في حَلاقِمِ',
    is_famous: false,
  },
]

const imruVerses: Verse[] = [
  {
    id: 'iq1',
    position: 1,
    hemistich_1: 'قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ',
    hemistich_2: 'بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ',
    full_verse: 'قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ',
    is_famous: true,
  },
  {
    id: 'iq2',
    position: 2,
    hemistich_1: 'فَتوضِحَ فَالمِقراةِ لَم يَعفُ رَسمُها',
    hemistich_2: 'لِما نَسَجَتها مِن جَنوبٍ وَشَمأَلِ',
    full_verse: 'فَتوضِحَ فَالمِقراةِ لَم يَعفُ رَسمُها لِما نَسَجَتها مِن جَنوبٍ وَشَمأَلِ',
    is_famous: false,
  },
  {
    id: 'iq3',
    position: 3,
    hemistich_1: 'مِكَرٍّ مِفَرٍّ مُقبِلٍ مُدبِرٍ مَعًا',
    hemistich_2: 'كَجُلمودِ صَخرٍ حَطَّهُ السَيلُ مِن عَلِ',
    full_verse: 'مِكَرٍّ مِفَرٍّ مُقبِلٍ مُدبِرٍ مَعًا كَجُلمودِ صَخرٍ حَطَّهُ السَيلُ مِن عَلِ',
    is_famous: true,
  },
]

const maarriVerses: Verse[] = [
  {
    id: 'ma1',
    position: 1,
    hemistich_1: 'وَإِنّي وَإِن كُنتُ الأَخيرَ زَمانُهُ',
    hemistich_2: 'لَآتٍ بِما لَم تَستَطِعهُ الأَوائِلُ',
    full_verse: 'وَإِنّي وَإِن كُنتُ الأَخيرَ زَمانُهُ لَآتٍ بِما لَم تَستَطِعهُ الأَوائِلُ',
    is_famous: true,
  },
  {
    id: 'ma2',
    position: 2,
    hemistich_1: 'اِثنانِ أَهلُ الأَرضِ ذو عَقلٍ بِلا',
    hemistich_2: 'دينٍ وَآخَرُ دَيِّنٌ لا عَقلَ لَه',
    full_verse: 'اِثنانِ أَهلُ الأَرضِ ذو عَقلٍ بِلا دينٍ وَآخَرُ دَيِّنٌ لا عَقلَ لَه',
    is_famous: false,
  },
]

const khansaVerses: Verse[] = [
  {
    id: 'kh1',
    position: 1,
    hemistich_1: 'يُذَكِّرُني طُلوعُ الشَمسِ صَخرًا',
    hemistich_2: 'وَأَذكُرُهُ لِكُلِّ غُروبِ شَمسِ',
    full_verse: 'يُذَكِّرُني طُلوعُ الشَمسِ صَخرًا وَأَذكُرُهُ لِكُلِّ غُروبِ شَمسِ',
    is_famous: true,
  },
  {
    id: 'kh2',
    position: 2,
    hemistich_1: 'وَلَولا كَثرَةُ الباكينَ حَولي',
    hemistich_2: 'عَلى إِخوانِهِم لَقَتَلتُ نَفسي',
    full_verse: 'وَلَولا كَثرَةُ الباكينَ حَولي عَلى إِخوانِهِم لَقَتَلتُ نَفسي',
    is_famous: true,
  },
]

export const POEMS: Poem[] = [
  {
    id: 'p1',
    title_ar: 'على قدر أهل العزم',
    slug: 'ala-qadri-ahli-al-azm',
    meter: 'الطويل',
    era: 'abbasid',
    view_count: 184230,
    poet: { id: 'poet-1', name_ar: 'المتنبي', slug: 'almutanabbi', era: 'abbasid' },
    categories: [
      { id: 'c1', name_ar: 'حكمة', slug: 'hikma' },
      { id: 'c2', name_ar: 'فخر', slug: 'fakhr' },
    ],
    verses: mutanabbiVerses,
  },
  {
    id: 'p2',
    title_ar: 'قفا نبك',
    slug: 'qifa-nabki',
    meter: 'الطويل',
    era: 'pre_islamic',
    view_count: 96540,
    poet: { id: 'poet-2', name_ar: 'امرؤ القيس', slug: 'imru-al-qais', era: 'pre_islamic' },
    categories: [{ id: 'c3', name_ar: 'غزل', slug: 'ghazal' }],
    verses: imruVerses,
  },
  {
    id: 'p3',
    title_ar: 'لزوم ما لا يلزم',
    slug: 'luzum-ma-la-yalzam',
    meter: 'الطويل',
    era: 'abbasid',
    view_count: 42110,
    poet: { id: 'poet-3', name_ar: 'أبو العلاء المعري', slug: 'al-maarri', era: 'abbasid' },
    categories: [{ id: 'c1', name_ar: 'حكمة', slug: 'hikma' }],
    verses: maarriVerses,
  },
  {
    id: 'p4',
    title_ar: 'رثاء صخر',
    slug: 'rithaa-sakhr',
    meter: 'الوافر',
    era: 'islamic_early',
    view_count: 33980,
    poet: { id: 'poet-4', name_ar: 'الخنساء', slug: 'al-khansaa', era: 'islamic_early' },
    categories: [{ id: 'c4', name_ar: 'رثاء', slug: 'ritha' }],
    verses: khansaVerses,
  },
]

export const POETS: Poet[] = [
  {
    id: 'poet-1',
    name_ar: 'المتنبي',
    name_en: 'Al-Mutanabbi',
    slug: 'almutanabbi',
    era: 'abbasid',
    birthplace: 'الكوفة',
    dates: '٩١٥–٩٦٥م',
    bio: 'أبو الطيب أحمد بن الحسين المتنبي، من أعظم شعراء العربية على الإطلاق، اشتهر بحكمته البالغة وفخره الشديد وقوة معانيه وجزالة ألفاظه. مدح سيف الدولة الحمداني فكانت سيفياته من أروع ما قيل في المديح، ويُعدّ مالئ الدنيا وشاغل الناس.',
    poem_count: 2987,
    verse_count: 102540,
    famous_verses: [
      { id: 'v1', hemistich_1: 'عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ', hemistich_2: 'وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ', poem_slug: 'ala-qadri-ahli-al-azm' },
      { id: 'v2', hemistich_1: 'وَتَعظُمُ في عَينِ الصَغيرِ صِغارُها', hemistich_2: 'وَتَصغُرُ في عَينِ العَظيمِ العَظائِمُ', poem_slug: 'ala-qadri-ahli-al-azm' },
      { id: 'v6', hemistich_1: 'سَقَتها الغَمامُ الغُرُّ قَبلَ نُزولِهِ', hemistich_2: 'فَلَمّا دَنا مِنها سَقَتها الجَماجِمُ', poem_slug: 'ala-qadri-ahli-al-azm' },
    ],
    poems: [
      { id: 'p1', title_ar: 'على قدر أهل العزم', slug: 'ala-qadri-ahli-al-azm', verse_count: 7, meter: 'الطويل' },
    ],
  },
  {
    id: 'poet-2',
    name_ar: 'امرؤ القيس',
    name_en: 'Imru’ al-Qais',
    slug: 'imru-al-qais',
    era: 'pre_islamic',
    birthplace: 'نجد',
    dates: '٥٠١–٥٤٤م',
    bio: 'امرؤ القيس بن حُجر الكِندي، صاحب أشهر المعلقات وأميرٌ ضائع، يُعدّ من رواد الشعر الجاهلي وأبرز من وقف على الأطلال. لُقّب بالملك الضِّلّيل، وشِعره أنموذج للوصف الحسّي البديع والغزل الصريح.',
    poem_count: 68,
    verse_count: 2410,
    famous_verses: [
      { id: 'iq1', hemistich_1: 'قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ', hemistich_2: 'بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ', poem_slug: 'qifa-nabki' },
      { id: 'iq3', hemistich_1: 'مِكَرٍّ مِفَرٍّ مُقبِلٍ مُدبِرٍ مَعًا', hemistich_2: 'كَجُلمودِ صَخرٍ حَطَّهُ السَيلُ مِن عَلِ', poem_slug: 'qifa-nabki' },
    ],
    poems: [{ id: 'p2', title_ar: 'قفا نبك', slug: 'qifa-nabki', verse_count: 3, meter: 'الطويل' }],
  },
  {
    id: 'poet-3',
    name_ar: 'أبو العلاء المعري',
    name_en: 'Abu al-‘Ala’ al-Ma‘arri',
    slug: 'al-maarri',
    era: 'abbasid',
    birthplace: 'معرة النعمان',
    dates: '٩٧٣–١٠٥٧م',
    bio: 'أبو العلاء أحمد بن عبد الله المعري، فيلسوف الشعراء وشاعر الفلاسفة، عُرف بعمق فكره وتشاؤمه وحكمته. كفّ بصره صغيرًا فلُقّب برهين المحبسين، وترك في «اللزوميات» و«سقط الزند» إرثًا فكريًا خالدًا.',
    poem_count: 412,
    verse_count: 11200,
    famous_verses: [
      { id: 'ma1', hemistich_1: 'وَإِنّي وَإِن كُنتُ الأَخيرَ زَمانُهُ', hemistich_2: 'لَآتٍ بِما لَم تَستَطِعهُ الأَوائِلُ', poem_slug: 'luzum-ma-la-yalzam' },
    ],
    poems: [{ id: 'p3', title_ar: 'لزوم ما لا يلزم', slug: 'luzum-ma-la-yalzam', verse_count: 2, meter: 'الطويل' }],
  },
  {
    id: 'poet-4',
    name_ar: 'الخنساء',
    name_en: 'Al-Khansa’',
    slug: 'al-khansaa',
    era: 'islamic_early',
    birthplace: 'نجد',
    dates: '٥٧٥–٦٤٥م',
    bio: 'تماضر بنت عمرو، الشهيرة بالخنساء، أشهر شواعر العرب وأعظم من رثى في تاريخ الشعر العربي. خلّد رثاؤها لأخويها صخر ومعاوية اسمها، وأدركت الإسلام فأسلمت، وصبرت على استشهاد أبنائها الأربعة.',
    poem_count: 142,
    verse_count: 3120,
    famous_verses: [
      { id: 'kh1', hemistich_1: 'يُذَكِّرُني طُلوعُ الشَمسِ صَخرًا', hemistich_2: 'وَأَذكُرُهُ لِكُلِّ غُروبِ شَمسِ', poem_slug: 'rithaa-sakhr' },
      { id: 'kh2', hemistich_1: 'وَلَولا كَثرَةُ الباكينَ حَولي', hemistich_2: 'عَلى إِخوانِهِم لَقَتَلتُ نَفسي', poem_slug: 'rithaa-sakhr' },
    ],
    poems: [{ id: 'p4', title_ar: 'رثاء صخر', slug: 'rithaa-sakhr', verse_count: 2, meter: 'الوافر' }],
  },
]

export const CATEGORIES: { id: string; name_ar: string; slug: string; count: number; desc: string }[] = [
  { id: 'c1', name_ar: 'حكمة', slug: 'hikma', count: 18420, desc: 'أبياتٌ تختصر تجارب العمر في كلمات' },
  { id: 'c3', name_ar: 'غزل', slug: 'ghazal', count: 24310, desc: 'في الحب والشوق وذكر المحبوب' },
  { id: 'c2', name_ar: 'فخر', slug: 'fakhr', count: 9870, desc: 'اعتزازٌ بالنفس والقبيلة والمجد' },
  { id: 'c4', name_ar: 'رثاء', slug: 'ritha', count: 7650, desc: 'في فقد الأحبة وبكاء الراحلين' },
  { id: 'c5', name_ar: 'مديح', slug: 'madih', count: 15230, desc: 'في الثناء على الملوك والكرماء' },
  { id: 'c6', name_ar: 'هجاء', slug: 'hija', count: 6120, desc: 'في الذم والسخرية اللاذعة' },
  { id: 'c7', name_ar: 'وصف', slug: 'wasf', count: 12090, desc: 'تصويرٌ بديع للطبيعة والأشياء' },
  { id: 'c8', name_ar: 'زهد', slug: 'zuhd', count: 5340, desc: 'في التقوى والإعراض عن الدنيا' },
]

// ===== Helpers =====
export function getPoemBySlug(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug)
}

export function getPoetBySlug(slug: string): Poet | undefined {
  return POETS.find((p) => p.slug === slug)
}

export function findVerse(id: string): { verse: Verse; poem: Poem } | undefined {
  for (const poem of POEMS) {
    const verse = poem.verses.find((v) => v.id === id)
    if (verse) return { verse, poem }
  }
  return undefined
}

export function getRelatedVerses(excludeId: string, limit = 4): SearchHit[] {
  const hits: SearchHit[] = []
  for (const poem of POEMS) {
    for (const v of poem.verses) {
      if (v.id === excludeId) continue
      if (!v.is_famous) continue
      hits.push(toSearchHit(v, poem))
    }
  }
  return hits.slice(0, limit)
}

export function toSearchHit(v: Verse, poem: Poem): SearchHit {
  return {
    id: v.id,
    hemistich_1: v.hemistich_1,
    hemistich_2: v.hemistich_2,
    full_verse: v.full_verse,
    poet_name_ar: poem.poet.name_ar,
    poem_title_ar: poem.title_ar,
    poem_slug: poem.slug,
    poet_slug: poem.poet.slug,
    is_famous: v.is_famous,
  }
}

export function searchVerses(query: string): SearchHit[] {
  const q = query.trim()
  const all: SearchHit[] = []
  for (const poem of POEMS) {
    for (const v of poem.verses) {
      all.push(toSearchHit(v, poem))
    }
  }
  if (!q) return all
  const norm = (s: string) => s.replace(/[\u064B-\u0652]/g, '').replace(/[إأآا]/g, 'ا')
  const nq = norm(q)
  return all.filter(
    (h) =>
      norm(h.full_verse).includes(nq) ||
      norm(h.poet_name_ar).includes(nq) ||
      norm(h.poem_title_ar).includes(nq),
  )
}

// Group hits by poem for the results page
export function groupHitsByPoem(hits: SearchHit[]) {
  const map = new Map<string, { poem_title_ar: string; poet_name_ar: string; poem_slug: string; poet_slug: string; matches: SearchHit[] }>()
  for (const h of hits) {
    const existing = map.get(h.poem_slug)
    if (existing) {
      existing.matches.push(h)
    } else {
      map.set(h.poem_slug, {
        poem_title_ar: h.poem_title_ar || h.hemistich_1,
        poet_name_ar: h.poet_name_ar,
        poem_slug: h.poem_slug,
        poet_slug: h.poet_slug,
        matches: [h],
      })
    }
  }
  return Array.from(map.values())
}
