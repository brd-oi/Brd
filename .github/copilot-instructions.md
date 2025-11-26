<!-- Copilot instructions for brd-oi/Brd -->
# Copilot / AI Agent Instructions

This project is a Vite + React + TypeScript app using Tailwind and a small design-system of UI primitives. The goal of this file is to give an AI coding agent immediate, actionable context so it can be productive without lengthy discovery.

- Architecture (big picture):
  - **Frontend:** `src/` — pages live in `src/pages/` (e.g. `Hatching.tsx`, `Index.tsx`) and reusable primitives live in `src/components/ui/`.
  - **Data layer:** Supabase client at `src/integrations/supabase/client.ts` + SQL migrations in `supabase/migrations/`.
  - **Edge functions:** Deno-based edge functions in `supabase/edge_function/` (see `deno.json` and `deps.ts`). Tests run via `pnpm run test:edge-functions`.
  - **Lib / tooling:** helpers in `src/lib/` (example: `react-router-dom-proxy.tsx`). Project uses Vite for bundling and `pnpm` as package manager.

- Key scripts (run from repo root):
  - Install: `pnpm install` (this repo is a pnpm workspace)
  - Dev server: `pnpm dev` (runs `vite` with `VITE_ENABLE_ROUTE_MESSAGING=true`)
  - Build: `pnpm build` (or `pnpm run build:dev` for dev-mode sourcemaps)
  - Preview production build: `pnpm preview`
  - Lint: `pnpm lint`
  - Edge function tests: `pnpm run test:edge-functions`

- Conventions & patterns to follow (project-specific):
  - UI primitives: `src/components/ui/*.tsx` are small wrappers around Radix primitives and Tailwind classes. Prefer reusing these primitives when adding UI rather than adding raw Radix/Tailwind in pages.
  - Tailwind-first styling: do not add global CSS; prefer utility classes and existing component props.
  - File naming: components under `src/components/ui/` are lowercase filenames (e.g. `button.tsx`, `alert.tsx`). Pages use PascalCase (e.g. `Hatching.tsx`).
  - State & data fetching: the app uses `@supabase/supabase-js` for auth/data and `@tanstack/react-query` for caching. Look for `client.ts` and `react-query` usage when changing data flows.
  - Routing: `src/lib/react-router-dom-proxy.tsx` contains project-specific routing integration — inspect before modifying route behavior.

- Integration points / external dependencies to be careful with:
  - Supabase: credentials and setup are external; do not hardcode secrets. Edge functions are Deno runtime — tests run with `deno task test` under `supabase/edge_function`.
  - Third-party examples: `examples/third-party-integrations/stripe/` shows how payment integrations are organized.

- Where to look for examples of common changes:
  - Add/modify UI: `src/components/ui/` — follow existing prop shapes and class-variance-authority utilities.
  - New page: copy structure from `src/pages/Index.tsx` or `Hatching.tsx` and register routes via the routing pattern in `main.tsx`/`react-router-dom-proxy.tsx`.
  - DB changes: add SQL to `supabase/migrations/` and update edge functions if required.

- Testing and verification tips:
  - Run `pnpm dev` and open the Vite server; ensure any env toggles (like `VITE_ENABLE_ROUTE_MESSAGING`) are preserved.
  - For edge functions, run `pnpm run test:edge-functions` (this changes into `supabase/edge_function` and runs Deno tests).

- Merge guidance if this file already exists:
  - Preserve any project-specific notes already present (especially auth or deploy steps).
  - Update scripts/command examples if `package.json` changes.

If any section is unclear or you want more examples (e.g., a walkthrough for adding a new page + data fetch + migration), tell me which part and I'll expand with step-by-step edits referencing concrete files in `src/`.
