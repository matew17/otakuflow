---
task: 0008-bottom-nav-title-improvements
date: 2026-04-27
branch: main
pr: TBD
agents_used: [implementer]
models: { implementer: sonnet }
---

# Run log — Bottom Navigation Bar & Page Title Improvements

## Brief

Replace the top AppHeader with a fixed bottom navigation bar using @iconify/vue icons, and introduce a reusable PageTitle component used consistently across all views.

## PRD

[docs/prds/0008-bottom-nav-title-improvements.md](../prds/0008-bottom-nav-title-improvements.md)

## Decisions

- D1: `DefaultLayout.vue` no longer imports `useAuthStore` directly — auth visibility is fully delegated to `BottomNav.vue` via its internal `v-if="auth.isLoggedIn"` guard, keeping the layout clean.
- D2: The "Characters" `<h1>` in `AnimeDetailView.vue` is intentionally NOT replaced with `<PageTitle>` per AC17 (only the anime title, not subtitles, uses PageTitle).
- D3: `pb-20` on `<main>` in DefaultLayout provides ~80px clearance so content never slides under the fixed nav.
- D4: `RouterLink` `active-class="text-[--color-accent]"` handles AC3 without any custom JS logic.
- D5: Logout button styled with `text-white/60 hover:text-white` for subtle visual distinction (AC6) without a heavy secondary color that could clash.

## Subagent calls

1. implementer — input PRD 0008; output source changes; duration ~5 min.

## Diffs of note

- `src/components/BottomNav.vue` — new component; fixed bottom nav with 3 RouterLinks + logout button, self-hides when not logged in
- `src/components/PageTitle.vue` — new component; centered h1 with bold styling and consistent spacing
- `src/layouts/DefaultLayout.vue` — removed AppHeader import and usage; added BottomNav + pb-20 on main
- `src/views/ExploreView.vue` — replaced `<h1>Explore</h1>` with `<PageTitle title="Explore" />`
- `src/views/LibraryView.vue` — replaced bare `<h1>Library</h1>` with `<PageTitle title="Library" />`
- `src/views/FavoritesView.vue` — replaced `<h1>Favorites</h1>` with `<PageTitle title="Favorites" />`
- `src/views/AnimeDetailView.vue` — replaced styled anime title `<h1>` with `<PageTitle :title="data?.data.title ?? ''" />`

## New dependencies

- `@iconify/vue@5.0.0` — provides 150k+ tree-shakeable SVG icons; used exclusively for BottomNav icons (Explore, Library, Favorites, Logout). Zero font-file overhead.

## Failures and retries

None.

## Open tech debt

- AppHeader.vue is now unused but still exists in the repo. It can be deleted once the tester confirms BottomNav covers all its scenarios.

## Follow-ups

- Consider `env(safe-area-inset-bottom)` via a Tailwind plugin for proper iPhone notch clearance (currently using flat `pb-4`).
- E2E tests for bottom nav navigation and active state highlighting to be written by tester subagent.
