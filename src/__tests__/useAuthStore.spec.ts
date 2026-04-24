import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createApp, nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from '../stores/useAuthStore'

function makePinia() {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  setActivePinia(pinia)
}

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    makePinia()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts as logged out when localStorage is empty', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('sets user and marks as logged in after login()', () => {
    const auth = useAuthStore()
    auth.login('test@example.com')
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user?.username).toBe('test@example.com')
  })

  it('persists user to localStorage on login()', async () => {
    const auth = useAuthStore()
    auth.login('test@example.com')
    await nextTick()
    const stored = localStorage.getItem('otakuflow:user')
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored!)).toMatchObject({ user: { username: 'test@example.com' } })
  })

  it('restores user from localStorage on fresh store init', () => {
    localStorage.setItem('otakuflow:user', JSON.stringify({ user: { username: 'test@example.com' } }))
    makePinia()
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user?.username).toBe('test@example.com')
  })

  it('clears user state and localStorage on logout()', async () => {
    const auth = useAuthStore()
    auth.login('test@example.com')
    auth.logout()
    await nextTick()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
    const stored = localStorage.getItem('otakuflow:user')
    expect(JSON.parse(stored!)).toMatchObject({ user: null })
  })
})
