# TV Tracker

A lightweight, client-side single-page application for tracking TV shows across streaming platforms. Organize your watchlist by service, set priorities, track watch status, and keep notes -- all saved locally in your browser with zero server dependency.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Data Model](#data-model)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Persistence Layer](#persistence-layer)
- [Styling and Theming](#styling-and-theming)
- [Build and Development Tooling](#build-and-development-tooling)
- [Getting Started](#getting-started)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.2 | UI library -- functional components with hooks |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Static typing with strict mode enabled |
| [Vite](https://vitejs.dev/) | 4.4 | Dev server, HMR, and production bundling |
| `@vitejs/plugin-react` | 4.x | React Fast Refresh and JSX transform for Vite |

There is no backend, no external API, no state management library (no Redux, no Context API), and no CSS-in-JS. The entire application runs client-side with data persisted to `localStorage`.

---

## Project Structure

```
tv-tracker/
├── index.html              # HTML entry point, mounts React app to #root
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript compiler configuration
├── vite.config.ts          # Vite build configuration
└── src/
    ├── main.tsx            # React root -- renders <App /> inside StrictMode
    ├── App.tsx             # Root component, owns ALL application state
    ├── types.ts            # Shared TypeScript type definitions
    ├── storage.ts          # localStorage persistence layer
    ├── index.css           # Global stylesheet -- dark theme, CSS custom properties
    └── components/
        ├── PlatformTabs.tsx    # Tab bar for switching streaming platforms
        ├── ShowList.tsx        # Sortable/filterable show list with toolbar
        ├── ShowCard.tsx        # Individual show row with controls
        └── AddShowForm.tsx     # Controlled form for adding a new show
```

### File-by-File Breakdown

| File | Lines | Responsibility |
|---|---|---|
| `index.html` | 13 | Minimal HTML shell. Contains a `<div id="root">` mount point and loads `/src/main.tsx` as an ES module via `<script type="module">`. |
| `vite.config.ts` | 7 | Minimal Vite configuration -- only enables the `@vitejs/plugin-react` plugin. |
| `tsconfig.json` | 18 | Targets ES2020, uses `bundler` module resolution, enables `strict` mode, and uses the `react-jsx` JSX transform (no manual `React` imports needed). |
| `src/main.tsx` | 11 | Application entry point. Creates a React 18 root with `createRoot`, wraps `<App />` in `<React.StrictMode>`, and imports the global stylesheet. |
| `src/types.ts` | 17 | Defines the core data types: `WatchStatus`, `Show`, and `Platform`. |
| `src/storage.ts` | 27 | Encapsulates all `localStorage` interaction. Provides `loadPlatforms()` and `savePlatforms()` functions, plus a `DEFAULTS` array of seven streaming platforms. |
| `src/App.tsx` | 86 | Root component. Owns the `platforms` and `activeId` state. Defines all mutation functions (`addShow`, `updateShow`, `deleteShow`, `addPlatform`). Persists state on every change via a `useEffect`. |
| `src/index.css` | 193 | Complete application stylesheet. Defines CSS custom properties in `:root`, a universal box-sizing reset, and styles for every component using BEM-like class naming. |
| `src/components/PlatformTabs.tsx` | 32 | Renders a horizontal tab bar. Each tab shows the platform name and a show-count badge. Includes an "add platform" button that prompts the user via `window.prompt()`. |
| `src/components/ShowList.tsx` | 76 | Manages local UI state for sorting (`priority`, `title`, `added`) and filtering (`all`, `unwatched`, `watching`, `watched`). Renders the toolbar, conditionally renders `AddShowForm`, and maps the sorted/filtered shows to `ShowCard` components. |
| `src/components/ShowCard.tsx` | 54 | Renders a single show as a card/row. Displays the title, optional notes, a priority dropdown (P1--P5), a status cycle button, and a delete button. Uses lookup maps (`STATUS_LABELS`, `STATUS_CYCLE`) for status display and transitions. |
| `src/components/AddShowForm.tsx` | 56 | A controlled form with three fields: title (required), priority (select, default 3), and notes (optional). Validates non-empty title on submit. Calls the `onAdd` callback with the new show data. |

---

## Architecture Overview

The application follows a simple layered architecture:

```
┌─────────────────────────────────────────────────┐
│                  index.html                      │
│              (static HTML shell)                 │
├─────────────────────────────────────────────────┤
│                  main.tsx                         │
│          (React root + StrictMode)               │
├─────────────────────────────────────────────────┤
│                   App.tsx                         │
│       (state owner, mutation functions,          │
│        persistence side-effect)                   │
├──────────────┬──────────────────────────────────┤
│ PlatformTabs │           ShowList                │
│  (tab nav)   │   (sort/filter + show cards)      │
│              ├────────────────┬─────────────────┤
│              │  AddShowForm   │    ShowCard[]    │
│              │  (form input)  │  (show display)  │
└──────────────┴────────────────┴─────────────────┘
        │                                │
        └──────────┬─────────────────────┘
                   ▼
            ┌─────────────┐
            │  storage.ts  │
            │ (localStorage)│
            └─────────────┘
```

**Key architectural decisions:**

1. **Single state owner** -- `App.tsx` holds all application state. No context providers, no Redux store.
2. **Prop drilling** -- State and callbacks flow down through props. Components never access or mutate global state directly.
3. **Immutable updates** -- All state mutations use spread operators to create new objects/arrays, ensuring React detects changes correctly.
4. **Side-effect persistence** -- A single `useEffect` in `App.tsx` serializes the entire `platforms` array to `localStorage` on every change.
5. **No routing** -- The app is a single view. Platform switching is handled by tab state, not URL routes.

---

## Data Model

All types are defined in `src/types.ts`:

```typescript
export type WatchStatus = 'unwatched' | 'watching' | 'watched'

export interface Show {
  id: string
  title: string
  priority: number // 1 = highest, 5 = lowest
  status: WatchStatus
  notes?: string
  addedAt: number  // Unix timestamp (Date.now())
}

export interface Platform {
  id: string
  name: string
  shows: Show[]
}
```

### Type Relationships

```
Platform (1) ──── contains ──── (*) Show
                                     │
                                     └── status: WatchStatus
```

- A **Platform** groups shows by streaming service. Each platform has a unique `id`, a display `name`, and an array of `Show` objects.
- A **Show** represents a single TV show on a platform. It carries a `title`, a numeric `priority` (1 through 5, where 1 is "must watch"), a `status` that cycles through three states, optional `notes`, and an `addedAt` timestamp for sort-by-date.
- **WatchStatus** is a string union with three values that form a cycle: `unwatched` -> `watching` -> `watched` -> `unwatched`.

### ID Generation

Show and platform IDs are generated by a `uid()` helper in `App.tsx`:

```typescript
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
```

This produces a collision-resistant string by combining a random base-36 fragment with a timestamp-based base-36 fragment. It is not a cryptographic ID -- it is sufficient for a local, single-user application.

---

## Component Hierarchy

```
App
├── PlatformTabs
└── ShowList
    ├── AddShowForm   (conditionally rendered)
    └── ShowCard[]    (one per filtered/sorted show)
```

### Component Responsibilities

#### `App` (root -- `src/App.tsx`)

- Owns the `platforms: Platform[]` and `activeId: string` state via `useState`
- Derives `activePlatform` from the state on every render
- Defines mutation functions: `addShow`, `updateShow`, `deleteShow`, `addPlatform`
- Runs a `useEffect` that calls `savePlatforms(platforms)` whenever `platforms` changes
- Passes data and callbacks down to child components via props

#### `PlatformTabs` (`src/components/PlatformTabs.tsx`)

- Receives: `platforms`, `active` (active platform ID), `onSelect`, `onAddPlatform`
- Renders a `<nav>` with a `<button>` per platform
- Each tab displays the platform name and a badge with `p.shows.length`
- The active tab gets the `.active` CSS class
- An "add platform" button calls `window.prompt()` and invokes `onAddPlatform` with the result

#### `ShowList` (`src/components/ShowList.tsx`)

- Receives: `platform`, `onAddShow`, `onStatusChange`, `onPriorityChange`, `onDeleteShow`
- Owns local UI state: `adding` (boolean toggle), `sort` (SortKey), `filter` (FilterStatus)
- Filters the platform's shows by status, then sorts by the selected key
- Renders a toolbar with sort/filter dropdowns and an "Add Show" button
- Conditionally renders `AddShowForm` when `adding` is true
- Maps sorted/filtered shows to `ShowCard` components

##### Local Types in ShowList

```typescript
type SortKey = 'priority' | 'title' | 'added'
type FilterStatus = 'all' | WatchStatus
```

#### `ShowCard` (`src/components/ShowCard.tsx`)

- Receives: `show`, `onStatusChange`, `onPriorityChange`, `onDelete`
- Renders a card with the show title, optional notes, and three controls:
  - **Priority dropdown** -- select from P1 through P5
  - **Status button** -- displays the current status label and cycles to the next on click
  - **Delete button** -- removes the show
- Uses two constant lookup maps:

```typescript
const STATUS_LABELS: Record<WatchStatus, string> = {
  unwatched: '⬜ Unwatched',
  watching:  '▶️ Watching',
  watched:   '✅ Watched',
}

const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  unwatched: 'watching',
  watching:  'watched',
  watched:   'unwatched',
}
```

#### `AddShowForm` (`src/components/AddShowForm.tsx`)

- Receives: `onAdd`, `onCancel`
- Manages three pieces of local state: `title`, `priority` (default 3), `notes`
- Validates that `title` is non-empty before calling `onAdd`
- New shows are always created with `status: 'unwatched'`
- Resets form fields after successful submission

---

## State Management

### Philosophy

This application uses **prop drilling** exclusively -- no React Context, no Redux, no external state library. All application state lives in `App.tsx` as `useState` hooks, and all mutations flow through callback props.

### State Shape

```typescript
// In App.tsx
const [platforms, setPlatforms] = useState<Platform[]>(loadPlatforms)
const [activeId, setActiveId] = useState<string>(() => loadPlatforms()[0]?.id ?? '')
```

- `platforms` -- The complete array of streaming platforms and their shows. This is the single source of truth for all data.
- `activeId` -- The ID of the currently selected platform tab.

### Derived State

```typescript
const activePlatform = platforms.find(p => p.id === activeId) ?? platforms[0]
```

The active platform is derived on every render -- it is not stored separately in state.

### Mutation Functions

All mutations go through a shared `updatePlatforms` helper that accepts a transformation function:

```typescript
function updatePlatforms(fn: (prev: Platform[]) => Platform[]) {
  setPlatforms(prev => fn(prev))
}
```

The four mutation functions use `updatePlatforms` with immutable update patterns:

| Function | Signature | Pattern |
|---|---|---|
| `addShow` | `(platformId, show) => void` | Maps over platforms, spreads new show (with generated `id` and `addedAt`) into the matching platform's `shows` array |
| `updateShow` | `(platformId, showId, patch) => void` | Maps over platforms, maps over shows within the matching platform, spreads `patch` onto the matching show |
| `deleteShow` | `(platformId, showId) => void` | Maps over platforms, filters out the matching show from the matching platform's `shows` array |
| `addPlatform` | `(name) => void` | Spreads a new `Platform` object onto the end of `platforms`, then sets `activeId` to the new platform |

### Local Component State

`ShowList` maintains its own UI state for sorting and filtering. These are view-level concerns that do not need to be persisted or shared:

```typescript
const [adding, setAdding] = useState(false)
const [sort, setSort] = useState<SortKey>('priority')
const [filter, setFilter] = useState<FilterStatus>('all')
```

`AddShowForm` maintains controlled form state (`title`, `priority`, `notes`) that is purely local to the form lifecycle.

---

## Data Flow

### User Interaction Flows

#### 1. Selecting a Platform Tab

```
User clicks tab
  → PlatformTabs calls onSelect(platformId)
    → App.setActiveId(platformId)
      → Re-render: activePlatform is re-derived
        → ShowList receives new platform prop
```

#### 2. Adding a Show

```
User clicks "+ Add Show"
  → ShowList.setAdding(true)
    → AddShowForm renders

User fills form and submits
  → AddShowForm validates title
    → AddShowForm calls onAdd({ title, priority, status: 'unwatched', notes })
      → ShowList calls onAddShow(platform.id, show)
        → App.addShow(platformId, show)
          → Immutable state update (new show with generated id and addedAt)
            → useEffect fires → savePlatforms(platforms) → localStorage updated
```

#### 3. Cycling Show Status

```
User clicks status button on a ShowCard
  → ShowCard computes next status via STATUS_CYCLE[show.status]
    → ShowCard calls onStatusChange(show.id, nextStatus)
      → ShowList calls onStatusChange(platform.id, show.id, nextStatus)
        → App.updateShow(platformId, showId, { status: nextStatus })
          → Immutable state update → useEffect → localStorage
```

#### 4. Changing Priority

```
User selects new priority from dropdown
  → ShowCard calls onPriorityChange(show.id, newPriority)
    → ShowList calls onPriorityChange(platform.id, show.id, newPriority)
      → App.updateShow(platformId, showId, { priority: newPriority })
        → Immutable state update → useEffect → localStorage
```

#### 5. Deleting a Show

```
User clicks delete button (✕)
  → ShowCard calls onDelete(show.id)
    → ShowList calls onDeleteShow(platform.id, show.id)
      → App.deleteShow(platformId, showId)
        → Immutable state update (filter out show) → useEffect → localStorage
```

#### 6. Adding a New Platform

```
User clicks "+" add-platform button
  → PlatformTabs calls window.prompt('Platform name:')
    → If non-empty, calls onAddPlatform(name)
      → App.addPlatform(name)
        → New Platform object appended to platforms array
          → App.setActiveId(newPlatformId) → tab switches to new platform
            → useEffect → localStorage
```

---

## Persistence Layer

### Module: `src/storage.ts`

All persistence is handled through two functions and one constant:

```typescript
const KEY = 'tv-tracker-platforms'

const DEFAULTS: Platform[] = [
  { id: 'netflix', name: 'Netflix', shows: [] },
  { id: 'hulu',    name: 'Hulu',    shows: [] },
  { id: 'hbo',     name: 'HBO Max', shows: [] },
  { id: 'disney',  name: 'Disney+', shows: [] },
  { id: 'apple',   name: 'Apple TV+', shows: [] },
  { id: 'prime',   name: 'Prime Video', shows: [] },
  { id: 'peacock', name: 'Peacock', shows: [] },
]

export function loadPlatforms(): Platform[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Platform[]) : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function savePlatforms(platforms: Platform[]): void {
  localStorage.setItem(KEY, JSON.stringify(platforms))
}
```

### Persistence Strategy

- **Storage key:** `tv-tracker-platforms`
- **Format:** JSON-serialized `Platform[]` array
- **Load behavior:** On app mount, `loadPlatforms()` is called as the initial value for `useState`. If `localStorage` has no data or parsing fails, the seven default platforms are returned.
- **Save behavior:** A `useEffect` in `App.tsx` calls `savePlatforms(platforms)` on every change to the `platforms` array. This is a synchronous, write-on-every-change strategy -- there is no debouncing or batching.
- **Error handling:** `loadPlatforms()` wraps the `JSON.parse` call in a try/catch. If the stored data is corrupted, the app silently falls back to defaults.

### Limitations

- `localStorage` is limited to approximately 5 MB per origin in most browsers.
- Data is per-browser and per-origin -- it does not sync across devices.
- Clearing browser data will erase all saved shows.
- The `activeId` (selected tab) is not persisted -- on reload, the first platform is always selected.

---

## Styling and Theming

### Approach

The application uses a single global CSS file (`src/index.css`, 193 lines) with no CSS modules, CSS-in-JS, or pre-processors. Class names follow a BEM-like flat naming convention (e.g., `.show-card`, `.show-title`, `.show-controls`).

### CSS Custom Properties (Dark Theme)

All theme colors are defined as CSS custom properties on `:root`:

```css
:root {
  --bg: #0f0f13;           /* Page background -- near-black */
  --surface: #1a1a24;      /* Card/panel backgrounds */
  --surface2: #22222f;     /* Input/select backgrounds */
  --border: #2e2e3e;       /* Border color */
  --accent: #7c6af7;       /* Primary accent -- purple */
  --accent-hover: #9585ff; /* Accent hover state */
  --text: #e8e8f0;         /* Primary text color */
  --muted: #888899;        /* Secondary/muted text */
  --green: #4caf7d;        /* Watched status indicator */
  --yellow: #f0b429;       /* Watching status indicator */
  --red: #e05c5c;          /* Delete/danger actions */
  --radius: 8px;           /* Standard border radius */
}
```

### Typography

The app uses a system font stack for fast rendering and native appearance:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Base font size is `14px`.

### Visual Status Indicators

Show cards receive dynamic styling based on watch status through CSS classes:

| Status | CSS Class | Visual Effect |
|---|---|---|
| `unwatched` | `.status-unwatched` | Default appearance |
| `watching` | `.status-watching` | Yellow left border (`3px solid var(--yellow)`) |
| `watched` | `.status-watched` | Dimmed card (`opacity: 0.55`) |

Status buttons also receive status-specific styling:

```css
.status-btn.status-watching { border-color: var(--yellow); color: var(--yellow); }
.status-btn.status-watched  { border-color: var(--green);  color: var(--green);  }
```

### Layout

- The `.app` container is centered with `max-width: 860px` and auto margins
- Platform tabs use `display: flex` with `flex-wrap: wrap` for responsive wrapping
- Show cards use flexbox with `justify-content: space-between` to position content and controls
- The toolbar uses flexbox with wrapping for responsive behavior at narrow widths

### Reset

A universal box-sizing reset is applied at the top of the stylesheet:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
```

---

## Build and Development Tooling

### Vite Configuration

`vite.config.ts` is minimal -- it only enables the React plugin:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

The React plugin provides:
- React Fast Refresh for HMR during development
- Automatic JSX transform (no need to `import React` in every file)

### TypeScript Configuration

Key `tsconfig.json` settings:

| Option | Value | Purpose |
|---|---|---|
| `target` | `ES2020` | Output target for type-checking |
| `module` | `ESNext` | Use ES module syntax |
| `moduleResolution` | `bundler` | Resolve modules as a bundler would (Vite) |
| `jsx` | `react-jsx` | Use the automatic JSX runtime (React 17+ transform) |
| `strict` | `true` | Enable all strict type-checking options |
| `noEmit` | `true` | TypeScript is used for type-checking only -- Vite handles transpilation |
| `isolatedModules` | `true` | Ensures compatibility with single-file transpilation (required by Vite/esbuild) |
| `allowImportingTsExtensions` | `true` | Allows `.ts`/`.tsx` extensions in import paths |

### npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start the Vite dev server with HMR |
| `build` | `tsc && vite build` | Type-check with TypeScript, then bundle with Vite for production |
| `preview` | `vite preview` | Serve the production build locally for testing |

### Build Pipeline

1. `tsc` runs type-checking across all files in `src/` (no emit -- `noEmit: true`)
2. `vite build` uses esbuild to transpile TypeScript/JSX and Rollup to bundle the output
3. Production output is written to the `dist/` directory

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm (included with Node.js)

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

The optimized output is written to `dist/`.

### Preview Production Build

```bash
npm run preview
```

This serves the `dist/` directory locally so you can verify the production build before deploying.
