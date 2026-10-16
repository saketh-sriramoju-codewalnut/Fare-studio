import { test, expect } from '@playwright/test'
test('login and CRUD persist across refresh with filters, export, and mobile layout', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/users')
  await expect(page).toHaveURL(/\/login$/)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  await page.getByRole('button', { name: /Use demo credentials/ }).click()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: /Your team, together/ }),
  ).toBeVisible()
  await page.screenshot({ path: 'artifacts/users-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByText('Page 2 of 2')).toBeVisible()
  await page.getByLabel('Filter by status').selectOption('Invited')
  await expect(
    page.getByRole('button', { name: 'View Demi Wilkinson' }),
  ).toBeVisible()
  await expect(page.getByText('Page 1 of 1')).toBeVisible()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.getByRole('button', { name: 'Add user', exact: true }).click()
  await page.getByLabel('Full name').fill('Jamie Taylor')
  await page.getByLabel('Email address').fill('jamie@example.com')
  await page.getByRole('button', { name: 'Create user' }).click()
  await expect(
    page.getByRole('button', { name: 'View Jamie Taylor' }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'View Jamie Taylor' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Edit Jamie Taylor' }).click()
  await page.getByLabel('Full name').fill('Jamie Updated')
  await page.getByLabel('Role', { exact: true }).selectOption('Manager')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.getByLabel('Search users').fill('jamie')
  await expect(
    page.getByRole('button', { name: 'View Jamie Updated' }),
  ).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('rewards-iq-users.csv')
  await page.getByRole('button', { name: 'View Jamie Updated' }).click()
  await expect(page.getByRole('dialog')).toContainText('jamie@example.com')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.getByRole('button', { name: 'Delete Jamie Updated' }).click()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'View Jamie Updated' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Delete Jamie Updated' }).click()
  await page.getByRole('button', { name: 'Delete user', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'No users match your search' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'artifacts/users-mobile.png', fullPage: true })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Add user', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.screenshot({ path: 'artifacts/create-mobile.png', fullPage: true })
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.screenshot({ path: 'artifacts/login-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: 'artifacts/login-desktop.png', fullPage: true })
  await page.goto('/users')
  await expect(page).toHaveURL(/\/login$/)
  expect(errors).toEqual([])
})
