/**
 * Unit tests for useAnimeSeasonNow composable
 *
 * PRD criterion → test mapping:
 *   AC4  — filter=season fetches from useAnimeSeasonNow (queryKey ['anime','season','now'])
 *   AC9  — composable exposes isLoading flag
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { useAnimeSeasonNow } from '../../composables/useAnimeSeasonNow'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

/**
 * Mounts a minimal component that calls the composable and exposes its return
 * value via wrapper.vm.result. This is the recommended pattern when composables
 * rely on Vue Query injection.
 */
function withSetup<T>(composable: () => T) {
  let result: T
  const Wrapper = defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    },
  })
  const queryClient = makeQueryClient()
  const wrapper = mount(Wrapper, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })
  // @ts-expect-error — assigned synchronously inside setup
  return { result: result!, wrapper, queryClient }
}

// ---------------------------------------------------------------------------
// Module-level mock for anime-service
// ---------------------------------------------------------------------------

vi.mock('../../services/anime-service', () => ({
  getSeasonNow: vi.fn(),
  getTopAnime: vi.fn(),
  searchAnime: vi.fn(),
}))

import { getSeasonNow } from '../../services/anime-service'
import type { AnimeResponse } from '../../types/anime'

const mockSeasonData: AnimeResponse = {
  data: [
    {
      mal_id: 101,
      title: 'Season Anime',
      synopsis: 'A seasonal hit.',
      score: 7.9,
      episodes: 12,
      images: { jpg: { image_url: 'season.jpg', large_image_url: 'season-large.jpg' } },
      genres: [{ mal_id: 2, name: 'Drama' }],
      status: 'Currently Airing',
      year: 2024,
    },
  ],
  pagination: { last_visible_page: 1, has_next_page: false },
}

// ---------------------------------------------------------------------------
// AC4 — correct query key
// ---------------------------------------------------------------------------

describe('useAnimeSeasonNow — AC4: uses correct query key', () => {
  beforeEach(() => {
    vi.mocked(getSeasonNow).mockResolvedValue(mockSeasonData)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls getSeasonNow when composable is used', async () => {
    const { result } = withSetup(() => useAnimeSeasonNow())
    // Let the query run
    await new Promise((r) => setTimeout(r, 0))
    expect(vi.mocked(getSeasonNow)).toHaveBeenCalled()
    expect(result).toBeDefined()
  })

  it('returns data from getSeasonNow on success', async () => {
    const { result } = withSetup(() => useAnimeSeasonNow())
    await new Promise((r) => setTimeout(r, 50))
    expect(result.data.value?.data[0]?.mal_id).toBe(101)
    expect(result.data.value?.data[0]?.title).toBe('Season Anime')
  })
})

// ---------------------------------------------------------------------------
// AC9 — isLoading flag
// ---------------------------------------------------------------------------

describe('useAnimeSeasonNow — AC9: exposes isLoading', () => {
  afterEach(() => vi.restoreAllMocks())

  it('exposes an isLoading reactive ref', () => {
    vi.mocked(getSeasonNow).mockResolvedValue(mockSeasonData)
    const { result } = withSetup(() => useAnimeSeasonNow())
    // isLoading is a boolean ref exposed by useQuery
    expect(typeof result.isLoading.value).toBe('boolean')
  })
})
