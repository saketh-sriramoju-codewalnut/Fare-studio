# Working on rewardsIQ

This project is a React/TypeScript login and user CRUD starter. The user has not provided API endpoints. Keep service adapters local until endpoint contracts are supplied; do not invent network routes or send invitations.

Project skills live in `.agents/skills`. Read the relevant skill before making its kind of change:

- `rewards-ui-system`: UI consistency, typography, forms, and responsive styling.
- `rewards-react-performance`: loading, bundles, rendering, assets, and substantial dependency changes.
- `rewards-ui-verification`: browser checks for responsive, accessible, readable, functioning UI.
- `frontend-design` and `high-end-visual-design`: the user-requested upstream skills for design work.

For cross-cutting work, start with `docs/repo-map.md`, read only the affected sources, and consult `docs/architecture.md` plus the relevant `docs/adr/` decision when changing a boundary. `rewards-context-engineering` is available for focused context packets and durable documentation. Its applied scope is in `docs/specs/context-engineering.md`.

Four sibling skills are planned in separate PRs and may be absent on this branch: `rewards-spec-first` (acceptance and writable-field boundaries), `rewards-multi-agent-delivery` (parallel ownership and recovery), `rewards-behavioral-testing` (failure-injection regressions), and `rewards-evidence-led-prs` (repeatable checks and review evidence). Read their actual `SKILL.md` only when present. `docs/agentic-engineering.md` maps the five deliveries to the booklet and explains what, how, and why.

Preserve the existing product direction when applying the upstream design skills. The user's larger-font request takes precedence over microscopic captions or marketing-sized whitespace. Current readable type, color, radius, and motion tokens are in `src/index.css`; reuse them across screens.

Use the appropriate build/lint/tests documented in README.md. Interactive preview uses port 5184; browser tests use a dedicated server on port 5185. Do not change or stop an unrelated app to claim a default port.
