/**
 * S+R child tool composition (02b): the tool-name → package-row mapping for
 * the dynamic per-run read-only preset, plus the roster that backs the
 * agent/created restrict injection. The allow list itself is evaluated at task
 * start by resolveReadOnlyToolFilter (engine.ts, unchanged single source of
 * truth), so both the mounted package rows and the injected restrict come from
 * the same parent-intersected list.
 */
import type { SessionId } from '@deepseek-ai/dsh-session';
/** One cordis entry row mounting an official tool package (default config). */
export interface WorkflowToolPackageRow {
    readonly name: string;
}
/** Deduplicated package rows for one allow list, plus names with no mapping. */
export declare function readOnlyPackageRows(allow: readonly string[]): {
    readonly rows: readonly WorkflowToolPackageRow[];
    readonly unmapped: readonly string[];
};
/**
 * Per-task registration of reserved child ids pending the agent/created
 * restrict injection. reserve happens before activation; release at task
 * terminal state so the roster never accumulates finished runs.
 */
export declare class ChildToolRoster {
    private readonly entries;
    reserve(childId: SessionId, allow: readonly string[]): void;
    lookup(childId: SessionId): readonly string[] | undefined;
    release(childId: SessionId): void;
}
