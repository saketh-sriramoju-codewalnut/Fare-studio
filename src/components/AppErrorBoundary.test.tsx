import { lazy, Suspense } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppErrorBoundary } from './AppErrorBoundary'

beforeEach(() => {
  // React reports deliberately caught errors to the development console.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

it('leaves a healthy application visible', () => {
  render(
    <AppErrorBoundary>
      <h1>Your workspace</h1>
    </AppErrorBoundary>,
  )
  expect(
    screen.getByRole('heading', { name: 'Your workspace' }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

it('shows safe readable guidance, focuses the heading, and retries a transient failure', async () => {
  const user = userEvent.setup()
  let shouldFail = true
  function UnstablePage() {
    if (shouldFail) throw new Error('private-profile alice@example.com stack')
    return <h1>Your workspace</h1>
  }
  render(
    <AppErrorBoundary>
      <UnstablePage />
    </AppErrorBoundary>,
  )
  expect(
    screen.getByRole('heading', { name: 'This screen could not open' }),
  ).toHaveFocus()
  expect(screen.getByRole('alert')).toHaveTextContent('reload the page')
  expect(document.body).not.toHaveTextContent('private-profile')
  expect(document.body).not.toHaveTextContent('alice@example.com')
  shouldFail = false
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(
    screen.getByRole('heading', { name: 'Your workspace' }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

it('offers a full page reload when a rejected lazy import is cached after retry', async () => {
  const user = userEvent.setup()
  const reloadPage = vi.fn()
  const loadPage = vi.fn(() =>
    Promise.reject(new Error('private-chunk-location')),
  )
  const LazyPage = lazy(loadPage)
  render(
    <AppErrorBoundary reloadPage={reloadPage}>
      <Suspense fallback={<p role="status">Loading workspace</p>}>
        <LazyPage />
      </Suspense>
    </AppErrorBoundary>,
  )
  await screen.findByRole('heading', { name: 'This screen could not open' })
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(
    await screen.findByRole('heading', { name: 'This screen could not open' }),
  ).toHaveFocus()
  // React.lazy retains the rejected loader result; resetting alone cannot reload it.
  expect(loadPage).toHaveBeenCalledTimes(1)
  expect(document.body).not.toHaveTextContent('private-chunk-location')
  await user.tab()
  expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()
  await user.tab()
  expect(screen.getByRole('button', { name: 'Reload page' })).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(reloadPage).toHaveBeenCalledTimes(1)
})
