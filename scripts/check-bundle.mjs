import { readFile, readdir } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const manifest = JSON.parse(
  await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'),
)
const initial = new Set()
function collect(key) {
  const chunk = manifest[key]
  if (!chunk || initial.has(chunk.file)) return
  initial.add(chunk.file)
  for (const dependency of chunk.imports ?? []) collect(dependency)
}
for (const [key, chunk] of Object.entries(manifest))
  if (chunk.isEntry) collect(key)
const files = await readdir(path.join(dist, 'assets'))
const sizes = await Promise.all(
  files.map(async (name) => {
    const buffer = await readFile(path.join(dist, 'assets', name))
    return { name, raw: buffer.length, gzip: gzipSync(buffer).length }
  }),
)
const metrics = [
  {
    label: 'Initial JavaScript (gzip)',
    value: sizes
      .filter(
        (item) =>
          item.name.endsWith('.js') && initial.has(`assets/${item.name}`),
      )
      .reduce((sum, item) => sum + item.gzip, 0),
    limit: 100 * 1024,
  },
  {
    label: 'All JavaScript (gzip)',
    value: sizes
      .filter((item) => item.name.endsWith('.js'))
      .reduce((sum, item) => sum + item.gzip, 0),
    limit: 115 * 1024,
  },
  {
    label: 'All CSS (gzip)',
    value: sizes
      .filter((item) => item.name.endsWith('.css'))
      .reduce((sum, item) => sum + item.gzip, 0),
    limit: 12 * 1024,
  },
  {
    label: 'Modern font files (raw WOFF2)',
    value: sizes
      .filter((item) => item.name.endsWith('.woff2'))
      .reduce((sum, item) => sum + item.raw, 0),
    limit: 130 * 1024,
  },
]
let failed = false
for (const { label, value, limit } of metrics) {
  const passes = value <= limit
  console.log(
    `${passes ? 'PASS' : 'FAIL'} ${label}: ${(value / 1024).toFixed(1)} KiB / ${(limit / 1024).toFixed(0)} KiB budget`,
  )
  if (!passes) failed = true
}
if (failed) process.exitCode = 1
