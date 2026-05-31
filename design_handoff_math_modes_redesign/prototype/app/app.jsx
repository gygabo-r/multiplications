/* ===== app.jsx — shell, scaling, direction switch, nav, tweaks ===== */
const { useState: useSt, useEffect: useEf, useRef: useRf } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "garden",
  "reduceMotion": false,
  "confetti": true
}/*EDITMODE-END*/;

const NAV = [
  { id: 'home', icon: '🎮', label: T.navPlay },
  { id: 'collection', icon: '🏆', label: T.navCollection },
  { id: 'stats', icon: '📊', label: T.navStats },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dir = DIRECTIONS[t.direction] || DIRECTIONS.garden;

  const [screen, setScreen] = useSt('home');
  const [mode, setMode] = useSt('multiply');
  const [num, setNum] = useSt(1);
  const fitRef = useRf(null);

  // scaling to fit viewport
  useEf(() => {
    function fit() {
      if (!fitRef.current) return;
      const W = 1226, H = 866;
      const s = Math.min(window.innerWidth * 0.97 / W, window.innerHeight * 0.9 / H);
      fitRef.current.style.transform = `scale(${s})`;
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  function go(s) { setScreen(s); }
  function startMode(m) { setMode(m); setScreen('map'); }
  function startNumber(n) { setNum(n); setScreen('session'); }

  const showNav = ['home', 'collection', 'stats'].includes(screen);

  // theme vars
  const themeStyle = { ...dir.vars, '--app-font': dir.font };

  return (
    <>
      {/* direction switcher chrome */}
      <div id="switcher">
        {Object.values(DIRECTIONS).map(d => (
          <button key={d.id} className={d.id === t.direction ? 'active' : ''} onClick={() => setTweak('direction', d.id)}>
            {d.tab}
          </button>
        ))}
      </div>

      <div id="stage">
        <div id="fit" ref={fitRef}>
          <div className="ipad">
            <div className="ipad-cam" />
            <div className="screen">
              <div className={`app ${dir.bgClass} ${t.reduceMotion ? 'reduce-motion' : ''}`} style={themeStyle}>
                <BgDecor dir={dir} />
                <div className="layer">
                  {screen === 'home' && <HomeScreen dir={dir} go={go} startMode={startMode} />}
                  {screen === 'map' && <MapScreen dir={dir} mode={mode} startNumber={startNumber} go={go} />}
                  {screen === 'session' && <SessionScreen key={`${dir.id}-${mode}-${num}`} dir={dir} mode={mode} n={num} go={go} confetti={t.confetti} />}
                  {screen === 'collection' && <CollectionScreen dir={dir} go={go} />}
                  {screen === 'stats' && <StatsScreen dir={dir} go={go} />}
                </div>

                {/* bottom nav */}
                {showNav && (
                  <div style={{
                    position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 20, display: 'flex', gap: 6, padding: 7,
                    background: 'var(--surface)', borderRadius: 999,
                    border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,.14)',
                  }}>
                    {NAV.map(item => {
                      const active = screen === item.id;
                      return (
                        <button key={item.id} onClick={() => go(item.id)} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '12px 22px', borderRadius: 999, fontWeight: 700, fontSize: 16,
                          background: active ? dir.rainbow[0] : 'transparent',
                          color: active ? '#fff' : 'var(--sub)',
                          transition: 'all .15s ease',
                        }}>
                          <span style={{ fontSize: 22 }}>{item.icon}</span>
                          {active && item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Irány" />
        <TweakRadio label="Stílus" value={t.direction}
          options={[{ value: 'garden', label: 'Gyümölcs' }, { value: 'space', label: 'Űr' }, { value: 'monster', label: 'Szörny' }]}
          onChange={v => setTweak('direction', v)} />
        <TweakSection label="Élmény" />
        <TweakToggle label="Konfetti" value={t.confetti} onChange={v => setTweak('confetti', v)} />
        <TweakToggle label="Nyugodt mód (kevesebb mozgás)" value={t.reduceMotion} onChange={v => setTweak('reduceMotion', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
