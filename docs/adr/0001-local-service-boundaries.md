# ADR 0001: Keep endpoint-free services and validate persisted data

Status: accepted for this local starter.

## Context

The user requested login and user CRUD without providing endpoints. The UI already depends on typed async services. Browser storage can contain hand-edited, stale, or malformed records that TypeScript cannot validate at runtime. Duplicate IDs make row identity and mutations ambiguous; duplicate email variants violate the form's identity rule.

## Decision

Keep the existing `AuthService` and `UserService` contracts and select local adapters in `src/services/index.ts`. Validate persisted collections before returning or mutating them: meaningful record fields, allowed role/status, canonical UTC ISO creation dates, unique IDs, and unique emails under trim/lowercase comparison. Reuse input validation for names/emails. A malformed collection raises an actionable error without rewriting saved bytes. An empty collection stays empty.

## Alternatives and consequences

Silently seeding on invalid storage would hide corruption and overwrite the person's work. Repairing individual rows would require an explicit migration/recovery policy and risks losing identity. Trusting parsed JSON would let invalid data cross the service boundary. Rejecting a whole invalid collection is conservative and observable; the user must deliberately repair it or clear the local demo key. No backend-grade security is implied.

Canonical ISO timestamps match every value produced by the adapter. Previously accepted alternative date formats are now reported as invalid rather than silently converted. Once API contracts arrive, map server fields in an adapter and choose any needed explicit migration. Real authentication must validate sessions and permissions on the server; the demo route guard is not a security boundary.
