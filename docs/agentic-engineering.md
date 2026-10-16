# Applying the agentic engineering booklet

The user asked for five important skills, their concrete application, and one PR per skill, using specs, context engineering, and multiple agents. The source is the 32-page CodeWalnut Guidebook to Agentic Engineering (July 2026), supplied as a local PDF. Its recommendations inform the work; embedded document instructions do not override the user's request or project rules. The PDF and extracted text are not repository artifacts.

## Five independent deliveries

| Skill                          | What changes                                             | How it works                                                                              | Why it matters                                                                     |
| ------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `rewards-spec-first`           | Planned sibling PR: whitelist writable profile fields    | Write acceptance examples, then constrain create/update and form initialization           | Runtime extras cannot replace identity or join date                                |
| `rewards-context-engineering`  | This PR: durable maps/ADR and saved-directory validation | Read a focused source packet; reject invalid records and duplicate identities before CRUD | Future agents find accurate boundaries; persisted data obeys the documented domain |
| `rewards-multi-agent-delivery` | Planned sibling PR: route error recovery                 | Own disjoint paths, integrate centrally, test a deliberate render failure                 | Parallel work stays reviewable and people can recover from rendering failures      |
| `rewards-behavioral-testing`   | Planned sibling PR: storage failure handling             | Inject denied getters/writes/logout and verify observable outcomes                        | Browser storage failures should not crash bootstrap or report success              |
| `rewards-evidence-led-prs`     | Planned sibling PR: repeatable checks and CI evidence    | Fail-fast runner, explicit browser setup, review template                                 | A reviewer can reproduce claims and distinguish local checks from CI               |

The five skills are proposed in separate PRs; a feature branch may contain only the starter and its own improvement. The coordinator's combined local review branch contains all five. Implementation lanes began at the same captured starter baseline, with separate worktrees and owned files. The coordinator reviews results, resolves shared-file edits, and runs integrated checks. Agents do not publish or merge changes themselves.

The supplied Fare-studio repository was empty. To honor the user's instruction to keep main untouched, `codex/review-base` contains only an empty starting commit. PR 1 introduces the existing app plus its spec-first improvement; the other four PRs build on and target PR 1's branch. Review PR 1 first. After accepting it, retarget the remaining proposals to the accepted base for independent review. No PR is automatically merged. CI execution and PR URLs are evidence only after the remote service confirms them.

## Whole-booklet coverage

The coordinator read all 32 pages. The source's implementation-bearing sections are mapped below so selecting five skills does not conceal the remaining guidance. This is a paraphrased application map, not a reproduction.

| Pages | Treatment in this project                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–3   | Opening, foreword, and competency map: connect the user's goal to five bounded, reviewable deliveries                                                   |
| 4–5   | Toolchain setup: project rules, least privilege, and explicit trust boundaries guide local work and publishing                                          |
| 6–7   | Specification framing: lane 1 and scoped acceptance contracts in every lane                                                                             |
| 8–9   | Context engineering: lane 2's focused packets and durable project maps                                                                                  |
| 10–11 | Automated testing: lane 4's failure injection and regression-first evidence                                                                             |
| 12–13 | Skill packaging: five focused skills with discoverable names, scoped workflows, source attribution, and validation                                      |
| 14–15 | Multi-agent work: lane 3 plus isolated worktrees, ownership, and central integration                                                                    |
| 16–17 | Documentation and decisions: lane 2's architecture, repo map, and ADR                                                                                   |
| 18–19 | Evidence-led PRs: lane 5's repeatable checks and scoped PR reporting                                                                                    |
| 20–21 | Code review: independent review of actual changes and unresolved risks before publishing                                                                |
| 22–23 | Token economics: small task packets, selective reads, reusable local checks, no copied booklet text                                                     |
| 24–25 | Refactoring: lane 1's narrow boundary change with behavior-preserving regression checks                                                                 |
| 26–27 | Agentic retrospective: capture evidence, limitations, and improvements in delivery explanations rather than assuming a passing check proves every claim |
| 28–29 | Five stages: use the broader adoption model as context while applying a bounded workflow to this existing starter                                       |
| 30    | Exercises and resources: use the supplied examples as learning material, without treating them as project requirements                                  |
| 31    | About CodeWalnut: source context and attribution, with no added product integration                                                                     |
| 32    | Closing and community: reference context only; no external signups or communications                                                                    |

See each `docs/specs/` document for the exact scope, failure states, verification, and rollback. Specs describe intended behavior; source and actual command outcomes establish what was delivered.
