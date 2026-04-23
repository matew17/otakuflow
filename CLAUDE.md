# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Start Vite dev server
pnpm build          # Type-check + build production bundle
pnpm build-only     # Build without type-checking
pnpm test:unit      # Run Vitest unit tests
pnpm lint           # Run oxlint + eslint with auto-fix
pnpm format         # Prettier format (src/)
```

## Architecture

**OtakuFlow** is a Vue 3 + TypeScript anime discovery app that integrates with the [Jikan API](https://api.jikan.moe/v4).

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

### Key Conventions

- **Query keys** use arrays: `['anime', 'search', query, page]`
- **Search** is disabled until the query is > 2 characters; debounced 400 ms via `refDebounced` from `@vueuse/core`
- **Base components** (`BaseButton`, `BaseInput`, `BaseModal`) live in `src/components/` and are used for consistency across the UI
- **TypeScript types** for the Jikan API response schema are in `src/types/`
- Tests live in `src/__tests__/` and use `@vue/test-utils` + Vitest (jsdom environment)
