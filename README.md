# TV Tracker

A lightweight web app for tracking TV shows across streaming platforms. Organize your watchlist by service, set priorities, track watch status, and keep notes -- all saved locally in your browser.

## Features

- **Platform tabs** -- comes with Netflix, Hulu, HBO Max, Disney+, Apple TV+, Prime Video, and Peacock out of the box. Add custom platforms at any time.
- **Add shows** with a title, priority level (1-5), and optional notes.
- **Watch status tracking** -- cycle each show through Unwatched, Watching, and Watched with a single click.
- **Priority levels** -- rank shows from P1 (must watch) to P5 (someday) and adjust on the fly.
- **Sort and filter** -- sort your list by priority, title, or date added; filter by watch status.
- **Persistent storage** -- all data is saved to `localStorage`, so your list survives page reloads with no server required.
- **Dark theme** -- a dark UI designed for comfortable browsing.

## Tech Stack

- [React](https://react.dev/) 18 with functional components and hooks
- [TypeScript](https://www.typescriptlang.org/) 5
- [Vite](https://vitejs.dev/) 4 for dev server and builds

No backend, no external API calls. Everything runs client-side.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Output is written to the `dist/` directory.

### Preview the production build

```bash
npm run preview
```

## Project Structure

```
tv-tracker/
  index.html            # HTML entry point
  package.json
  tsconfig.json
  vite.config.ts
  src/
    main.tsx            # React root render
    App.tsx             # Top-level app component and state management
    types.ts            # TypeScript types (Show, Platform, WatchStatus)
    storage.ts          # localStorage helpers and default platforms
    index.css           # Global styles (dark theme, layout)
    components/
      PlatformTabs.tsx  # Tab bar for switching between streaming platforms
      ShowList.tsx      # Sortable, filterable list of shows for a platform
      ShowCard.tsx      # Individual show row with status/priority controls
      AddShowForm.tsx   # Form for adding a new show
```
