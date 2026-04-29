// Five canonical Phoenix banner templates, each at 1920×1080 (or stated).
// Each renders as an absolute-positioned scene inside its parent at design-pixel scale.

const {
  Wordmark, Eyebrow, HeroHeadline, SubMeta, PillCTA, Rock, SpeakerCard,
  Stat, LogoBar, DateChip, phoenixGradient,
} = window.PhoenixBanner;

// ── 1. Webinar / Product Release — Navy + Pink Rock ─────────────────────
function WebinarNavyPink({ title = "What's new in Docebo", subtitle = 'February 2026', date = 'Feb 12, 2026', time = '10:00 – 11:00 AM EST' }) {
  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, background: '#06065D', overflow: 'hidden' }}>
      {/* circuit grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Rock on right, pink */}
      <div style={{ position: 'absolute', right: 0, top: 0 }}>
        <Rock width={1080} height={1080} fill="#FF5DD8" />
      </div>
      <div style={{ position: 'absolute', left: 100, top: 240, width: 900 }}>
        <Eyebrow color="#FF5DD8" style={{ marginBottom: 36 }}>WEBINAR · PRODUCT RELEASE</Eyebrow>
        <HeroHeadline size={120} accent={subtitle} accentColor="#FF5DD8">{title}</HeroHeadline>
        <div style={{ marginTop: 56 }}>
          <DateChip date={date} time={time} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 100, bottom: 80 }}>
        <PillCTA mode="outline-light">Register now</PillCTA>
      </div>
      <div style={{ position: 'absolute', right: 80, bottom: 64 }}>
        <Wordmark color="#fff" size={72} />
      </div>
    </div>
  );
}

// ── 2. DU Live event — Beige + Speakers ────────────────────────────────
function DULiveSpeakers({ title = 'Design better learning environments', date = 'May 8 · DU Live' }) {
  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, background: '#E6DACB', overflow: 'hidden' }}>
      {/* diagonal lime accent slash bottom-left */}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, width: 800, height: 240,
        background: '#E3FFAB',
        clipPath: 'polygon(0 100%, 0 60%, 100% 0, 100% 100%)',
      }} />
      <div style={{ position: 'absolute', left: 100, top: 100 }}>
        <Wordmark color="#06065D" size={56} />
      </div>
      <div style={{ position: 'absolute', left: 100, top: 220, width: 1100 }}>
        <Eyebrow color="#7E2EE9" style={{ marginBottom: 32 }}>— DU LIVE · NYC · MAY 8</Eyebrow>
        <HeroHeadline color="#06065D" size={130}>{title}</HeroHeadline>
        <div style={{ marginTop: 56, fontFamily: 'var(--ff-body)', fontWeight: 600, fontSize: 24, color: '#06065D' }}>{date}</div>
      </div>
      {/* speaker cards on the right */}
      <div style={{ position: 'absolute', right: 100, top: 220, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {['Dr. Aisha Patel', 'Marcus Chen', 'Sofia Romano'].map((n, i) => (
          <div key={n} style={{
            display: 'flex', alignItems: 'center', gap: 18,
            background: 'rgba(6,6,93,0.04)', padding: 18, borderRadius: 14,
            border: '1px solid rgba(6,6,93,0.12)',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: ['#FF5DD8', '#7E2EE9', '#54FA77'][i],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 28, color: '#06065D',
            }}>{n.split(' ').map(s => s[0]).join('')}</div>
            <div>
              <div style={{ fontFamily: 'var(--ff-body)', fontWeight: 700, fontSize: 22, color: '#06065D' }}>{n}</div>
              <div style={{ fontFamily: 'var(--ff-body)', fontSize: 16, color: 'rgba(6,6,93,0.65)' }}>{['Head of L&D, Zoom', 'VP Talent, Samsung', 'CEO, Future Skills Co.'][i]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 100, bottom: 64 }}>
        <PillCTA mode="solid-navy">Register</PillCTA>
      </div>
    </div>
  );
}

// ── 3. Data-as-Power — dark grid, big stats ────────────────────────────
function DataAsPower({ stat = '3.2x', label = 'ROI on AI-native learning', body = '4,200 enterprise L&D leaders. One report.' }) {
  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, background: '#131E29', overflow: 'hidden' }}>
      {/* data grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      <div style={{ position: 'absolute', left: 100, top: 100 }}>
        <Wordmark color="#fff" size={56} />
      </div>
      <div style={{ position: 'absolute', left: 100, top: 280, width: 1700 }}>
        <Eyebrow color="#54FA77" style={{ marginBottom: 36 }}>— THE 2026 STATE OF L&D</Eyebrow>
        <div style={{
          fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 360,
          lineHeight: 0.85, color: '#54FA77', letterSpacing: '-0.04em',
          textShadow: '0 0 60px rgba(84,250,119,0.35)',
        }}>{stat}</div>
        <div style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 72, color: '#fff', marginTop: 24, letterSpacing: '-0.02em' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--ff-body)', fontSize: 28, color: 'rgba(255,255,255,0.65)', marginTop: 32 }}>
          {body}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 100, bottom: 64 }}>
        <PillCTA mode="solid-green">See the data</PillCTA>
      </div>
    </div>
  );
}

// ── 4. Rebellious Editorial — uppercase italic, asterisk ───────────────
function RebelliousEditorial({ headline = 'YOUR LMS IS\nLYING TO YOU.*', footnote = '*Most aren\'t built for outcomes. We are.' }) {
  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, background: '#2A2923', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', left: 100, top: 100 }}>
        <Wordmark color="#fff" size={48} />
      </div>
      <div style={{
        position: 'absolute', right: -60, top: 60,
        fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: 720,
        color: '#FF5DD8', lineHeight: 1, letterSpacing: '-0.05em', userSelect: 'none',
      }}>*</div>
      <div style={{ position: 'absolute', left: 100, top: 320, width: 1500 }}>
        <h1 style={{
          fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontWeight: 400,
          textTransform: 'uppercase', fontSize: 200, lineHeight: 0.95,
          letterSpacing: '-0.03em', whiteSpace: 'pre-line', margin: 0,
        }}>{headline}</h1>
      </div>
      <div style={{
        position: 'absolute', left: 100, bottom: 180, width: 900,
        fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 26,
        color: 'rgba(255,255,255,0.7)', lineHeight: 1.4,
      }}>
        {footnote}
      </div>
      <div style={{ position: 'absolute', right: 100, bottom: 80 }}>
        <PillCTA mode="solid-pink">Read the truth</PillCTA>
      </div>
    </div>
  );
}

// ── 5. Co-brand / Partner — Beige + Pink Rock + Logo Lockup ─────────────
function CoBrandPartner({ title = 'Skills intelligence,\nin action.', partner = '365 Talents', date = 'June 18 · Webinar' }) {
  return (
    <div style={{ position: 'relative', width: 1920, height: 1080, background: '#E6DACB', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 0, top: 0 }}>
        <Rock width={1080} height={1080} fill="#FF5DD8" />
      </div>
      <div style={{ position: 'absolute', left: 100, top: 100, display: 'flex', alignItems: 'center', gap: 28 }}>
        <Wordmark color="#06065D" size={48} />
        <div style={{ width: 1, height: 36, background: 'rgba(6,6,93,0.3)' }} />
        <div style={{ fontFamily: 'var(--ff-body)', fontWeight: 700, fontSize: 28, color: '#06065D', letterSpacing: '-0.01em' }}>{partner}</div>
      </div>
      <div style={{ position: 'absolute', left: 100, top: 280, width: 1100 }}>
        <Eyebrow color="#7E2EE9" style={{ marginBottom: 36 }}>— PARTNER WEBINAR</Eyebrow>
        <HeroHeadline color="#06065D" size={140}>{title}</HeroHeadline>
        <div style={{ marginTop: 48, fontFamily: 'var(--ff-body)', fontWeight: 600, fontSize: 26, color: '#06065D' }}>{date}</div>
      </div>
      <div style={{ position: 'absolute', left: 100, bottom: 80 }}>
        <PillCTA mode="solid-navy">Register</PillCTA>
      </div>
    </div>
  );
}

window.PhoenixTemplates = { WebinarNavyPink, DULiveSpeakers, DataAsPower, RebelliousEditorial, CoBrandPartner };
