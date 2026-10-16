import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function revision(cwd) {
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd,
    encoding: 'utf8',
  })
  const changes = spawnSync('git', ['status', '--porcelain'], {
    cwd,
    encoding: 'utf8',
  })
  return {
    commitId: commit.status === 0 ? commit.stdout.trim() : null,
    dirty: changes.status === 0 ? changes.stdout.trim().length > 0 : null,
  }
}

export function qualitySteps({
  all = false,
  npmCli = process.env.npm_execpath,
} = {}) {
  if (!npmCli)
    throw new Error(
      'Run this command through npm run verify or npm run verify:all.',
    )
  const npm = (label, script) => ({
    label,
    file: process.execPath,
    args: [npmCli, 'run', script],
  })
  return [
    npm('Formatting', 'format:check'),
    npm('Lint', 'lint'),
    npm('Quality runner tests', 'test:quality'),
    npm('Application tests', 'test'),
    npm('Production build and bundle budgets', 'check:bundle'),
    ...(all ? [npm('Browser workflows and accessibility', 'test:e2e')] : []),
  ]
}

export function runVerification({
  steps,
  cwd = process.cwd(),
  reportPath = resolve(cwd, 'artifacts/verification.json'),
  mode = 'custom',
}) {
  const report = {
    schemaVersion: 1,
    ...revision(cwd),
    mode,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    status: 'running',
    exitCode: null,
    commands: steps.map(({ label, file, args }) => ({
      label,
      file,
      args,
      status: 'not-run',
      exitCode: null,
      signal: null,
      durationMs: null,
      error: null,
    })),
  }
  const save = () => {
    mkdirSync(dirname(reportPath), { recursive: true })
    writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n')
  }
  save()
  let exitCode = report.commitId ? 0 : 1
  if (!report.commitId)
    console.error(
      'Verification requires a Git commit so evidence has a revision.',
    )
  else {
    for (const command of report.commands) {
      command.status = 'running'
      save()
      console.log(`\nChecking: ${command.label}`)
      const started = performance.now()
      const result = spawnSync(command.file, command.args, {
        cwd,
        stdio: 'inherit',
        shell: false,
      })
      command.durationMs = Math.round(performance.now() - started)
      command.exitCode = result.status
      command.signal = result.signal
      command.error = result.error?.message.slice(0, 500) ?? null
      command.status =
        result.status === 0 && !result.error ? 'passed' : 'failed'
      save()
      if (command.status === 'failed') {
        exitCode = result.status || 1
        break
      }
    }
  }
  report.status = exitCode === 0 ? 'passed' : 'failed'
  report.exitCode = exitCode
  report.finishedAt = new Date().toISOString()
  save()
  return { exitCode, report }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const flags = process.argv.slice(2)
    if (flags.some((flag) => flag !== '--all'))
      throw new Error('Only --all is supported. Use npm run verify[:all].')
    const all = flags.includes('--all')
    const { exitCode } = runVerification({
      steps: qualitySteps({ all }),
      mode: all ? 'with-browser' : 'local',
    })
    process.exitCode = exitCode
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Verification failed.',
    )
    process.exitCode = 1
  }
}
