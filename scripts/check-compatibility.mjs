// Read-only compatibility gate: verify the installed DSH desktop runtime (app.asar)
// matches the pins recorded in compatibility.json. Offline and deterministic; the
// asar archive is opened read-only and never modified (NFR-7). When DSH upgrades,
// this check fails by design — realign compatibility.json before releasing again.
import { closeSync, openSync, readSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const compatibility = JSON.parse(readFileSync(new URL('../compatibility.json', import.meta.url), 'utf8'))

function resolveAsarPath() {
  const override = process.env.DSH_ASAR_PATH
  if (override !== undefined && override !== '') return override
  const localAppData = process.env.LOCALAPPDATA
  if (localAppData === undefined) {
    fail([['asar path', 'unable to resolve standard install (LOCALAPPDATA not set); set DSH_ASAR_PATH']])
  }
  return join(localAppData, 'Programs', 'DeepSeek Harness', 'resources', 'app.asar')
}

// Minimal asar reader. Header layout: [u32 = 4][u32 blockSize][u32 blockSize-4]
// [u32 jsonLength][json directory] then file data at base 8 + blockSize. Entry
// offsets in the directory are decimal strings relative to that base.
function openAsar(path) {
  const fd = openSync(path, 'r')
  try {
    const meta = Buffer.alloc(16)
    if (readSync(fd, meta, 0, 16, 0) !== 16 || meta.readUInt32LE(0) !== 4) {
      throw new Error('not an asar archive: unexpected header layout')
    }
    const blockSize = meta.readUInt32LE(4)
    const jsonLength = meta.readUInt32LE(12)
    const json = Buffer.alloc(jsonLength)
    if (readSync(fd, json, 0, jsonLength, 16) !== jsonLength) {
      throw new Error('not an asar archive: truncated directory header')
    }
    const dataBase = 8 + blockSize
    const root = JSON.parse(json.toString('utf8')).files
    return {
      readText(entryPath) {
        let node = { files: root }
        for (const segment of entryPath.split('/')) {
          node = node.files?.[segment]
          if (node === undefined) return undefined
        }
        if (node.offset === undefined || node.size === undefined) return undefined
        const buf = Buffer.alloc(node.size)
        if (readSync(fd, buf, 0, node.size, dataBase + Number(node.offset)) !== node.size) {
          throw new Error(`asar entry truncated: ${entryPath}`)
        }
        return buf.toString('utf8')
      },
      close: () => closeSync(fd),
    }
  } catch (error) {
    closeSync(fd)
    throw error
  }
}

function fail(mismatches) {
  for (const [item, detail] of mismatches) console.error(`compatibility mismatch [${item}]: ${detail}`)
  process.exit(1)
}

const asar = openAsar(resolveAsarPath())
try {
  const mismatches = []
  const manifest = asar.readText(compatibility.target.runtimeManifest)
  const manifestVersion = manifest === undefined ? undefined : JSON.parse(manifest).version
  if (manifestVersion !== compatibility.target.version) {
    mismatches.push(['runtime manifest', `expected ${compatibility.target.version}, got ${manifestVersion ?? 'missing'}`])
  }
  for (const [name, expected] of Object.entries(compatibility.pins)) {
    const entryPath = `dsh/node_modules/${name}/package.json`
    const pkg = asar.readText(entryPath)
    const actual = pkg === undefined ? undefined : JSON.parse(pkg).version
    if (actual !== expected) {
      mismatches.push([name, `expected ${expected}, got ${actual ?? 'missing'}`])
    }
  }
  if (mismatches.length > 0) fail(mismatches)
  console.log(`DSH compatibility pin verified: ${compatibility.target.version} (${Object.keys(compatibility.pins).length} pins, asar fingerprint @ ${new Date(compatibility.testedAt).toISOString()})`)
} finally {
  asar.close()
}
