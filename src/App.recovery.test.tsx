import { beforeEach, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('./context/auth', () => ({
  useAuth: () => ({ session: { name: 'Demo administrator' } }),
}))
vi.mock('./pages/UsersPage', () => ({
  UsersPage: () => {
    throw new Error('private-route-error token=do-not-display')
  },
}))

beforeEach(() => {
  window.history.replaceState({}, '', '/users')
})

it('contains a failing protected route within the actual application', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    render(<App />)
    expect(
      await screen.findByRole('heading', {
        name: 'This screen could not open',
      }),
    ).toHaveFocus()
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reload page' }),
    ).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('private-route-error')
    expect(document.body).not.toHaveTextContent('do-not-display')
  } finally {
    consoleError.mockRestore()
  }
})
