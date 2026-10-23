import { SessionId } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { ChildToolRoster, readOnlyPackageRows } from '../src/child-composition.js'

describe('read-only tool name to package row mapping', () => {
  it('maps every default read-only tool name to an official package, deduplicated', () => {
    // The seven names of the default readOnlyAllowedTools configuration.
    const plan = readOnlyPackageRows(['read', 'read_image', 'glob', 'grep', 'skill', 'web_search', 'lsp'])
    expect(plan.unmapped).toEqual([])
    expect(plan.rows.map(row => row.name)).toEqual([
      '@deepseek-ai/dsh-tool-fs',
      '@deepseek-ai/dsh-tool-fs-search',
      '@deepseek-ai/dsh-tool-skill',
      '@deepseek-ai/dsh-tool-web',
      '@deepseek-ai/dsh-tool-lsp',
    ])
  })

  it('reports names without a package mapping instead of dropping them silently', () => {
    expect(readOnlyPackageRows(['read', 'made_up'])).toEqual({
      rows: [{ name: '@deepseek-ai/dsh-tool-fs' }],
      unmapped: ['made_up'],
    })
  })

  it('returns an empty composition for an empty allow list', () => {
    expect(readOnlyPackageRows([])).toEqual({ rows: [], unmapped: [] })
  })
})

describe('child tool roster', () => {
  it('releases roster entries so finished children never accumulate', () => {
    const roster = new ChildToolRoster()
    const child = SessionId('dsh-external-workflow-child-test')
    roster.reserve(child, ['read'])
    expect(roster.lookup(child)).toEqual(['read'])
    roster.release(child)
    expect(roster.lookup(child)).toBeUndefined()
  })

  it('leaves unreserved children untouched', () => {
    expect(new ChildToolRoster().lookup(SessionId('dsh-external-workflow-child-unrelated'))).toBeUndefined()
  })
})
