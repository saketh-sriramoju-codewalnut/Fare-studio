# Reproducible quality evidence

## Actor and goal

A contributor or reviewer needs one reproducible quality command and a truthful record of what passed, failed, or never ran. GitHub should run the same gates and retain evidence when a check fails.

## Contract and examples

`npm run verify` runs formatting, lint, Node quality-runner tests, application tests, and the production build/bundle budgets sequentially. The build includes TypeScript checks. `npm run verify:all` adds browser tests. Commands use an executable and argument array with no shell interpolation; npm provides its CLI path so Windows and Unix run the same Node entry point.

Formatting scripts use Prettier's `--end-of-line auto` because Git may check out CRLF on Windows and LF on Linux. Other format rules remain enforced. This avoids changing unrelated baseline files solely to normalize platform line endings.

The runner writes ignored `artifacts/verification.json` with schema version, revision and dirty-tree state, start/end times, overall result, and each command's executable, arguments, status, exit code, signal, and duration. If check two exits 7, the process exits 7, check one is passed, check two is failed, later checks remain `not-run`, and the report is saved. A missing executable similarly fails with a nonzero runner exit and a bounded diagnostic. A successful fixture executes every command and writes a passed report.

The CLI accepts only `--all` to include browser checks. Tests may supply harmless temporary fixture commands through the exported runner API; no arbitrary command argument is exposed through the CLI. Revision identifies committed context; the dirty flag makes uncommitted verification explicit. Reports contain no collected environment, credentials, or application data.

## CI and publication

The GitHub workflow in `.github/workflows/quality.yml` is configured for pull requests and pushes to `codex/**`, with read-only contents permission, Node 24, `npm ci`, explicit Chromium installation, and `npm run verify:all`. `CI` selects Chromium without the local Microsoft Edge channel. Traces, screenshots, HTML report, test results, and verification JSON are retained even when checks fail. Local browser checks retain Edge. CI runtime has a bounded job timeout.

Publication history: GitHub initially rejected the active workflow because the CLI authorization lacked `workflow` scope, so PR 5 first carried an inactive template. The user subsequently approved activation. The configuration is now prepared in its executable workflow location; actual publication and remote run results must be verified independently. No local gate is weakened or skipped to enable it, and main is not modified.

The PR template captures problem/behavior, why, spec, exact evidence, risks, and rollback. A workflow configuration or local check is never reported as an executed remote CI run.

## Non-goals and failures

No dependencies, lockfile changes, APIs, deployments, merges, or changes to app behavior. Missing Git/npm/Node, failed checks, and missing browser installations must remain visible failures. No automatic retry, budget relaxation, secret collection, or reuse of an unrelated dev server. This runner is for trusted repository commands, not sandboxing untrusted code. Browser tests use port 5185; the parent coordinates browser execution.

## Acceptance and verification

1. Real spawned fixture commands prove the runner propagates a failing exit code, preserves the report, and never executes later commands.
2. A real successful fixture proves both commands execute and their results persist. A missing command proves startup failure does not look successful.
3. `npm run verify` passes locally for this change, or records the exact failing gate. Format only owned files before invoking it.
4. Parent runs integrated browser checks. Inspect CI configuration locally; claim GitHub execution only after a real run.
5. Validate skill frontmatter; review the skill and PR template for bounded, evidence-backed claims.

## Rollback

Revert the lane's runner, tests, npm scripts, CI workflow, Playwright configuration, template, skill, documentation, and README additions. No stored data or dependency migration is required.

## Recorded local evidence and remaining checks

- `npm run test:quality`: 3 tests passed, using actual spawned Node fixtures. A fixture exited 7, the wrapper process exited 7, and its later marker file was absent; success and missing-executable cases also passed.
- The first `npm run verify` correctly exited 1 on inherited CRLF formatting and recorded every later command as `not-run`. The scoped platform line-ending adjustment above resolved this without rewriting baseline files.
- `npm run verify` then exited 0: formatting, lint, 3 runner tests, 9 baseline application tests, TypeScript/build, and bundle budgets passed. The generated ignored report identified baseline `a7963c2fafa95bb3f3ecfa0ce8580d8443a9aac2` and `dirty: true`, because this lane is not committed yet. Gzip budgets measured 85.1 KiB initial JS, 91.4 KiB total JS, 5.9 KiB CSS, and 96.7 KiB raw modern fonts.
- Exact-file Prettier checks and skill validation passed. The validator used existing project-local PyYAML support; no dependency was added.
- GitHub's public `git/ref/tags/v7` API confirmed the workflow's pinned hashes. Official action sources: [checkout](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1), [setup-node](https://github.com/actions/setup-node), and [upload-artifact](https://github.com/actions/upload-artifact).
- This lane did not run browser tests, install a browser, push a workflow, or execute remote CI. Parent integration and the actual GitHub run must supply that evidence. No workflow publication/authentication issue has been observed because publication was not attempted here.

Source: supplied CodeWalnut booklet pp. 18–19 and 22–23; the local application is an evidence artifact and reproducible check contract.
