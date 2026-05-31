import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getModeConfig, RAINBOW } from '@/lib/modes'
import { useSession } from '@/hooks/useSession'
import { useDailyAnimal } from '@/hooks/useDailyAnimal'
import { FruitTray } from '@/components/session/FruitTray'
import { ProgressTrack } from '@/components/session/ProgressTrack'
import { Keypad } from '@/components/session/Keypad'
import { SummaryScreen } from '@/components/session/SummaryScreen'
import { AnimalAwardOverlay } from '@/components/animals/AnimalAwardOverlay'
import type { Mode } from '@/lib/tables'

export default function SessionPage() {
  const { mode, n } = useParams<{ mode: string; n: string }>()
  const parsedMode = (mode as Mode) ?? 'multiply'
  const parsedN = parseInt(n ?? '1', 10)

  return <SessionRunner mode={parsedMode} n={parsedN} />
}

function SessionRunner({ mode, n }: { mode: Mode; n: number }) {
  const navigate = useNavigate()
  const cfg = getModeConfig(mode)
  const { state, currentQuestion, submitAnswer, persistSession } = useSession(mode, n)
  const { pendingAnimal, awardIfNew, clearPending } = useDailyAnimal()
  const savedRef = useRef(false)

  const [inputValue, setInputValue] = useState('')
  const [shaking, setShaking] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [eqKey, setEqKey] = useState(0)

  // Persist + award when session ends
  useEffect(() => {
    if (state.phase !== 'summary' || savedRef.current) return
    savedRef.current = true
    persistSession().then(() => awardIfNew())
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Shake animation on wrong
  useEffect(() => {
    if (state.shakeTrigger === 0) return
    setInputValue('')
    setShaking(true)
    const t = setTimeout(() => setShaking(false), 420)
    return () => clearTimeout(t)
  }, [state.shakeTrigger])

  // Flash animation on correct
  useEffect(() => {
    if (state.flashTrigger === 0) return
    setFlashing(true)
    setInputValue('')
    const t = setTimeout(() => {
      setFlashing(false)
      setEqKey(k => k + 1)
    }, 350)
    return () => clearTimeout(t)
  }, [state.flashTrigger])

  function handleSubmit() {
    const num = parseInt(inputValue, 10)
    if (isNaN(num) || inputValue === '') return
    submitAnswer(num)
  }

  if (state.phase === 'summary') {
    return (
      <>
        <SummaryScreen
          mode={mode}
          n={n}
          records={state.records}
          fruits={state.fruits}
          onReplay={() => navigate(`/play/${mode}`)}
        />
        <AnimalAwardOverlay animal={pendingAnimal} onDismiss={clearPending} />
      </>
    )
  }

  const total = 10
  const current = state.currentIndex
  const phaseLabel = state.phase === 'sequential' ? 'Sorrendben' : 'Keverve'
  const modeColor = cfg.badgeColor

  return (
    <div style={{ padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="key"
          style={{ width: 48, height: 54, fontSize: 20, borderRadius: 16, flexShrink: 0 }}
          onClick={() => navigate(`/play/${mode}`)}
        >
          ←
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--sub)', flex: 1 }}>
          {phaseLabel} · {current + 1}/10
        </span>
        <span style={{
          background: modeColor,
          color: '#fff',
          borderRadius: 999,
          padding: '4px 14px',
          fontSize: 16,
          fontWeight: 700,
        }}>
          {cfg.symbol} {cfg.label}
        </span>
      </div>

      {/* Progress track */}
      <ProgressTrack current={current} total={total} />

      {/* Fruit tray */}
      <FruitTray fruits={state.fruits} />

      {/* Main play area */}
      {currentQuestion && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 40, flex: 1, alignItems: 'center' }}>
          {/* Left: equation + answer box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              key={eqKey}
              className="animate-eq-in"
              style={{ fontSize: 84, fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.1 }}
            >
              <span style={{ color: 'var(--ink)' }}>{currentQuestion.a} </span>
              <span style={{ color: RAINBOW[5] }}>{currentQuestion.op}</span>
              <span style={{ color: 'var(--ink)' }}> {currentQuestion.b} </span>
              <span style={{ color: 'var(--sub)' }}>=</span>
            </div>

            <div
              className={`answer-box ${shaking ? 'shaking animate-shake' : ''} ${flashing ? 'correct' : ''}`}
              style={{ width: '100%', maxWidth: 320, height: 120 }}
            >
              {inputValue
                ? <span style={{ color: 'var(--ink)' }}>{inputValue}</span>
                : <span style={{ color: 'var(--line)', fontSize: 64 }}>?</span>
              }
            </div>
          </div>

          {/* Right: keypad */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Keypad
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={shaking || flashing}
            />
          </div>
        </div>
      )}
    </div>
  )
}
