# AI Agent Guidance for my-golf-sweepstake

## Project overview
- Single-page React application built with Vite.
- Uses plain JavaScript and `.jsx` component files, not TypeScript.
- No backend in the workspace; UI state is stored in `localStorage` and static data is loaded from `src/data`.
- Main entry point: `src/main.jsx` → `src/App.jsx`.

## Key commands
- `npm install` — install dependencies
- `npm run dev` — start Vite development server
- `npm run build` — create production build
- `npm run lint` — run ESLint over the project

## Important files and folders
- `src/App.jsx` — main application state and stage flow
- `src/components/` — feature components organized by area
- `src/data/worldRankings.json` — static world rankings data used by the app
- `public/` — static assets served by Vite
- `fetchRankings.js` — utility script for updating ranking data (not part of the app runtime)

## Coding conventions
- Keep components in `src/components/*` with colocated CSS files.
- Prefer small reusable React components and pass state via props.
- Use `useState` and `useEffect` for client-side state and persistence.
- Preserve the plain JS/JSX code style; do not convert the app to TypeScript unless explicitly requested.

## What to prioritize
- Fix UI or state bugs in existing components.
- Keep logic in `App.jsx` aligned with the current “selection → draw → scores” flow.
- Avoid introducing a backend or server-side API.
- Use existing static data format when updating rankings or player data.

## Notes for AI agents
- The app is currently using local storage to persist selected tournament, participants, players, and draw results.
- The `Spinner` component uses `react-custom-roulette`.
- The README explains the project is a minimal Vite/React template with a static ranking data approach.

## Useful links
- `README.md` — project description and notes
- `package.json` — scripts and dependency overview
