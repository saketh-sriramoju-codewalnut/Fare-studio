import { beforeEach, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  window.history.replaceState({}, '', '/users')
})
it('protects the directory and completes login, create, view, edit, delete and sign out', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(
    await screen.findByRole('heading', { name: 'Welcome back.' }),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /Use demo credentials/ }))
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
  await screen.findByRole('heading', { name: /Your team, together/ })
  await user.click(screen.getByRole('button', { name: 'Add user' }))
  await user.click(screen.getByRole('button', { name: 'Create user' }))
  expect(
    screen.getByText('Enter a name with at least 2 characters.'),
  ).toBeInTheDocument()
  await user.type(screen.getByLabelText(/Full name/), 'Jamie Taylor')
  await user.type(screen.getByLabelText(/Email address/), 'jamie@example.com')
  await user.click(screen.getByRole('button', { name: 'Create user' }))
  await screen.findByRole('button', { name: 'View Jamie Taylor' })
  await user.click(screen.getByRole('button', { name: 'View Jamie Taylor' }))
  expect(
    within(screen.getByRole('dialog')).getByText('jamie@example.com'),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Edit user' }))
  await user.clear(screen.getByLabelText(/Full name/))
  await user.type(screen.getByLabelText(/Full name/), 'Jamie Updated')
  await user.click(screen.getByRole('button', { name: 'Save changes' }))
  await user.click(
    await screen.findByRole('button', { name: 'Delete Jamie Updated' }),
  )
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(
    screen.getByRole('button', { name: 'View Jamie Updated' }),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Delete Jamie Updated' }))
  await user.click(screen.getByRole('button', { name: 'Delete user' }))
  expect(
    screen.queryByRole('button', { name: 'View Jamie Updated' }),
  ).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Sign out' }))
  expect(
    await screen.findByRole('heading', { name: 'Welcome back.' }),
  ).toBeInTheDocument()
}, 15000)
