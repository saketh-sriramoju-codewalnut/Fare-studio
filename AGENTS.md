# Working on rewardsIQ

This project is a React/TypeScript login and user CRUD starter. The user has not provided API endpoints. Keep service adapters local until endpoint contracts are supplied; do not invent network routes or send invitations.

Project skills live in `.agents/skills`. Read the relevant skill before making its kind of change:

- `rewards-ui-system`: UI consistency, typography, forms, and responsive styling.
- `rewards-react-performance`: loading, bundles, rendering, assets, and substantial dependency changes.
- `rewards-ui-verification`: browser checks for responsive, accessible, readable, functioning UI.
- `frontend-design` and `high-end-visual-design`: the user-requested upstream skills for design work.

Preserve the existing product direction when applying the upstream design skills. The user's larger-font request takes precedence over microscopic captions or marketing-sized whitespace. Current readable type, color, radius, and motion tokens are in `src/index.css`; reuse them across screens.

Use the appropriate build/lint/tests documented in README.md. Interactive preview uses port 5184; browser tests use a dedicated server on port 5185. Do not change or stop an unrelated app to claim a default port.
