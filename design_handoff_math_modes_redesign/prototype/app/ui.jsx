/* ===== ui.jsx — shared playful components ===== */
const { useState: useStateUI, useEffect: useEffectUI, useRef: useRefUI } = React;

// ---- decorative background per direction ----
function BgDecor({ dir }) {
  if (dir.id === 'space') {
    const stars = Array.from({ length: 46 }, (_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      s: 1 + Math.random() * 2.5, d: Math.random() * 3,
    }));
    return (
      <div className="bg-decor">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 70% 0%, #2A2070, transparent), radial-gradient(120% 90% at 10% 100%, #3A1A60, transparent)' }} />
        {stars.map((s, i) => (
          <div key={i} className="starbit" style={{ left: s.x + '%', top: s.y + '%', width: s.s, height: s.s, animationDelay: s.d + 's' }} />
        ))}
        <div style={{ left: '78%', top: '14%', fontSize: 52, opacity: .9, animation: 'float-y 7s ease-in-out infinite', '--r': '12deg' }}>🪐</div>
        <div style={{ left: '8%', top: '20%', fontSize: 30, opacity: .8, animation: 'float-y 6s ease-in-out infinite' }}>☄️</div>
      </div>
    );
  }
  if (dir.id === 'monster') {
    return (
      <div className="bg-decor">
        <div className="blob" style={{ left: '-6%', top: '-8%', width: 260, height: 260, background: '#FF4D6D', opacity: .22 }} />
        <div className="blob" style={{ right: '-8%', top: '8%', width: 300, height: 300, background: '#7A4DFF', opacity: .18 }} />
        <div className="blob" style={{ left: '30%', bottom: '-14%', width: 320, height: 320, background: '#00C2A8', opacity: .16 }} />
        {/* sticker dots */}
        <div style={{ left: '12%', bottom: '12%', fontSize: 40, opacity: .5, animation: 'spinwobble 5s ease-in-out infinite' }}>✦</div>
        <div style={{ right: '14%', top: '40%', fontSize: 34, opacity: .5, animation: 'spinwobble 6s ease-in-out infinite' }}>✦</div>
      </div>
    );
  }
  // garden
  return (
    <div className="bg-decor">
      <div className="blob" style={{ left: '-8%', top: '-10%', width: 280, height: 280, background: '#FFC93C', opacity: .35 }} />
      <div className="blob" style={{ right: '-10%', top: '-6%', width: 240, height: 240, background: '#FF6F91', opacity: .28 }} />
      <div className="blob" style={{ right: '6%', bottom: '-16%', width: 300, height: 300, background: '#33C97E', opacity: .22 }} />
      <div className="blob" style={{ left: '-6%', bottom: '-12%', width: 240, height: 240, background: '#3BC9DB', opacity: .22 }} />
      <div style={{ left: '80%', top: '12%', fontSize: 40, opacity: .8, animation: 'float-y 6s ease-in-out infinite', '--r': '8deg' }}>🌸</div>
      <div style={{ left: '6%', top: '30%', fontSize: 32, opacity: .75, animation: 'float-y 7s ease-in-out infinite' }}>🍃</div>
    </div>
  );
}

// ---- star rating (mastery) ----
function Stars({ count, size = 18 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ fontSize: size, filter: i < count ? 'none' : 'grayscale(1)', opacity: i < count ? 1 : .28 }}>⭐</span>
      ))}
    </div>
  );
}

// ---- mascot bubble ----
function Mascot({ dir, say, size = 78, flip = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className="bob" style={{ fontSize: size, lineHeight: 1, transform: flip ? 'scaleX(-1)' : 'none' }}>{dir.mascot}</div>
      {say && (
        <div style={{
          background: 'var(--surface)', color: 'var(--ink)', padding: '12px 18px',
          borderRadius: 22, borderBottomLeftRadius: 6, fontWeight: 600, fontSize: 19,
          boxShadow: '0 6px 16px rgba(0,0,0,.10)', border: '1px solid var(--line)',
        }}>{say}</div>
      )}
    </div>
  );
}

// ---- confetti burst ----
function Confetti({ colors, n = 60 }) {
  const bits = useRefUI(null);
  if (!bits.current) {
    bits.current = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      dur: 1.4 + Math.random() * 1.2,
      c: colors[i % colors.length],
      size: 8 + Math.random() * 10,
      round: Math.random() > 0.5,
    }));
  }
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 }}>
      {bits.current.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x + '%', top: -20,
          width: b.size, height: b.size, background: b.c,
          borderRadius: b.round ? '50%' : 3,
          animation: `confettiFall ${b.dur}s ${b.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ---- progress track with travelling avatar ----
function ProgressTrack({ overall, total, dir }) {
  const pct = Math.round((overall / total) * 100);
  const avatar = dir.id === 'space' ? '🚀' : dir.id === 'monster' ? '👾' : '🐝';
  return (
    <div style={{ position: 'relative', height: 30 }}>
      <div style={{ position: 'absolute', top: 11, left: 0, right: 0, height: 10, borderRadius: 999, background: 'var(--line)' }} />
      <div style={{
        position: 'absolute', top: 11, left: 0, height: 10, borderRadius: 999,
        width: `calc(${pct}% )`, background: `linear-gradient(90deg, ${dir.rainbow[3]}, ${dir.rainbow[0]})`,
        transition: 'width .45s cubic-bezier(.2,.9,.3,1.1)',
      }} />
      <div style={{
        position: 'absolute', top: -3, left: `calc(${pct}% - 16px)`,
        fontSize: 28, transition: 'left .45s cubic-bezier(.2,.9,.3,1.1)',
        transform: dir.id === 'space' ? 'rotate(0deg)' : 'none',
      }}>{avatar}</div>
    </div>
  );
}

// ---- number keypad ----
function Keypad({ onDigit, onClear, onEnter, disabled }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
      {keys.map(k => (
        <button key={k} className="key" style={{ height: 70, fontSize: 34 }}
          onClick={() => onDigit(k)} disabled={disabled}>{k}</button>
      ))}
      <button className="key" style={{ height: 70, fontSize: 26, background: 'var(--ring)', color: '#fff', boxShadow: '0 5px 0 rgba(0,0,0,.18)' }}
        onClick={onClear} disabled={disabled}>⌫</button>
      <button className="key" style={{ height: 70, fontSize: 34 }}
        onClick={() => onDigit('0')} disabled={disabled}>0</button>
      <button className="key" style={{ height: 70, fontSize: 32, background: 'var(--primary)', color: '#fff', boxShadow: '0 5px 0 var(--primary-shadow)' }}
        onClick={onEnter} disabled={disabled}>✓</button>
    </div>
  );
}

// ---- soft rounded card ----
function Panel({ children, style, onClick, className }) {
  return (
    <div className={className} onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,.06)',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { BgDecor, Stars, Mascot, Confetti, ProgressTrack, Keypad, Panel });
