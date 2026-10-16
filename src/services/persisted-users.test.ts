import { beforeEach, describe, expect, it } from 'vitest'
import { mockUserService as users, USERS_KEY } from './mock'
import type { User, UserInput } from '../types'

const valid: User = {
  id: 'persisted-1',
  name: 'Jamie Taylor',
  email: 'jamie@example.com',
  role: 'Member',
  status: 'Active',
  createdAt: '2026-10-01T10:30:00.000Z',
}
const input: UserInput = {
  name: 'Robin Taylor',
  email: 'robin@example.com',
  role: 'Manager',
  status: 'Inactive',
}

beforeEach(() => localStorage.clear())

describe('persisted directory integrity', () => {
  it('treats empty saved bytes as corruption rather than an absent directory', async () => {
    localStorage.setItem(USERS_KEY, '')
    await expect(users.list()).rejects.toThrow(
      'Saved user data could not be read',
    )
    expect(localStorage.getItem(USERS_KEY)).toBe('')
  })
  it.each([
    ['blank ID', { id: '  ' }],
    ['missing ID', { id: null }],
    ['blank name', { name: '  ' }],
    ['short name', { name: 'J' }],
    ['long name', { name: 'J'.repeat(81) }],
    ['invalid email', { email: 'broken' }],
    ['blank email', { email: '  ' }],
    ['long email', { email: `${'j'.repeat(243)}@example.com` }],
    ['unknown role', { role: 'Owner' }],
    ['unknown status', { status: 'Disabled' }],
    ['invalid timestamp', { createdAt: 'tomorrow' }],
    ['calendar overflow', { createdAt: '2026-02-30T10:30:00.000Z' }],
    ['ambiguous timestamp', { createdAt: '1' }],
  ])('rejects %s and preserves the saved bytes', async (_label, override) => {
    const stored = JSON.stringify([{ ...valid, ...override }])
    localStorage.setItem(USERS_KEY, stored)
    await expect(users.list()).rejects.toThrow(
      'Saved user data could not be read',
    )
    expect(localStorage.getItem(USERS_KEY)).toBe(stored)
  })

  it.each([
    ['duplicate IDs', { email: 'robin@example.com' }],
    ['duplicate emails', { id: 'persisted-2' }],
    [
      'normalized duplicate emails',
      { id: 'persisted-2', email: '  JAMIE@EXAMPLE.COM  ' },
    ],
  ])('rejects %s without saving', async (_label, override) => {
    const stored = JSON.stringify([valid, { ...valid, ...override }])
    localStorage.setItem(USERS_KEY, stored)
    await expect(users.list()).rejects.toThrow(
      'Saved user data could not be read',
    )
    expect(localStorage.getItem(USERS_KEY)).toBe(stored)
  })

  it('blocks all mutations against an invalid collection without overwriting it', async () => {
    const stored = JSON.stringify([valid, { ...valid, id: 'persisted-2' }])
    localStorage.setItem(USERS_KEY, stored)
    await expect(users.create(input)).rejects.toThrow('could not be read')
    await expect(users.update(valid.id, input)).rejects.toThrow(
      'could not be read',
    )
    await expect(users.remove(valid.id)).rejects.toThrow('could not be read')
    expect(localStorage.getItem(USERS_KEY)).toBe(stored)
  })

  it('returns valid profiles unchanged rather than rewriting saved data', async () => {
    const collection = [
      valid,
      { ...valid, id: 'persisted-2', email: '  ROBIN@example.com  ' },
    ]
    const stored = JSON.stringify(collection)
    localStorage.setItem(USERS_KEY, stored)
    expect(await users.list()).toEqual(collection)
    expect(localStorage.getItem(USERS_KEY)).toBe(stored)
  })

  it('keeps a saved empty collection empty', async () => {
    localStorage.setItem(USERS_KEY, '[]')
    expect(await users.list()).toEqual([])
    expect(localStorage.getItem(USERS_KEY)).toBe('[]')
  })

  it('preserves normalized email identity when writing beside valid padded saved emails', async () => {
    const stored = JSON.stringify([
      { ...valid, email: '  JAMIE@example.com  ' },
      { ...valid, id: 'persisted-2', email: 'robin@example.com' },
    ])
    localStorage.setItem(USERS_KEY, stored)
    await expect(
      users.create({ ...input, email: 'jamie@example.com' }),
    ).rejects.toThrow('already exists')
    await expect(
      users.update('persisted-2', { ...input, email: 'jamie@example.com' }),
    ).rejects.toThrow('already exists')
    expect(localStorage.getItem(USERS_KEY)).toBe(stored)
    expect(await users.list()).toHaveLength(2)
  })

  it.each([{}, [null], [42], [[]]])(
    'rejects a non-user collection: %j',
    async (value) => {
      const stored = JSON.stringify(value)
      localStorage.setItem(USERS_KEY, stored)
      await expect(users.list()).rejects.toThrow('could not be read')
      expect(localStorage.getItem(USERS_KEY)).toBe(stored)
    },
  )
})
