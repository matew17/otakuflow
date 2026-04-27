---
id: '001'
slug: 'favorites-list'
title: 'Favorites List'
status: 'draft'
approved: true
created: '2026-04-27'
author: 'planner'
---

## Problem

Users have no way to save or revisit anime they are interested in. Once they leave the explore page, there is no mechanism to mark anime as favorites or access a personalized collection.

## Goals

1. Add a heart-toggle icon directly on each `AnimeCard` component.
2. Persist favorites in a Pinia store using `pinia-plugin-persistedstate` (already installed).
3. Add a `/favorites` route accessible from the top navigation bar.
4. The `/favorites` view reuses the same card grid layout as `/explore`, sourced from the store.

## Non-goals

- Backend persistence or syncing across devices.
- Heart icon on the detail page (`/anime/:id`).
- Bulk operations (mass delete, export).
- Search/filter within the favorites view (v1).

## User stories

- **US1**: As a user browsing the explore page, I want to click a heart icon on any anime card to toggle it as a favorite.
- **US2**: As a user, I want to see the heart icon filled when an anime is already favorited, so I know its status at a glance.
- **US3**: As a user, I want a "Favorites" link in the top navigation bar to quickly reach my list.
- **US4**: As a user, I want my favorites to persist after closing and reopening the browser.

## Acceptance criteria

1. **Pinia store**: A `useFavoritesStore` in `src/stores/favorites.ts` exposes:
   - `favorites: Anime[]` — reactive list of favorited anime
   - `isFavorite(animeId: number): boolean`
   - `toggleFavorite(anime: Anime): void`
   - `clearFavorites(): void`

2. **Persistence**: The store uses `pinia-plugin-persistedstate` with key `otakuflow:favorites`; favorites survive a full page reload.

3. **AnimeCard heart icon**: `AnimeCard.vue` displays a heart button that:
   - Is always visible on the card (or visible on hover — implementer's choice).
   - Shows filled/unfilled based on `isFavorite()`.
   - Calls `toggleFavorite()` on click without navigating away.
   - Stops click propagation so the card link does not fire.

4. **Top navigation link**: `AppHeader.vue` (or the layout nav) includes a "Favorites" link pointing to `/favorites`.

5. **Favorites route**: `/favorites` is added to `src/router/index.ts` with `meta: { requiresAuth: true }`.

6. **FavoritesView**: `src/views/FavoritesView.vue` renders the same `AnimeCard` grid as ExploreView, consuming `useFavoritesStore().favorites`. Shows "No favorites yet" when the list is empty.

7. **Reactivity**: Favoriting/unfavoriting on `/explore` updates the `/favorites` view instantly (shared store state).

8. **TypeScript strict**: All new code passes `vue-tsc --noEmit` and ESLint without errors.

## Technical notes

### Store design

```typescript
// src/stores/favorites.ts
export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<Anime[]>([])
    const isFavorite = (id: number) => favorites.value.some((a) => a.mal_id === id)
    const toggleFavorite = (anime: Anime) => {
      if (isFavorite(anime.mal_id)) {
        favorites.value = favorites.value.filter((a) => a.mal_id !== anime.mal_id)
      } else {
        favorites.value.push(anime)
      }
    }
    const clearFavorites = () => {
      favorites.value = []
    }
    return { favorites, isFavorite, toggleFavorite, clearFavorites }
  },
  { persist: { key: 'otakuflow:favorites' } },
)
```

### New files

- `src/stores/favorites.ts` — Pinia store
- `src/views/FavoritesView.vue` — favorites list view
- `src/__tests__/favorites-store.test.ts` — unit tests

### Modified files

- `src/components/AnimeCard.vue` — add heart icon
- `src/layouts/DefaultLayout.vue` (or `AppHeader.vue`) — add nav link
- `src/router/index.ts` — add `/favorites` route

### No new dependencies

`pinia-plugin-persistedstate` is already installed (used by auth store).

## Open questions

1. Should the heart icon always be visible on the card, or only on hover?
2. Should unfavoriting from within `/favorites` remove the card immediately (yes, via store reactivity)?
