import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useFavoritesStore } from '../stores/favorites'
import type { Anime } from '../types/anime'

function makePinia() {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  setActivePinia(pinia)
}

const animeA: Anime = {
  mal_id: 1,
  title: 'Cowboy Bebop',
  synopsis: 'Space bounty hunters.',
  score: 8.75,
  episodes: 26,
  images: { jpg: { image_url: 'a.jpg', large_image_url: 'a-large.jpg' } },
  genres: [{ mal_id: 1, name: 'Action' }],
  status: 'Finished Airing',
  year: 1998,
}

const animeB: Anime = {
  mal_id: 2,
  title: 'Trigun',
  synopsis: 'A gunman on a desert planet.',
  score: 8.2,
  episodes: 26,
  images: { jpg: { image_url: 'b.jpg', large_image_url: 'b-large.jpg' } },
  genres: [{ mal_id: 1, name: 'Action' }],
  status: 'Finished Airing',
  year: 1998,
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // AC1 — store initializes empty
  it('starts with an empty favorites list', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toHaveLength(0)
  })

  // AC1 — isFavorite returns false when list is empty
  it('isFavorite returns false for an anime not in the list', () => {
    const store = useFavoritesStore()
    expect(store.isFavorite(1)).toBe(false)
  })

  // AC1 — toggleFavorite adds an anime
  it('toggleFavorite adds an anime that is not yet favorited', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    expect(store.favorites).toHaveLength(1)
    expect(store.favorites[0]?.mal_id).toBe(1)
    expect(store.isFavorite(1)).toBe(true)
  })

  // AC1 — toggleFavorite removes an already-favorited anime
  it('toggleFavorite removes an anime that is already favorited', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    store.toggleFavorite(animeA)
    expect(store.favorites).toHaveLength(0)
    expect(store.isFavorite(1)).toBe(false)
  })

  // AC1 — clearFavorites empties the list
  it('clearFavorites removes all favorites', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    store.toggleFavorite(animeB)
    store.clearFavorites()
    expect(store.favorites).toHaveLength(0)
  })

  // AC2 — persists to localStorage
  it('persists favorites to localStorage under the correct key', async () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    await nextTick()
    const raw = localStorage.getItem('otakuflow:favorites')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed).toMatchObject({ favorites: [{ mal_id: 1 }] })
  })

  // AC2 — restores from localStorage on fresh store init
  it('restores favorites from localStorage on fresh store initialisation', () => {
    localStorage.setItem(
      'otakuflow:favorites',
      JSON.stringify({ favorites: [animeA] }),
    )
    makePinia()
    const store = useFavoritesStore()
    expect(store.favorites).toHaveLength(1)
    expect(store.isFavorite(1)).toBe(true)
  })

  // AC7 — two anime can be favorited independently
  it('tracks multiple favorites independently', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    store.toggleFavorite(animeB)
    expect(store.favorites).toHaveLength(2)
    store.toggleFavorite(animeA)
    expect(store.favorites).toHaveLength(1)
    expect(store.isFavorite(2)).toBe(true)
    expect(store.isFavorite(1)).toBe(false)
  })
})
