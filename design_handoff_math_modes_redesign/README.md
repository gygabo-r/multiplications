# Handoff: Szorzótábla Redesign — playful kids' math app (3 themes + 3 modes)

## Overview

This is a redesign of the existing **`gygabo-r/multiplications`** app (an in-browser
Hungarian multiplication-practice app for an 8-year-old, "Gvendolin"). The redesign:

1. Makes the app **much more playful and game-like** (the original was "not playful enough").
2. Is designed for **iPad / tablet** (landscape) with big touch targets and an **on-screen
   number keypad** — the child never needs a physical keyboard.
3. Adds **two new practice modes** alongside multiplication: **addition** and **subtraction**.
4. Adds light gamification: **daily streak**, **per-number mastery stars**, **fruit/star/gem
   collecting**, and a **daily reward creature** with a confetti reveal.
5. Ships **three switchable visual themes ("directions")** so the look can be chosen later.

The app stays **100% Hungarian**.

---

## About the design files

The files in `prototype/` are **design references built in HTML/React (inline Babel)**. They are
a *runnable, high-fidelity spec* — not production code to copy verbatim. The task is to
**recreate these designs inside the existing codebase** (`gygabo-r/multiplications`: React 19 +
TypeScript + Vite + Tailwind v4 + shadcn + Base UI + Dexie + react-router + framer-motion),
reusing that project's established patterns and libraries.

Concretely, the prototype differs from the target stack in these ways — re-implement using the
**target** column:

| Concern | Prototype (reference) | Target codebase |
|---|---|---|
| Components | Inline JSX, exported to `window` | Real `.tsx` files under `src/` |
| Styling | Inline styles + CSS vars + `styles.css` | Tailwind v4 classes + the existing `@theme` tokens in `src/index.css`; shadcn `Card`/`Button` |
| Persistence | `localStorage` (`mfg_v1` key) | **Dexie/IndexedDB** (extend `src/db/`) |
| Routing | `useState` screen switch | **react-router** (extend `src/App.tsx` routes) |
| Animation | CSS keyframes | CSS keyframes and/or the already-installed **framer-motion** |
| Emoji rewards | Unicode emoji | Keep emoji (matches original app) |

> The **three themes** in the prototype are a *design-decision aid*. Production almost certainly
> ships **one** theme. Pick the chosen direction's tokens (see Design Tokens) and implement just that,
> unless the product owner explicitly wants a runtime theme switcher.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, and interactions are intended as final.
Recreate the UI to match, using the codebase's libraries (Tailwind tokens, shadcn components).

---

## Mapping to the existing repo

The original repo already has most of the scaffolding. Suggested changes:

```
src/
  lib/
    tables.ts          → generalize: buildQuestions(mode, n, shuffle)   [see "Question logic"]
    modes.ts    (NEW)  → MODES config (multiply / add / subtract metadata + label helpers)
    fruits.ts          → keep (tray items). Optionally add per-theme tray sets.
    animals.ts         → keep (daily reward set). Optionally add per-theme reward sets.
  hooks/
    useSession.ts      → take (mode, n) instead of (table); compare against precomputed answer
  db/
    index.ts           → Session row: add `mode: 'multiply'|'add'|'subtract'` and rename `table`→`n`
    queries.ts         → getModeStats(mode); recent sessions carry mode+n; daily-animal unchanged
  pages/
    Home.tsx           → mode picker (3 cards) + streak + total-stars header
    Memorize.tsx       → rename concept to "Practice"; route by mode + number; renders SessionRunner
    Stats.tsx          → mode toggle (×/+/−) over the per-number mastery grid; heatmap unchanged
    Animals.tsx        → unchanged (daily reward collection)
  components/
    modes/ModeCard.tsx     → restyle to the new card (colored symbol badge + title + sub)
    session/QuestionCard.tsx → big "a op b =" + on-screen Keypad + answer display
    session/Keypad.tsx (NEW) → 3×4 number pad (1-9, ⌫, 0, ✓)
    session/ProgressBar.tsx  → travelling-avatar track (bee/rocket/monster)
    session/FruitTray.tsx    → collected-items strip with pop-in on newest
    session/SummaryScreen.tsx→ confetti + mascot + stat panel
    animals/AnimalAwardOverlay.tsx → already exists; keep/restyle to RewardOverlay
  components/layout/
    Sidebar.tsx / BottomNav.tsx → nav: Játék 🎮 / Gyűjtemény 🏆 / Statok 📊 (hide during a session)
```

Routes (react-router): `/` (home/mode-picker), `/play/:mode` (number picker),
`/play/:mode/:n` (session), `/stats`, `/animals`.

---

## Question logic (the core spec — implement exactly)

A session always = **20 questions**: a **sequential** round of 10 (n in natural order), then a
**shuffled** round of 10 (Fisher–Yates). One tray item per correct answer; first-try correctness
is tracked per question. Wrong answer → shake + retry (no advance, no tray item).

`buildQuestions(mode, n, shuffle)` returns 10 `{ a, b, op, ans }`:

- **multiply** (pick table `n`, 1–10): for `i = 1..10` → `{ a: i, b: n, op: '×', ans: i * n }`
  - displayed `i × n =`
- **add** (pick addend `n`, 1–10): for `i = 1..10` → `{ a: i, b: n, op: '+', ans: i + n }`
  - displayed `i + n =`  (sums 2–20; max sum 20 at n=10)
- **subtract** (pick subtrahend `n`, 1–10): for `i = 1..10` → `{ a: i + n, b: n, op: '−', ans: i }`
  - displayed `(i+n) − n =`, e.g. n=3 → `4 − 3, 5 − 3 … 13 − 3`
  - **answers are always 1–10, never negative; minuend ≤ 20**

> ⚠️ Open decision flagged to the product owner: subtraction is currently the *inverse of addition*
> (subtract n from n+1…n+10). An alternative is "pick the bigger number, subtract 1–10 from it"
> (`10 − 1, 10 − 2 …`). Confirm before building.

Mastery stars per (mode, number), from first-try rate across that combo's sessions:
`rate ≥ 0.9 → 3★`, `≥ 0.7 → 2★`, `> 0 → 1★`, no sessions → 0★ ("Nincs adat").

---

## Screens / Views

Design canvas is an **iPad in landscape: 1194 × 834 px** content area (inside a dark bezel).
All padding/sizes below are at that scale.

### 1. Home (mode picker)
- **Purpose:** greet, show progress, pick a mode.
- **Layout:** vertical, padding `48px 56px`.
  - Header row (space-between): left = subtitle "Mit tanulunk ma?" (17px, 600, `--sub`) + h1
    "Szia Gvendolin! 👋" (52px, 700); right = **mascot** (theme emoji, 86px, gentle bob) with a
    white speech bubble ("N. nap! 🔥" if streak>0, else "Kezdjük! ✨").
  - **Two stat chips** (flex, gap 16, margin-top 30), each a white panel (`padding 20px 24px`,
    radius `--radius`): 🔥 + big number (38px,700) + "napos sorozat"; ⭐ + number + "csillag összesen".
  - Heading "Mit játsszunk?" (20px, 700, margin-top 30).
  - **3 mode cards** (grid, 3 cols, gap 16). Each card: white surface, radius `--radius`,
    `box-shadow: 0 10px 0 var(--line)` (chunky bottom shadow), `padding 26px 20px`, left-aligned,
    column, gap 14, press = translateY(5px). Contents:
    - colored **symbol badge**: 64×64, radius 20, white glyph 40px/700, bg = mode color
      (multiply `rainbow[0]`, add `rainbow[3]`, subtract `rainbow[5]`).
    - title (22px,700) + subtitle (15px,600,`--sub`).
    - **Szorzótábla** `×` "1× – 10×" · **Összeadás** `+` "összeg max 20" · **Kivonás** `−` "20-ig".

### 2. Number picker ("level map")
- **Purpose:** pick which number to practice for the chosen mode.
- **Layout:** padding `40px 52px`.
  - Header: round back button (54×54, key style) + h1 = mode pick title + subtitle "Koppints egy szintre!".
    - pick titles: multiply "Melyik szorzótábla?" · add "Melyik számmal adunk?" · subtract "Melyik számot vonjuk ki?".
  - **Grid 5 cols × 2 rows, gap 18.** Each tile: square (`aspect-ratio 1`), white, radius 28,
    `border 2px var(--line)`, `box-shadow 0 8px 0 var(--line)`, press translateY(4px). Centered:
    big label (40px,700, color cycles through `rainbow`) + mastery `Stars` (3 emoji ⭐, unearned greyscaled/0.28).
    - labels: `n×` / `+n` / `−n`.

### 3. Session (the game)
- **Purpose:** answer 20 questions with the keypad.
- **Layout:** full height flex column, padding `28px 44px 36px`. **No bottom nav here.**
  - Top bar (space-between): back button "← Vissza" (key style), center phase label
    (16px,700,`--sub`): "1. kör · Sorrendben" then "2. kör · Keverve"; right = mode badge pill
    (`8px 16px`, radius 999, bg `rainbow[0]`, white): `n× szorzótábla` / `+n összeadás` / `−n kivonás`.
  - **Progress track** (margin-top 20): 10px rounded rail (`--line`), fill = linear-gradient
    `rainbow[3] → rainbow[0]`, width `overall/20`; a **travelling avatar emoji** (bee 🐝 / rocket 🚀 /
    monster 👾) rides the fill; width+left transition `.45s cubic-bezier(.2,.9,.3,1.1)`.
  - **Tray strip** (min-height 46, wrap): collected items (26px); newest gets `tray-in` pop; empty
    state "🧺 Szedjünk gyümölcsöt!" (theme-worded).
  - **Two-column play area** (grid `1.15fr 1fr`, gap 40, centered):
    - Left: **equation** `a <op> b =` (84px,700, letter-spacing −2px, `eq-in` entrance) where `<op>`
      is colored `rainbow[5]` and `=` is `--sub`; below, an **answer box** 280×120, radius 28,
      `border 4px` (= `--line`, turns `--accent` while shaking, `--primary` on correct), shows typed
      value (72px,700) or a faded "?" placeholder; on correct it flashes and briefly shows ✓.
    - Right: **Keypad**, max-width 360, centered. 3-col grid, gap 12. Keys are 70px tall, radius 22,
      `box-shadow 0 5px 0 <shadow>`, press translateY(4). Layout: `1 2 3 / 4 5 6 / 7 8 9 /
      ⌫(bg --ring, white) 0 ✓(bg --primary, white)`. Max 3 digits.
  - **Keyboard support:** physical 0–9 types, Backspace clears last, Enter submits (parity with keypad).

### 4. Summary
- **Purpose:** celebrate end of session.
- **Layout:** centered column, padding 40, gap 22, with a one-shot **confetti** burst.
  - 🎉 (76px, `reward-pop`), h1 "Szuper munka!" (46px,700), mascot bubble "X/20 elsőre! 🌟".
  - Stat panel (width 460): rows — `<mode title>`: `<n label>`; "Elsőre jó": `X/20` (value in `--primary`);
    then "Összegyűjtve" with the collected tray items wrapped.
  - Buttons: "Még egyszer" (key style → number picker) and "Főmenü" (primary pill → home).

### 5. Reward overlay (daily creature)
- Shown over the summary the first time a session is completed **on a given calendar day per theme**.
- Full-screen tinted layer (theme-colored, `backdrop-filter: blur(6px)`, white text) + heavy confetti.
  - Big reward emoji (150px, `reward-pop` spring), title (theme: "Új állatbarát! 🐾" / "Új felfedezés! 🌌" /
    "Új szörnyi barát! 👾"), subtitle "Gyere vissza holnap egy újért! 🌟", white "Hurrá! 🎉" button to dismiss.
- Reward is a random not-yet-owned emoji from the theme's reward set; persisted to the collection.

### 6. Collection
- **Purpose:** show earned daily creatures + locked slots.
- Header: h1 = theme collection title + icon ("Állatkáim 🐾" / "Galaxisom 🪐" / "Szörnygyűjtemény 👾"),
  subtitle "Eddig megvan: X / TOTAL", bobbing mascot on the right.
- Grid 6 cols, gap 16: owned slots = white card with emoji (38px) + earned date (MM-DD, 11px);
  locked = `--line` bg with greyscaled "❓" at 0.25 opacity.

### 7. Stats
- h1 "Hogy megy? 📊". Two-column row (gap 20):
  - **Aktív napok** panel: 70-day heatmap, 10-col grid, 6px gap, cells `aspect-ratio 1` radius 6,
    active = `rainbow[3]` else `--line`; caption "N aktív nap · utolsó 70 nap".
  - **Legutóbbi körök** panel: up to 6 rows, each "`<mode label>` `MM-DD`" + "`X/10` elsőre"
    (`X` in `--primary`); empty = "Még nincs befejezett kör.".
  - Full-width **overview** panel below: header "Szorzótáblák" + a **segmented mode toggle**
    (×/+/− pills; active pill bg `rainbow[0]`, white). Grid 5-col of the 10 numbers for the
    selected mode, each showing label + mastery stars (or "Nincs adat").

---

## Interactions & Behavior

- **Press feedback:** chunky "bottom shadow" buttons depress (translateY toward the shadow) on press.
- **Correct answer:** answer box border → `--primary`, flashes (`correctFlash` 0.6s), shows ✓ briefly,
  a tray item pops in (`trayIn` ~0.5s spring), progress avatar slides forward, next equation `eq-in`.
- **Wrong answer:** the equation+box column shakes (`shake` 0.42s), border → `--accent`, input clears,
  tries counter increments (so the question no longer counts as first-try), stays on same question.
- **Phase change:** after 10 sequential, rebuild shuffled set, reset index; phase label updates.
- **Screen transitions:** each screen mounts with `screenIn` (0.42s, fade + 14px rise + slight scale).
- **Mascot:** idle `bob` (2.6s loop). **Decor:** floating blobs/stars/flowers per theme (purely decorative,
  `pointer-events:none`, behind content).
- **Reward gating:** award at most one creature per calendar day **per theme** (key = `theme|YYYY-MM-DD`).
- **Reduced-motion option:** a toggle disables all animations/transitions (`* { animation:none;
  transition:none }`). Honor `prefers-reduced-motion` in production.

---

## State Management

Per session (the `useSession(mode, n)` hook):
- `phase`: `'sequential' | 'random' | 'summary'`
- `questions`: `{a,b,op,ans}[]` (10)
- `currentIndex`, `tries` (for current question), `fruits: string[]`, `records: QuestionRecord[]`
- transient triggers: `shakeTrigger`, `flashTrigger` (increment to fire one-shot animations)
- `submitAnswer(answer, trayPool)` → compares `answer === q.ans`; on correct pushes record + tray item
  and advances/transitions; on wrong bumps `tries` + `shakeTrigger`.

`QuestionRecord = { a, b, op, tries, firstTryCorrect }`.

On entering `summary` (once): **persist the session** (Dexie) and **award the daily creature**.

Persisted (Dexie) — extend the existing schema:
- `Session { id, date 'YYYY-MM-DD', mode, n, questions: QuestionRecord[], fruitsEarned: string[], completedAt }`
- daily-creature collection (already exists as `DailyAnimal`) — keep, but if you keep per-theme reward
  sets, key the collection/award by theme.

Derived selectors: `getStreak()` (consecutive active days back from today/yesterday),
`getTotalStars()` (sum of first-try-correct answers), `getModeStats(mode)` (per-number sessions/rate/stars),
`getRecent(n)`, `getActiveDays()`.

---

## Design Tokens

Shared: radius scale derives from a base `--radius`; chunky shadows use a darker shade of the surface/line.
Heatmap/fills/label cycling use the theme **rainbow** array.

**Fonts (Google Fonts):** `Fredoka` (400–700) for the soft theme; `Baloo 2` (500–800) for space/monster.
Original app uses **Geist** — you may keep Geist for body and add a rounded display face for headings, or
adopt Fredoka/Baloo per the chosen theme.

### Theme A — "Gyümölcskert" (soft candy garden) — closest to today's app
```
--bg #FFF6EC  --surface #FFFFFF  --ink #43352E  --sub #B0A39A
--primary #33C97E  --primary-ink #0E3F2B  --primary-shadow #1F9E5E
--accent #FF6F91  --ring #FFC93C  --line rgba(67,53,46,.08)  --radius 32px
key-bg #FFFFFF  key-ink #43352E  key-shadow rgba(67,53,46,.14)
rainbow [#FF6F91,#FF9F45,#FFC93C,#33C97E,#3BC9DB,#5C7CFA,#9B6BF5]
font Fredoka · mascot 🐝 (Zümi) · tray = fruit emoji · rewards = animals
```

### Theme B — "Űrkaland" (neon deep space)
```
--bg #12102E  --surface rgba(255,255,255,.07)  --ink #F3F0FF  --sub #9A93C8
--primary #36E0C8  --primary-ink #04231F  --primary-shadow #1C9C8C
--accent #FF5DA2  --ring #FFD23F  --line rgba(255,255,255,.10)  --radius 28px
key-bg rgba(255,255,255,.10)  key-ink #F3F0FF  key-shadow rgba(0,0,0,.35)
rainbow [#FF5DA2,#FFA94D,#FFD23F,#36E0C8,#4DABF7,#9775FA,#E599F7]
font Baloo 2 · mascot 🚀 (Koz) · tray = ⭐/🌟/✨ · rewards = planets/space (🪐🌍🛸👽…)
+ decorative starfield + radial space gradient behind content
```

### Theme C — "Szörnysuli" (bold arcade / sticker)
```
--bg #FFE14D  --surface #FFFFFF  --ink #221A33  --sub #8A7FA0
--primary #7A4DFF  --primary-ink #FFFFFF  --primary-shadow #5429C7
--accent #FF4D6D  --ring #00C2A8  --line rgba(34,26,51,.14)  --radius 26px
key-bg #FFFFFF  key-ink #221A33  key-shadow #221A33
rainbow [#FF4D6D,#FF8A3D,#FFD23F,#2BD66A,#00C2A8,#4D9DFF,#7A4DFF]
font Baloo 2 · mascot 👾 (Mütyür) · tray = gems (💎🪙💠…) · rewards = monsters (👾👹🤖👻…)
```

### Key animations (CSS keyframes — see `prototype/app/styles.css`)
- `shake` 0.42s (wrong) · `pop`/`trayIn` (tray) · `bob` 2.6s (mascot) · `eqIn` 0.4s (equation)
- `confettiFall` (1.4–2.6s) · `rewardPop` 0.8s spring · `correctFlash` 0.6s · `screenIn` 0.42s
- `float-y`, `sparkle`, `glowPulse` (decor)

---

## Copy (Hungarian strings)

All UI strings are Hungarian and centralized in `prototype/app/data.jsx` (the `T` object and the
`MODES`/`DIRECTIONS` configs) — lift them from there verbatim. Highlights: greeting "Szia Gvendolin!",
"Mit játsszunk?", phase labels "1. kör · Sorrendben" / "2. kör · Keverve", "Szuper munka!",
"Még egyszer" / "Főmenü", nav "Játék / Gyűjtemény / Statok".

---

## Assets

- **No bitmap assets.** All characters/rewards/tray items are **Unicode emoji** (matches the original app).
- **Fonts:** Google Fonts (Fredoka, Baloo 2). Original repo also has `@fontsource-variable/geist`.
- **Icons:** the original repo has `lucide-react` available if you prefer icon glyphs over emoji for nav.

## Screenshots (reference renders)

Labeled renders of every screen are in `screenshots/` (iPad landscape, 1280px wide):

| File | Screen |
|---|---|
| `01-home-garden.png` | Home / mode picker — Gyümölcskert theme |
| `02-numberpicker-add-garden.png` | Number picker (Összeadás), with mastery stars |
| `03-session-add-garden.png` | Session — `1 + 7 =`, keypad, tray, progress bee |
| `04-reward-garden.png` | Daily reward overlay ("Új állatbarát!", panda) |
| `05-summary-garden.png` | Session summary (19/20, fruit haul) |
| `06-collection-garden.png` | Collection — 1/24 owned, locked slots |
| `07-stats-garden.png` | Stats — heatmap, recent rounds, mode toggle |
| `08-home-space.png` | Home — Űrkaland (neon space) theme |
| `09-session-multiply-space.png` | Session — Űrkaland theme (`1 × 6 =`) |
| `10-home-monster.png` | Home — Szörnysuli (arcade) theme |
| `11-session-monster.png` | Session — Szörnysuli theme |

---

## Files (in this bundle)

```
prototype/
  Szorzótábla Redesign.html   ← entry; open in a browser to run the reference
  app/
    styles.css                ← base, iPad bezel, theme var hooks, ALL keyframes
    data.jsx                  ← DIRECTIONS (3 themes), MODES (3 modes), T (HU strings), buildQuestions()
    engine.jsx                ← useSession(mode,n), localStorage persistence, stats/streak selectors
    ui.jsx                    ← BgDecor, Stars, Mascot, Confetti, ProgressTrack, Keypad, Panel
    screens.jsx               ← Home, MapScreen, SessionScreen, SummaryScreen, RewardOverlay, Collection, Stats
    app.jsx                   ← iPad shell, scaling, theme switcher, nav, routing-by-state, Tweaks
    tweaks-panel.jsx          ← (prototype-only) theme/confetti/reduced-motion toggles; not needed in prod
```

To run the reference: open `prototype/Szorzótábla Redesign.html` in a modern browser. The top pill
switches themes; the in-app nav switches Home / Collection / Stats. Progress persists to `localStorage`
under `mfg_v1` (clear it to reset).

---

## Implementation order (suggested)

1. `lib/tables.ts` → `buildQuestions(mode,n,shuffle)` + `lib/modes.ts` (MODES). Unit-test the math.
2. Dexie schema: add `mode`/`n` to `Session`; update `db/queries.ts` (`getModeStats`, recent, streak).
3. `useSession(mode,n)`; `QuestionCard` + new `Keypad`.
4. `Home` mode picker → number picker → session route wiring (react-router).
5. `SummaryScreen` + reward overlay (reuse `AnimalAwardOverlay`).
6. `Stats` mode toggle; nav restyle; pick ONE theme's tokens into `src/index.css`.
7. Motion polish (framer-motion or CSS), reduced-motion support, QA on a real iPad.
```
