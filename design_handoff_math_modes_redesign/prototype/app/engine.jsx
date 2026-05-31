/* ===== engine.jsx — session hook + persistence ===== */
const { useState, useCallback, useEffect, useRef } = React;

const STORE_KEY = 'mfg_v1';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { sessions: [], collections: { garden: [], space: [], monster: [] }, awards: {} };
}
function saveStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
}
function todayISO() { return new Date().toISOString().slice(0, 10); }

// ---- persistence helpers ----
function recordSession(mode, n, records, fruits) {
  const s = loadStore();
  s.sessions.push({
    id: Date.now(),
    date: todayISO(),
    mode,
    n,
    questions: records,
    fruits,
  });
  saveStore(s);
}

// award a daily reward for a direction; returns the new emoji or null
function awardIfNew(dirId, rewardSet) {
  const s = loadStore();
  const key = dirId + '|' + todayISO();
  if (s.awards[key]) return null;
  const used = (s.collections[dirId] || []).map(c => c.emoji);
  const emoji = pickFrom(rewardSet, used);
  s.awards[key] = emoji;
  if (!s.collections[dirId]) s.collections[dirId] = [];
  s.collections[dirId].push({ emoji, date: todayISO() });
  saveStore(s);
  return emoji;
}

function getCollection(dirId) {
  return loadStore().collections[dirId] || [];
}

function getActiveDays() {
  const s = loadStore();
  return Array.from(new Set(s.sessions.map(x => x.date)));
}

function getStreak() {
  const days = new Set(getActiveDays());
  let streak = 0;
  const d = new Date();
  // count back from today (or yesterday if today not yet active)
  if (!days.has(todayISO())) d.setDate(d.getDate() - 1);
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (days.has(iso)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

function getTotalStars() {
  // total first-try-correct answers across all sessions
  const s = loadStore();
  return s.sessions.reduce((acc, ses) =>
    acc + ses.questions.filter(q => q.firstTryCorrect).length, 0);
}

function getModeStats(mode) {
  const s = loadStore();
  const out = [];
  for (let n = 1; n <= 10; n++) {
    const rows = s.sessions.filter(x => x.mode === mode && x.n === n);
    const totalQ = rows.reduce((a, r) => a + r.questions.length, 0);
    const firstTry = rows.reduce((a, r) => a + r.questions.filter(q => q.firstTryCorrect).length, 0);
    const rate = totalQ ? firstTry / totalQ : 0;
    let stars = 0;
    if (rows.length) {
      if (rate >= 0.9) stars = 3;
      else if (rate >= 0.7) stars = 2;
      else stars = 1;
    }
    out.push({ n, sessions: rows.length, rate, stars, totalQ });
  }
  return out;
}

function getRecent(n) {
  const s = loadStore();
  return [...s.sessions].sort((a, b) => b.id - a.id).slice(0, n);
}

// ---- session hook (mode-aware) ----
function useSession(mode, n) {
  const [state, setState] = useState(() => ({
    phase: 'sequential',
    questions: buildQuestions(mode, n, false),
    currentIndex: 0,
    tries: 0,
    fruits: [],
    records: [],
    shakeTrigger: 0,
    flashTrigger: 0,
    lastWasCorrect: false,
  }));

  const currentQuestion = state.questions[state.currentIndex] ?? null;

  const submitAnswer = useCallback((answer, trayPool) => {
    if (state.phase === 'summary') return false;
    const q = state.questions[state.currentIndex];
    if (!q) return false;
    const correct = answer === q.ans;

    if (correct) {
      const newItem = pickFrom(trayPool, []);
      setState(prev => {
        const record = {
          a: q.a, b: q.b, op: q.op,
          tries: prev.tries + 1,
          firstTryCorrect: prev.tries === 0,
        };
        const newRecords = [...prev.records, record];
        const nextIndex = prev.currentIndex + 1;
        const base = {
          ...prev,
          fruits: [...prev.fruits, newItem],
          records: newRecords,
          tries: 0,
          flashTrigger: prev.flashTrigger + 1,
          lastWasCorrect: true,
        };
        if (nextIndex >= prev.questions.length) {
          if (prev.phase === 'sequential') {
            return { ...base, phase: 'random', questions: buildQuestions(mode, n, true), currentIndex: 0 };
          }
          return { ...base, phase: 'summary', currentIndex: nextIndex };
        }
        return { ...base, currentIndex: nextIndex };
      });
      return true;
    } else {
      setState(prev => ({ ...prev, tries: prev.tries + 1, shakeTrigger: prev.shakeTrigger + 1, lastWasCorrect: false }));
      return false;
    }
  }, [state, mode, n]);

  return { state, currentQuestion, submitAnswer };
}

Object.assign(window, {
  useSession, recordSession, awardIfNew, getCollection, getActiveDays,
  getStreak, getTotalStars, getModeStats, getRecent, todayISO, loadStore, saveStore,
});
