---
id: "001"
slug: "favorites-list"
title: "Favorites List"
status: "draft"
approved: false
created: "2026-04-27"
author: "planner"
---

## Problem

Users have no way to save or revisit anime they are interested in. Once they leave the detail page, there is no mechanism to mark anime as favorites or access a personalized collection. This limits discoverability and the user's ability to maintain a curated watchlist.

## Goals

1. Enable users to mark anime as favorite/unfavorite with visual feedback.
2. Persist favorites in browser localStorage (no backend required).
3. Display a badge count of favorited anime in the top navigation.
4. Provide a dedicated `/favorites` route listing all favorited anime with the same card-based UI as `/explore`.
5. Ensure favorites persist across browser sessions.

## Non-goals

- Backend persistence or syncing across devices.
- Analytics on favorite trends.
- Sharing favorites with other users.
- Bulk operations on favorites (mass delete, export).
- Integration with the `/library` view (remains a separate stub).

## User stories

- **US1**: As a logged-in user browsing anime detail, I want to click a heart icon to toggle favorite status so I can save anime to review later.
- **US2**: As a logged-in user, I want to see a badge on the "Favorites" nav link showing how many anime I have saved so I can quickly gauge my list size.
- **US3**: As a logged-in user, I want to visit `/favorites` to see all my saved anime in a grid layout, search-capable, and with the same card visual style as `/explore`.
- **US4**: As a logged-in user, I want my favorites to persist after I close and reopen the browser so I don't lose my collection.

## Acceptance criteria

1. **Favorites composable exists**: A `useFavorites()` composable in `src/composables/useFavorites.ts` exports:
   - `favoriteIds` (reactive Set<number> or Ref<number[]>)
   - `isFavorite(animeId: number): boolean`
   - `toggleFavorite(anime: Anime): void`
   - `getFavoritedAnime(): Anime[]`
   - `clearFavorites(): void`

2. **localStorage integration**: Favorites are persisted to `otakuflow:favorites` key as a JSON array of anime objects (not just IDs).

3. **Detail page heart icon**: `AnimeDetailView.vue` displays a heart button (or icon) above or alongside the anime title that:
   - Shows filled/unfilled based on `isFavorite()` state.
   - Calls `toggleFavorite()` on click.
   - Is visually distinct (e.g., red when filled, outlined when empty).

4. **Navigation badge**: `AppHeader.vue` displays a favorites link/button in the nav bar with a badge showing the count of favorited anime (e.g., "♥️ 3" or a badge overlay).

5. **Favorites route exists**: A new route `/favorites` is added to `src/router/index.ts` with `meta: { requiresAuth: true }`.

6. **FavoritesView component**: A new `src/views/FavoritesView.vue` displays:
   - All favorited anime in the same `CardWrapper` + `AnimeCard` grid as ExploreView.
   - A message "No favorites yet" if the list is empty.
   - Click behavior that navigates to `/anime/:id` (same as ExploreView).
   - (Optional) Search/filter by title within favorites.

7. **Badge count reactive**: When a user favorites/unfavorites an anime on the detail page, the badge in `AppHeader` updates in real-time without full refresh.

8. **Persistence across sessions**: Close and reopen the browser; favorites list is intact.

9. **Cross-page consistency**: Favoriting anime on `/explore` detail page updates the `/favorites` view; unfavoriting on `/favorites` updates the badge.

10. **TypeScript strict mode**: All new code passes `vue-tsc --noEmit` and ESLint without errors; uses strict typing for Anime objects.

## Technical notes

### Data shape

Favorites are stored as a JSON array in localStorage under key `otakuflow:favorites`:

```json
[
  {
    "mal_id": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "synopsis": "...",
    "score": 9.09,
    "episodes": 64,
    "images": { "jpg": { "image_url": "...", "large_image_url": "..." } },
    "genres": [{ "mal_id": 1, "name": "Action" }],
    "status": "Finished Airing",
    "year": 2009
  }
]
```

### Composable design (recommended option)

**Option A (chosen)**: Use a composable `useFavorites()` that:
- Initializes from localStorage on first mount.
- Exposes a reactive ref or computed state of favorites.
- Does NOT add a new Pinia store (keep auth store as the only store per CLAUDE.md).
- Handles localStorage reads/writes internally.

**Option B (rejected)**: Create a new Pinia store for favorites.
- Violates the constraint that "Pinia — auth store only" per CLAUDE.md.
- Would require modifying the architecture guidance.

**Why Option A**: Keeps the codebase lean, respects existing architectural constraints, and leverages Vue's reactivity system directly. localStorage is simple and sufficient for client-side favorites.

### Component modifications

- **AnimeDetailView.vue**: Add a favorite button near the title or score section. Use a heart icon (e.g., `♥️` or SVG) with conditional fill color.
- **AppHeader.vue**: Add a new nav link/button for favorites with a badge count (e.g., `<RouterLink to="/favorites">Favorites <span class="badge">{{ favoriteCount }}</span></RouterLink>`).
- **BaseButton.vue**: No changes required; reuse existing component for toggle button if styled appropriately.

### New files

- `src/composables/useFavorites.ts` — composable
- `src/views/FavoritesView.vue` — favorites list view
- `src/__tests__/useFavorites.test.ts` — unit tests for composable
- `src/__tests__/FavoritesView.test.ts` — component tests for view (optional)

### Route configuration

Add to `src/router/index.ts` children array:

```typescript
{ path: 'favorites', component: FavoritesView, meta: loginMeta }
```

### localStorage key

- Key: `otakuflow:favorites`
- Format: JSON stringified array of `Anime` objects
- Scope: Per-browser, per-domain (not synced across devices/browsers)

## Acceptance testing strategy

### Unit tests (Vitest, `src/__tests__/useFavorites.test.ts`)

1. **Test initialization**: Composable reads from localStorage on first call.
2. **Test isFavorite()**: Returns true/false based on current state.
3. **Test toggleFavorite()**: Adds anime not in favorites; removes anime already in favorites.
4. **Test persistence**: After toggle, localStorage is updated.
5. **Test getFavoritedAnime()**: Returns correct anime objects in the favorites list.
6. **Test clearFavorites()**: Empties the list and clears localStorage.

### Component tests (Vitest + @vue/test-utils)

1. **AnimeDetailView**: Renders a heart button; clicking toggles its fill state; calls composable methods.
2. **AppHeader**: Badge displays correct count; updates reactively when composable state changes.
3. **FavoritesView**: Displays grid of favorited anime; shows empty state when no favorites; click navigates to detail page.

### E2E tests (Playwright, `tests/favorites.spec.ts`)

1. **User flow**: Login → navigate to anime detail → click heart → verify badge count increases in nav → navigate to /favorites → verify card appears → click card → verify detail loads.
2. **Persistence**: Favorite anime → close browser → reopen → verify favorites are restored.
3. **Unfavorite flow**: Add favorite → navigate to /favorites → click card → unfavorite → return to /favorites → verify card is removed.
4. **Empty state**: Log out and log back in with a fresh profile → /favorites shows "No favorites yet" message.

### Manual smoke tests

- Favorite from detail page; badge updates immediately without refresh.
- Search/filter on /favorites page (if implemented).
- localStorage key and value can be inspected in browser DevTools.

## Implementation notes

- **Debouncing**: Optional debounce for localStorage writes if toggling favorites very rapidly (low priority).
- **Hydration**: Ensure composable is available before components mount; use lazy loading if needed.
- **Accessibility**: Heart button should have `aria-label` describing state (e.g., "Add to favorites" vs "Remove from favorites").
- **Error handling**: Gracefully handle corrupted localStorage or quota exceeded (warn user, disable favorites temporarily).

## Open questions

1. Should favoriting/unfavoriting trigger a toast/snackbar notification, or is the badge count sufficient visual feedback?
2. Should the /favorites view include search/filter by title (scope creep vs. UX benefit)?
3. Should we display the anime's current score/rating on the favorite card, or keep the card identical to ExploreView's AnimeCard?
4. What is the expected maximum number of favorites before localStorage quota becomes a concern? (Typically 5–10 MB per domain; each anime ~2 KB, so ~2500 anime should be safe.)
