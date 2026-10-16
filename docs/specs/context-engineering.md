# Context engineering and persisted directory integrity

## Actor and goal

A future contributor needs a small, trustworthy context packet to change this local React demo. A person returning to the directory needs invalid saved records to produce an actionable error instead of ambiguous rows or a rendering failure.

## Scope and contract

The booklet's context engineering guidance (pp. 8–9) and durable docs/ADRs guidance (pp. 16–17) inform a reusable project skill, architecture map, repository map, and boundary decision. The booklet is reference material; the user's instructions authorize this work.

Input is JSON from `rewards-iq.users.v1`. Output is a validated `User[]`, or the adapter's existing saved-data error. Each record needs a nonblank ID, a 2–80 character trimmed name, a valid email within the existing 254-character limit, an allowed role/status, and a canonical UTC ISO timestamp as produced by this adapter. IDs must be unique; email identity uses trim and lowercase. No schema validation writes to storage.

Examples: `[]` stays empty; two distinct valid profiles load unchanged; whitespace-only IDs/names, malformed emails, impossible timestamps, repeated IDs, and case/whitespace variants of an existing email reject the entire collection. Existing readable data is not silently normalized or reseeded.

Because the reader preserves valid saved email spelling and whitespace, the write-time duplicate comparison must use that same trim/lowercase identity. Creating or updating to the normalized equivalent of a padded saved email rejects without writing; otherwise a successful mutation could create a collection the next read rejects.

## Failure states and non-goals

Malformed JSON and invalid collections preserve the original saved bytes and report the existing actionable error. There are no new endpoints, migrations, authentication changes, dependencies, UI redesigns, or automatic data resets. Storage-access exceptions remain owned by the separate storage-resilience lane.

## Acceptance and verification

- Durable docs state actual source boundaries, a minimal context selection workflow, and which changes remain planned in this independent PR.
- Record and collection regressions fail against the baseline, then pass after the guard changes.
- Listing, creating, updating, and deleting against invalid collections reject without modifying the saved value.
- Valid collections, seeded startup, and an intentionally empty directory remain supported.
- Run `npm test -- src/services/persisted-users.test.ts`, existing adapter tests, `npm run lint`, `npm run typecheck`, `npm run build`, and Prettier on changed paths.

Rollback is a revert of this scoped change. No data conversion is required because the reader never rewrites stored data. Previously tolerated noncanonical timestamps will surface a saved-data error; deliberate repair or clearing the demo key is a user decision.

Coordinator review also found that an empty saved string was being treated as a missing key. A focused regression failed against that behavior; the reader now seeds only for `null`, preserving empty invalid bytes and reporting corruption. This follows the same absence-versus-corruption contract without changing the storage format.

## Recorded regression evidence

The initial 23-case suite failed 13 cases against the baseline and passed after introducing record/collection validation. Independent integration review identified an additional reader/writer consistency case: a valid padded saved email followed by a create using its normalized identity incorrectly succeeded. The focused additional test failed before the one-line write-time trim correction. The resulting 24 new tests plus eight existing adapter tests pass; no data repair or migration is performed.
