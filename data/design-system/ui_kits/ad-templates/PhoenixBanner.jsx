// PhoenixBanner — building blocks for Docebo Phoenix ad templates
// All elements positioned within a 1920×1080 art board; scaled by parent.

const Wordmark = ({ color = '#fff', size = 36, style = {} }) => (
  <span style={{
    fontFamily: 'var(--ff-display)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: size,
    color,
    letterSpacing: '-0.025em',
    lineHeight: 1,
    display: 'inline-block',
    ...style,
  }}>docebo</span>
);

const Eyebrow = ({ children, color = '#FF5DD8', style = {} }) => (
  <div style={{
    fontFamily: 'var(--ff-mono)',
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color,
    ...style,
  }}>{children}</div>
);

const HeroHeadline = ({ children, color = '#fff', accent, accentColor = '#FF5DD8', size = 96, style = {} }) => (
  <h1 style={{
    fontFamily: 'var(--ff-display)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: '-0.025em',
    color,
    margin: 0,
    ...style,
  }}>
    {children}
    {accent && <><br /><span style={{ color: accentColor }}>{accent}</span></>}
  </h1>
);

const SubMeta = ({ children, color = 'rgba(255,255,255,0.85)', size = 22, style = {} }) => (
  <div style={{
    fontFamily: 'var(--ff-body)',
    fontWeight: 500,
    fontSize: size,
    lineHeight: 1.35,
    color,
    ...style,
  }}>{children}</div>
);

const PillCTA = ({ children, mode = 'outline-light', style = {} }) => {
  const base = {
    fontFamily: 'var(--ff-body)',
    fontWeight: 700,
    fontSize: 22,
    padding: '20px 44px',
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    border: 'none',
    letterSpacing: '-0.005em',
  };
  const modes = {
    'outline-light': { ...base, background: 'transparent', color: '#fff', border: '1.8px solid rgba(255,255,255,0.85)' },
    'solid-pink': { ...base, background: '#FF5DD8', color: '#06065D' },
    'solid-green': { ...base, background: '#E3FFAB', color: '#106D24' },
    'solid-navy': { ...base, background: '#0033A0', color: '#fff' },
    'solid-purple': { ...base, background: '#7E2EE9', color: '#fff' },
  };
  return <button style={{ ...modes[mode], ...style }}>{children} <span style={{ marginLeft: 4 }}>→</span></button>;
};

// The "Rock" — recurring blob/shape behind portraits or used as a focal element.
// Polygon path inferred from Figma /Rock-Styling page.
const Rock = ({ width = 1080, height = 1080, fill = '#FF5DD8', style = {} }) => (
  <svg viewBox="0 0 1080 1080" width={width} height={height} style={style}>
    <path d="M 734.4 0 L 1080 0 L 1080 1080 L 172.8 1080 L 11.653 838.279 C 4.2 827.1 1.56 813.391 4.328 800.244 L 172.8 0 L 734.4 0 Z" fill={fill} />
  </svg>
);

// Phoenix gradient fill (only sanctioned multi-stop gradient).
const phoenixGradient = 'linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)';

const SpeakerCard = ({ name, role, bg = 'rgba(255,255,255,0.06)', portraitColor = '#DCB7FF', style = {} }) => (
  <div style={{
    width: 260,
    borderRadius: 18,
    background: bg,
    border: '1px solid rgba(255,255,255,0.18)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    ...style,
  }}>
    <div style={{
      width: '100%',
      aspectRatio: '1 / 1',
      borderRadius: 12,
      background: `linear-gradient(135deg, ${portraitColor} 0%, rgba(255,255,255,0.04) 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'var(--ff-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>Portrait</div>
    <div>
      <div style={{ fontFamily: 'var(--ff-body)', fontWeight: 700, fontSize: 18, color: '#fff' }}>{name}</div>
      <div style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{role}</div>
    </div>
  </div>
);

const Stat = ({ value, label, color = '#54FA77' }) => (
  <div>
    <div style={{
      fontFamily: 'var(--ff-display)',
      fontStyle: 'italic',
      fontSize: 84,
      lineHeight: 0.95,
      color,
      letterSpacing: '-0.02em',
    }}>{value}</div>
    <div style={{
      fontFamily: 'var(--ff-mono)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.7)',
      marginTop: 6,
    }}>{label}</div>
  </div>
);

const LogoBar = ({ logos = ['Zoom', 'Samsung', 'Pret', 'La-Z-Boy', 'Walmart'], color = 'rgba(255,255,255,0.5)' }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
    {logos.map((l, i) => (
      <div key={i} style={{
        fontFamily: 'var(--ff-body)',
        fontWeight: 700,
        fontSize: 22,
        color,
        letterSpacing: '-0.005em',
      }}>{l}</div>
    ))}
  </div>
);

const DateChip = ({ date, time }) => (
  <div style={{
    fontFamily: 'var(--ff-body)',
    fontWeight: 600,
    fontSize: 22,
    color: '#fff',
    lineHeight: 1.4,
  }}>
    <div>{date}</div>
    <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{time}</div>
  </div>
);

window.PhoenixBanner = {
  Wordmark, Eyebrow, HeroHeadline, SubMeta, PillCTA, Rock, SpeakerCard,
  Stat, LogoBar, DateChip, phoenixGradient,
};
