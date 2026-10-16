# Route recovery handoff

## Scope and ownership

Implementation lane: codex/multi-agent-recovery, isolated worktree .tmp-worktrees/multi-agent-recovery, baseline a7963c2. Owned changes: src/App.tsx; new src/App.recovery.test.tsx; src/components/AppErrorBoundary.tsx, .css and .test.tsx; docs/specs/route-recovery.md; this handoff; .agents/skills/rewards-multi-agent-delivery/SKILL.md. No dependencies, service contracts, endpoints, shared CSS, git settings, or other lane files changed. No publication or integration performed by the implementer.

Read before implementation: root delivery spec, AGENTS.md, existing UI system/performance/UI verification and upstream design skills, skill-creator, App/Brand/test setup and README commands. The bounded packet and owned paths kept this implementation independent of the other four lanes.

## What, how, and why

What: add application-level render recovery and a reusable multi-agent delivery skill.

How: AppErrorBoundary wraps routing, provider bootstrap, and Suspense. React converts a descendant exception into a fixed recovery panel, focuses its heading, and exposes keyboard-accessible Try again and Reload page actions. Retry remounts the child tree for transient failures; reload starts a new document/module graph for React.lazy failures that React caches. Recovery text uses existing fonts, type/radius/color tokens and shared buttons, with responsive wrapped actions. No thrown message or component stack enters the rendered UI, and no telemetry service receives it.

Why: without a boundary, one route exception unmounts the application into a blank screen. Suspense only handles loading; it does not provide recovery after import rejection. A reset-only solution cannot repair a cached rejected lazy import. The skill records isolated ownership, small context packets, independent review, and publication boundaries so future parallel work remains reviewable.

Booklet basis: multi-agent workflow pp. 14–15, code review pp. 20–21; project contract in docs/specs/route-recovery.md. The booklet supplied engineering principles, not execution permissions.

## Implementer evidence

- Red regression: before the boundary existed, npm test -- src/App.recovery.test.tsx failed with missing recovery heading, an empty body container, and an uncaught deliberate route error.
- Green focused tests: npm test -- src/App.recovery.test.tsx src/components/AppErrorBoundary.test.tsx — 4 passed. Covers actual protected route render failure, safe public copy, heading focus, healthy child pass-through, transient retry success, rejected lazy import still cached after retry, and keyboard-triggered reload callback.
- Full npm test — 4 files / 13 tests passed, including original login/create/view/edit/delete/logout flow and adapter tests.
- npm run typecheck and npm run lint — passed.
- skill-creator quick_validate.py — Skill is valid, using the coordinator-provided .skill-tools PyYAML path; no dependency installation or package changes in this lane.
- npm run check:bundle — production build and all budgets passed: initial JS 85.4 KiB gzip, all JS 91.7 KiB gzip, CSS 6.1 KiB gzip, modern fonts 96.7 KiB raw.
- Prettier check on all owned source/spec/skill files — passed. This handoff is formatted separately after creation.

## Independent review and browser verification

Independent reviewer /root/project_audit inspected the actual diff and scoped spec, including privacy, focus behavior, and cached lazy-import retry. The reviewer reported no actionable issues and independently reran all four focused recovery tests successfully. No code fixes were required. Browser reload, network-failure, responsive screenshots, and axe checks remain pending with the parent coordinator before publication.

Suggested browser failure check: serve this lane's production build on a free dedicated port; intercept and abort the lazy UsersPage chunk after demo login. Confirm recovery heading focus, no private details, 16px body/actions, visible focus, and no page overflow at desktop, 390px and 320px. Retry should remain safely recoverable because React cached the rejection; remove the abort and click Reload page to confirm a fresh document can load the directory again. A browser check is needed to prove actual window.location.reload behavior; the unit test injects a reload callback because JSDOM cannot navigate documents.

## Known limits and rollback

No browser screenshots or browser reload result have been produced by the implementer; parent owns that check. Persistent infrastructure failures can return to recovery after reload. Retry remounts the app/provider and loses unsaved component state; the screen warns about unsaved changes. This boundary does not catch event-handler or detached asynchronous callback errors; existing local service/form handling remains responsible. React development diagnostics may still appear in developer tools; the application does not render or persist them.

Rollback removes the App.tsx wrapper/import and new boundary files. No data migration or storage reset is required.
