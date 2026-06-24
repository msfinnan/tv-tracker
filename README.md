# TV Tracker

A lightweight web app for tracking TV shows across streaming platforms. Organize your watchlist by service, set priorities, track watch status, and keep notes -- all saved locally in your browser.

## Features

- **Platform tabs** -- comes with Netflix, Hulu, HBO Max, Disney+, Apple TV+, Prime Video, and Peacock out of the box. Add custom platforms at any time.
- **Add shows** with a title, priority level (1-5), and optional notes.
- **Watch status tracking** -- cycle each show through Unwatched, Watching, and Watched with a single click.
- **Priority levels** -- rank shows from P1 (must watch) to P5 (someday) and adjust on the fly.
- **Sort and filter** -- sort your list by priority, title, or date added; filter by watch status.
- **Search** -- find shows by title or notes as you type.
- **Season / episode tracking** -- record an optional current season and episode for each show and update them as you watch.
- **Edit shows** -- update a show's title, notes, season, and episode after adding it.
- **Stats dashboard** -- see totals, unwatched/watching/watched counts, completion percentage, and per-platform bars at a glance.
- **Import / export** -- export your watchlist as JSON and import from JSON in either "merge" (add to existing) or "replace" (overwrite) mode.
- **Persistent storage** -- all data is saved to `localStorage`, so your list survives page reloads with no server required.
- **Dark theme** -- a dark UI designed for comfortable browsing.

## Tech Stack

- [React](https://react.dev/) 18 with functional components and hooks
- [TypeScript](https://www.typescriptlang.org/) 5
- [Vite](https://vitejs.dev/) 4 for dev server and builds
- [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/) (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`) and `jsdom` for the test suite

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

### Run the tests

```bash
npm test
```

This runs the suite once (`vitest run`). To run the tests in watch mode while developing:

```bash
npm run test:watch
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
    types.ts            # TypeScript types (Show, ShowPatch, Platform, WatchStatus)
    storage.ts          # localStorage helpers and default platforms
    constants.ts        # Shared constant values
    utils.ts            # Helper functions
    validation.ts       # JSON import validation for the import/export feature
    index.css           # Global styles (dark theme, layout)
    components/
      PlatformTabs.tsx     # Tab bar for switching between streaming platforms
      ShowList.tsx         # Sortable, filterable, searchable list of shows for a platform
      ShowCard.tsx         # Individual show row with status/priority controls
      AddShowForm.tsx      # Form for adding a new show
      SearchBar.tsx        # Search input for filtering shows by title or notes
      StatsDashboard.tsx   # Totals, status counts, completion percentage, and per-platform bars
      ImportExport.tsx     # Export watchlist to JSON and import (merge/replace) from JSON
    test/
      setup.ts             # Vitest/Testing Library test setup
      *.test.tsx           # Component tests
      *.test.ts            # storage and other module tests
```
