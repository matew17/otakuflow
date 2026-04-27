---
id: '0008'
slug: 'bottom-nav-title-improvements'
title: 'Bottom Navigation Bar & Page Title Improvements'
date: 2026-04-27
approved: true
---

# Bottom Navigation Bar & Page Title Improvements

## Context

OtakuFlow currently uses a horizontal navigation bar (`AppHeader.vue`) positioned at the top of the layout, displaying text links to main routes (Explore, Library, Favorites) alongside a Logout button. This layout is desktop-centric and not optimized for mobile experience.

The task is to:

1. Move navigation to the bottom of the screen in a mobile-style navigation bar with icons
2. Improve page titles across views for better visual hierarchy and readability

This aligns with modern mobile-first design patterns and improves overall UX consistency.

## Motivation

- **Mobile UX**: Bottom navigation is the standard mobile pattern, reducing thumb travel and improving reachability
- **Visual hierarchy**: Titles deserve better styling to establish page context clearly
- **Responsiveness**: Current header doesn't adapt gracefully to small screens
- **Accessibility**: Icons paired with tooltips/labels improve discoverability
- **Consistency**: All views currently use inconsistently styled `<h1>` tags

## Scope

### In Scope

- Refactor `AppHeader.vue` into a bottom navigation bar component
- Add icon library integration
- Create a new title component or styling convention
- Update `DefaultLayout.vue` to position nav at bottom and adjust main content spacing
- Update all view titles (ExploreView, LibraryView, FavoritesView, AnimeDetailView)
- Add/update tests for nav behavior, active states, and title rendering

### Out of Scope

- LoginView styling (login should not show bottom nav; already handled via auth guard)
- Mobile-specific menu collapse/drawer behavior (nav is always visible)
- Dark mode variants (already using theme tokens)

## Design Decisions

### Option A: @iconify/vue (Recommended)

**Pros:**

- 150k+ icons from multiple sets (Material Design, Feather, etc.)
- Tree-shakeable, only imports used icons
- No font file overhead
- Semantic icon naming
- Well-maintained, large community

**Cons:**

- Additional dependency (~5-10 KB gzip)
- Network request for icon metadata on first load (cached)

**Selection Rationale:** Best balance of ecosystem size, performance, and maintainability. Aligns with modern Vue practices.

### Option B: Phosphor Icons or Tabler Icons

**Pros:**

- Lightweight, curated icon sets
- Good for specific design systems

**Cons:**

- Smaller ecosystem
- May require custom sprite/font setup

### Option C: Font Awesome

**Pros:**

- Industry standard, huge icon library
- Well-documented

**Cons:**

- Heavier (font file ~50+ KB)
- Overkill for nav-only use case

**Recommendation:** Use Option A (@iconify/vue) for flexibility and performance.

---

### Typography for Page Titles

**Current state:** Views use unstyled `<h1>` tags with minimal spacing.

**Proposed approach:**

1. Create a `PageTitle` component (`src/components/PageTitle.vue`) or a Tailwind utility class
2. Apply consistently across all views:
   - Font: Inter (already defined in theme)
   - Weight: `font-bold` or `font-extrabold`
   - Size: `text-3xl` or `text-4xl`
   - Alignment: `text-center`
   - Spacing: `py-6` (top) + `mb-6` (bottom)
   - Color: Inherit from surface theme (white text on surface background)

3. Use existing Tailwind tokens: `text-white` (default), `bg-surface` (inherited from layout)

**Rationale:**

- Component approach (PageTitle) is reusable and testable
- Avoids inline class duplication
- Centralized styling makes future theme changes easier
- Consistent across all views

---

## Files Affected

| File                                         | Change                                                              | Reason            |
| -------------------------------------------- | ------------------------------------------------------------------- | ----------------- |
| `src/components/AppHeader.vue`               | Refactor to BottomNav; move to fixed bottom, use icons              | Core feature      |
| `src/layouts/DefaultLayout.vue`              | Adjust main padding-bottom; conditional nav rendering               | Layout adjustment |
| `src/components/PageTitle.vue`               | Create new component                                                | Title consistency |
| `src/views/ExploreView.vue`                  | Replace `<h1>` with `<PageTitle>`                                   | Apply new pattern |
| `src/views/LibraryView.vue`                  | Replace `<h1>` with `<PageTitle>`                                   | Apply new pattern |
| `src/views/FavoritesView.vue`                | Replace `<h1>` with `<PageTitle>`                                   | Apply new pattern |
| `src/views/AnimeDetailView.vue`              | Update title styling; may split into `<PageTitle>` + detail section | Apply new pattern |
| `src/styles.css`                             | (Optional) Add @theme tokens for icon colors if needed              | Theming           |
| `package.json`                               | Add `@iconify/vue` dependency                                       | Dependencies      |
| `src/__tests__/components/PageTitle.spec.ts` | Unit tests                                                          | Test coverage     |
| `src/__tests__/components/BottomNav.spec.ts` | Unit tests                                                          | Test coverage     |
| `playwright/e2e/navigation.spec.ts`          | E2E tests                                                           | Test coverage     |

---

## Acceptance Criteria

### Navigation Bar (Bottom Nav)

- **AC1:** Bottom nav component (`BottomNav.vue`) is created and renders at the fixed bottom of the viewport with 100% width
- **AC2:** Nav displays 3 icon buttons (Explore, Library, Favorites) + 1 logout button (or text label)
- **AC3:** Active route's icon is visually distinct (e.g., highlighted with accent color, text-decoration)
- **AC4:** Inactive icons are styled with muted color (e.g., `text-white/60`)
- **AC5:** On hover, icons show visual feedback (scale, color change, or background highlight)
- **AC6:** Logout button is distinguishable (e.g., secondary color or position)
- **AC7:** Nav is not visible on `/login` (only show when `auth.isLoggedIn === true`)
- **AC8:** Nav height accounts for safe area on mobile (padding on iPhone notch/dynamic island)
- **AC9:** Main content in `DefaultLayout` has `pb-[80px]` or similar to avoid overlap with fixed nav
- **AC10:** Icons are from `@iconify/vue` and match the theme's primary/accent colors

### Page Titles

- **AC11:** `PageTitle` component exists and accepts a `title` prop (string)
- **AC12:** Title is centered horizontally
- **AC13:** Title uses `text-3xl` or `text-4xl` font size with `font-bold` weight
- **AC14:** Title has `py-6` and `mb-6` spacing
- **AC15:** Title color is white (inherits from surface)
- **AC16:** All views (Explore, Library, Favorites, AnimeDetail) use `<PageTitle>` instead of plain `<h1>`
- **AC17:** AnimeDetailView's anime title (not the "Characters" subtitle) uses the PageTitle component

### Integration

- **AC18:** No console errors or warnings on page load or navigation
- **AC19:** Navigation works on mobile viewport (< 768px) without layout shift
- **AC20:** Navigation works on desktop viewport (> 1024px) without breaking grid/content

---

## Test Strategy

### Unit Tests (Vitest + @vue/test-utils)

**BottomNav.spec.ts:**

- Renders all 3 nav links (Explore, Library, Favorites)
- Renders logout button
- Applies `active-class` styling to current route
- Inactive links have muted styling
- Logout click calls auth store's `logout()` method and redirects to `/login`
- Nav is hidden when `auth.isLoggedIn === false`
- Icons render from @iconify/vue without errors

**PageTitle.spec.ts:**

- Accepts and renders `title` prop
- Has correct Tailwind classes applied (`text-center`, `text-3xl`, `font-bold`, etc.)
- Text is centered horizontally

### E2E Tests (Playwright)

**navigation.spec.ts (new or expanded):**

- User can navigate between Explore, Library, Favorites via bottom nav icons
- Active route's nav item is highlighted
- Logout button logs out user and redirects to login
- Nav is visible on `/explore` but not on `/login`
- Nav does not overlap content on mobile (check viewport width < 768px)
- Title is visible and centered on each page (Explore, Library, Favorites)

### Manual Testing

- Visual review on iOS Safari (notch/dynamic island safe area)
- Visual review on Android Chrome
- Color contrast check (WCAG AA) for icons and titles
- Keyboard navigation: tab through nav buttons, confirm focus states

---

## Icon Selection

**Proposed icons (from @iconify/vue, using `material-symbols` or `feather` set):**

| Route     | Icon               | Identifier                                         |
| --------- | ------------------ | -------------------------------------------------- |
| Explore   | Search / Compass   | `material-symbols:explore` or `feather:compass`    |
| Library   | Bookshelf / Book   | `material-symbols:library-books` or `feather:book` |
| Favorites | Heart              | `material-symbols:favorite` or `feather:heart`     |
| Logout    | Sign-out / Log-out | `material-symbols:logout` or `feather:log-out`     |

These are finalized during implementation; PRD does not mandate exact icons, only that they come from a consistent set.

---

## Dependencies

**To add:**

- `@iconify/vue` (latest stable, ~1.x)

**Affected existing deps:**

- None; this is additive

---

## Rollout

1. **Phase 1 (Week 1):** Create BottomNav and PageTitle components, wire into layout
2. **Phase 2 (Week 1):** Update all view titles to use PageTitle
3. **Phase 3 (Week 2):** Write comprehensive tests (unit + e2e)
4. **Phase 4 (Week 2):** Visual polish and mobile QA
5. **Phase 5 (Week 3):** Merge to main after approval

---

## Questions

None at this time. The design is clear and the acceptance criteria are testable.

---

## Success Metrics

- All AC (Acceptance Criteria) met
- Tests pass (unit + e2e)
- Zero accessibility regressions
- Mobile navigation fully functional on iOS/Android
- Page load time impact < 50ms (from @iconify/vue CDN)
