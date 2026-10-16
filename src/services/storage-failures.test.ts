import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  mockAuthService as auth,
  mockUserService as users,
  demoCredentials,
  SESSION_KEY,
} from './mock'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
afterEach(() => {
  vi.restoreAllMocks()
})
const denied = () => {
  throw new DOMException('Access is denied', 'SecurityError')
}

describe('storage failure behavior', () => {
  it('boots signed out when both storage property getters are denied', () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(denied)
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(denied)
    expect(auth.getSession()).toBeNull()
  })
  it('uses a valid remembered session if session storage access is denied', () => {
    const remembered = { name: 'Alex Morgan', email: demoCredentials.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(remembered))
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(denied)
    expect(auth.getSession()).toEqual(remembered)
  })
  it('treats a failed session read as signed out', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied)
    expect(auth.getSession()).toBeNull()
  })
  it('reports denied user-storage getter access with an actionable error', async () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(denied)
    await expect(users.list()).rejects.toThrow('Browser storage is unavailable')
  })
  it('reports denied user-storage method access with an actionable error', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied)
    await expect(users.list()).rejects.toThrow('Browser storage is unavailable')
  })
  it.each([false, true])(
    'does not silently change remember=%s when the requested store is denied',
    async (remember) => {
      const other = remember ? sessionStorage : localStorage
      vi.spyOn(
        window,
        remember ? 'localStorage' : 'sessionStorage',
        'get',
      ).mockImplementation(denied)
      await expect(
        auth.login(demoCredentials.email, demoCredentials.password, remember),
      ).rejects.toThrow('Enable it and try again')
      expect(other.getItem(SESSION_KEY)).toBeNull()
    },
  )
  it('still clears remembered state when clearing the session store fails', async () => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ name: 'Alex', email: demoCredentials.email }),
    )
    const remove = Storage.prototype.removeItem
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (
      this: Storage,
      key: string,
    ) {
      if (this === localStorage) return remove.call(this, key)
      throw new DOMException('Access is denied', 'SecurityError')
    })
    await expect(auth.logout()).rejects.toThrow('could not be cleared')
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
  })
  it('still clears session state when the local-storage getter fails', async () => {
    const sessionStore = sessionStorage
    sessionStore.setItem(
      SESSION_KEY,
      JSON.stringify({ name: 'Alex', email: demoCredentials.email }),
    )
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(denied)
    await expect(auth.logout()).rejects.toThrow('could not be cleared')
    expect(sessionStore.getItem(SESSION_KEY)).toBeNull()
  })
})
