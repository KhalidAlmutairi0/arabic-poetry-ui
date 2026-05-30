"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const poems = [
  {
    id: 1, title: "على قدر أهل العزم", poet: "المتنبي", era: "القرن الرابع الهجري",
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
    id: 2, title: "معلّقة امرئ القيس", poet: "امرؤ القيس", era: "العصر الجاهلي",
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
    id: 3, title: "ترجمان الأشواق", poet: "ابن عربي", era: "القرن السابع الهجري",
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
    id: 4, title: "رثاء صخر", poet: "الخنساء", era: "العصر الجاهلي",
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
    id: 5, title: "دع عنك لومي", poet: "أبو نواس", era: "القرن الثاني الهجري",
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

const toArabicNum = (n: number) => n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)])

export default function PoetryReader() {
  const [view, setView] = useState<"browse" | "read">("browse")
  const [activePoem, setActivePoem] = useState(0)
  const [fontSize, setFontSize] = useState(28)
  const [autoScroll, setAutoScroll] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transDir, setTransDir] = useState<"in" | "out">("in")
  const [ready, setReady] = useState(false)
  const [hovering, setHovering] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (autoScroll && view === "read" && !hovering) {
      intervalRef.current = setInterval(() => { scrollRef.current?.scrollBy({ top: 1 }) }, 28)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoScroll, view, hovering])

  const openPoem = useCallback((i: number) => {
    setActivePoem(i)
    setTransDir("in")
    setTransitioning(true)
    setView("read")
    scrollRef.current?.scrollTo({ top: 0 })
    setTimeout(() => setTransitioning(false), 400)
  }, [])

  const nav = useCallback((dir: -1 | 1) => {
    setTransDir("out")
    setTransitioning(true)
    setTimeout(() => {
      setActivePoem(p => { const n = p + dir; return n < 0 ? poems.length - 1 : n >= poems.length ? 0 : n })
      setTransDir("in")
      scrollRef.current?.scrollTo({ top: 0 })
      setTimeout(() => setTransitioning(false), 350)
    }, 220)
  }, [])

  const poem = poems[activePoem]
  return (
    <>
      <style>{CSS_TEXT}</style>
      <div className="dr" ref={scrollRef}>
        {/* ── TOP BAR ── */}
        <div className="dr-bar">
          <div className="dr-logo" onClick={() => { setView("browse"); setAutoScroll(false) }}>ديوان</div>
          <div className="dr-controls">
            {[{ l: "ص", s: 22 }, { l: "م", s: 28 }, { l: "ك", s: 34 }].map(f => (
              <button key={f.s} className={`dr-pill ${fontSize === f.s ? "active" : ""}`} onClick={() => setFontSize(f.s)}>{f.l}</button>
            ))}
            {view === "read" && (
              <button className={`dr-circle ${autoScroll ? "active" : ""}`} onClick={() => setAutoScroll(!autoScroll)}>▼</button>
            )}
            <button className="dr-pill outline" onClick={() => view === "browse" ? setShowAll(true) : (setView("browse"), setAutoScroll(false))}>
              {view === "browse" ? "عرض الكل" : "تصفح"}
            </button>
          </div>
        </div>

        {/* ── BROWSE ── */}
        {view === "browse" && (
          <div className="dr-content">
            <div className="dr-header" style={{ opacity: ready ? 1 : 0 }}>
              <div className="dr-sub">مختارات</div>
              <div className="dr-tagline">من عيون الشعر العربي</div>
            </div>
            <div className="dr-grid">
              {poems.map((p, i) => (
                <div key={p.id} className="dr-card" onClick={() => openPoem(i)}
                  style={{ animationDelay: `${i * 80 + 200}ms`, opacity: ready ? undefined : 0 }} dir="rtl" lang="ar">
                  <div className="dr-card-title">{p.title}</div>
                  <div className="dr-card-meta">{p.poet} — {p.era}</div>
                  <div className="dr-card-preview">
                    <span>{p.verses[0].sadr}</span>
                    <span className="dr-diamond">◆</span>
                    <span>{p.verses[0].ajuz}</span>
                  </div>
                  <div className="dr-ornament">✦</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── READING ── */}
        {view === "read" && (
          <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <button className="dr-nav dr-nav-r" onClick={() => nav(1)}>→</button>
            <button className="dr-nav dr-nav-l" onClick={() => nav(-1)}>←</button>

            <div className={`dr-poem ${transitioning ? (transDir === "out" ? "out" : "in") : ""}`} dir="rtl" lang="ar">
              <div className="dr-poem-header">
                <h2 className="dr-poem-title">{poem.title}</h2>
                <div className="dr-poem-meta">{poem.poet} — {poem.era}</div>
              </div>

              {poem.verses.map((v, i) => (
                <div key={i}>
                  <div className="dr-verse" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="dr-vnum">{toArabicNum(i + 1)}</span>
                    <div className="dr-sadr" style={{ fontSize }}>{v.sadr}</div>
                    <div className="dr-ajuz" style={{ fontSize }}>{v.ajuz}</div>
                  </div>
                  {(i + 1) % 3 === 0 && i < poem.verses.length - 1 && (
                    <div className="dr-star">✦</div>
                  )}
                </div>
              ))}
            </div>

            <div className="dr-dots">
              {poems.map((_, i) => (
                <button key={i} className={`dr-dot ${i === activePoem ? "active" : ""}`}
                  onClick={() => { if (i !== activePoem) { setTransDir("out"); setTransitioning(true); setTimeout(() => { setActivePoem(i); setTransDir("in"); scrollRef.current?.scrollTo({ top: 0 }); setTimeout(() => setTransitioning(false), 350) }, 220) } }} />
              ))}
            </div>
          </div>
        )}

        {/* ── MODAL ── */}
        {showAll && (
          <div className="dr-modal">
            <button className="dr-modal-close" onClick={() => setShowAll(false)}>✕</button>
            <div className="dr-modal-inner" dir="rtl" lang="ar">
              {poems.map((p, pi) => (
                <div key={p.id}>
                  <div className="dr-poem-header">
                    <h2 className="dr-poem-title" style={{ fontSize: 26 }}>{p.title}</h2>
                    <div className="dr-poem-meta">{p.poet} — {p.era}</div>
                  </div>
                  {p.verses.map((v, vi) => (
                    <div key={vi} className="dr-verse static">
                      <div className="dr-sadr" style={{ fontSize: fontSize - 2 }}>{v.sadr}</div>
                      <div className="dr-ajuz" style={{ fontSize: fontSize - 2 }}>{v.ajuz}</div>
                    </div>
                  ))}
                  {pi < poems.length - 1 && (
                    <div className="dr-poem-divider">
                      <div className="dr-line" /><span>◇</span><div className="dr-line" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const CSS_TEXT = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

.dr, .dr *, .dr *::before, .dr *::after {
  margin: 0; padding: 0; box-sizing: border-box;
  font-family: 'Amiri', serif !important;
  -webkit-font-smoothing: antialiased;
}

.dr {
  position: fixed !important; inset: 0 !important; z-index: 99999 !important;
  background: #0d0b08 !important; color: #e8d5a3 !important;
  overflow-y: auto !important; overflow-x: hidden !important;
}

.dr::before {
  content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}
.dr::after {
  content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 40%, #0d0b08dd 100%);
}

.dr > * { position: relative; z-index: 1; }

/* ── BAR ── */
.dr-bar {
  position: sticky !important; top: 0; z-index: 50 !important;
  background: #0d0b08dd !important; backdrop-filter: blur(16px);
  border-bottom: 1px solid #c9a84c18;
  padding: 14px 28px; display: flex; justify-content: space-between; align-items: center;
}
.dr-logo {
  font-family: 'Cinzel', serif !important; font-size: 24px; font-weight: 600;
  color: #c9a84c; letter-spacing: 0.1em; cursor: pointer;
  transition: opacity 0.3s;
}
.dr-logo:hover { opacity: 0.8; }
.dr-controls { display: flex; align-items: center; gap: 8px; }

.dr-pill {
  font-family: 'Amiri', serif !important; font-size: 14px;
  padding: 5px 16px; border-radius: 20px; cursor: pointer;
  background: transparent; color: #8a6f35; border: 1px solid #8a6f3566;
  transition: all 0.2s ease;
}
.dr-pill:hover, .dr-pill.active { background: #c9a84c !important; color: #0d0b08 !important; border-color: #c9a84c !important; font-weight: 700; }
.dr-pill.outline { color: #c9a84c; border-color: #c9a84c; }
.dr-pill.outline:hover { background: #c9a84c !important; color: #0d0b08 !important; }

.dr-circle {
  width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
  background: transparent; color: #8a6f35; border: 1px solid #8a6f3566;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  transition: all 0.2s;
}
.dr-circle:hover, .dr-circle.active { background: #c9a84c !important; color: #0d0b08 !important; border-color: #c9a84c !important; }
.dr-circle.active { animation: pulse 2s ease infinite; }

/* ── BROWSE ── */
.dr-content { max-width: 760px; margin: 0 auto; padding: 56px 24px 80px; }
.dr-header { text-align: center; margin-bottom: 56px; transition: opacity 0.6s 0.2s; }
.dr-sub { font-family: 'Cinzel', serif !important; font-size: 13px; letter-spacing: 0.3em; color: #8a6f35; margin-bottom: 10px; text-transform: uppercase; }
.dr-tagline { font-size: 18px; color: #e8d5a3; opacity: 0.55; }

.dr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; }

.dr-card {
  background: #1a1610; border-radius: 14px; padding: 34px 28px 28px;
  border: 1px solid #c9a84c15; cursor: pointer; position: relative; overflow: hidden;
  transition: all 0.25s ease; animation: fadeUp 0.4s ease both;
}
.dr-card:hover {
  transform: translateY(-4px); border-color: #c9a84c !important;
  box-shadow: 0 16px 48px #00000070, 0 0 0 1px #c9a84c33;
}
.dr-card-title { font-size: 26px; font-weight: 700; color: #c9a84c; line-height: 1.7; margin-bottom: 8px; }
.dr-card-meta { font-family: 'Cinzel', serif !important; font-size: 11px; letter-spacing: 0.14em; color: #8a6f35; margin-bottom: 22px; }
.dr-card-preview { font-size: 15px; line-height: 2.2; color: #8a6f35; border-top: 1px solid #c9a84c15; padding-top: 18px; }
.dr-diamond { margin: 0 14px; opacity: 0.25; font-size: 10px; }
.dr-ornament { position: absolute; bottom: 14px; left: 16px; font-size: 20px; color: #c9a84c; opacity: 0.08; }

/* ── READING ── */
.dr-nav {
  position: fixed; top: 50%; transform: translateY(-50%); z-index: 40;
  width: 46px; height: 46px; border-radius: 50%; cursor: pointer;
  background: #1a1610; color: #c9a84c; border: 1px solid #c9a84c22;
  font-size: 18px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.dr-nav:hover { background: #c9a84c; color: #0d0b08; }
.dr-nav-r { right: 24px; }
.dr-nav-l { left: 24px; }

.dr-poem { max-width: 760px; margin: 0 auto; padding: 60px 24px 120px; }
.dr-poem.in { animation: poemIn 0.3s ease both; }
.dr-poem.out { animation: poemOut 0.2s ease forwards; }

.dr-poem-header { text-align: center; margin-bottom: 52px; }
.dr-poem-title { font-size: 34px; font-weight: 700; color: #c9a84c; line-height: 1.5; margin-bottom: 14px; }
.dr-poem-meta { font-family: 'Cinzel', serif !important; font-size: 12px; letter-spacing: 0.18em; color: #8a6f35; }

.dr-verse {
  display: grid; grid-template-columns: 1fr 1fr; padding: 16px 20px;
  border-radius: 8px; transition: background 0.3s ease; position: relative;
  animation: fadeUp 0.4s ease both;
}
.dr-verse.static { animation: none; }
.dr-verse:hover { background: #c9a84c12; }

.dr-vnum {
  position: absolute; right: -36px; top: 50%; transform: translateY(-50%);
  font-size: 13px; color: #8a6f35; opacity: 0.25;
}

.dr-sadr {
  text-align: right; line-height: 2.4; letter-spacing: 0.02em; color: #e8d5a3;
  padding-left: 20px;
}
.dr-ajuz {
  text-align: left; line-height: 2.4; letter-spacing: 0.02em; color: #e8d5a3;
  transform: translateY(7px); border-right: 1px solid #c9a84c18; padding-right: 20px;
}

.dr-star { text-align: center; padding: 18px 0; color: #8a6f35; opacity: 0.35; font-size: 16px; letter-spacing: 0.3em; }

.dr-dots { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 40; }
.dr-dot {
  width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer; padding: 0;
  background: #8a6f35; opacity: 0.3; transition: all 0.3s;
}
.dr-dot.active { background: #c9a84c; opacity: 1; transform: scale(1.3); }

/* ── MODAL ── */
.dr-modal {
  position: fixed; inset: 0; z-index: 200; background: #0d0b08f2; backdrop-filter: blur(10px);
  overflow-y: auto; animation: modalIn 0.3s ease both;
}
.dr-modal-close {
  position: sticky; top: 24px; float: left; margin-left: 28px; z-index: 210;
  width: 42px; height: 42px; border-radius: 50%; cursor: pointer;
  background: #1a1610; color: #c9a84c; border: 1px solid #c9a84c22;
  font-size: 18px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.dr-modal-close:hover { background: #c9a84c; color: #0d0b08; }
.dr-modal-inner { max-width: 760px; margin: 0 auto; padding: 60px 24px 80px; }

.dr-poem-divider { display: flex; align-items: center; gap: 20px; padding: 44px 0; color: #c9a84c; opacity: 0.4; font-size: 14px; }
.dr-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, #c9a84c44, transparent); }

/* ── SCROLLBAR ── */
.dr::-webkit-scrollbar { width: 5px; }
.dr::-webkit-scrollbar-track { background: transparent; }
.dr::-webkit-scrollbar-thumb { background: #8a6f3544; border-radius: 3px; }

/* ── MOBILE ── */
@media (max-width: 640px) {
  .dr-grid { grid-template-columns: 1fr; }
  .dr-verse { grid-template-columns: 1fr; gap: 0; }
  .dr-ajuz { transform: none; border-right: none; padding-right: 0; padding-top: 4px; border-top: 1px solid #c9a84c12; text-align: right; }
  .dr-sadr { padding-left: 0; }
  .dr-vnum { display: none; }
  .dr-nav { display: none; }
  .dr-bar { padding: 12px 16px; }
  .dr-content { padding: 32px 16px 60px; }
  .dr-poem { padding: 40px 16px 100px; }
  .dr-controls { gap: 6px; }
  .dr-pill { padding: 4px 12px; font-size: 13px; }
}

/* ── KEYFRAMES ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes poemIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes poemOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-22px); } }
@keyframes modalIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
`
