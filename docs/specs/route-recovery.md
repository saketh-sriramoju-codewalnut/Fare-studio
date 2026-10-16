# Route recovery specification

## Actor and goal

A rewardsIQ user whose route cannot render needs readable recovery actions instead of a blank application. This applies to synchronous render errors and rejected lazy route imports. The boundary also covers provider bootstrap failures because it wraps the application root.

## Contract

Input: a child render exception or rejected React.lazy import. Output: one focused, accessible recovery screen with fixed public copy, a retry action, and a full page reload action. Never interpolate error messages, component stacks, profile values, or credentials into the screen.

A transient render failure can recover by remounting the boundary children. React caches a rejected lazy import; retrying the same lazy component may still fail. Reload the page performs a new document load and starts a fresh module graph. A persistent deployment or network failure can still fail again; recovery must not loop automatically.

## Visual plan

Preserve the existing product: violet #7354d5 actions, strong #252736 text, muted #646777 supporting copy, white surface, #f7f8fa backdrop. Reuse DM Sans body, Manrope headings, shared panel/control radii and existing button styles. A single left-aligned recovery panel fits within a centered main region, with wrapped actions on narrow screens. Body and buttons use 16px; no tiny captions, new assets, entry animation, or dependencies.

## Examples and failure states

- A route throws a private error: show “This screen could not open”, focus its heading, and omit the private error.
- A child can render after retry: pressing Try again restores its content.
- A route import rejects: show the same safe screen; a cached rejection can fall back again after retry; Reload page starts fresh.
- Children render normally: show them without recovery UI.

## Non-goals

No API endpoints, error-reporting services, persistent error storage, session clearing, data reset, deployment repair, or event-handler/async callback error capture. Existing form/service errors retain their local handling. No shared stylesheet or dependency changes.

## Acceptance criteria

1. Deliberate failures in an actual App route and a rejected lazy component reach the boundary.
2. Recovery text and actions have accessible names; focus moves to its heading.
3. Transient retry remounts successfully and reload invokes a full page reload operation.
4. Private errors and stacks never appear in rendered content.
5. Existing login/CRUD tests, type checking, lint, formatting, production build and bundle budgets continue to pass.
6. Parent verifies desktop/mobile screenshots and browser interactions independently before integration.

## Verification and rollback

Run the focused App recovery and boundary tests, npm test, npm run typecheck, npm run lint, formatting on owned files, and npm run check:bundle. Parent runs integrated browser checks and records independent review in docs/agent-handoffs/route-recovery.md. Roll back by removing the boundary wrapper/import from App.tsx and its new files; no storage or service migration is involved.

Source: CodeWalnut Guidebook to Agentic Engineering, July 2026, multi-agent workflow pp. 14–15 and code review pp. 20–21. These pages motivate isolated implementation, bounded handoffs, and independent evidence; the UI improvement is the scoped project application, not a claim that the booklet prescribes this exact component.
