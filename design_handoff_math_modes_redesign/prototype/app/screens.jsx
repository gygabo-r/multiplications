/* ===== screens.jsx — all app screens ===== */
const { useState: useS, useEffect: useE, useRef: useR } = React;

/* ---------- HOME ---------- */
function HomeScreen({ dir, go, startMode }) {
  const streak = getStreak();
  const stars = getTotalStars();
  const modeColors = { multiply: dir.rainbow[0], add: dir.rainbow[3], subtract: dir.rainbow[5] };
  return (
    <div className="scroll screen-enter" style={{ padding: '48px 56px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--sub)' }}>{T.hiSub}</div>
          <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.05, marginTop: 4 }}>{T.hi} 👋</h1>
        </div>
        <Mascot dir={dir} say={streak > 0 ? `${streak}. nap! 🔥` : 'Kezdjük! ✨'} size={86} flip />
      </div>

      {/* stat chips */}
      <div style={{ display: 'flex', gap: 16, marginTop: 30 }}>
        <Panel style={{ flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="bob" style={{ fontSize: 44 }}>🔥</div>
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 15, color: 'var(--sub)', fontWeight: 600 }}>{T.streak}</div>
          </div>
        </Panel>
        <Panel style={{ flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="bob" style={{ fontSize: 44 }}>⭐</div>
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{stars}</div>
            <div style={{ fontSize: 15, color: 'var(--sub)', fontWeight: 600 }}>{T.totalStars}</div>
          </div>
        </Panel>
      </div>

      {/* mode picker */}
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 30, marginBottom: 14 }}>{T.whatToPlay}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {Object.values(MODES).map(m => (
          <button key={m.id} className="mode-card" onClick={() => startMode(m.id)} style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)',
            boxShadow: '0 10px 0 var(--line)', padding: '26px 20px', textAlign: 'left', color: 'var(--ink)',
            display: 'flex', flexDirection: 'column', gap: 14, transition: 'transform .1s ease',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(5px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'none'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, background: modeColors[m.id],
              color: '#fff', fontSize: 40, fontWeight: 700, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{m.symbol}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{m.title}</div>
              <div style={{ fontSize: 15, color: 'var(--sub)', fontWeight: 600, marginTop: 2 }}>{m.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- LEVEL MAP (table picker) ---------- */
function MapScreen({ dir, mode, startNumber, go }) {
  const M = MODES[mode];
  const stats = getModeStats(mode);
  return (
    <div className="scroll screen-enter" style={{ padding: '40px 52px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button className="key" onClick={() => go('home')} style={{ width: 54, height: 54, fontSize: 24, borderRadius: 18, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{M.pickTitle}</h1>
          <div style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 17, marginTop: 4 }}>{T.pickSub}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, marginTop: 34 }}>
        {stats.map((s, i) => (
          <button key={s.n} onClick={() => startNumber(s.n)} className="tile-pop"
            style={{
              position: 'relative', aspectRatio: '1', borderRadius: 28,
              background: 'var(--surface)', border: '2px solid var(--line)',
              boxShadow: '0 8px 0 var(--line)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'transform .1s ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(4px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'none'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{
              fontSize: 40, fontWeight: 700,
              color: dir.rainbow[i % dir.rainbow.length],
            }}>{M.tileLabel(s.n)}</div>
            <Stars count={s.stars} size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- SESSION ---------- */
function SessionScreen({ dir, mode, n, go, onReward, confetti = true }) {
  const { state, currentQuestion, submitAnswer } = useSession(mode, n);
  const M = MODES[mode];
  const [value, setValue] = useS('');
  const [shaking, setShaking] = useS(false);
  const [justCorrect, setJustCorrect] = useS(false);
  const savedRef = useR(false);
  const [reward, setReward] = useS(null);

  const total = 10;
  const offset = state.phase === 'random' ? total : 0;
  const overall = offset + state.currentIndex;

  // reset typed value on new question
  useE(() => { setValue(''); }, [state.currentIndex, state.phase]);

  // shake on wrong
  useE(() => {
    if (state.shakeTrigger === 0) return;
    setShaking(true);
    setValue('');
    const t = setTimeout(() => setShaking(false), 440);
    return () => clearTimeout(t);
  }, [state.shakeTrigger]);

  // correct flash
  useE(() => {
    if (state.flashTrigger === 0) return;
    setJustCorrect(true);
    const t = setTimeout(() => setJustCorrect(false), 360);
    return () => clearTimeout(t);
  }, [state.flashTrigger]);

  // on summary: persist + award once
  useE(() => {
    if (state.phase !== 'summary' || savedRef.current) return;
    savedRef.current = true;
    recordSession(mode, n, state.records, state.fruits);
    const emoji = awardIfNew(dir.id, dir.rewardSet);
    if (emoji) { setReward(emoji); onReward && onReward(emoji); }
  }, [state.phase]);

  // physical keyboard support
  useE(() => {
    function onKey(e) {
      if (state.phase === 'summary') return;
      if (e.key >= '0' && e.key <= '9') setValue(v => (v.length < 3 ? v + e.key : v));
      else if (e.key === 'Backspace') setValue(v => v.slice(0, -1));
      else if (e.key === 'Enter') doEnter();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function doEnter() {
    if (value === '') return;
    submitAnswer(parseInt(value, 10), dir.tray);
  }

  if (state.phase === 'summary') {
    return (
      <>
        <SummaryScreen dir={dir} mode={mode} n={n} records={state.records} fruits={state.fruits} go={go} confetti={confetti} />
        {reward && <RewardOverlay dir={dir} emoji={reward} onDismiss={() => setReward(null)} confetti={confetti} />}
      </>
    );
  }

  const phaseLabel = state.phase === 'sequential' ? `1. ${T.round} · ${T.phaseSeq}` : `2. ${T.round} · ${T.phaseRnd}`;

  return (
    <div className="screen-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 44px 36px' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <button className="key" onClick={() => go('map')} style={{ height: 48, padding: '0 18px', fontSize: 17, borderRadius: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>← {T.back}</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--sub)' }}>{phaseLabel}</div>
        <div style={{
          fontWeight: 700, fontSize: 17, padding: '8px 16px', borderRadius: 999,
          background: dir.rainbow[0], color: '#fff', whiteSpace: 'nowrap',
        }}>{M.badge(n)}</div>
      </div>

      {/* progress */}
      <div style={{ marginTop: 20 }}>
        <ProgressTrack overall={overall} total={total * 2} dir={dir} />
      </div>

      {/* tray */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, minHeight: 46, flexWrap: 'wrap' }}>
        {state.fruits.length === 0 && <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 15 }}>🧺 {dir.playWord}</span>}
        {state.fruits.map((f, i) => (
          <span key={i} className={i === state.fruits.length - 1 ? 'tray-in' : ''} style={{ fontSize: 26 }}>{f}</span>
        ))}
      </div>

      {/* main two-column play area */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 40, alignItems: 'center', marginTop: 8 }}>
        {/* equation + answer */}
        <div className={shaking ? 'shake' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          {currentQuestion && (
            <div key={`${state.phase}-${state.currentIndex}`} className="eq-in" style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, textAlign: 'center', letterSpacing: '-2px' }}>
              {currentQuestion.a} <span style={{ color: dir.rainbow[5] }}>{currentQuestion.op}</span> {currentQuestion.b} <span style={{ color: 'var(--sub)' }}>=</span>
            </div>
          )}
          <div style={{
            width: 280, height: 120, borderRadius: 28,
            border: `4px solid ${shaking ? 'var(--accent)' : justCorrect ? 'var(--primary)' : 'var(--line)'}`,
            background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, fontWeight: 700, transition: 'border-color .2s',
            color: justCorrect ? 'var(--primary)' : 'var(--ink)',
          }} className={justCorrect ? 'flash' : ''}>
            {value === '' ? <span style={{ color: 'var(--sub)', opacity: .5 }}>?</span> : (justCorrect ? '✓' : value)}
          </div>
        </div>

        {/* keypad */}
        <div style={{ maxWidth: 360, width: '100%', justifySelf: 'center' }}>
          <Keypad
            onDigit={d => setValue(v => (v.length < 3 ? v + d : v))}
            onClear={() => setValue(v => v.slice(0, -1))}
            onEnter={doEnter}
            disabled={shaking}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- SUMMARY ---------- */
function SummaryScreen({ dir, mode, n, records, fruits, go, confetti = true }) {
  const M = MODES[mode];
  const firstTry = records.filter(r => r.firstTryCorrect).length;
  const total = records.length;
  return (
    <div className="screen-enter" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 22 }}>
      {confetti && <Confetti colors={dir.rainbow} n={50} />}
      <div className="reward-pop" style={{ fontSize: 76 }}>🎉</div>
      <h1 style={{ fontSize: 46, fontWeight: 700 }}>{T.summaryTitle}</h1>
      <Mascot dir={dir} say={`${firstTry}/${total} elsőre! 🌟`} size={72} />
      <Panel style={{ width: 460, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Row label={M.title} value={M.tileLabel(n)} />
        <Row label={T.sFirst} value={`${firstTry}/${total}`} accent />
        <div>
          <div style={{ fontSize: 15, color: 'var(--sub)', fontWeight: 600, marginBottom: 8 }}>{T.sCollected}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {fruits.map((f, i) => <span key={i} style={{ fontSize: 24 }}>{f}</span>)}
          </div>
        </div>
      </Panel>
      <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
        <button className="key" onClick={() => go('map')} style={{ padding: '16px 28px', fontSize: 19, fontWeight: 700, borderRadius: 18 }}>{T.again}</button>
        <button className="pbtn" onClick={() => go('home')} style={{ padding: '16px 34px', fontSize: 19, borderRadius: 18 }}>{T.home}</button>
      </div>
    </div>
  );
}
function Row({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 18 }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 22, color: accent ? 'var(--primary)' : 'var(--ink)' }}>{value}</span>
    </div>
  );
}

/* ---------- REWARD OVERLAY ---------- */
function RewardOverlay({ dir, emoji, onDismiss, confetti = true }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: dir.id === 'space' ? 'rgba(10,8,30,.92)' : dir.id === 'monster' ? 'rgba(34,26,51,.9)' : 'rgba(255,111,145,.92)',
      backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', color: '#fff',
    }}>
      {confetti && <Confetti colors={dir.rainbow} n={80} />}
      <div className="reward-pop" style={{ fontSize: 150, lineHeight: 1, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,.3))' }}>{emoji}</div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginTop: 20 }}>{dir.rewardTitle}</h2>
      <p style={{ fontSize: 20, opacity: .85, marginTop: 8 }}>{T.comeBack}</p>
      <button onClick={onDismiss} style={{
        marginTop: 30, padding: '16px 40px', fontSize: 22, fontWeight: 700,
        borderRadius: 999, background: '#fff', color: 'var(--ink)',
        boxShadow: '0 10px 28px rgba(0,0,0,.25)',
      }}>{T.hooray}</button>
    </div>
  );
}

/* ---------- COLLECTION ---------- */
function CollectionScreen({ dir, go }) {
  const owned = getCollection(dir.id);
  const ownedSet = new Set(owned.map(o => o.emoji));
  const ownedByEmoji = {};
  owned.forEach(o => { if (!ownedByEmoji[o.emoji]) ownedByEmoji[o.emoji] = o.date; });
  return (
    <div className="scroll screen-enter" style={{ padding: '40px 52px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 700 }}>{dir.collectionTitle} {dir.collectionIcon}</h1>
          <div style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 18, marginTop: 6 }}>
            {T.collectedSoFar}: <strong style={{ color: 'var(--ink)' }}>{ownedSet.size}</strong> / {dir.rewardSet.length}
          </div>
        </div>
        <div className="bob" style={{ fontSize: 56 }}>{dir.mascot}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 30 }}>
        {dir.rewardSet.map((emoji, i) => {
          const have = ownedSet.has(emoji);
          return (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 22, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              background: have ? 'var(--surface)' : 'var(--line)',
              border: '1px solid var(--line)',
              boxShadow: have ? '0 6px 16px rgba(0,0,0,.08)' : 'none',
            }}>
              <span style={{ fontSize: 38, filter: have ? 'none' : 'grayscale(1)', opacity: have ? 1 : .25 }}>
                {have ? emoji : '❓'}
              </span>
              {have && <span style={{ fontSize: 11, color: 'var(--sub)', fontWeight: 600 }}>{ownedByEmoji[emoji].slice(5)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- STATS ---------- */
function StatsScreen({ dir, go }) {
  const [statMode, setStatMode] = useS('multiply');
  const activeDays = new Set(getActiveDays());
  const stats = getModeStats(statMode);
  const recent = getRecent(6);
  // last 70 days
  const cells = [];
  const today = new Date();
  for (let i = 69; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ iso, active: activeDays.has(iso) });
  }
  return (
    <div className="scroll screen-enter" style={{ padding: '40px 52px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700 }}>{T.statsTitle} 📊</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 26 }}>
        {/* heatmap */}
        <Panel style={{ padding: '22px 24px' }}>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>{T.activeDays}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
            {cells.map((c, i) => (
              <div key={i} title={c.iso} style={{
                aspectRatio: '1', borderRadius: 6,
                background: c.active ? dir.rainbow[3] : 'var(--line)',
              }} />
            ))}
          </div>
          <div style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, fontWeight: 600 }}>
            {activeDays.size} {T.daysActive} · {T.last70}
          </div>
        </Panel>

        {/* recent */}
        <Panel style={{ padding: '22px 24px' }}>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>{T.recent}</div>
          {recent.length === 0 && <div style={{ color: 'var(--sub)', fontWeight: 600 }}>{T.noRecent}</div>}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.map(s => {
              const ft = s.questions.filter(q => q.firstTryCorrect).length;
              return (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontWeight: 700 }}>{MODES[s.mode] ? MODES[s.mode].tileLabel(s.n) : `${s.n}×`} <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 14 }}>{s.date.slice(5)}</span></span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{ft}/{s.questions.length} <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 14 }}>{T.first}</span></span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* mode overview */}
      <Panel style={{ padding: '22px 24px', marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: 19 }}>{T.tablesOverview}</div>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg)', borderRadius: 999 }}>
            {Object.values(MODES).map(m => (
              <button key={m.id} onClick={() => setStatMode(m.id)} style={{
                padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 15,
                background: statMode === m.id ? dir.rainbow[0] : 'transparent',
                color: statMode === m.id ? '#fff' : 'var(--sub)', transition: 'all .15s',
              }}>{m.symbol} {m.title}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {stats.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 0', borderRadius: 18, background: 'var(--bg)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: dir.rainbow[i % dir.rainbow.length] }}>{MODES[statMode].tileLabel(s.n)}</div>
              {s.sessions ? <Stars count={s.stars} size={14} /> : <span style={{ fontSize: 12, color: 'var(--sub)', fontWeight: 600 }}>{T.noData}</span>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, MapScreen, SessionScreen, SummaryScreen, RewardOverlay, CollectionScreen, StatsScreen,
});
