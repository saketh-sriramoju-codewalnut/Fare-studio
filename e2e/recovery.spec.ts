import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('recovers from a failed lazy screen import with a real document reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  const moduleUrl = '**/src/pages/UsersPage.tsx*'
  await page.route(moduleUrl, (route) => route.abort('failed'))
  await page.goto('/login')
  await page.getByRole('button', { name: /Use demo credentials/ }).click()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  const heading = page.getByRole('heading', {
    name: 'This screen could not open',
  })
  await expect(heading).toBeVisible()
  await expect(heading).toBeFocused()
  await expect(page.getByText('Unsaved changes may be lost.')).toBeVisible()
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(audit.violations).toEqual([])
  await page.screenshot({
    path: 'artifacts/recovery-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 320, height: 844 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: 'artifacts/recovery-mobile.png',
    fullPage: true,
  })
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Try again', exact: true }),
  ).toBeFocused()
  await page.unroute(moduleUrl)
  await page.getByRole('button', { name: 'Reload page', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: /Your team, together/ }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'View Olivia Rhye' }),
  ).toBeVisible()
})
