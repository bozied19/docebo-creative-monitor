// Phoenix Slide templates — modular React components
// Each fills a 1920×1080 slide. Compose them inside <section> tags in index.html.

function TitleSlide({ title = "The 2026 State of L&D", subtitle = "What 4,200 leaders told us about AI, ROI, and skills." }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#06065D', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <svg viewBox="0 0 1080 1080" width="900" height="900" style={{ position: 'absolute', right: -120, top: -80 }}>
        <path d="M 734.4 0 L 1080 0 L 1080 1080 L 172.8 1080 L 11.653 838.279 C 4.2 827.1 1.56 813.391 4.328 800.244 L 172.8 0 L 734.4 0 Z" fill="#FF5DD8" />
      </svg>
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 40, letterSpacing: '-0.025em' }}>docebo</div>
      <div style={{ position: 'absolute', left: 100, top: 320, width: 1100 }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontWeight: 600, fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF5DD8', marginBottom: 36 }}>— REPORT · APRIL 2026</div>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 140, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0 }}>{title}</h1>
        <p style={{ fontFamily: 'var(--ff-body)', fontSize: 28, color: 'rgba(255,255,255,0.75)', maxWidth: 900, marginTop: 32, lineHeight: 1.4 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function SectionBreak({ number = '01', title = "AI-native learning isn't optional anymore." }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#E6DACB', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 32, color: '#06065D', letterSpacing: '-0.025em' }}>docebo</div>
      <div style={{ position: 'absolute', left: 100, top: 240, fontFamily: 'var(--ff-mono)', fontWeight: 600, fontSize: 24, letterSpacing: '0.12em', color: '#7E2EE9' }}>— SECTION {number}</div>
      <h1 style={{ position: 'absolute', left: 100, top: 320, width: 1700, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 180, lineHeight: 0.95, letterSpacing: '-0.025em', color: '#06065D', margin: 0 }}>{title}</h1>
    </div>
  );
}

function BigQuoteSlide({ quote = "We replaced four tools and shipped onboarding in a week.", author = "VP of Learning", company = "Fortune 500 retail" }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.025em' }}>docebo</div>
      <div style={{ position: 'absolute', left: 100, top: 280, fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 100, color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>"</div>
      <p style={{ position: 'absolute', left: 100, top: 380, width: 1700, fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 88, lineHeight: 1.15, letterSpacing: '-0.01em', margin: 0 }}>{quote}</p>
      <div style={{ position: 'absolute', left: 100, bottom: 120 }}>
        <div style={{ fontFamily: 'var(--ff-body)', fontWeight: 700, fontSize: 26 }}>{author}</div>
        <div style={{ fontFamily: 'var(--ff-body)', fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>{company}</div>
      </div>
    </div>
  );
}

function StatSlide({ stat = '3.2x', label = 'ROI on AI-native learning programs', context = 'Average across 1,400 enterprise customers, 2024–2026.' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#131E29', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.025em' }}>docebo</div>
      <div style={{ position: 'absolute', left: 100, top: 240, fontFamily: 'var(--ff-mono)', fontWeight: 600, fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#54FA77' }}>— DATA POINT</div>
      <div style={{ position: 'absolute', left: 100, top: 280, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 480, lineHeight: 0.85, letterSpacing: '-0.04em', color: '#54FA77', textShadow: '0 0 80px rgba(84,250,119,0.4)' }}>{stat}</div>
      <div style={{ position: 'absolute', left: 100, top: 740, width: 1500, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 72, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{label}</div>
      <div style={{ position: 'absolute', left: 100, bottom: 100, fontFamily: 'var(--ff-body)', fontSize: 22, color: 'rgba(255,255,255,0.55)', maxWidth: 900 }}>{context}</div>
    </div>
  );
}

function ComparisonSlide({ left = { title: 'Compliance theatre', items: ['Check-the-box training', 'No measurable outcome', 'Audit panic, twice a year'] }, right = { title: 'Outcomes', items: ['AI-personalized paths', 'ROI tracked per skill', 'Audit-ready by design'] } }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden', color: '#06065D' }}>
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.025em' }}>docebo</div>
      <div style={{ position: 'absolute', left: 100, top: 240, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 100, lineHeight: 0.95, letterSpacing: '-0.025em' }}>This, not that.</div>
      <div style={{ position: 'absolute', left: 100, top: 480, width: 820, padding: 56, background: '#EBE6DD', borderRadius: 14 }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontWeight: 600, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#56534E' }}>— BEFORE</div>
        <h3 style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 56, marginTop: 20, marginBottom: 32, letterSpacing: '-0.02em' }}>{left.title}</h3>
        {left.items.map((it, i) => (
          <div key={i} style={{ fontFamily: 'var(--ff-body)', fontSize: 24, color: 'rgba(6,6,93,0.7)', padding: '14px 0', borderTop: i ? '1px solid rgba(6,6,93,0.12)' : 'none' }}>{it}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 480, width: 820, padding: 56, background: '#06065D', color: '#fff', borderRadius: 14 }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontWeight: 600, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF5DD8' }}>— WITH DOCEBO</div>
        <h3 style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 56, marginTop: 20, marginBottom: 32, letterSpacing: '-0.02em' }}>{right.title}</h3>
        {right.items.map((it, i) => (
          <div key={i} style={{ fontFamily: 'var(--ff-body)', fontSize: 24, color: 'rgba(255,255,255,0.85)', padding: '14px 0', borderTop: i ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>{it}</div>
        ))}
      </div>
    </div>
  );
}

function CTASlide({ title = 'Train smarter.\nWin bigger.', cta = 'Book a demo' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#06065D', overflow: 'hidden', color: '#fff' }}>
      <svg viewBox="0 0 1080 1080" width="800" height="800" style={{ position: 'absolute', right: -100, bottom: -100 }}>
        <path d="M 734.4 0 L 1080 0 L 1080 1080 L 172.8 1080 L 11.653 838.279 C 4.2 827.1 1.56 813.391 4.328 800.244 L 172.8 0 L 734.4 0 Z" fill="#E3FFAB" />
      </svg>
      <div style={{ position: 'absolute', left: 100, top: 100, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 40, letterSpacing: '-0.025em' }}>docebo</div>
      <h1 style={{ position: 'absolute', left: 100, top: 360, width: 1200, fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 200, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0, whiteSpace: 'pre-line' }}>{title}</h1>
      <button style={{
        position: 'absolute', left: 100, bottom: 120,
        fontFamily: 'var(--ff-body)', fontWeight: 700, fontSize: 28,
        padding: '24px 56px', borderRadius: 999, background: '#FF5DD8',
        color: '#06065D', border: 'none', cursor: 'pointer',
      }}>{cta} →</button>
    </div>
  );
}

window.PhoenixSlides = { TitleSlide, SectionBreak, BigQuoteSlide, StatSlide, ComparisonSlide, CTASlide };
