import {
  roles,
  statuses,
  type AuthService,
  type Session,
  type User,
  type UserInput,
  type UserService,
} from '../types'
import { validateUser } from '../lib/validation'
export const USERS_KEY = 'rewards-iq.users.v1'
export const SESSION_KEY = 'rewards-iq.session.v1'
export const demoCredentials = {
  email: 'admin@rewardsiq.com',
  password: 'Demo123!',
}
const seed: User[] = [
  ['Olivia Rhye', 'olivia@rewardsiq.com', 'Admin', 'Active'],
  ['Phoenix Baker', 'phoenix@rewardsiq.com', 'Manager', 'Active'],
  ['Lana Steiner', 'lana@rewardsiq.com', 'Member', 'Active'],
  ['Demi Wilkinson', 'demi@rewardsiq.com', 'Member', 'Invited'],
  ['Drew Cano', 'drew@rewardsiq.com', 'Manager', 'Active'],
  ['Natali Craig', 'natali@rewardsiq.com', 'Member', 'Inactive'],
  ['Orlando Diggs', 'orlando@rewardsiq.com', 'Member', 'Active'],
  ['Andi Lane', 'andi@rewardsiq.com', 'Member', 'Invited'],
  ['Kate Morrison', 'kate@rewardsiq.com', 'Admin', 'Active'],
  ['Arjun Mehta', 'arjun@rewardsiq.com', 'Member', 'Active'],
  ['Sofia Chen', 'sofia@rewardsiq.com', 'Manager', 'Active'],
  ['James Wilson', 'james@rewardsiq.com', 'Member', 'Inactive'],
].map(([name, email, role, status], index) => ({
  id: `user-${index + 1}`,
  name,
  email,
  role: role as User['role'],
  status: status as User['status'],
  createdAt: new Date(Date.UTC(2026, 8, 3 + index)).toISOString(),
}))
function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false
  const user = value as User
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    roles.includes(user.role) &&
    statuses.includes(user.status) &&
    typeof user.createdAt === 'string' &&
    !Number.isNaN(Date.parse(user.createdAt))
  )
}
function readUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) return structuredClone(seed)
  try {
    const parsed: unknown = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.every(isUser)) return parsed
  } catch {
    /* Preserve corrupt data and report an actionable error. */
  }
  throw new Error(
    'Saved user data could not be read. Clear this app’s site data to restore the demo.',
  )
}
function saveUsers(users: User[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    throw new Error(
      'Changes could not be saved. Check that browser storage is available and try again.',
    )
  }
}
function normalize(
  input: UserInput,
  users: User[],
  excludingId?: string,
): UserInput {
  const clean = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
  }
  const errors = validateUser(clean)
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
  if (
    users.some(
      (user) =>
        user.id !== excludingId && user.email.toLowerCase() === clean.email,
    )
  )
    throw new Error('A user with this email address already exists.')
  return clean
}
export const mockUserService: UserService = {
  async list() {
    return readUsers()
  },
  async create(input) {
    const users = readUsers()
    const user = {
      ...normalize(input, users),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    saveUsers([user, ...users])
    return user
  },
  async update(id, input) {
    const users = readUsers()
    const existing = users.find((user) => user.id === id)
    if (!existing)
      throw new Error(
        'This user no longer exists. Refresh the list and try again.',
      )
    const user = { ...existing, ...normalize(input, users, id) }
    saveUsers(users.map((item) => (item.id === id ? user : item)))
    return user
  },
  async remove(id) {
    const users = readUsers()
    if (!users.some((user) => user.id === id))
      throw new Error(
        'This user no longer exists. Refresh the list and try again.',
      )
    saveUsers(users.filter((user) => user.id !== id))
  },
}
function readSession(storage: Storage): Session | null {
  try {
    const value = JSON.parse(
      storage.getItem(SESSION_KEY) ?? 'null',
    ) as Session | null
    return value &&
      typeof value.name === 'string' &&
      typeof value.email === 'string'
      ? value
      : null
  } catch {
    return null
  }
}
export const mockAuthService: AuthService = {
  async login(email, password, remember) {
    if (
      email.trim().toLowerCase() !== demoCredentials.email ||
      password !== demoCredentials.password
    )
      throw new Error(
        'Incorrect demo credentials. Use the demo account below to sign in.',
      )
    const session = { name: 'Alex Morgan', email: demoCredentials.email }
    try {
      localStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(SESSION_KEY)
      ;(remember ? localStorage : sessionStorage).setItem(
        SESSION_KEY,
        JSON.stringify(session),
      )
    } catch {
      throw new Error(
        'Sign-in requires browser storage. Enable it and try again.',
      )
    }
    return session
  },
  getSession() {
    return readSession(sessionStorage) ?? readSession(localStorage)
  },
  async logout() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  },
}
