---
id: '0009'
slug: explore-filters
title: 'Explore page — filter tabs + search override'
status: draft
approved: true
---

## Problem statement

The current **Explore** page always shows top anime and has a broken UX: pressing Enter in the search input reloads the page (native form submit), and there is no way to discover seasonal anime or to persist the user's browsing context across refreshes or page navigation. The page needs filter tabs, a fixed search input, and URL-based state persistence.

## Goals

After this ships, users can:

1. Click a "Top Anime" tab to view the top-rated anime (default on first visit).
2. Click a "This Season" tab to view anime airing in the current season.
3. See the active tab visually highlighted.
4. Type in the shared search box to override the active filter with search results.
5. Clear the search to return to the previously active filter's data.
6. Refresh the page or share the URL and land on the same filter + search state.
7. Press Enter in the search input without triggering a page reload.

## Non-goals

- Pagination controls (not exposed in UI for either filter in MVP).
- Genre filter or advanced filtering beyond the two primary sources.
- Sort options within a filter.

## Acceptance criteria

1. **Filter tab UI**: ExploreView displays two tabs labeled "Top Anime" and "This Season" with visual distinction for the active tab (using Tailwind `primary` token). Inactive tabs use the `surface` token.
2. **Default tab**: On first visit (no URL params), "Top Anime" is active.
3. **Tab switching**: Clicking a tab updates the URL query param `filter` (`?filter=top` or `?filter=season`) via `router.replace()` and switches the data source.
4. **Data source switching**: When `filter=top`, `useGetTopAnime()` provides data. When `filter=season`, `useAnimeSeasonNow()` provides data.
5. **Search shared across tabs**: The search input is visible and functional in both tabs. Typing overrides the active filter's data with search results (enabled when `q.length > 2`, debounced 400 ms).
6. **Search persisted in URL**: The search query is reflected in the URL as `?q=<value>` (combined with `?filter=...`). On load, if `q` param exists and `q.length > 2`, search is pre-activated.
7. **Search clear behavior**: When search is cleared (`q.length <= 2`), data reverts to whichever tab is active (from `filter` param). The `q` param is removed from the URL.
8. **Enter key fix**: The `<form>` in `SearchInput.vue` must have `@submit.prevent` so pressing Enter does not reload the page.
9. **Loading state**: A single `isLoading` computed reflects the state of whichever query is currently active (search or active filter). Skeleton cards appear while loading.
10. **Card display**: The anime grid uses existing `AnimeCard`, `CardWrapper`, and `SkeletonCard` components unchanged.
11. **No broken routes**: Clicking a card routes to `/anime/:id` as before.

## State management (URL as source of truth)

URL query params are the single source of truth for filter and search state:

| Param    | Values            | Default       |
| -------- | ----------------- | ------------- |
| `filter` | `top` \| `season` | `top`         |
| `q`      | any string        | `""` (absent) |

On mount, `ExploreView` reads `route.query.filter` and `route.query.q` to initialize the `activeFilter` ref and `searchInput` ref. Any user interaction (tab click or typing) calls `router.replace()` to keep the URL in sync. No Pinia store is needed for this state.

## Files to change

| File                                   | Change type | Description                                                                                                                                                                   |
| -------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/SearchInput.vue`       | Bug fix     | Add `@submit.prevent` to the `<form>` element.                                                                                                                                |
| `src/services/anime-service.ts`        | Addition    | Add `getSeasonNow()` → `GET /seasons/now`.                                                                                                                                    |
| `src/composables/useAnimeSeasonNow.ts` | New file    | Composable wrapping `getSeasonNow()` (staleTime: 5 min, gcTime: 10 min).                                                                                                      |
| `src/components/FilterTabs.vue`        | New file    | Tab component. Accepts `modelValue: 'top' \| 'season'`, emits `update:modelValue`. Highlights active tab.                                                                     |
| `src/views/ExploreView.vue`            | Refactor    | Read URL params on mount; sync state to URL on change; integrate `FilterTabs`; manage three queries with conditional `enabled`; unified `animeData` and `isLoading` computed. |

## API contracts

### `GET /top/anime`

- **Endpoint**: `https://api.jikan.moe/v4/top/anime`
- **Response**: `AnimeResponse` (`data: Anime[]`, `pagination: Pagination`)
- **Status**: Existing, implemented in `getTopAnime()`.

### `GET /seasons/now`

- **Endpoint**: `https://api.jikan.moe/v4/seasons/now`
- **Query params**: None required for MVP.
- **Response**: `AnimeResponse` (same structure as `/top/anime`)
- **Status**: New — add `getSeasonNow()` in `anime-service.ts`.

## Implementation approach

Three independent queries with conditional `enabled` (Option A — aligns with existing architecture):

```
queryTopAnime    → enabled when !isSearching && activeFilter === 'top'
querySeasonNow   → enabled when !isSearching && activeFilter === 'season'
querySearchAnime → enabled when isSearching (q.length > 2)
```

`animeData` computed picks from whichever query is active. Caching benefit: switching tabs does not re-fetch if data is still fresh within `staleTime`.

## Test strategy

### Unit tests — `src/__tests__/composables/useAnimeSeasonNow.spec.ts`

- Mock `getSeasonNow` and verify query key `['anime', 'season', 'now']`, `staleTime: 300000`, `gcTime: 600000`, and that it returns data.

### Component tests — `src/__tests__/components/FilterTabs.spec.ts`

- Render with `modelValue="top"` → "Top Anime" has active styling, "This Season" does not.
- Click "This Season" → emits `update:modelValue` with `"season"`.
- Click "Top Anime" → emits `update:modelValue` with `"top"`.

### Component tests — `src/__tests__/components/SearchInput.spec.ts`

- Submit the form (press Enter) → verify no navigation / page reload (form `submit` is prevented).

### Integration tests — `src/__tests__/views/ExploreView.spec.ts`

Mock `useGetTopAnime`, `useAnimeSeasonNow`, `useAnimeSearch`, and `useRouter`/`useRoute`.

- **Test 1 — Default state**: No URL params → "Top Anime" tab active, data from `useGetTopAnime`.
- **Test 2 — URL param init (filter)**: Mount with `?filter=season` → "This Season" active, data from `useAnimeSeasonNow`.
- **Test 3 — URL param init (search)**: Mount with `?q=naruto` → search enabled, data from `useAnimeSearch`.
- **Test 4 — Tab switch updates URL**: Click "This Season" → `router.replace` called with `{ query: { filter: 'season' } }`.
- **Test 5 — Search overrides filter**: Type >2 chars → `useAnimeSearch` enabled, its data shown regardless of active tab.
- **Test 6 — Search clear reverts**: Clear search → `useAnimeSearch` disabled, active filter data shown, `q` removed from URL.
- **Test 7 — Loading state**: Mock pending query → skeleton cards visible.
- **Test 8 — Card click navigation**: Click anime card → `router.push` called with `/anime/<id>`.

### E2E tests (deferred)

- Navigate to `/explore` → "Top Anime" active by default.
- Click "This Season" → URL updates, grid changes.
- Type search → results change; clear → filter data returns.
- Hard refresh → same state restored from URL.

## Tailwind / Styling notes

- Active tab: `bg-primary text-white` (or `border-b-2 border-primary` for underline style).
- Inactive tab: `bg-surface text-body`.
- Tab row: `flex gap-2` below the page title, above the search input.
- Mobile-friendly: two tabs fit on small screens; no horizontal scroll needed.

## Notes

- TypeScript strict mode (`noUncheckedIndexedAccess`) must be respected in all new code.
- `<script setup lang="ts">` in all Vue components.
- No default exports — named exports for testability.
- Query key convention: arrays — `['anime', 'season', 'now']`.
- `router.replace()` (not `push`) for filter/search URL sync to avoid polluting browser history.
