---
name: rewards-ui-verification
description: Verify rewardsIQ frontend changes for readable typography, keyboard and touch access, responsive layout, and working login/CRUD behavior.
---

# Verify a rewardsIQ frontend change

Select checks based on what changed. Styling work needs browser inspection; service work needs the relevant adapter tests; interaction work needs the affected browser flow. Avoid adding snapshots or tests that merely assert class names.

Use `npm run lint`, `npm run format:check`, and `npm run build` for code changes. `npm test` covers auth, persistence, validation, and the component CRUD flow. `npm run test:e2e` starts its own app on port 5185 and uses installed Edge; the interactive preview is on 5184. Do not reuse an unrelated server or terminate someone else's process to free a port.

The browser tests save screenshots to `artifacts/`. View the images after layout changes; an automated pass alone does not prove visual quality. Inspect login, directory, create/edit, profile, delete confirmation, and error/empty states relevant to the change at 1440px and 390px. Check 320px and a tablet width when changing breakpoints or type scale.

- Visible text never falls below 12px; primary form input text is 16px and supporting text is normally 14px. Check computed sizes because media queries can override a correct-looking base rule.
- There is no page-level horizontal overflow. A long user table may scroll within its labeled, keyboard-focusable region. Long names/emails must not force the page wider.
- Verify tab focus, dialog focus containment, Escape, focus restoration, input labels, described validation errors, announced feedback, and 44px mobile action targets.
- Use written status and role labels. Check text contrast against its actual surface; 4.5:1 is the floor for normal text. If adding an accessibility audit dependency, run it on the changed UI and review the failures.
- CRUD creates/edits/deletes persist after reload, deletion requires confirmation, duplicate email errors retain form input, and sign-out protects /users again. Preserve search/filter/pagination and CSV scope.
- Respect reduced motion and look for console errors or unexpected third-party network requests. UI validation should not introduce real endpoints or send invites.

When a defect appears, fix its cause and rerun the affected check. Summarize what passed and any verification limitation. Do not describe a static screenshot or unit test as a measured runtime performance improvement.
