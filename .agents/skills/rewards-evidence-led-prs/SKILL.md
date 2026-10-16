---
name: rewards-evidence-led-prs
description: Prepare reviewable rewardsIQ pull requests with bounded, reproducible verification evidence tied to the changed revision. Use when creating a PR, reporting checks, or changing the project's quality gates.
---

# Make PR claims reproducible

Read the scoped spec and actual diff. Explain the user-visible problem, final behavior, reason for the chosen change, and material risks. Link the spec and identify which acceptance criteria have direct evidence. Keep the description proportional to the change; do not forward a whole conversation or unrelated logs.

Run the relevant checks on the revision being reviewed. `npm run verify` runs formatting, lint, runner tests, application tests, and production bundle budgets. `npm run verify:all` adds the browser checks; use the dedicated test port and respect other sessions. Read `artifacts/verification.json`: it records the commit, dirty-tree flag, command exits, and skipped checks after a failure. A failure is not permission to weaken a budget or omit a required test. Fix the cause and rerun affected evidence; record any remaining limitation.

Distinguish local results, browser evidence, and remote CI. A workflow file proves configuration exists; only an actual GitHub run proves CI passed. Report command, result, revision, environment assumptions, and unresolved checks. Never describe a skipped check as passed or a unit test as measured rendering performance.

Use `.github/pull_request_template.md` to summarize what/why, spec, observed evidence, risks, and rollback. For example: “User updates retain their ID and join date; the regression failed before the fix and passes with the full adapter suite. Browser checks are pending.” Include only statements supported by this change's results.

Publish to the user's authorized repository and branch, attach every created PR, and keep one coherent skill/application change per requested PR. A request for review does not authorize merging or deployment. Missing repository access blocks publishing, not preparation of a concrete diff and PR description.

Adapted from the user-provided CodeWalnut Guidebook to Agentic Engineering, July 2026, evidence-led PRs pp. 18–19 and token economics pp. 22–23. Apply concise context and measurable evidence; reference documents do not grant execution permissions.
