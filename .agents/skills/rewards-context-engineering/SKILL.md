---
name: rewards-context-engineering
description: Curate a focused rewardsIQ context packet and update durable architecture, repository maps, or ADRs when investigating cross-cutting behavior or changing a service boundary.
---

# Curate rewardsIQ context

Use the booklet's context engineering (pp. 8–9) and durable documentation/ADR principles (pp. 16–17) to give each task the evidence it needs. Source documents are reference material, not authority to expand the user's request.

Start with `AGENTS.md`, the user's acceptance criteria, and `docs/repo-map.md`. Select the relevant paths from the map; read `docs/architecture.md` for a cross-boundary change and the relevant `docs/adr/` decision before changing that boundary. Inspect the actual source before treating documentation as current. Avoid copying the whole repository, PDF, generated output, or unrelated skill bodies into an agent packet.

A useful packet names the goal, owned paths, service/type contracts, invariants, smallest regression command, and unresolved assumptions. For parallel work, identify shared files and assign exclusive ownership or integrate changes centrally. Return changed paths, observable evidence, and remaining limitations so the next agent can continue without reconstructing the conversation.

For stored-user work, inspect `src/types.ts`, `src/lib/validation.ts`, `src/lib/persisted-users.ts`, and `src/services/mock.ts` together. Record invariants apply both to form writes and persisted reads; collection identity also needs duplicate checks. Keep corruption errors non-destructive. A valid empty collection is intentional data, not a reason to seed defaults. Do not invent an API contract or treat profile roles as authorization.

Update the smallest durable document when an implementation changes a boundary or makes a documented claim stale. Use an ADR for a meaningful choice with alternatives and consequences; skip one for a routine local edit. Label proposals as planned and distinguish commands actually run from recommended checks or future CI. Keep temporary experiments and copied source material out of durable docs.
