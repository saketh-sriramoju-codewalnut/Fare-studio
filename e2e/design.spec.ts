import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function checkReadableLayout(page: Page) {
  const tinyText = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    )
    const issues: string[] = []
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent?.trim()
      const element = walker.currentNode.parentElement
      if (
        !text ||
        !element ||
        !element.getClientRects().length ||
        ['SCRIPT', 'STYLE'].includes(element.tagName)
      )
        continue
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden' || style.display === 'none') continue
      if (parseFloat(style.fontSize) < 12)
        issues.push(`${text.slice(0, 60)}: ${style.fontSize}`)
    }
    return issues
  })
  expect(tinyText).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  for (const input of await page
    .locator('input:not([type="checkbox"])')
    .all()) {
    if (await input.isVisible())
      expect(
        await input.evaluate((element) =>
          parseFloat(getComputedStyle(element).fontSize),
        ),
      ).toBeGreaterThanOrEqual(16)
  }
}

test('type scale, contrast, responsive layout, and modal keyboard access', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/login')
  await expect(
    page.getByRole('heading', { name: 'Welcome back.' }),
  ).toBeVisible()
  await checkReadableLayout(page)
  const loginAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(loginAudit.violations).toEqual([])
  await page.getByRole('button', { name: /Use demo credentials/ }).click()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'View Olivia Rhye' }),
  ).toBeVisible()
  const directoryAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(directoryAudit.violations).toEqual([])
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await checkReadableLayout(page)
  }
  await page.getByRole('button', { name: 'Add user', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByLabel('Full name')).toBeFocused()
  await checkReadableLayout(page)
  const dialogAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(dialogAudit.violations).toEqual([])
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Add user', exact: true }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await checkReadableLayout(page)
})
