import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  existsSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const project = fileURLToPath(new URL('../', import.meta.url))
const runnerUrl = new URL('./verify.mjs', import.meta.url).href

function fixture(t) {
  const folder = mkdtempSync(join(tmpdir(), 'rewardsiq-quality-'))
  t.after(() => {
    const target = resolve(folder)
    assert.equal(dirname(target), resolve(tmpdir()))
    assert.ok(basename(target).startsWith('rewardsiq-quality-'))
    rmSync(target, { recursive: true, force: true })
  })
  const command = join(folder, 'command.mjs')
  writeFileSync(
    command,
    "import { writeFileSync } from 'node:fs'; writeFileSync(process.argv[2], 'ran'); process.exitCode = Number(process.argv[3]);\n",
  )
  const step = (label, exitCode = 0) => ({
    label,
    file: process.execPath,
    args: [command, join(folder, label), String(exitCode)],
  })
  const run = (steps) => {
    const reportPath = join(folder, 'verification.json')
    const wrapper = join(folder, 'run.mjs')
    writeFileSync(
      wrapper,
      `import { runVerification } from ${JSON.stringify(runnerUrl)};\nprocess.exitCode = runVerification(${JSON.stringify({ steps, cwd: project, reportPath })}).exitCode;\n`,
    )
    const result = spawnSync(process.execPath, [wrapper], { encoding: 'utf8' })
    return {
      ...result,
      report: JSON.parse(readFileSync(reportPath, 'utf8')),
    }
  }
  return { folder, step, run }
}

test('a failing command stops later commands and propagates its exit in process and report', (t) => {
  const { folder, step, run } = fixture(t)
  const result = run([step('first'), step('failure', 7), step('never')])
  assert.equal(result.status, 7, result.stderr)
  assert.ok(existsSync(join(folder, 'first')))
  assert.ok(existsSync(join(folder, 'failure')))
  assert.equal(existsSync(join(folder, 'never')), false)
  assert.equal(result.report.status, 'failed')
  assert.equal(result.report.exitCode, 7)
  assert.match(result.report.commitId, /^[0-9a-f]{40,64}$/)
  assert.equal(typeof result.report.dirty, 'boolean')
  assert.deepEqual(
    result.report.commands.map(({ status, exitCode }) => [status, exitCode]),
    [
      ['passed', 0],
      ['failed', 7],
      ['not-run', null],
    ],
  )
})

test('successful commands both execute and persist a passed result', (t) => {
  const { folder, step, run } = fixture(t)
  const result = run([step('first'), step('second')])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(folder, 'first')))
  assert.ok(existsSync(join(folder, 'second')))
  assert.equal(result.report.status, 'passed')
  assert.equal(result.report.exitCode, 0)
  assert.ok(result.report.finishedAt)
  assert.deepEqual(
    result.report.commands.map(({ status, exitCode }) => [status, exitCode]),
    [
      ['passed', 0],
      ['passed', 0],
    ],
  )
})

test('a command that cannot start fails instead of allowing later checks', (t) => {
  const { folder, step, run } = fixture(t)
  const result = run([
    { label: 'missing', file: join(folder, 'missing-executable'), args: [] },
    step('never'),
  ])
  assert.equal(result.status, 1, result.stderr)
  assert.equal(result.report.commands[0].status, 'failed')
  assert.equal(result.report.commands[0].exitCode, null)
  assert.match(result.report.commands[0].error, /ENOENT/)
  assert.equal(result.report.commands[1].status, 'not-run')
  assert.equal(existsSync(join(folder, 'never')), false)
})
