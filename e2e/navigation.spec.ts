/**
 * E2E tests for BottomNav & PageTitle — PRD 0008
 *
 * Criterion → test mapping:
 *   AC7  — nav not visible on /login; visible on /explore after login
 *   AC2  — nav shows Explore, Library, Favorites + Logout
 *   AC18 — no console errors on page load and navigation
 *   AC19 — navigation works on mobile viewport (< 768px)
 *   AC20 — navigation works on desktop viewport (> 1024px)
 *   AC12/AC13/AC14/AC15 — page title visible and centred in each view
 *   Route navigation — Library and Favorites reachable from bottom nav
 */
import { test, expect, type Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helper: log into the app
// ---------------------------------------------------------------------------
async function login(page: Page) {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('anypassword')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/explore/)
}

// ---------------------------------------------------------------------------
// AC7 — nav visibility
// ---------------------------------------------------------------------------

test.describe('BottomNav — AC7: visibility based on auth state', () => {
  test('bottom nav is NOT visible on /login (unauthenticated)', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
    // The nav element is only rendered when isLoggedIn === true
    await expect(page.locator('nav')).not.toBeVisible()
  })

  test('bottom nav IS visible on /explore after login', async ({ page }) => {
    await login(page)
    await expect(page.locator('nav')).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// AC2 — nav items present
// ---------------------------------------------------------------------------

test.describe('BottomNav — AC2: nav items', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('shows Explore nav link', async ({ page }) => {
    await expect(page.locator('nav').getByText('Explore')).toBeVisible()
  })

  test('shows Library nav link', async ({ page }) => {
    await expect(page.locator('nav').getByText('Library')).toBeVisible()
  })

  test('shows Favorites nav link', async ({ page }) => {
    await expect(page.locator('nav').getByText('Favorites')).toBeVisible()
  })

  test('shows Logout button', async ({ page }) => {
    await expect(page.locator('nav').getByText('Logout')).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Route navigation via bottom nav
// ---------------------------------------------------------------------------

test.describe('BottomNav — route navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('clicking Library navigates to /library', async ({ page }) => {
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
  })

  test('clicking Favorites navigates to /favorites', async ({ page }) => {
    await page.locator('nav').getByText('Favorites').click()
    await expect(page).toHaveURL(/\/favorites/)
  })

  test('clicking Explore navigates to /explore', async ({ page }) => {
    // Navigate away first
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
    await page.locator('nav').getByText('Explore').click()
    await expect(page).toHaveURL(/\/explore/)
  })
})

// ---------------------------------------------------------------------------
// PageTitle visible and centred on each view (AC12, AC13, AC14, AC15 observable in E2E)
// ---------------------------------------------------------------------------

test.describe('PageTitle — title visible in each view', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Explore view shows a visible h1 with text "Explore"', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Explore' })).toBeVisible()
  })

  test('Library view shows a visible h1 with text "Library"', async ({ page }) => {
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
    await expect(page.getByRole('heading', { level: 1, name: 'Library' })).toBeVisible()
  })

  test('Favorites view shows a visible h1 with text "Favorites"', async ({ page }) => {
    await page.locator('nav').getByText('Favorites').click()
    await expect(page).toHaveURL(/\/favorites/)
    await expect(page.getByRole('heading', { level: 1, name: 'Favorites' })).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// AC18 — no console errors on page load and navigation
// ---------------------------------------------------------------------------

test.describe('AC18: no console errors during navigation', () => {
  test('no console errors on /explore after login', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await login(page)
    await expect(page).toHaveURL(/\/explore/)

    expect(errors).toHaveLength(0)
  })

  test('no console errors when navigating between views', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await login(page)
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
    await page.locator('nav').getByText('Favorites').click()
    await expect(page).toHaveURL(/\/favorites/)
    await page.locator('nav').getByText('Explore').click()
    await expect(page).toHaveURL(/\/explore/)

    expect(errors).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// AC19 — mobile viewport (< 768px)
// ---------------------------------------------------------------------------

test.describe('AC19: mobile viewport navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('bottom nav is visible on mobile viewport', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
  })

  test('can navigate to Library on mobile', async ({ page }) => {
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
  })

  test('can navigate to Favorites on mobile', async ({ page }) => {
    await page.locator('nav').getByText('Favorites').click()
    await expect(page).toHaveURL(/\/favorites/)
  })

  test('page title is visible on mobile', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Explore' })).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// AC20 — desktop viewport (> 1024px)
// ---------------------------------------------------------------------------

test.describe('AC20: desktop viewport navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('bottom nav is visible on desktop viewport', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
  })

  test('can navigate to Library on desktop', async ({ page }) => {
    await page.locator('nav').getByText('Library').click()
    await expect(page).toHaveURL(/\/library/)
  })

  test('can navigate to Favorites on desktop', async ({ page }) => {
    await page.locator('nav').getByText('Favorites').click()
    await expect(page).toHaveURL(/\/favorites/)
  })

  test('page title is visible on desktop', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Explore' })).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Logout flow via bottom nav
// ---------------------------------------------------------------------------

test.describe('BottomNav — logout via nav', () => {
  test('clicking Logout redirects to /login', async ({ page }) => {
    await login(page)
    await page.locator('nav').getByText('Logout').click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('bottom nav is not visible after logout', async ({ page }) => {
    await login(page)
    await page.locator('nav').getByText('Logout').click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('nav')).not.toBeVisible()
  })
})
