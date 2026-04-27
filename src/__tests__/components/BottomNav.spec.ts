/**
 * Unit tests for BottomNav.vue
 *
 * PRD criterion → test mapping:
 *   AC1  — component renders at the fixed bottom of the viewport
 *   AC2  — shows links to Explore, Library, Favorites and a Logout button
 *   AC3  — active route link has class text-[--color-accent]
 *   AC4  — inactive links have class text-white/60
 *   AC7  — component renders nothing when auth.isLoggedIn === false
 *   AC9  — (covered by DefaultLayout; nav itself fixed bottom-0)
 *   Logout click — calls auth.logout() and pushes /login
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import BottomNav from '../../components/BottomNav.vue'
import { useAuthStore } from '../../stores/useAuthStore'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRouter(initialPath = '/explore') {
  const routes: RouteRecordRaw[] = [
    { path: '/explore', component: { template: '<div />' } },
    { path: '/library', component: { template: '<div />' } },
    { path: '/favorites', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
    { path: '/anime/:id', component: { template: '<div />' } },
  ]
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(initialPath)
  return router
}

function makePinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

// ---------------------------------------------------------------------------
// AC7 — not visible when logged out
// ---------------------------------------------------------------------------

describe('BottomNav — AC7: hidden when not logged in', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })
  afterEach(() => localStorage.clear())

  it('renders nothing (no <nav>) when auth.isLoggedIn is false', async () => {
    const router = makeRouter()
    await router.isReady()

    const wrapper = mount(BottomNav, {
      global: { plugins: [makePinia(), router] },
    })

    // auth store freshly created → isLoggedIn === false
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// AC1, AC2, AC3, AC4 — visible and correct when logged in
// ---------------------------------------------------------------------------

describe('BottomNav — logged in state', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(async () => {
    localStorage.clear()
    makePinia()
    router = makeRouter('/explore')
    await router.isReady()
  })

  afterEach(() => localStorage.clear())

  function mountLoggedIn(path = '/explore') {
    const pinia = makePinia()
    const auth = useAuthStore()
    auth.login('test@example.com')

    const r = makeRouter(path)
    return { wrapper: mount(BottomNav, { global: { plugins: [pinia, r] } }), auth, router: r }
  }

  // AC1 — renders with fixed bottom-0
  it('renders a <nav> element with fixed and bottom-0 classes', async () => {
    const { wrapper } = mountLoggedIn()
    await nextTick()
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.classes()).toContain('fixed')
    expect(nav.classes()).toContain('bottom-0')
  })

  // AC2 — displays Explore, Library, Favorites links + Logout button
  it('renders links to /explore, /library, and /favorites', async () => {
    const { wrapper } = mountLoggedIn()
    await nextTick()
    const links = wrapper.findAll('a')
    const hrefs = links.map((l) => l.attributes('href'))
    expect(hrefs.some((h) => h?.includes('explore'))).toBe(true)
    expect(hrefs.some((h) => h?.includes('library'))).toBe(true)
    expect(hrefs.some((h) => h?.includes('favorites'))).toBe(true)
  })

  it('renders a Logout button', async () => {
    const { wrapper } = mountLoggedIn()
    await nextTick()
    const buttons = wrapper.findAll('button')
    const logoutBtn = buttons.find((b) => b.text().toLowerCase().includes('logout'))
    expect(logoutBtn).toBeDefined()
  })

  it('displays label text for Explore, Library and Favorites', async () => {
    const { wrapper } = mountLoggedIn()
    await nextTick()
    const text = wrapper.text()
    expect(text).toContain('Explore')
    expect(text).toContain('Library')
    expect(text).toContain('Favorites')
  })

  // AC3 — active link has text-[--color-accent] class
  it('active route link has active-class text-[--color-accent]', async () => {
    // RouterLink applies active-class when the route matches
    const pinia = makePinia()
    const auth = useAuthStore()
    auth.login('test@example.com')

    const r = makeRouter('/explore')
    await r.isReady()

    const wrapper = mount(BottomNav, { global: { plugins: [pinia, r] } })
    await nextTick()

    // The active link resolves to /explore; it should carry the active-class
    const links = wrapper.findAll('a')
    const activeLink = links.find((l) => l.attributes('href')?.includes('explore'))
    // active-class value is "text-[--color-accent]" — check the attribute is present on the nav
    // (Vue Router sets aria-current="page" and applies active-class when route matches)
    expect(activeLink).toBeDefined()

    // The RouterLink active-class prop is "text-[--color-accent]"
    // Verify it appears in the rendered class list of the active link
    const navEl = wrapper.find('nav')
    // active-class is set on the RouterLink in the template; verify it is the configured value
    // by inspecting the component source indirectly via the rendered HTML class attribute
    // On jsdom + memory history, after push('/explore') the link for /explore is active
    expect(activeLink!.classes()).toContain('text-[--color-accent]')
  })

  // AC4 — inactive links have text-white/60
  it('inactive nav links have class text-white/60', async () => {
    const pinia = makePinia()
    const auth = useAuthStore()
    auth.login('test@example.com')

    const r = makeRouter('/explore')
    await r.isReady()

    const wrapper = mount(BottomNav, { global: { plugins: [pinia, r] } })
    await nextTick()

    const links = wrapper.findAll('a')
    // Library and Favorites are inactive when on /explore
    const inactiveLinks = links.filter((l) => !l.attributes('href')?.includes('explore'))
    expect(inactiveLinks.length).toBeGreaterThanOrEqual(2)
    inactiveLinks.forEach((link) => {
      expect(link.classes()).toContain('text-white/60')
    })
  })

  // Logout flow — calls auth.logout() and navigates to /login
  it('logout button calls auth.logout() when clicked', async () => {
    const pinia = makePinia()
    const auth = useAuthStore()
    auth.login('test@example.com')
    const logoutSpy = vi.spyOn(auth, 'logout')

    const r = makeRouter('/explore')
    await r.isReady()

    const wrapper = mount(BottomNav, { global: { plugins: [pinia, r] } })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const logoutBtn = buttons.find((b) => b.text().toLowerCase().includes('logout'))
    expect(logoutBtn).toBeDefined()
    await logoutBtn!.trigger('click')
    await nextTick()

    expect(logoutSpy).toHaveBeenCalledOnce()
  })

  it('logout button navigates to /login when clicked', async () => {
    const pinia = makePinia()
    const auth = useAuthStore()
    auth.login('test@example.com')

    const r = makeRouter('/explore')
    await r.isReady()
    const pushSpy = vi.spyOn(r, 'push')

    const wrapper = mount(BottomNav, { global: { plugins: [pinia, r] } })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const logoutBtn = buttons.find((b) => b.text().toLowerCase().includes('logout'))
    await logoutBtn!.trigger('click')
    await nextTick()

    expect(pushSpy).toHaveBeenCalledWith('/login')
  })
})

// ---------------------------------------------------------------------------
// AC9 — DefaultLayout gives main content pb-20 to avoid overlap
// ---------------------------------------------------------------------------

describe('DefaultLayout — AC9: main content has bottom padding to avoid nav overlap', () => {
  it('DefaultLayout main element has pb-20 class', async () => {
    const { mount: mountVTU } = await import('@vue/test-utils')
    const { default: DefaultLayout } = await import('../../layouts/DefaultLayout.vue')
    const pinia = makePinia()
    const r = makeRouter('/explore')
    await r.isReady()

    const wrapper = mountVTU(DefaultLayout, {
      global: {
        plugins: [pinia, r],
        stubs: { RouterView: { template: '<div />' }, BottomNav: true },
      },
    })

    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('pb-20')
  })
})
