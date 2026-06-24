# Agent Instructions

Basic guidance for AI agents working in this repository.

## Project overview

TV Tracker is a lightweight web app for tracking TV shows across streaming
platforms. It is built with React 18, TypeScript 5, and Vite 4. The app runs
entirely client-side: there is no backend and no external API calls. All data is
persisted to the browser's `localStorage`.

## Conventions

- Use functional React components with hooks. There are no class components.
- Shared TypeScript types live in `src/types.ts` (e.g. `Show`, `ShowPatch`,
  `Platform`, `WatchStatus`). Reuse these types rather than redefining shapes.
- UI components live in `src/components/`, one component per file.
- `localStorage` access goes through the helpers in `src/storage.ts`. Avoid
  reading or writing `localStorage` directly from components.
- Keep shared constants in `src/constants.ts`, generic helpers in `src/utils.ts`,
  and import/export validation in `src/validation.ts`.
- Match the existing code style for naming, formatting, and error handling.

## Build and test commands

- `npm run dev` - start the Vite dev server.
- `npm run build` - type-check and build for production (output in `dist/`).
- `npm test` - run the test suite once (Vitest + Testing Library).
- `npm run test:watch` - run the tests in watch mode while developing.

## Testing expectations

This is a hobby project that prefers minimal testing. Don't add extensive test
coverage unless explicitly asked. When you do touch tested code, keep the
existing tests passing.
