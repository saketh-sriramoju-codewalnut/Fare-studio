# Focused repository map

Choose the smallest relevant group, then follow imports and actual tests. Avoid loading generated bundles, screenshots, the whole PDF, or unrelated skills into a task packet.

| Task                      | Start here                                                                    | Evidence                                        |
| ------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| Route/session behavior    | `src/App.tsx`, `src/context/AuthContext.tsx`, `src/context/auth.ts`           | `src/App.test.tsx`, `src/services/mock.test.ts` |
| Service/domain change     | `src/types.ts`, `src/services/index.ts`, `src/services/mock.ts`               | `src/services/mock.test.ts`                     |
| Saved-directory integrity | `src/lib/persisted-users.ts`, `src/lib/validation.ts`, `src/services/mock.ts` | `src/services/persisted-users.test.ts`          |
| Form/dialog interaction   | `src/components/UserForm.tsx`, `src/components/Dialog.tsx`, calling page      | `src/App.test.tsx`, `e2e/users.spec.ts`         |
| Directory/search/export   | `src/pages/UsersPage.tsx`                                                     | `e2e/users.spec.ts`, relevant component tests   |
| Visual/readability change | `src/index.css`, affected component/page, UI skills                           | `e2e/design.spec.ts`, inspect screenshots       |
| Loading/assets/budgets    | `src/main.tsx`, `src/App.tsx`, `scripts/check-bundle.mjs`, performance skill  | `npm run check:bundle`                          |
| Context/boundary decision | `AGENTS.md`, `docs/architecture.md`, `docs/adr/`                              | Verify claims against source and targeted tests |

Run commands from the repository root. `npm test -- <test-path>` targets a suite; `npm run lint`, `npm run typecheck`, and `npm run build` check implementation. Format exact changed paths while parallel agents work. The full commands and setup are in `README.md`.

`playwright.config.ts` reserves port 5185 with `reuseExistingServer: false`; normal preview uses 5184. It currently selects installed Microsoft Edge. A separate CI delivery lane may add an explicit browser install; inspect the branch's actual config before relying on it.

A handoff should give the goal, owned paths, invariants, smallest verification command, evidence actually observed, and open questions. Mark planned files as planned; never tell another agent to read a file that is absent on its branch.
