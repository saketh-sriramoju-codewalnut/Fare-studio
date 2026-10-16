import { roles, statuses, type User } from '../types'
import { validateUser } from './validation'

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const user = value as Record<string, unknown>
  if (
    typeof user.id !== 'string' ||
    !user.id.trim() ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string' ||
    !roles.includes(user.role as User['role']) ||
    !statuses.includes(user.status as User['status']) ||
    typeof user.createdAt !== 'string'
  )
    return false

  const timestamp = Date.parse(user.createdAt)
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString() === user.createdAt &&
    Object.keys(
      validateUser({
        name: user.name,
        email: user.email,
        role: user.role as User['role'],
        status: user.status as User['status'],
      }),
    ).length === 0
  )
}

/** Check both record shape and collection identity without changing saved data. */
export function isPersistedUserCollection(value: unknown): value is User[] {
  if (!Array.isArray(value)) return false
  const ids = new Set<string>()
  const emails = new Set<string>()
  for (const user of value) {
    if (!isUser(user)) return false
    const email = user.email.trim().toLowerCase()
    if (ids.has(user.id) || emails.has(email)) return false
    ids.add(user.id)
    emails.add(email)
  }
  return true
}
