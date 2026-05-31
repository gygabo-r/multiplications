/* ===== data.jsx — directions, rewards, tables, Hungarian strings ===== */

// ---- question builder (works for all modes) ----
// multiply n: i×n            (i = 1..10)        answer i*n
// add n:      i+n            (i = 1..10)        answer i+n   (max sum 20)
// subtract n: (i+n) − n      (i = 1..10)        answer i     (minuend ≤ 20, never negative)
function buildQuestions(mode, n, shuffle) {
  const qs = [];
  for (let i = 1; i <= 10; i++) {
    if (mode === 'add') qs.push({ a: i, b: n, op: '+', ans: i + n });
    else if (mode === 'subtract') qs.push({ a: i + n, b: n, op: '−', ans: i });
    else qs.push({ a: i, b: n, op: '×', ans: i * n });
  }
  if (shuffle) {
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
  }
  return qs;
}

function pickFrom(pool, used) {
  const usedSet = new Set(used);
  const avail = pool.filter(x => !usedSet.has(x));
  const from = avail.length ? avail : pool;
  return from[Math.floor(Math.random() * from.length)];
}

// ---- the three directions ----
const DIRECTIONS = {
  garden: {
    id: 'garden',
    tab: '🍓 Gyümölcskert',
    font: "'Fredoka', system-ui, sans-serif",
    bgClass: 'dir-garden',
    vars: {
      '--bg': '#FFF6EC',
      '--surface': '#FFFFFF',
      '--ink': '#43352E',
      '--sub': '#B0A39A',
      '--primary': '#33C97E',
      '--primary-ink': '#0E3F2B',
      '--primary-shadow': '#1F9E5E',
      '--accent': '#FF6F91',
      '--ring': '#FFC93C',
      '--line': 'rgba(67,53,46,.08)',
      '--radius': '32px',
      '--key-bg': '#FFFFFF',
      '--key-ink': '#43352E',
      '--key-shadow': 'rgba(67,53,46,.14)',
    },
    rainbow: ['#FF6F91', '#FF9F45', '#FFC93C', '#33C97E', '#3BC9DB', '#5C7CFA', '#9B6BF5'],
    tray: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍', '🍌', '🍉'],
    rewardSet: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦄','🐝','🐞','🦋','🦔','🐢','🐧','🐮','🐷','🐔','🦉'],
    mascot: '🐝', mascotName: 'Zümi',
    rewardWord: 'állat',
    rewardTitle: 'Új állatbarát! 🐾',
    collectionTitle: 'Állatkáim',
    collectionIcon: '🐾',
    trayWord: 'gyümölcs',
    playWord: 'Szedjünk gyümölcsöt!',
  },
  space: {
    id: 'space',
    tab: '🚀 Űrkaland',
    font: "'Baloo 2', 'Fredoka', sans-serif",
    bgClass: 'dir-space',
    vars: {
      '--bg': '#12102E',
      '--surface': 'rgba(255,255,255,0.07)',
      '--ink': '#F3F0FF',
      '--sub': '#9A93C8',
      '--primary': '#36E0C8',
      '--primary-ink': '#04231F',
      '--primary-shadow': '#1C9C8C',
      '--accent': '#FF5DA2',
      '--ring': '#FFD23F',
      '--line': 'rgba(255,255,255,.10)',
      '--radius': '28px',
      '--key-bg': 'rgba(255,255,255,0.10)',
      '--key-ink': '#F3F0FF',
      '--key-shadow': 'rgba(0,0,0,.35)',
    },
    rainbow: ['#FF5DA2', '#FFA94D', '#FFD23F', '#36E0C8', '#4DABF7', '#9775FA', '#E599F7'],
    tray: ['⭐', '🌟', '✨', '💫', '⭐', '🌟'],
    rewardSet: ['🪐','🌍','🌕','☄️','🛸','👽','🌌','🚀','👾','🌠','🔭','🌖','🌗','🌘','🪨','⚡','🌞','💎','🛰️','👨‍🚀'],
    mascot: '🚀', mascotName: 'Koz',
    rewardWord: 'bolygó',
    rewardTitle: 'Új felfedezés! 🌌',
    collectionTitle: 'Galaxisom',
    collectionIcon: '🪐',
    trayWord: 'csillag',
    playWord: 'Gyűjtsünk csillagot!',
  },
  monster: {
    id: 'monster',
    tab: '👾 Szörnysuli',
    font: "'Baloo 2', 'Fredoka', sans-serif",
    bgClass: 'dir-monster',
    vars: {
      '--bg': '#FFE14D',
      '--surface': '#FFFFFF',
      '--ink': '#221A33',
      '--sub': '#8A7FA0',
      '--primary': '#7A4DFF',
      '--primary-ink': '#FFFFFF',
      '--primary-shadow': '#5429C7',
      '--accent': '#FF4D6D',
      '--ring': '#00C2A8',
      '--line': 'rgba(34,26,51,.14)',
      '--radius': '26px',
      '--key-bg': '#FFFFFF',
      '--key-ink': '#221A33',
      '--key-shadow': '#221A33',
    },
    rainbow: ['#FF4D6D', '#FF8A3D', '#FFD23F', '#2BD66A', '#00C2A8', '#4D9DFF', '#7A4DFF'],
    tray: ['💎', '🪙', '💠', '🔶', '🟣', '💎'],
    rewardSet: ['👾','👹','👺','🤖','👻','🎃','💀','🧟','🧌','🐲','🐉','🦖','🦕','🦠','🤡','🥷','🦇','🕷️','🐙','🦑'],
    mascot: '👾', mascotName: 'Mütyür',
    rewardWord: 'szörny',
    rewardTitle: 'Új szörnyi barát! 👾',
    collectionTitle: 'Szörnygyűjtemény',
    collectionIcon: '👾',
    trayWord: 'drágakő',
    playWord: 'Gyűjtsünk drágakövet!',
  },
};

// ---- the three practice modes ----
const MODES = {
  multiply: {
    id: 'multiply', symbol: '×', title: 'Szorzótábla', sub: '1× – 10×',
    pickTitle: 'Melyik szorzótábla?',
    tileLabel: n => `${n}×`,
    badge: n => `${n}× szorzótábla`,
  },
  add: {
    id: 'add', symbol: '+', title: 'Összeadás', sub: 'összeg max 20',
    pickTitle: 'Melyik számmal adunk?',
    tileLabel: n => `+${n}`,
    badge: n => `+${n} összeadás`,
  },
  subtract: {
    id: 'subtract', symbol: '−', title: 'Kivonás', sub: '20-ig',
    pickTitle: 'Melyik számot vonjuk ki?',
    tileLabel: n => `−${n}`,
    badge: n => `−${n} kivonás`,
  },
};

// ---- shared Hungarian strings ----
const T = {
  hi: 'Szia Gvendolin!',
  hiSub: 'Mit tanulunk ma?',
  whatToPlay: 'Mit játsszunk?',
  play: 'Játsszunk!',
  streak: 'napos sorozat',
  totalStars: 'csillag összesen',
  pickTitle: 'Melyik szorzótábla?',
  pickSub: 'Koppints egy szintre!',
  table: 'szorzótábla',
  back: 'Vissza',
  phaseSeq: 'Sorrendben',
  phaseRnd: 'Keverve',
  round: 'kör',
  summaryTitle: 'Szuper munka!',
  sTable: 'Szorzótábla',
  sQuestions: 'Kérdések',
  sFirst: 'Elsőre jó',
  sCollected: 'Összegyűjtve',
  again: 'Még egyszer',
  home: 'Főmenü',
  comeBack: 'Gyere vissza holnap egy újért! 🌟',
  hooray: 'Hurrá! 🎉',
  collectedSoFar: 'Eddig megvan',
  locked: 'Még nincs meg',
  statsTitle: 'Hogy megy?',
  activeDays: 'Aktív napok',
  last70: 'utolsó 70 nap',
  daysActive: 'aktív nap',
  tablesOverview: 'Szorzótáblák',
  recent: 'Legutóbbi körök',
  noData: 'Nincs adat',
  noRecent: 'Még nincs befejezett kör.',
  first: 'elsőre',
  rounds: 'kör',
  navPlay: 'Játék',
  navCollection: 'Gyűjtemény',
  navStats: 'Statok',
  newRecord: 'Mehet az első kör! 🚀',
};

Object.assign(window, {
  DIRECTIONS, MODES, T, buildQuestions, pickFrom,
});
