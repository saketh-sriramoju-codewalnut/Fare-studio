# rewardsIQ architecture

This is a browser-only React/TypeScript starter with simulated authentication and a local user directory. Inspect source alongside this document when making a change. Dependency versions and scripts are authoritative in `package.json` and `package-lock.json`.

## Runtime flow

`src/main.tsx` mounts the app in StrictMode and loads local font subsets plus shared CSS. `src/App.tsx` places routes inside `BrowserRouter`, `AuthProvider`, and `Suspense`. Login is eager; `UsersPage` is a lazy import. `/users` redirects to `/login` without a demo session.

`AuthProvider` holds the session and delegates login/logout to `authService`. `src/services/index.ts` is the adapter selection point. Today both services use `src/services/mock.ts`; there are no fetch calls, tokens, external APIs, invitations, or real permission checks. A role/status describes a directory profile; it grants no authorization. The demo administrator is separate from directory records.

`UsersPage` loads profiles through `UserService`, guards stale effect completions, and holds view state for search, filters, sorting, pagination, and dialogs. Filtering/sorting and CSV export operate over the complete loaded collection; export includes all matches, not just the current page. `UserForm` performs client feedback and calls create/update. The service repeats validation at its write boundary.

## Persistence and invariants

`rewards-iq.users.v1` in localStorage contains the directory. Absence starts with cloned sample profiles; a saved `[]` is intentional. `src/lib/persisted-users.ts` validates record fields plus collection identity before data enters the UI or a mutation. IDs are nonblank and unique. Names and emails follow `validateUser`; email uniqueness compares trim/lowercase. Role/status values come from `src/types.ts`. `createdAt` is canonical UTC ISO output from `Date.toISOString()`, which also prevents accepting normalized impossible dates. Invalid JSON or collections report the existing saved-data error and are never silently reseeded or rewritten.

The reader preserves valid saved strings as stored. It does not repair or migrate records. Values previously tolerated by a permissive reader, such as noncanonical timestamp strings, now require deliberate repair or clearing the demo key. UI retry reads again; it does not reset data.

`rewards-iq.session.v1` stores a name/email demo session in sessionStorage by default, or localStorage when remembered. No password is persisted. Read/write/logout failure behavior is covered by adapter tests; storage hardening is a separate proposed delivery lane, not a guarantee introduced by this change.

## Boundaries and future work

Domain/service contracts live in `src/types.ts`; presentation should depend on `services/index.ts` rather than mock details. See [ADR 0001](adr/0001-local-service-boundaries.md) before replacing adapters. A real auth integration needs asynchronous bootstrap, expiry/session validation, and server authorization. Large server datasets need a paginated/query-aware contract; client pagination is appropriate for this small local demo.

Shared readable type, colors, radii, and motion live in `src/index.css`. Preserve those tokens and the user's larger-font requirement. Use the UI skills for visual edits and performance skill for loading/assets. Unit/component checks verify behavior; Playwright verifies the real workflow and readability/accessibility. Bundle budgets prevent growth regressions but do not establish Core Web Vitals.
