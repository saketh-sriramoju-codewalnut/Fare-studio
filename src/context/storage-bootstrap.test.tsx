import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

beforeEach(() => {
  window.history.replaceState({}, '', '/users')
})
afterEach(() => {
  vi.restoreAllMocks()
})
it('opens login instead of crashing when browser storage getters are blocked', async () => {
  for (const key of ['sessionStorage', 'localStorage'] as const) {
    vi.spyOn(window, key, 'get').mockImplementation(() => {
      throw new DOMException('Access is denied', 'SecurityError')
    })
  }
  render(<App />)
  expect(
    await screen.findByRole('heading', { name: 'Welcome back.' }),
  ).toBeInTheDocument()
})
