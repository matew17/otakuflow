/**
 * Component-level tests for AC3, AC4, AC5, AC6, AC7
 * (AC1 and AC2 are covered by favorites-store.spec.ts)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import AnimeCard from '../components/AnimeCard.vue'
import FavoritesView from '../views/FavoritesView.vue'
import { useFavoritesStore } from '../stores/favorites'
import type { Anime } from '../types/anime'
import routerIndex from '../router/index'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePinia() {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  setActivePinia(pinia)
  return pinia
}

/** Minimal stub router used by component tests that need RouterLink resolved. */
function makeStubRouter() {
  const routes: RouteRecordRaw[] = [
    { path: '/', component: { template: '<div />' } },
    { path: '/explore', component: { template: '<div />' } },
    { path: '/favorites', component: { template: '<div />' } },
    { path: '/library', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
    { path: '/anime/:id', component: { template: '<div />' } },
  ]
  return createRouter({ history: createWebHashHistory(), routes })
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

// ---------------------------------------------------------------------------
// AC3 — AnimeCard heart button
// ---------------------------------------------------------------------------

describe('AnimeCard — AC3: heart button', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders a heart button element on the card', () => {
    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('heart button aria-label says "Add to favorites" when anime is not favorited', () => {
    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Add to favorites')
  })

  it('heart SVG fill is "none" (unfilled) when anime is not favorited', () => {
    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const path = wrapper.find('svg path')
    expect(path.attributes('fill')).toBe('none')
  })

  it('heart SVG is filled when anime is already favorited', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)

    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const path = wrapper.find('svg path')
    // fill should be a non-"none" color value indicating filled state
    expect(path.attributes('fill')).not.toBe('none')
  })

  it('heart button aria-label says "Remove from favorites" when anime is already favorited', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)

    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Remove from favorites')
  })

  it('clicking the heart button calls toggleFavorite and updates isFavorite', async () => {
    const store = useFavoritesStore()
    expect(store.isFavorite(animeA.mal_id)).toBe(false)

    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    await nextTick()

    expect(store.isFavorite(animeA.mal_id)).toBe(true)
  })

  it('clicking the heart button stops event propagation (@click.stop)', async () => {
    const wrapper = mount(AnimeCard, {
      props: { anime: animeA },
    })

    let parentClicked = false
    wrapper.element.addEventListener('click', () => {
      parentClicked = true
    })

    const button = wrapper.find('button')
    // Use the DOM element directly so the event actually bubbles through the real DOM
    button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(parentClicked).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// AC5 — Favorites route configuration
// ---------------------------------------------------------------------------

describe('Router — AC5: /favorites route exists with requiresAuth', () => {
  it('/favorites route is registered', () => {
    const allRoutes = routerIndex.getRoutes()
    const favRoute = allRoutes.find((r) => r.path === '/favorites')
    expect(favRoute).toBeDefined()
  })

  it('/favorites route has meta.requiresAuth = true', () => {
    const allRoutes = routerIndex.getRoutes()
    const favRoute = allRoutes.find((r) => r.path === '/favorites')
    expect(favRoute?.meta?.requiresAuth).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// AC6 — FavoritesView
// ---------------------------------------------------------------------------

describe('FavoritesView — AC6: card grid and empty state', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('shows "No favorites yet" empty-state message when favorites list is empty', async () => {
    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    const wrapper = mount(FavoritesView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('No favorites yet')
  })

  it('does not show "No favorites yet" when there are favorites', async () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)

    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    const wrapper = mount(FavoritesView, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).not.toContain('No favorites yet')
  })

  it('renders one AnimeCard per favorited anime', async () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    store.toggleFavorite(animeB)

    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    const wrapper = mount(FavoritesView, {
      global: { plugins: [router] },
    })

    // AnimeCard renders a <div> with image + title text; check titles appear
    expect(wrapper.text()).toContain(animeA.title)
    expect(wrapper.text()).toContain(animeB.title)
  })

  it('calls router.push with the anime detail path when a card wrapper is clicked', async () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)

    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    // Spy on router.push to assert the navigation intent
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(FavoritesView, {
      global: { plugins: [router] },
    })

    // CardWrapper renders as <div class="w-[300px]">; Vue 3 falls through the
    // @click listener to the root element.
    const CardWrapperComp = (await import('../components/CardWrapper.vue')).default
    const cardWrapper = wrapper.findComponent(CardWrapperComp)
    await cardWrapper.trigger('click')
    await nextTick()

    // FavoritesView calls router.push('anime/' + id)
    expect(pushSpy).toHaveBeenCalledWith('anime/' + animeA.mal_id)
  })
})

// ---------------------------------------------------------------------------
// AC7 — Reactivity: shared store between views
// ---------------------------------------------------------------------------

describe('Reactivity — AC7: toggling in one context updates the other', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('favoriting via AnimeCard updates FavoritesView immediately (shared store)', async () => {
    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    // Mount FavoritesView first — starts empty
    const favView = mount(FavoritesView, {
      global: { plugins: [router] },
    })
    expect(favView.text()).toContain('No favorites yet')

    // Toggle favorite via the store (simulating AnimeCard click on explore)
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)
    await nextTick()

    // FavoritesView should now show the anime title
    expect(favView.text()).toContain(animeA.title)
    expect(favView.text()).not.toContain('No favorites yet')
  })

  it('unfavoriting via store removes card from FavoritesView immediately', async () => {
    const store = useFavoritesStore()
    store.toggleFavorite(animeA)

    const router = makeStubRouter()
    await router.push('/favorites')
    await router.isReady()

    const favView = mount(FavoritesView, {
      global: { plugins: [router] },
    })
    expect(favView.text()).toContain(animeA.title)

    // Unfavorite
    store.toggleFavorite(animeA)
    await nextTick()

    expect(favView.text()).not.toContain(animeA.title)
    expect(favView.text()).toContain('No favorites yet')
  })
})
