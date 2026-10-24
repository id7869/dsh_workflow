import { SessionId } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { ChildToolRoster, readOnlyPackageRows } from '../src/child-composition.js'

describe('read-only tool name to package row mapping', () => {
  it('maps every default read-only tool name to an official package row, deduplicated', () => {
    // The seven names of the default readOnlyAllowedTools configuration.
    const plan = readOnlyPackageRows(['read', 'read_image', 'glob', 'grep', 'skill', 'web_search', 'lsp'])
    expect(plan.unmapped).toEqual([])
    expect(plan.rows).toEqual([
      { name: '@deepseek-ai/dsh-tool-fs' },
      { name: '@deepseek-ai/dsh-tool-fs-search', config: { sampleOverCapGlobResults: true } },
      { name: '@deepseek-ai/dsh-tool-skill' },
      { name: '@deepseek-ai/dsh-tool-web' },
      { name: '@deepseek-ai/dsh-tool-lsp' },
    ])
  })

  it('supplies the schema-required fs-search config on the glob/grep package row', () => {
    for (const tool of ['glob', 'grep']) {
      expect(readOnlyPackageRows([tool]).rows).toEqual([
        { name: '@deepseek-ai/dsh-tool-fs-search', config: { sampleOverCapGlobResults: true } },
      ])
    }
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
