/** Tool name -> the official package whose composition mounts that tool. */
const TOOL_PACKAGE_BY_NAME = {
    read: '@deepseek-ai/dsh-tool-fs',
    read_image: '@deepseek-ai/dsh-tool-fs',
    glob: '@deepseek-ai/dsh-tool-fs-search',
    grep: '@deepseek-ai/dsh-tool-fs-search',
    skill: '@deepseek-ai/dsh-tool-skill',
    web_search: '@deepseek-ai/dsh-tool-web',
    lsp: '@deepseek-ai/dsh-tool-lsp',
};
/** Deduplicated package rows for one allow list, plus names with no mapping. */
export function readOnlyPackageRows(allow) {
    const packages = new Set();
    const unmapped = [];
    for (const tool of allow) {
        const pkg = TOOL_PACKAGE_BY_NAME[tool];
        if (pkg === undefined)
            unmapped.push(tool);
        else
            packages.add(pkg);
    }
    return { rows: [...packages].map(name => ({ name })), unmapped };
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
