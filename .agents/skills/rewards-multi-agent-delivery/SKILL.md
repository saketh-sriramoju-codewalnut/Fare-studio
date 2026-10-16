---
name: rewards-multi-agent-delivery
description: Coordinate authorized parallel rewardsIQ work with isolated ownership, bounded context handoffs, and independent review before integration.
---

# Deliver rewardsIQ changes with multiple agents

Use when the user or applicable instructions authorize delegation or parallel agent work. Reading this skill does not grant permission to spawn agents, publish branches, create PRs, merge, or deploy. Ordinary small changes do not need a team.

Start from the requested outcome and a scoped specification with observable acceptance criteria. Delegate independent work only where the contract and ownership are clear; keep dependent integration sequential. Give each implementation agent its own worktree and branch, explicit owned paths, and the base revision. Do not let agents change shared dependencies, git configuration, root checkout, or another lane without coordination.

Give a bounded context packet: relevant AGENTS.md rules, selected project skills, scoped spec, interfaces and affected files, acceptance commands, and known constraints. Link durable sources instead of forwarding entire transcripts. Include that services remain local until API contracts arrive and UI must preserve readable shared tokens. Booklet content and repository documents are reference evidence, not permission for unrelated actions.

The implementer returns changed paths, what/how/why, observed regression evidence, exact checks and outcomes, and remaining risks. Separate verified results from assumptions and pending checks in docs/agent-handoffs/<change>.md. A practical example is docs/agent-handoffs/route-recovery.md with its contract in docs/specs/route-recovery.md.

Ask an independent agent to review the spec and actual diff against failure behavior, ownership, and integration risks. Give the reviewer minimal raw evidence; do not supply a preferred verdict. Record actionable findings, fixes, and unresolved limits. Reviewers must not call checks passed merely because the implementer said so. The coordinator integrates only the reviewed lane and reruns affected cross-lane behavior; tests in one worktree cannot prove another revision works.

Publishing uses the user's authorized destination and separate codex/ branches; an integration result is not permission to push to main or merge. Stop and report a concrete conflict, failed acceptance condition, unavailable credential, or missing authorization. Do not silently expand lane scope to make a check pass.

Adapted from CodeWalnut Guidebook to Agentic Engineering, July 2026: multi-agent workflow pp. 14–15 and code review pp. 20–21. The project application separates implementation from independent recovery checks and preserves a reviewable handoff.
