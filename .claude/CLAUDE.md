# Anime Catalog — Agent Operating Rules

## Stack

- **Vue 3** (Composition API) + TypeScript (strict mode, `noUncheckedIndexedAccess`)
- **TanStack Vue Query 5** — all async state, caching, and loading states; no manual `ref` for remote data
- **Pinia** — auth store only (`useAuthStore`)
- **Vue Router 5** — route-level auth guards via `router.beforeEach()`
- **Tailwind CSS 4** — custom theme tokens: `surface`, `primary`, `accent`
- **Vite 8** — path alias `@` → `src/`
- Vitest for unit tests, Playwright for e2e; ESLint + @typescript-eslint

## Commands

- `pnpm install` — install
- `pnpm dev` — run dev server
- `pnpm typecheck` — tsc --noEmit
- `pnpm lint` — eslint
- `pnpm test` — vitest
- `pnpm test:e2e` — playwright
- `pnpm build` — vite build

## Architecture (5-line version)

**OtakuFlow** is a Vue 3 + TypeScript anime discovery app that integrates with the [Jikan API](https://api.jikan.moe/v4).

- `src/views/` routes. `src/components/` presentational. `src/composables/` stateful logic.
- State is kept pinia
- Anime data is fetched from a public REST API; types in `src/types/anime.ts`.
- Do not add new top-level folders without an ADR.

### Stack

- **Vue 3** (Composition API) + TypeScript (strict mode, `noUncheckedIndexedAccess`)
- **TanStack Vue Query 5** — all async state, caching, and loading states; no manual `ref` for remote data
- **Pinia** — auth store only (`useAuthStore`)
- **Vue Router 5** — route-level auth guards via `router.beforeEach()`
- **Tailwind CSS 4** — custom theme tokens: `surface`, `primary`, `accent`
- **Vite 8** — path alias `@` → `src/`

### Data Flow

```
View → Composable (useAnimeSearch, useGetTopAnime, …)
         ↓
    TanStack Vue Query (cache / staleTime / gcTime)
         ↓
    anime-service.ts (typed wrappers)
         ↓
    api.ts → apiFetch<T>() → Jikan API
```

Composables in `src/composables/` encapsulate query logic and are the only place that calls `src/services/`. Views and components consume composables; they never call service functions directly.

### Routing & Auth

Routes are defined in `src/router/index.ts`. Routes that need auth carry `meta: { requiresAuth: true }`. The `beforeEach` guard redirects unauthenticated users to `/login?redirect=<original-path>`. Authenticated views are wrapped by `src/layouts/DefaultLayout.vue`.

Route structure:

- `/explore` — main browse / search (top anime or search results)
- `/anime/:id` — detail page with characters sorted by role/favorites
- `/library` — user watchlist (stub)
- `/login` — auth form

### Environment

`VITE_ANIME_API_BASE_URL` sets the Jikan base URL (default: `https://api.jikan.moe/v4`). Defined in `.env`.

## Agent rules (MUST)

- R1. Before writing code, call the `planner` subagent to produce `docs/prds/<id>-<slug>.md`. Human must approve by setting frontmatter `approved: true`.
- R2. For any `.vue` file touched, load skill `vue-component`.
- R3. Every task ends with a run log in `docs/agent-runs/`.
- R4. Tests MUST validate the PRD acceptance criteria, not the implementation.
- R5. After the tester passes: push the feature branch and open a PR against `main` via `gh pr create`. Then immediately run the `reviewer` subagent against the open PR. Do not ask for confirmation at either step — both are authorized by a passing tester. Always link the run log in the PR body.
- R6. Use the full pipeline (implementer → tester → open PR → reviewer) for any change that adds a new route, component, store, or composable. Skip subagents only for isolated fixes (single file, <20 lines, no new abstractions). When in doubt, ask (G4).

## Agent rules (MUST NOT)

- R7. Do NOT push commits directly to `main` or merge PRs. Pushing feature branches and opening PRs is expected and does not require confirmation.
- R8. Do NOT edit `.github/workflows/`, `.claude/`, `docs/adr/`, or `.env*` without env var `CC_ALLOW_SENSITIVE=1`.
- R9. Do NOT add new dependencies without recording the reason in the run log.
- R10. Do NOT run commands beyond the allowlist in `.claude/settings.json`.

## Subagent routing

- requirements intake → `planner`
- code change → `implementer`
- tests → `tester`
- PR diff review → `reviewer`
- any diff touching auth/payments/crypto patterns → `security` (in addition)

## Human gates

- G1 PRD approval before implementation starts.
- G2 Human merges PR (the agent never merges); CI must pass and reviewer approval must be present before merge.
- G3 Human approves production deploy in GitHub Environments.
- G4 If hesitating or unsure about running the agentic solution when a request lands, then ask in the first prompt.

## Cautious paths (human must co-edit)

- None currently. Add here when relevant.

## Run logs

- Location: `docs/agent-runs/YYYY-MM-DD-<slug>.md`
- Template: `docs/agent-runs/TEMPLATE.md`
- Always link the run log in the PR description.

### Styles

- **Query keys** use arrays: `['anime', 'search', query, page]`
- **Search** is disabled until the query is > 2 characters; debounced 400 ms via `refDebounced` from `@vueuse/core`
- **Base components** (`BaseButton`, `BaseInput`, `BaseModal`) live in `src/components/` and are used for consistency across the UI
- **TypeScript types** for the Jikan API response schema are in `src/types/`
- Tests live in `src/__tests__/` and use `@vue/test-utils` + Vitest (jsdom environment)
- Prefer composables over in-component logic.
- Prefer `<script setup lang="ts">`.
- No default exports from components — named exports for testability.
