/**
 * Tool name -> the official package row that mounts the tool. Packages whose
 * config schema declares required fields carry them here: dsh-tool-fs-search
 * requires sampleOverCapGlobResults with no fallback (E6 缺陷 #4), and the
 * official tool-catalog value is true.
 */
const TOOL_PACKAGE_BY_NAME = {
    read: { name: '@deepseek-ai/dsh-tool-fs' },
    read_image: { name: '@deepseek-ai/dsh-tool-fs' },
    glob: { name: '@deepseek-ai/dsh-tool-fs-search', config: { sampleOverCapGlobResults: true } },
    grep: { name: '@deepseek-ai/dsh-tool-fs-search', config: { sampleOverCapGlobResults: true } },
    skill: { name: '@deepseek-ai/dsh-tool-skill' },
    web_search: { name: '@deepseek-ai/dsh-tool-web' },
    lsp: { name: '@deepseek-ai/dsh-tool-lsp' },
};
/** Deduplicated package rows for one allow list, plus names with no mapping. */
export function readOnlyPackageRows(allow) {
    const byPackage = new Map();
    const unmapped = [];
    for (const tool of allow) {
        const row = TOOL_PACKAGE_BY_NAME[tool];
        if (row === undefined)
            unmapped.push(tool);
        else if (!byPackage.has(row.name))
            byPackage.set(row.name, row);
    }
    return { rows: [...byPackage.values()], unmapped };
}
/**
 * Per-task registration of reserved child ids pending the agent/created
 * restrict injection. reserve happens before activation; release at task
 * terminal state so the roster never accumulates finished runs.
 */
export class ChildToolRoster {
    entries = new Map();
    reserve(childId, allow) {
        this.entries.set(childId, allow);
    }
    lookup(childId) {
        return this.entries.get(childId);
    }
    release(childId) {
        this.entries.delete(childId);
    }
}
