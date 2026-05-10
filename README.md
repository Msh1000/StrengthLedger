# StrengthLog

Premium mobile-first strength training tracker built with React, Vite, TypeScript, Tailwind CSS, Zustand, Dexie, React Router, date-fns, Framer Motion, lucide-react, and react-swipeable.

## Run

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Phase 1

- Mobile app shell with fixed bottom navigation.
- Today dashboard with date swiping, workout summary, volume, completed sets, and PR highlights.
- Active workout screen with exercise cards, editable sets, set types, copy last set, delete set/exercise, volume, estimated 1RM, and PR badges.
- Floating rest timer with pause, resume, reset, skip, plus/minus 30 seconds, browser notifications, and vibration support.
- Exercise library with seeded exercises, search, filters, favorites, and quick workout add.
- Calendar, routines, progress, and settings screens using the same design system.
- Offline-first IndexedDB persistence through Dexie.

## Assets And Fonts

The current Phase 1 build uses CSS-rendered training artwork and system fallbacks for `Inter` and `Space Grotesk` so the app works fully offline after install. Replace with production assets later if desired:

- Workout hero athlete: transparent PNG/WebP, 240 x 240 px, dark rim-lit male/female lifter pose.
- Exercise thumbnails: transparent PNG/WebP, 96 x 96 px each, neutral line-art or realistic equipment icons.
- App icon: SVG or PNG, 1024 x 1024 px, matte black background with purple/blue StrengthLog mark.
- Fonts: self-host `Inter` and `Space Grotesk` as WOFF2 in `src/assets/fonts/`, then add `@font-face` rules in `src/index.css`.

## Storage

StrengthLog stores workouts, exercises, routines, and settings locally in IndexedDB under the `strengthlog` database. There is no backend or login in this phase.
