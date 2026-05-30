"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ─── POEM DATA ──────────────────────────────────────────────────────────────

const poems = [
  {
    id: 1,
    title: "على قدر أهل العزم",
    poet: "المتنبي",
    era: "القرن الرابع الهجري",
    verses: [
      { sadr: "عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ", ajuz: "وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ" },
      { sadr: "وَتَعظُمُ في عَينِ الصَغيرِ صِغارُها", ajuz: "وَتَصغُرُ في عَينِ العَظيمِ العَظائِمُ" },
      { sadr: "يُكَلِّفُ سَيفُ الدَولَةِ الجَيشَ هَمَّهُ", ajuz: "وَقَد عَجَزَت عَنهُ الجُيوشُ الخَضارِمُ" },
      { sadr: "وَيَطلُبُ عِندَ الناسِ ما عِندَ نَفسِهِ", ajuz: "وَذَلِكَ ما لا تَدَّعيهِ الضَراغِمُ" },
      { sadr: "هَلِ الحَدَثُ الحَمراءُ تَعرِفُ لَونَها", ajuz: "وَتَعلَمُ أَيُّ الساقِيَينِ الغَمائِمُ" },
      { sadr: "سَقَتها الغَمامُ الغُرُّ قَبلَ نُزولِهِ", ajuz: "فَلَمّا دَنا مِنها سَقَتها الجَماجِمُ" },
      { sadr: "فَأَوردَها خَوضَ الحِمامِ فَأَصدَرَت", ajuz: "قَلوبَ رِجالٍ عِندَها في حَلاقِمُ" },
    ],
  },
  {
    id: 2,
    title: "معلّقة امرئ القيس",
    poet: "امرؤ القيس",
    era: "العصر الجاهلي",
    verses: [
      { sadr: "قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ", ajuz: "بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ" },
      { sadr: "فَتوضِحَ فَالمِقراةِ لَم يَعفُ رَسمُها", ajuz: "لِما نَسَجَتها مِن جَنوبٍ وَشَمأَلِ" },
      { sadr: "تَرى بَعَرَ الأَرآمِ في عَرَصاتِها", ajuz: "وَقيعانِها كَأَنَّهُ حَبُّ فُلفُلِ" },
      { sadr: "كَأَنّي غَداةَ البَينِ يَومَ تَحَمَّلوا", ajuz: "لَدى سَمُراتِ الحَيِّ ناقِفُ حَنظَلِ" },
      { sadr: "وُقوفاً بِها صَحبي عَلَيَّ مَطِيَّهُم", ajuz: "يَقولونَ لا تَهلِك أَسىً وَتَجَمَّلِ" },
      { sadr: "وَإِنَّ شِفائي عَبرَةٌ مُهَراقَةٌ", ajuz: "فَهَل عِندَ رَسمٍ دارِسٍ مِن مُعَوَّلِ" },
    ],
  },
  {
    id: 3,
    title: "ترجمان الأشواق",
    poet: "ابن عربي",
    era: "القرن السابع الهجري",
    verses: [
      { sadr: "لَقَد صارَ قَلبي قابِلاً كُلَّ صورَةٍ", ajuz: "فَمَرعىً لِغِزلانٍ وَدَيرٌ لِرُهبانِ" },
      { sadr: "وَبَيتٌ لِأَوثانٍ وَكَعبَةُ طائِفٍ", ajuz: "وَأَلواحُ تَوراةٍ وَمُصحَفُ قُرآنِ" },
      { sadr: "أَدينُ بِدينِ الحُبِّ أَنّى تَوَجَّهَت", ajuz: "رَكائِبُهُ فَالحُبُّ ديني وَإيماني" },
      { sadr: "يا نَسيمَ الصَبا بَلِّغ تَحِيَّتَنا", ajuz: "مَن لَو عَلى النارِ مَشَينا لِأَجلِهِ" },
      { sadr: "لَنا هَوىً لَو كانَ في الصَخرِ لانثَنى", ajuz: "وَلانَ لَهُ قَلبُ الحَديدِ الصَلادِمِ" },
      { sadr: "فَيا خاتِمَ الرُسلِ الَّذي فاقَ مَجدُهُ", ajuz: "جَميعَ الوَرى طُرّاً بِلا اِستِثناءِ" },
    ],
  },
  {
    id: 4,
    title: "رثاء صخر",
    poet: "الخنساء",
    era: "العصر الجاهلي",
    verses: [
      { sadr: "قَذىً بِعَينِكِ أَم بِالعَينِ عُوّارُ", ajuz: "أَم ذَرَفَت إِذ خَلَت مِن أَهلِها الدارُ" },
      { sadr: "كَأَنَّ عَيني لِذِكراهُ إِذا خَطَرَت", ajuz: "فَيضٌ يَسيلُ عَلى الخَدَّينِ مِدرارُ" },
      { sadr: "وَإِنَّ صَخراً لَتَأتَمُّ الهُداةُ بِهِ", ajuz: "كَأَنَّهُ عَلَمٌ في رَأسِهِ نارُ" },
      { sadr: "وَإِنَّ صَخراً لَمَولانا وَسَيِّدُنا", ajuz: "وَإِنَّ صَخراً إِذا نَشتو لَنَحّارُ" },
      { sadr: "حَمّالُ أَلوِيَةٍ هَبّاطُ أَودِيَةٍ", ajuz: "شَهّادُ أَندِيَةٍ لِلجَيشِ جَرّارُ" },
      { sadr: "يُطَلِّقُ البَكرَ يَومَ الرَوعِ يَركَبُها", ajuz: "لِأَنَّهُ مِن حِفاظِ العِرضِ غَيّارُ" },
    ],
  },
  {
    id: 5,
    title: "دع عنك لومي",
    poet: "أبو نواس",
    era: "القرن الثاني الهجري",
    verses: [
      { sadr: "دَع عَنكَ لَومي فَإِنَّ اللَومَ إِغراءُ", ajuz: "وَداوِني بِالَّتي كانَت هِيَ الداءُ" },
      { sadr: "صَفراءُ لا تَنزِلُ الأَحزانُ ساحَتَها", ajuz: "لَو مَسَّها حَجَرٌ مَسَّتهُ سَرّاءُ" },
      { sadr: "مِن كَفِّ ذاتِ حِرٍ في زِيِّ ذي ذَكَرٍ", ajuz: "لَها مُحِبّانِ لوطِيٌّ وَزَنّاءُ" },
      { sadr: "قامَت بِإِبريقِها وَاللَيلُ مُعتَكِرٌ", ajuz: "فَلاحَ مِن وَجهِها في البَيتِ لَألاءُ" },
      { sadr: "فَأَرسَلَت مِن فَمِ الإِبريقِ صافِيَةً", ajuz: "كَأَنَّما أَخذَها بِالعَينِ إِغفاءُ" },
      { sadr: "رَقَّت عَنِ الماءِ حَتّى ما يُلائِمُها", ajuz: "لَطافَةً وَجَفا عَن شَكلِها الماءُ" },
    ],
  },
]

// ─── DECORATIVE SVGs ────────────────────────────────────────────────────────

const StarDivider = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
    <path
      d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
      fill="var(--gold-muted)"
    />
  </svg>
)

const PoemDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "40px 0" }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, var(--gold-primary), transparent)" }} />
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="10" y="0" width="14.14" height="14.14" rx="2" transform="rotate(45 10 0)" fill="none" stroke="var(--gold-primary)" strokeWidth="1" opacity="0.6" />
    </svg>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, var(--gold-primary), transparent)" }} />
  </div>
)

const CornerOrnament = () => (
  <div style={{ position: "absolute", bottom: 12, left: 12, opacity: 0.12 }}>
    <svg width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 0L17 11L28 14L17 17L14 28L11 17L0 14L11 11Z" fill="var(--gold-primary)" />
    </svg>
  </div>
)

// ─── ARABIC NUMERALS ────────────────────────────────────────────────────────

const toArabicNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)])

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function PoetryReader() {
  const [view, setView] = useState<"browse" | "read">("browse")
  const [activePoem, setActivePoem] = useState(0)
  const [fontSize, setFontSize] = useState(28)
  const [autoScroll, setAutoScroll] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionDir, setTransitionDir] = useState<"in" | "out">("in")
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const poemAreaRef = useRef<HTMLDivElement>(null)
  const [hoveringPoem, setHoveringPoem] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && view === "read" && !hoveringPoem) {
      autoScrollRef.current = setInterval(() => {
        scrollRef.current?.scrollBy({ top: 1 })
      }, 28)
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [autoScroll, view, hoveringPoem])

  const openPoem = useCallback((index: number) => {
    setActivePoem(index)
    setTransitionDir("in")
    setTransitioning(true)
    setView("read")
    scrollRef.current?.scrollTo({ top: 0 })
    setTimeout(() => setTransitioning(false), 400)
  }, [])

  const navigatePoem = useCallback((dir: -1 | 1) => {
    setTransitionDir("out")
    setTransitioning(true)
    setTimeout(() => {
      setActivePoem((p) => {
        const next = p + dir
        if (next < 0) return poems.length - 1
        if (next >= poems.length) return 0
        return next
      })
      setTransitionDir("in")
      scrollRef.current?.scrollTo({ top: 0 })
      setTimeout(() => setTransitioning(false), 350)
    }, 220)
  }, [])

  const poem = poems[activePoem]

  return (
    <>
      {/* ── Injected Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

        :root {
          --bg-deep: #0d0b08;
          --bg-card: #1a1610;
          --bg-hover: #221e14;
          --gold-primary: #c9a84c;
          --gold-light: #e8d5a3;
          --gold-muted: #8a6f35;
          --divider: #c9a84c22;
          --glow: #c9a84c18;
        }

        .poetry-reader {
          font-family: 'Amiri', serif;
          background: var(--bg-deep);
          color: var(--gold-light);
          min-height: 100vh;
          position: relative;
        }

        .poetry-reader::before {
          content: '';
          position: fixed;
          inset: 0;
          opacity: 0.035;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .poetry-reader::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(ellipse at center, transparent 50%, #0d0b08cc 100%);
        }

        .poetry-reader * { position: relative; z-index: 2; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes poemIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes poemOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .verse-row:hover {
          background: var(--glow);
          border-radius: 8px;
        }

        .card-poem:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px #00000060;
          border-color: var(--gold-primary) !important;
        }

        .control-btn {
          transition: all 200ms ease;
          cursor: pointer;
          border: none;
          outline: none;
        }

        .control-btn:hover {
          background: var(--gold-primary) !important;
          color: var(--bg-deep) !important;
        }

        .scroll-container::-webkit-scrollbar { width: 4px; }
        .scroll-container::-webkit-scrollbar-track { background: transparent; }
        .scroll-container::-webkit-scrollbar-thumb { background: var(--gold-muted); border-radius: 2px; }
      `}</style>

      <div className="poetry-reader" ref={scrollRef} style={{ overflowY: "auto", height: "100vh" }}>
        {/* ── CONTROL BAR ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "#0d0b0bcc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--divider)",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--gold-primary)",
              letterSpacing: "0.08em",
              opacity: mounted ? 1 : 0,
              transition: "opacity 500ms ease",
              cursor: "pointer",
            }}
            onClick={() => { setView("browse"); setAutoScroll(false) }}
          >
            ديوان
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Font size */}
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { label: "ص", size: 22 },
                { label: "م", size: 28 },
                { label: "ك", size: 34 },
              ].map((f) => (
                <button
                  key={f.size}
                  className="control-btn"
                  onClick={() => setFontSize(f.size)}
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontSize: 14,
                    padding: "4px 14px",
                    borderRadius: 20,
                    background: fontSize === f.size ? "var(--gold-primary)" : "transparent",
                    color: fontSize === f.size ? "var(--bg-deep)" : "var(--gold-muted)",
                    border: fontSize === f.size ? "none" : "1px solid var(--gold-muted)",
                    fontWeight: fontSize === f.size ? 700 : 400,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Auto-scroll */}
            {view === "read" && (
              <button
                className="control-btn"
                onClick={() => setAutoScroll(!autoScroll)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: autoScroll ? "var(--gold-primary)" : "transparent",
                  color: autoScroll ? "var(--bg-deep)" : "var(--gold-muted)",
                  border: autoScroll ? "none" : "1px solid var(--gold-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  animation: autoScroll ? "pulse 2s ease infinite" : "none",
                }}
              >
                ▼
              </button>
            )}

            {/* View toggle */}
            <button
              className="control-btn"
              onClick={() => {
                if (view === "browse") {
                  setShowAll(true)
                } else {
                  setView("browse")
                  setAutoScroll(false)
                }
              }}
              style={{
                fontFamily: "'Amiri', serif",
                fontSize: 14,
                padding: "6px 20px",
                borderRadius: 20,
                background: "transparent",
                color: "var(--gold-primary)",
                border: "1px solid var(--gold-primary)",
              }}
            >
              {view === "browse" ? "عرض الكل" : "تصفح"}
            </button>
          </div>
        </div>

        {/* ── BROWSE VIEW ── */}
        {view === "browse" && (
          <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px 20px 80px" }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: 56,
                opacity: mounted ? 1 : 0,
                transition: "opacity 600ms ease 200ms",
              }}
            >
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--gold-muted)",
                  marginBottom: 8,
                }}
              >
                مختارات
              </h1>
              <p
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: 18,
                  color: "var(--gold-light)",
                  opacity: 0.6,
                }}
                dir="rtl" lang="ar"
              >
                من عيون الشعر العربي
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 28,
              }}
            >
              {poems.map((p, i) => (
                <div
                  key={p.id}
                  className="card-poem"
                  onClick={() => openPoem(i)}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 12,
                    padding: "32px 28px 28px",
                    border: "1px solid var(--divider)",
                    cursor: "pointer",
                    transition: "all 250ms ease",
                    position: "relative",
                    overflow: "hidden",
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? `fadeSlideIn 400ms ease ${i * 80 + 300}ms both` : "none",
                  }}
                  dir="rtl" lang="ar"
                >
                  <h3
                    style={{
                      fontFamily: "'Amiri', serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "var(--gold-primary)",
                      marginBottom: 8,
                      lineHeight: 1.6,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "var(--gold-muted)",
                      marginBottom: 20,
                    }}
                  >
                    {p.poet} — {p.era}
                  </p>

                  {/* First verse preview */}
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 2,
                      color: "var(--gold-muted)",
                      borderTop: "1px solid var(--divider)",
                      paddingTop: 16,
                    }}
                  >
                    <span>{p.verses[0].sadr}</span>
                    <span style={{ margin: "0 12px", opacity: 0.3 }}>◆</span>
                    <span>{p.verses[0].ajuz}</span>
                  </div>

                  <CornerOrnament />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── READING VIEW ── */}
        {view === "read" && (
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveringPoem(true)}
            onMouseLeave={() => setHoveringPoem(false)}
            ref={poemAreaRef}
          >
            {/* Prev / Next */}
            <button
              className="control-btn"
              onClick={() => navigatePoem(1)}
              style={{
                position: "fixed",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 40,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--bg-card)",
                color: "var(--gold-primary)",
                border: "1px solid var(--divider)",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              →
            </button>
            <button
              className="control-btn"
              onClick={() => navigatePoem(-1)}
              style={{
                position: "fixed",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 40,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--bg-card)",
                color: "var(--gold-primary)",
                border: "1px solid var(--divider)",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </button>

            {/* Poem content */}
            <div
              style={{
                maxWidth: 740,
                margin: "0 auto",
                padding: "56px 20px 100px",
                animation: transitioning
                  ? transitionDir === "out"
                    ? "poemOut 200ms ease forwards"
                    : "poemIn 300ms ease both"
                  : "none",
              }}
              dir="rtl" lang="ar"
            >
              {/* Title */}
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h2
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--gold-primary)",
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  {poem.title}
                </h2>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    color: "var(--gold-muted)",
                  }}
                >
                  {poem.poet} — {poem.era}
                </p>
              </div>

              {/* Verses */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {poem.verses.map((v, i) => (
                  <div key={i}>
                    <div
                      className="verse-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 0,
                        padding: "14px 16px",
                        transition: "background 300ms ease",
                        direction: "rtl",
                        animation: `fadeSlideIn 400ms ease ${i * 80}ms both`,
                        position: "relative",
                      }}
                    >
                      {/* Verse number */}
                      <span
                        style={{
                          position: "absolute",
                          right: -32,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "'Amiri', serif",
                          fontSize: 12,
                          color: "var(--gold-muted)",
                          opacity: 0.3,
                        }}
                      >
                        {toArabicNum(i + 1)}
                      </span>

                      {/* الصدر */}
                      <div
                        style={{
                          textAlign: "right",
                          fontFamily: "'Amiri', serif",
                          fontSize,
                          lineHeight: 2.2,
                          letterSpacing: "0.02em",
                          color: "var(--gold-light)",
                          paddingLeft: 16,
                        }}
                      >
                        {v.sadr}
                      </div>

                      {/* العجز */}
                      <div
                        style={{
                          textAlign: "left",
                          fontFamily: "'Amiri', serif",
                          fontSize,
                          lineHeight: 2.2,
                          letterSpacing: "0.02em",
                          color: "var(--gold-light)",
                          transform: "translateY(7px)",
                          borderRight: "1px solid var(--divider)",
                          paddingRight: 16,
                        }}
                      >
                        {v.ajuz}
                      </div>
                    </div>

                    {/* Star divider every 3 verses */}
                    {(i + 1) % 3 === 0 && i < poem.verses.length - 1 && (
                      <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
                        <StarDivider />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div
              style={{
                position: "fixed",
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10,
                zIndex: 40,
              }}
            >
              {poems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i !== activePoem) {
                      setTransitionDir("out")
                      setTransitioning(true)
                      setTimeout(() => {
                        setActivePoem(i)
                        setTransitionDir("in")
                        scrollRef.current?.scrollTo({ top: 0 })
                        setTimeout(() => setTransitioning(false), 350)
                      }, 220)
                    }
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === activePoem ? "var(--gold-primary)" : "var(--gold-muted)",
                    opacity: i === activePoem ? 1 : 0.35,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 300ms ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── "عرض الكل" MODAL ── */}
        {showAll && (
          <div
            className="scroll-container"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "#0d0b08f0",
              backdropFilter: "blur(8px)",
              overflowY: "auto",
              animation: "modalIn 300ms ease both",
            }}
          >
            {/* Close */}
            <button
              className="control-btn"
              onClick={() => setShowAll(false)}
              style={{
                position: "sticky",
                top: 24,
                float: "left",
                marginLeft: 24,
                zIndex: 110,
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--bg-card)",
                color: "var(--gold-primary)",
                border: "1px solid var(--divider)",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div style={{ maxWidth: 740, margin: "0 auto", padding: "60px 20px 80px" }} dir="rtl" lang="ar">
              {poems.map((p, pi) => (
                <div key={p.id}>
                  {/* Title */}
                  <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <h2
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--gold-primary)",
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}
                    >
                      {p.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        letterSpacing: "0.15em",
                        color: "var(--gold-muted)",
                      }}
                    >
                      {p.poet} — {p.era}
                    </p>
                  </div>

                  {/* Verses */}
                  {p.verses.map((v, vi) => (
                    <div
                      key={vi}
                      className="verse-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        padding: "12px 16px",
                        transition: "background 300ms ease",
                        direction: "rtl",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "right",
                          fontFamily: "'Amiri', serif",
                          fontSize: fontSize - 2,
                          lineHeight: 2.2,
                          letterSpacing: "0.02em",
                          color: "var(--gold-light)",
                          paddingLeft: 16,
                        }}
                      >
                        {v.sadr}
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          fontFamily: "'Amiri', serif",
                          fontSize: fontSize - 2,
                          lineHeight: 2.2,
                          letterSpacing: "0.02em",
                          color: "var(--gold-light)",
                          transform: "translateY(7px)",
                          borderRight: "1px solid var(--divider)",
                          paddingRight: 16,
                        }}
                      >
                        {v.ajuz}
                      </div>
                    </div>
                  ))}

                  {pi < poems.length - 1 && <PoemDivider />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
