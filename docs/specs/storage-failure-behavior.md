# Storage failure behavior

## Actor and goal

A person using the local demo can open login even when browser storage is blocked, and receives a useful error when persistence cannot complete. This implements the behavioral-testing skill from booklet pp. 10-11.

## Contract

- Session bootstrap treats inaccessible or malformed stores as unavailable. It inspects sessionStorage first and can fall back to a valid remembered localStorage session.
- Denied global storage property access is guarded as well as failures inside storage methods.
- User-list reads report that browser storage is unavailable instead of leaking a DOM exception. A malformed stored value continues to use the existing corrupt-data error and is not overwritten.
- Login retains the explicit remember choice, never silently substitutes the other storage type, and reports the existing actionable sign-in storage error when required persistence cannot complete.
- Logout attempts to clear both session stores, even when one fails, and rejects with an actionable error if either cannot be cleared. The AuthProvider continues to surface failure rather than claim successful sign-out.
- Normal CRUD, session precedence, demo credentials, and storage keys remain unchanged.

## Examples and acceptance criteria

| Given                                                               | When            | Then                                                                |
| ------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| Both storage getters throw                                          | /users opens    | Login renders without an unhandled exception                        |
| sessionStorage getter throws; localStorage contains a valid session | getSession runs | The remembered session is returned                                  |
| localStorage getter/getItem throws                                  | list users runs | Promise rejects with a storage availability explanation             |
| Requested login store is denied                                     | login runs      | Promise rejects; no session is written to the other store           |
| First logout removal fails                                          | logout runs     | The second store is still attempted and the promise rejects clearly |

## Scope and tradeoffs

This is a simulated client session, not a security boundary. No endpoints, real tokens, storage migrations, cross-tab synchronization, or new permission model are added. Login keeps requiring its existing cleanup operations so it does not report success with a known stale opposite-store session. A failed logout may retain its in-memory session so the person can retry; a real backend integration needs server-side session revocation.

## Verification and rollback

Write failure-injection tests before the fix, observe the intended red assertions, then rerun `npm test -- src/services/storage-failures.test.ts src/context/storage-bootstrap.test.tsx src/services/mock.test.ts`. Run the full suite on integration. Revert this lane's commit to restore the previous adapter behavior; stored keys and payloads require no migration.

Observed evidence: the new suite failed 7 of 10 tests against the original adapter (including a real AuthProvider bootstrap crash); after the fix, all 18 focused new/existing adapter tests pass. Lint and production build pass. A separate agent reviewed the diff and independently reran the 18 focused tests without actionable findings. Full integrated browser results are recorded by the coordinator separately.
