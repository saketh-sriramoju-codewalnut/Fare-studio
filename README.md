# rewardsIQ

A React 19.3 + TypeScript user management starter built with Vite 8. Dependencies were installed from the current npm stable releases; `package-lock.json` records exact versions.

## Run locally

Use Node.js 22.12+ or 24 LTS (verified with Node 24.21).

```sh
npm ci
npm run dev
```

Open http://localhost:5184. The dev server uses port 5184; browser tests use a separate server on port 5185.

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Demo login

Click **Use demo credentials**, then **Sign in**.

- Email: `admin@rewardsiq.com`
- Password: `Demo123!`

Login is simulated. There are no endpoints, API calls, tokens, password recovery, or real permission checks. The demo password is public and should never be used for a real account. No passwords are saved in browser storage.

By default, the demo session uses `sessionStorage`. **Keep me signed in** uses `localStorage`. Sign out clears both session stores. The directory is protected by client-side routing for the demo; a real backend must enforce authentication and authorization.

## Included

- Responsive login and user directory, with keyboard accessible native dialogs.
- Create, view, edit, and delete profiles with confirmation before deletion.
- Required-field, name-length, email, and case-insensitive duplicate-email validation.
- Name/email search, role/status filters, name sorting, and pagination.
- Summary counts, empty/loading/error states, and success notifications.
- CSV export of all users matching the current filters, across every page.
- Persistent local mock data with 12 initial sample profiles.
- Locally bundled fonts and icons; the application requires no third-party network requests.
- Strict TypeScript, Oxlint, Prettier, Vitest, and Playwright checks.

Roles are **Admin**, **Manager**, and **Member**. Statuses are **Active**, **Invited**, and **Inactive**. These are profile attributes; marking a user Invited does not send an email. Directory profiles and the simulated signed-in administrator are separate.

## Connect your APIs later

`src/types.ts` defines the service contracts. `src/services/index.ts` selects the implementations. Replace its two mock adapters with API-backed services once endpoints and payloads are provided. No placeholder endpoints or environment variables are required today.

```ts
interface AuthService {
  login(email: string, password: string, remember: boolean): Promise<Session>
  getSession(): Session | null
  logout(): Promise<void>
}

interface UserService {
  list(): Promise<User[]>
  create(input: UserInput): Promise<User>
  update(id: string, input: UserInput): Promise<User>
  remove(id: string): Promise<void>
}
```

Map backend field names to the `User` model inside the adapter, and throw meaningful `Error` messages for the existing UI error states. The list currently loads all users and filters/paginates on the client. For a large dataset, extend the list contract to accept search, sorting, and pagination parameters and return a total count.

The current auth contract supports the synchronous demo session. When adding cookie-based authentication, introduce an asynchronous session bootstrap/loading state in `AuthProvider`, use your backend’s session validation and expiry rules, and enforce authorization server-side. Keep credentials and secrets out of client code.

## Structure

```text
src/
  components/        Brand, native modal, user form
  context/           Auth provider and auth hook
  lib/               Validation and display helpers
  pages/             Login and user directory
  services/          Mock adapters and API integration point
  test/              Component test setup
  types.ts           Domain models and service contracts
e2e/                 Real-browser workflow test
```

## Checks

```sh
npm run build        # TypeScript check and production bundle
npm run lint
npm test             # Adapter tests and component workflow
npm run test:e2e     # Full browser workflow using installed Microsoft Edge
npm run format:check
npm run check:bundle # Production build and bundle/font budgets
```

`npm run test:watch` runs tests during development. `npm run format` formats source files. `npm run preview` serves the production build.

The browser test uses Microsoft Edge via `playwright.config.ts`. On a machine without Edge, remove `channel: 'msedge'` and run `npx playwright install chromium` before running it. Browser test screenshots are saved in `artifacts/`; screenshots, build output, and test reports are gitignored.

For production hosting, configure the host to fall back to `index.html` for client routes such as `/login` and `/users`.

## Design and project skills

The project includes the requested [high-end-visual-design](https://skills.sh/leonxlnx/taste-skill/high-end-visual-design) and [frontend-design](https://skills.sh/anthropics/skills/frontend-design) skills under `.agents/skills`, along with three project-specific skills:

- `rewards-ui-system`: shared typography, color, spacing, controls, and responsive patterns.
- `rewards-react-performance`: route loading, asset choices, measured performance work, and bundle budgets.
- `rewards-ui-verification`: readability, responsive layouts, accessibility, and browser workflow checks.

`AGENTS.md` routes future work to the relevant skills. They are project-scoped and available on the next turn. Invoke them explicitly with `$rewards-ui-system`, `$rewards-react-performance`, or `$rewards-ui-verification` when useful. The upstream skills are preserved as installed; the project skills adapt their guidance to this application's readable, simple UI.

Type sizes use shared CSS tokens: 12px compact metadata, 14px secondary text, and 16px body/input text. Mobile layouts keep those sizes instead of shrinking text. Browser checks inspect computed sizes at 320, 390, 900, and 1440px and run axe checks on login, directory, and the create dialog.

The user directory loads as a lazy route after login. `scripts/check-bundle.mjs` follows the Vite manifest to enforce gzip budgets for initial JS (100 KiB), total JS (115 KiB), CSS (12 KiB), and raw WOFF2 fonts (130 KiB). These checks prevent asset regressions; they do not measure Core Web Vitals.

## Reset demo data

Remove `rewards-iq.users.v1` from localStorage in browser developer tools, then reload to restore sample profiles. Clearing this app’s site data also resets the demo. Storage errors are reported without silently overwriting saved profiles.
