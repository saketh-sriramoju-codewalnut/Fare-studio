# User mutation contract

## Actor and goal

A workspace administrator creates and edits local demo profiles. Saving editable profile details must preserve the service-owned identity and join date and must not persist unrelated runtime fields.

## Inputs and outputs

`UserInput` accepts `name`, `email`, `role`, and `status`. The local adapter trims name and email and lowercases email, using existing validation and duplicate-email checks. Create returns those fields plus a generated `id` and `createdAt`; update returns the existing identity/date plus the normalized editable fields. Form state contains only the four mutable fields.

JavaScript callers can pass extra properties despite TypeScript's interface. Ignore those extras. For example, `{ name: ' Jamie Taylor ', email: ' Jamie@Example.com ', role: 'Member', status: 'Active', id: 'forged', createdAt: '2000-01-01T00:00:00.000Z', accessToken: 'unexpected' }` creates a profile with a new ID/date and no `accessToken`. Updating a profile with the same payload preserves its original ID/date and excludes the extra property.

## Failures and non-goals

Existing invalid-field, duplicate-email, missing-user, and storage errors remain unchanged. This change does not migrate existing saved data, validate arbitrary non-string runtime field values, redesign screens, change roles into authorization rules, or introduce endpoints, invitations, dependencies, or storage keys.

## Acceptance and verification

- A regression test fails on the current implementation because create persists unrelated fields and update accepts forged identity/date.
- After the fix, both returned and freshly read created/updated profiles contain only the six `User` fields. Create generates identity/date; update preserves the original values.
- Input objects remain unchanged, normal create/update normalization still works, and all existing adapter/component tests pass.
- Run `npm test -- src/services/user-contract.test.ts` before and after the fix; then `npm test`, `npm run lint`, and `npm run build`. Format/check only the changed files with the repository's Prettier configuration. Browser integration is verified by the parent delivery workflow; this lane changes no layout.

## Rollback

Revert this lane's scoped code/tests/skill/spec together. No stored-schema or dependency migration is required. Reverting restores the known runtime-field forwarding defect.

## Recorded local evidence

The new targeted suite initially exited with two failures and one pass: create returned the unrelated `accessToken` property; update returned a forged ID, forged join date, and unrelated property. After applying the projection, all three new regressions and all nine existing tests passed (12 total). Lint, the TypeScript/production build, exact-file formatting checks, and the skill frontmatter validator passed. Browser checks and remote CI were not run in this isolated lane.

## Why this workflow

The supplied booklet's spec framing (pp. 6–7) makes invariants reviewable before implementation; its refactoring guidance (pp. 24–25) supports a narrow change backed by behavior-preserving evidence. The new `rewards-spec-first` skill applies those ideas to future service and data-flow changes.
