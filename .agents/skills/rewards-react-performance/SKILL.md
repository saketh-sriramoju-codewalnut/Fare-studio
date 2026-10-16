---
name: rewards-react-performance
description: Improve or review rewardsIQ React loading, bundle size, rendering, and data-flow performance when performance work is requested or a change adds substantial code or assets.
---

# Improve rewardsIQ performance

Start with the affected route and a concrete symptom or measurable cost. Read `src/App.tsx`, `src/main.tsx`, the affected service/component, and `scripts/check-bundle.mjs`. Do not add memoization, virtualization, a state library, or caching merely because they exist.

## Loading and assets

The login screen stays in the entry bundle; the protected user directory loads through React.lazy and Suspense after sign-in. Preserve that split and its accessible loading state. Avoid eager imports that pull the directory back into login. Keep named icon imports and locally hosted, Latin-subset font weights actually used by the UI.

Run `npm run check:bundle` for loading or dependency changes. The manifest checker follows static imports to distinguish initial JS from lazy chunks. Budgets are 100 KiB initial JS gzip, 115 KiB total JS gzip, 12 KiB CSS gzip, and 130 KiB raw WOFF2. These are regression limits for this starter, not proof of good Core Web Vitals. Investigate an overage; do not raise a limit solely to make a check pass. Document an intentional tradeoff when the user's requested feature justifies it.

## Rendering and data

Reuse the module-level Intl.DateTimeFormat instead of constructing it per row. Keep filtering and sort computations pure and avoid mutating the service's source array. At this demo's scale, client-side pagination is sufficient. Profile before introducing deferred queries, memoization, or virtualization.

The mock service performs no network requests and persists only CRUD writes. Preserve its validation, duplicate-email checks, corruption handling, and async interfaces. Do not add endpoints until the user supplies them. For a real large dataset, revise the list service to accept query/sort/page and return total count; do not load an unbounded server dataset into the browser.

Keep effect cleanup for async lists and notification timers. Use cancellation or stale-response guards when adding real requests. Preserve session bootstrap and error behavior when replacing the mock authentication adapter.

For motion, prefer transform and opacity; avoid scroll handlers, large scrolling blur layers, and permanent will-change. Validate observable behavior with relevant adapter/component tests and the browser CRUD test. Report measured bundle sizes or profiling evidence and limitations; do not claim faster rendering from a code change alone.
