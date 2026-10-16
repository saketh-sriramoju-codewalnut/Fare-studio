import { beforeEach, describe, expect, it } from 'vitest'
import { mockUserService as users, USERS_KEY } from './mock'
import type { UserInput } from '../types'

const input: UserInput = {
  name: ' Jamie Taylor ',
  email: ' Jamie@Example.com ',
  role: 'Member',
  status: 'Active',
}
const userFields = ['createdAt', 'email', 'id', 'name', 'role', 'status']

beforeEach(() => {
  localStorage.clear()
})

describe('user mutation field contract', () => {
  it('creates only allowed fields and generates identity despite runtime extras', async () => {
    const payload = {
      ...input,
      id: 'forged-id',
      createdAt: '2000-01-01T00:00:00.000Z',
      accessToken: 'unexpected',
    }
    const original = structuredClone(payload)
    const created = await users.create(payload)

    expect(Object.keys(created).sort()).toEqual(userFields)
    expect(created.id).not.toBe(payload.id)
    expect(created.createdAt).not.toBe(payload.createdAt)
    expect(Number.isNaN(Date.parse(created.createdAt))).toBe(false)
    expect(created.name).toBe('Jamie Taylor')
    expect(created.email).toBe('jamie@example.com')
    expect((await users.list()).find((user) => user.id === created.id)).toEqual(
      created,
    )
    expect(localStorage.getItem(USERS_KEY)).not.toContain('accessToken')
    expect(payload).toEqual(original)
  })

  it('updates only mutable fields while preserving persisted identity and join date', async () => {
    const existing = (await users.list())[0]
    const payload = {
      ...input,
      role: 'Manager' as const,
      status: 'Inactive' as const,
      id: 'forged-id',
      createdAt: '2000-01-01T00:00:00.000Z',
      accessToken: 'unexpected',
    }
    const original = structuredClone(payload)
    const updated = await users.update(existing.id, payload)

    expect(updated).toEqual({
      id: existing.id,
      createdAt: existing.createdAt,
      name: 'Jamie Taylor',
      email: 'jamie@example.com',
      role: 'Manager',
      status: 'Inactive',
    })
    const saved = await users.list()
    expect(saved.find((user) => user.id === existing.id)).toEqual(updated)
    expect(saved.some((user) => user.id === payload.id)).toBe(false)
    expect(localStorage.getItem(USERS_KEY)).not.toContain('accessToken')
    expect(payload).toEqual(original)
  })

  it('retains normal create and update normalization', async () => {
    const created = await users.create(input)
    const updated = await users.update(created.id, {
      ...input,
      name: ' Jamie Updated ',
      email: ' UPDATED@Example.com ',
    })

    expect(updated).toEqual({
      ...created,
      name: 'Jamie Updated',
      email: 'updated@example.com',
    })
    expect(Object.keys(updated).sort()).toEqual(userFields)
    expect((await users.list()).find((user) => user.id === created.id)).toEqual(
      updated,
    )
  })
})
