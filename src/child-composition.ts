/**
 * S+R child tool composition (02b): the tool-name → package-row mapping for
 * the dynamic per-run read-only preset, plus the roster that backs the
 * agent/created restrict injection. The allow list itself is evaluated at task
 * start by resolveReadOnlyToolFilter (engine.ts, unchanged single source of
 * truth), so both the mounted package rows and the injected restrict come from
 * the same parent-intersected list.
 */
import type { SessionId } from '@deepseek-ai/dsh-session'

/** One cordis entry row mounting an official tool package (default config). */
export interface WorkflowToolPackageRow {
  readonly name: string
}

/** Tool name -> the official package whose composition mounts that tool. */
const TOOL_PACKAGE_BY_NAME: Readonly<Record<string, string>> = {
  read: '@deepseek-ai/dsh-tool-fs',
  read_image: '@deepseek-ai/dsh-tool-fs',
  glob: '@deepseek-ai/dsh-tool-fs-search',
  grep: '@deepseek-ai/dsh-tool-fs-search',
  skill: '@deepseek-ai/dsh-tool-skill',
  web_search: '@deepseek-ai/dsh-tool-web',
  lsp: '@deepseek-ai/dsh-tool-lsp',
}

/** Deduplicated package rows for one allow list, plus names with no mapping. */
export function readOnlyPackageRows(allow: readonly string[]): { readonly rows: readonly WorkflowToolPackageRow[]; readonly unmapped: readonly string[] } {
  const packages = new Set<string>()
  const unmapped: string[] = []
  for (const tool of allow) {
    const pkg = TOOL_PACKAGE_BY_NAME[tool]
    if (pkg === undefined) unmapped.push(tool)
    else packages.add(pkg)
  }
  return { rows: [...packages].map(name => ({ name })), unmapped }
}

/**
 * Per-task registration of reserved child ids pending the agent/created
 * restrict injection. reserve happens before activation; release at task
 * terminal state so the roster never accumulates finished runs.
 */
export class ChildToolRoster {
  private readonly entries = new Map<SessionId, readonly string[]>()

  reserve(childId: SessionId, allow: readonly string[]): void {
    this.entries.set(childId, allow)
  }

  lookup(childId: SessionId): readonly string[] | undefined {
    return this.entries.get(childId)
  }

  release(childId: SessionId): void {
    this.entries.delete(childId)
  }
}
