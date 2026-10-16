import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  demoCredentials,
  mockAuthService as auth,
  mockUserService as users,
  SESSION_KEY,
  USERS_KEY,
} from './mock'
import type { UserInput } from '../types'
const input: UserInput = {
  name: ' Jamie Taylor ',
  email: ' Jamie@Example.com ',
  role: 'Member',
  status: 'Active',
}
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
describe('user storage adapter', () => {
  it('creates, persists, edits and removes a user without mutating its identity or join date', async () => {
    const initial = await users.list()
    const created = await users.create(input)
    expect(created.name).toBe('Jamie Taylor')
    expect(created.email).toBe('jamie@example.com')
    expect(await users.list()).toHaveLength(initial.length + 1)
    const edited = await users.update(created.id, {
      ...input,
      name: 'Jamie Updated',
      status: 'Inactive',
    })
    expect(edited.id).toBe(created.id)
    expect(edited.createdAt).toBe(created.createdAt)
    expect(
      (await users.list()).find((user) => user.id === created.id)?.name,
    ).toBe('Jamie Updated')
    await users.remove(created.id)
    expect(await users.list()).toHaveLength(initial.length)
  })
  it('rejects duplicate emails without changing saved data', async () => {
    await users.create(input)
    await expect(
      users.create({ ...input, email: 'JAMIE@example.com' }),
    ).rejects.toThrow('already exists')
    const existing = (await users.list())[1]
    await expect(users.update(existing.id, input)).rejects.toThrow(
      'already exists',
    )
  })
  it('rejects invalid input and updates to missing users', async () => {
    await expect(users.create({ ...input, name: ' ' })).rejects.toThrow(
      'at least 2',
    )
    await expect(users.create({ ...input, email: 'invalid' })).rejects.toThrow(
      'valid email',
    )
    await expect(users.update('missing', input)).rejects.toThrow(
      'no longer exists',
    )
    await expect(users.remove('missing')).rejects.toThrow('no longer exists')
  })
  it('keeps an empty list empty and surfaces corrupt data without replacing it', async () => {
    localStorage.setItem(USERS_KEY, '[]')
    expect(await users.list()).toEqual([])
    localStorage.setItem(USERS_KEY, 'broken')
    await expect(users.list()).rejects.toThrow('could not be read')
    expect(localStorage.getItem(USERS_KEY)).toBe('broken')
  })
  it('surfaces storage failures instead of reporting a successful save', async () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Quota')
      })
    try {
      await expect(users.create(input)).rejects.toThrow('could not be saved')
    } finally {
      spy.mockRestore()
    }
  })
})
describe('demo authentication', () => {
  it('rejects invalid credentials', async () => {
    await expect(
      auth.login(demoCredentials.email, 'wrongpass', false),
    ).rejects.toThrow('Incorrect')
    expect(auth.getSession()).toBeNull()
  })
  it('uses session storage by default and never stores passwords', async () => {
    await auth.login(demoCredentials.email, demoCredentials.password, false)
    expect(auth.getSession()?.email).toBe(demoCredentials.email)
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    expect(sessionStorage.getItem(SESSION_KEY)).not.toContain(
      demoCredentials.password,
    )
    await auth.logout()
    expect(auth.getSession()).toBeNull()
  })
  it('persists remembered sessions and clears both stores on sign out', async () => {
    await auth.login(demoCredentials.email, demoCredentials.password, true)
    expect(localStorage.getItem(SESSION_KEY)).not.toBeNull()
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull()
    await auth.logout()
    expect(auth.getSession()).toBeNull()
  })
})
