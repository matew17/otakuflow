/**
 * Integration tests for ExploreView.vue — covers the Explore filter tabs PRD.
 *
 * PRD criterion → test mapping:
 *   AC1  — FilterTabs component is rendered with two tabs; active tab uses bg-primary text-white
 *   AC2  — No URL params → activeFilter defaults to "top"
 *   AC3  — Clicking a tab calls router.replace with the correct filter param
 *   AC4  — filter=top data comes from useGetTopAnime; filter=season from useAnimeSeasonNow
 *   AC5  — SearchInput is visible regardless of active filter tab
 *   AC6  — Mounting with ?q=naruto pre-populates search and activates search path
 *   AC7  — Clearing search reverts to filter data (search query becomes empty)
 *   AC8  — Form @submit.prevent means Enter does not navigate (tested in SearchInput.spec.ts)
 *   AC9  — isLoading shows skeleton cards (SkeletonCard components)
 *   AC10 — Clicking an anime card calls router.push('/anime/<id>')
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import type { Anime, AnimeResponse } from '../../types/anime'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const topAnime: Anime = {
  mal_id: 1,
  title: 'Fullmetal Alchemist',
  synopsis: 'Brothers seek the Philosopher Stone.',
  score: 9.1,
  episodes: 64,
  images: { jpg: { image_url: 'fma.jpg', large_image_url: 'fma-large.jpg' } },
  genres: [{ mal_id: 1, name: 'Action' }],
  status: 'Finished Airing',
  year: 2009,
}

const seasonAnime: Anime = {
  mal_id: 2,
  title: 'Dungeon Meshi',
  synopsis: 'Cooking in a dungeon.',
  score: 8.7,
  episodes: 24,
  images: { jpg: { image_url: 'dm.jpg', large_image_url: 'dm-large.jpg' } },
  genres: [{ mal_id: 4, name: 'Adventure' }],
  status: 'Currently Airing',
  year: 2024,
}

const searchAnime: Anime = {
  mal_id: 3,
  title: 'Naruto',
  synopsis: 'A ninja with a dream.',
  score: 8.0,
  episodes: 220,
  images: { jpg: { image_url: 'naruto.jpg', large_image_url: 'naruto-large.jpg' } },
  genres: [{ mal_id: 1, name: 'Action' }],
  status: 'Finished Airing',
  year: 2002,
}

const topResponse: AnimeResponse = {
  data: [topAnime],
  pagination: { last_visible_page: 1, has_next_page: false, current_page: 1, items: { count: 1, total: 1, per_page: 25 }, count: 1, per_page: 25, total: 1 },
}

const seasonResponse: AnimeResponse = {
  data: [seasonAnime],
  pagination: { last_visible_page: 1, has_next_page: false, current_page: 1, items: { count: 1, total: 1, per_page: 25 }, count: 1, per_page: 25, total: 1 },
}

const searchResponse: AnimeResponse = {
  data: [searchAnime],
  pagination: { last_visible_page: 1, has_next_page: false, current_page: 1, items: { count: 1, total: 1, per_page: 25 }, count: 1, per_page: 25, total: 1 },
}

// ---------------------------------------------------------------------------
// Module mocks — must be declared before imports of the mocked modules
// ---------------------------------------------------------------------------

vi.mock('../../composables/useAnimeGetTop', () => ({
  useGetTopAnime: vi.fn(),
}))

vi.mock('../../composables/useAnimeSeasonNow', () => ({
  useAnimeSeasonNow: vi.fn(),
}))

vi.mock('../../composables/useAnimeSearch', () => ({
  useAnimeSearch: vi.fn(),
}))

import { useGetTopAnime } from '../../composables/useAnimeGetTop'
import { useAnimeSeasonNow } from '../../composables/useAnimeSeasonNow'
import { useAnimeSearch } from '../../composables/useAnimeSearch'
import ExploreView from '../../views/ExploreView.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRouter(initialPath = '/explore') {
  const routes: RouteRecordRaw[] = [
    { path: '/explore', component: { template: '<div />' } },
    { path: '/anime/:id', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
    { path: '/library', component: { template: '<div />' } },
    { path: '/favorites', component: { template: '<div />' } },
  ]
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(initialPath)
  return router
}

/** Returns a fake query result object similar to TanStack Query's useQuery return. */
function fakeQuery(data: AnimeResponse | null, options: { isLoading?: boolean } = {}) {
  return {
    data: ref(data),
    isLoading: ref(options.isLoading ?? false),
    isError: ref(false),
    error: ref(null),
  }
}

/** Default mock wiring: top=data, season=data, search=empty+disabled */
function wireDefaultMocks() {
  vi.mocked(useGetTopAnime).mockReturnValue(fakeQuery(topResponse) as any)
  vi.mocked(useAnimeSeasonNow).mockReturnValue(fakeQuery(seasonResponse) as any)
  vi.mocked(useAnimeSearch).mockReturnValue(fakeQuery(null) as any)
}

async function mountExplore(path = '/explore') {
  const router = makeRouter(path)
  await router.isReady()
  const pinia = createPinia()
  setActivePinia(pinia)

  const wrapper = mount(ExploreView, {
    global: { plugins: [router, pinia] },
  })
  return { wrapper, router }
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  wireDefaultMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// AC1 — FilterTabs rendered with correct tab labels and styling
// ---------------------------------------------------------------------------

describe('ExploreView — AC1: FilterTabs rendered', () => {
  it('renders "Top Anime" tab button', async () => {
    const { wrapper } = await mountExplore()
    const buttons = wrapper.findAll('button')
    expect(buttons.some((b) => b.text() === 'Top Anime')).toBe(true)
  })

  it('renders "This Season" tab button', async () => {
    const { wrapper } = await mountExplore()
    const buttons = wrapper.findAll('button')
    expect(buttons.some((b) => b.text() === 'This Season')).toBe(true)
  })

  it('active tab has bg-primary and text-white when filter=top', async () => {
    const { wrapper } = await mountExplore('/explore?filter=top')
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('bg-primary')
    expect(topButton.classes()).toContain('text-white')
  })

  it('inactive tab has bg-surface when filter=top', async () => {
    const { wrapper } = await mountExplore('/explore?filter=top')
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('bg-surface')
  })

  it('active tab has bg-primary and text-white when filter=season', async () => {
    const { wrapper } = await mountExplore('/explore?filter=season')
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('bg-primary')
    expect(seasonButton.classes()).toContain('text-white')
  })
})

// ---------------------------------------------------------------------------
// AC2 — Default tab is "Top Anime" when no filter param
// ---------------------------------------------------------------------------

describe('ExploreView — AC2: default tab is Top Anime', () => {
  it('Top Anime tab is active when no filter query param is present', async () => {
    const { wrapper } = await mountExplore('/explore')
    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    expect(topButton.classes()).toContain('bg-primary')
  })

  it('This Season tab is inactive when no filter query param is present', async () => {
    const { wrapper } = await mountExplore('/explore')
    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    expect(seasonButton.classes()).toContain('bg-surface')
  })

  it('top anime card title is shown by default (no filter param)', async () => {
    const { wrapper } = await mountExplore('/explore')
    await nextTick()
    expect(wrapper.text()).toContain(topAnime.title)
  })
})

// ---------------------------------------------------------------------------
// AC3 — Tab click calls router.replace with correct filter param
// ---------------------------------------------------------------------------

describe('ExploreView — AC3: clicking a tab calls router.replace with filter param', () => {
  it('clicking "This Season" tab calls router.replace with filter=season', async () => {
    const { wrapper, router } = await mountExplore('/explore?filter=top')
    const replaceSpy = vi.spyOn(router, 'replace')

    const seasonButton = wrapper.findAll('button').find((b) => b.text() === 'This Season')!
    await seasonButton.trigger('click')
    await nextTick()

    expect(replaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ query: expect.objectContaining({ filter: 'season' }) }),
    )
  })

  it('clicking "Top Anime" tab calls router.replace with filter=top', async () => {
    const { wrapper, router } = await mountExplore('/explore?filter=season')
    const replaceSpy = vi.spyOn(router, 'replace')

    const topButton = wrapper.findAll('button').find((b) => b.text() === 'Top Anime')!
    await topButton.trigger('click')
    await nextTick()

    expect(replaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ query: expect.objectContaining({ filter: 'top' }) }),
    )
  })
})

// ---------------------------------------------------------------------------
// AC4 — Data source switches between composables based on active filter
// ---------------------------------------------------------------------------

describe('ExploreView — AC4: data source depends on active filter', () => {
  it('shows top anime titles when filter=top', async () => {
    const { wrapper } = await mountExplore('/explore?filter=top')
    await nextTick()
    expect(wrapper.text()).toContain(topAnime.title)
    expect(wrapper.text()).not.toContain(seasonAnime.title)
  })

  it('shows season anime titles when filter=season', async () => {
    const { wrapper } = await mountExplore('/explore?filter=season')
    await nextTick()
    expect(wrapper.text()).toContain(seasonAnime.title)
    expect(wrapper.text()).not.toContain(topAnime.title)
  })
})

// ---------------------------------------------------------------------------
// AC5 — SearchInput is visible in both tabs
// ---------------------------------------------------------------------------

describe('ExploreView — AC5: search input visible in both tabs', () => {
  it('renders search input when filter=top', async () => {
    const { wrapper } = await mountExplore('/explore?filter=top')
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
  })

  it('renders search input when filter=season', async () => {
    const { wrapper } = await mountExplore('/explore?filter=season')
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// AC6 — Mounting with ?q=naruto pre-activates search
// ---------------------------------------------------------------------------

describe('ExploreView — AC6: ?q=naruto pre-populates search', () => {
  it('input is pre-filled with naruto when ?q=naruto is in the URL', async () => {
    // For the search path: useAnimeSearch must return search results when query is active
    vi.mocked(useAnimeSearch).mockReturnValue(fakeQuery(searchResponse) as any)

    const { wrapper } = await mountExplore('/explore?q=naruto')
    await nextTick()

    const input = wrapper.find('input[type="search"]')
    expect((input.element as HTMLInputElement).value).toBe('naruto')
  })
})

// ---------------------------------------------------------------------------
// AC7 — Clearing search reverts to filter data and removes q from URL
// ---------------------------------------------------------------------------

describe('ExploreView — AC7: clearing search reverts to filter data', () => {
  it('calls router.replace to remove q param when search is cleared', async () => {
    vi.mocked(useAnimeSearch).mockReturnValue(fakeQuery(searchResponse) as any)
    const { wrapper, router } = await mountExplore('/explore?q=naruto')
    await nextTick()

    const replaceSpy = vi.spyOn(router, 'replace')

    // Clear the search input
    const input = wrapper.find('input[type="search"]')
    await input.setValue('')
    await nextTick()

    // router.replace should have been called; q should not be in the query
    expect(replaceSpy).toHaveBeenCalled()
    const lastCall = replaceSpy.mock.calls[replaceSpy.mock.calls.length - 1]![0] as { query: Record<string, unknown> }
    expect(lastCall.query['q']).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// AC9 — isLoading shows skeleton cards
// ---------------------------------------------------------------------------

describe('ExploreView — AC9: loading state shows skeleton cards', () => {
  it('renders skeleton cards when top anime query is loading', async () => {
    vi.mocked(useGetTopAnime).mockReturnValue(fakeQuery(null, { isLoading: true }) as any)
    vi.mocked(useAnimeSearch).mockReturnValue(fakeQuery(null) as any)

    const { wrapper } = await mountExplore('/explore?filter=top')
    await nextTick()

    // SkeletonCard renders inside a CardWrapper; 6 skeletons expected
    const { default: SkeletonCard } = await import('../../components/SkeletonCard.vue')
    const skeletons = wrapper.findAllComponents(SkeletonCard)
    expect(skeletons.length).toBe(6)
  })

  it('renders skeleton cards when season query is loading', async () => {
    vi.mocked(useAnimeSeasonNow).mockReturnValue(fakeQuery(null, { isLoading: true }) as any)
    vi.mocked(useAnimeSearch).mockReturnValue(fakeQuery(null) as any)

    const { wrapper } = await mountExplore('/explore?filter=season')
    await nextTick()

    const { default: SkeletonCard } = await import('../../components/SkeletonCard.vue')
    const skeletons = wrapper.findAllComponents(SkeletonCard)
    expect(skeletons.length).toBe(6)
  })

  it('does not render skeleton cards when data is available', async () => {
    const { wrapper } = await mountExplore('/explore?filter=top')
    await nextTick()

    const { default: SkeletonCard } = await import('../../components/SkeletonCard.vue')
    const skeletons = wrapper.findAllComponents(SkeletonCard)
    expect(skeletons.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// AC10 — Clicking an anime card calls router.push('/anime/<id>')
// ---------------------------------------------------------------------------

describe('ExploreView — AC10: clicking anime card navigates to detail', () => {
  it('calls router.push with the anime detail path when a card wrapper is clicked', async () => {
    const { wrapper, router } = await mountExplore('/explore?filter=top')
    await nextTick()

    const pushSpy = vi.spyOn(router, 'push')

    const { default: CardWrapper } = await import('../../components/CardWrapper.vue')
    const cardWrappers = wrapper.findAllComponents(CardWrapper)
    expect(cardWrappers.length).toBeGreaterThan(0)

    await cardWrappers[0]!.trigger('click')
    await nextTick()

    expect(pushSpy).toHaveBeenCalledWith('anime/' + topAnime.mal_id)
  })

  it('calls router.push with season anime id when in season filter', async () => {
    const { wrapper, router } = await mountExplore('/explore?filter=season')
    await nextTick()

    const pushSpy = vi.spyOn(router, 'push')

    const { default: CardWrapper } = await import('../../components/CardWrapper.vue')
    const cardWrappers = wrapper.findAllComponents(CardWrapper)
    expect(cardWrappers.length).toBeGreaterThan(0)

    await cardWrappers[0]!.trigger('click')
    await nextTick()

    expect(pushSpy).toHaveBeenCalledWith('anime/' + seasonAnime.mal_id)
  })
})
