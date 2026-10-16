---
name: rewards-ui-system
description: Maintain rewardsIQ visual consistency when adding or editing screens, forms, tables, dialogs, and responsive styles.
---

# Maintain the rewardsIQ UI

Use the existing navy sidebar, violet actions, neutral surfaces, DM Sans body type, and Manrope headings. This is a team administration tool: prioritize readable profiles and clear CRUD actions. Preserve the chosen visual direction unless the user requests a redesign.

Read `src/index.css` tokens and the affected components before editing. Reuse `Brand`, `Dialog`, `UserForm`, `.button`, `.field`, `.status-pill`, and `.role-pill` where their semantics fit; do not add parallel styling systems.

- Type comes from `--text-xs` (12px), `--text-sm` (14px), `--text-base` (16px), and heading tokens. Primary user names and input text use 16px; secondary content uses 14px. Reserve 12px for badges and short metadata. Do not shrink text on mobile to fit a layout.
- Use `--text-strong` and `--text-muted` on light surfaces, and `--sidebar-muted` on navy. Status pills need readable text and written status labels, not color alone.
- Keep field labels, errors, helper text, and button vocabulary consistent across login and CRUD forms. Use sentence case and concrete action names.
- Build spacing around the larger type. Let toolbars wrap; keep table scrolling inside its own region. At 320px, controls and dialogs must fit without page-level horizontal overflow. The mobile scroll hint explains where additional columns live.
- Keep interactive targets at least 44px on touch layouts and preserve visible keyboard focus. Native dialogs retain focus handling and Escape behavior. Every input needs a label and errors linked via aria-describedby.
- Use the shared cubic-bezier token for brief feedback animations. Respect reduced motion; avoid continuous decoration or an animation dependency for simple feedback.

For a substantial new visual direction, read the installed `frontend-design` and `high-end-visual-design` skills. Apply them in service of this product and the user's brief. Their microscopic labels, oversized marketing spacing, and extensive reveal animations must not override the user's request for readable, simple UI.

Verify the changed screen on desktop and mobile using screenshots. Use `rewards-ui-verification` when the change affects interactions or layout. Update shared tokens rather than adding late overrides for every screen.
