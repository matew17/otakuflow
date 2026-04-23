import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('redirects to login when unauthenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/)
  })

  test('displays the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()
  })

  test('displays email and password fields', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('displays a disabled submit button when fields are empty', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Sign in' })
    await expect(button).toBeVisible()
    await expect(button).toBeDisabled()
  })
})
