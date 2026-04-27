---
task: 001-favorites-list
date: 2026-04-27
branch: feat/001-favorites-list
pr: pending
agents_used: [planner]
models: { planner: sonnet }
---

# Run log — Favorites List

## Brief

Add a heart-toggle icon to every AnimeCard, a Pinia store persisted via pinia-plugin-persistedstate, a `/favorites` route, and a Favorites nav link.

## PRD

[docs/prds/001-favorites-list.md](../prds/001-favorites-list.md)

## Decisions

- D1: Store holds `Anime | AnimeSearch` union type — `AnimeCard` already accepts both, so no normalization step needed and no data loss when toggling from search results.
- D2: Heart icon always visible (user's explicit requirement), positioned absolutely top-right with a semi-transparent backdrop so it's legible on any poster color.
- D3: No new dependencies — `pinia-plugin-persistedstate` already installed and wired in `main.ts`.

## Subagent calls

1. planner — produced `docs/prds/001-favorites-list.md`; PRD updated inline to match user requirements (Pinia store, card icon instead of detail page).

## Diffs of note

- `src/stores/favorites.ts` — new store; only place that owns favorites state.
- `src/components/AnimeCard.vue` — added heart button with `.stop` propagation so card click still navigates normally.
- `src/components/AppHeader.vue` — added Favorites RouterLink.
- `src/router/index.ts` — added `/favorites` route with `requiresAuth`.
- `src/views/FavoritesView.vue` — reuses `AnimeCard` + `CardWrapper` grid pattern from ExploreView.

## Failures and retries

None.

## Open tech debt

- Heart icon on `/anime/:id` detail page not added (out of scope for v1).
- No badge count on the Favorites nav link (not requested).
- No search/filter within FavoritesView (deferred per non-goals).

## Follow-ups

- Consider showing a toast on favorite/unfavorite.
- `/favorites` could support drag-to-reorder in a future iteration.
