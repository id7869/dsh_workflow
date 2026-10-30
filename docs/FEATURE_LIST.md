# Feature List

## Version Info

- Current Release: v0.2.3
- Planned Version: none
- Last Updated: 2026-10-30

## Version Summary

| Version | Status | Progress |
| --- | --- | ---: |
| v0.2.3 | Complete | 1/1 |
| v0.2.2 | Complete | 2/2 |
| v0.2.1 | Complete | 1/1 |
| v0.2.0 | Complete | 2/2 |
| v0.1.2 | Complete | 1/1 |
| v0.1.1 | Complete | 1/1 |
| v0.1.0 | Complete | 1/1 |

## Feature Index

| ID | Title | Category | Priority | Status | Released |
| --- | --- | --- | --- | --- | --- |
| 001 | KodaX-parity workflow orchestration | New | Critical | Complete | v0.1.0 |
| 002 | Visible workflow handoff and session title integration | Fix | High | Complete | v0.1.1 |
| 003 | Reliable handoff preflight and background lifecycle projection | Fix | Critical | Complete | v0.1.2 |
| 004 | DSH 0.2.1-rc.2 compatibility upgrade | Upgrade | Critical | Complete | v0.2.0 |
| 005 | Read-only sub-agent security via dynamic tool composition | New | Critical | Complete | v0.2.0 |
| 006 | DSH 0.2.1-rc.3 compatibility realignment | Upgrade | High | Complete | v0.2.1 |
| 007 | Tool-entry JSON coercion for string-delivered parameters | Fix | Critical | Complete | v0.2.2 |
| 008 | Approval degradation to the user confirm card on unavailable | Fix | Critical | Complete | v0.2.2 |
| 009 | DSH 0.2.1-rc.5 compatibility realignment | Upgrade | High | Complete | v0.2.3 |

## Feature Details

### FEATURE_001: KodaX-parity workflow orchestration

- Description: Add the complete reusable/generated/governed workflow layer above DSH native harness primitives.
- Category: New
- Priority: Critical
- Status: Complete
- Released: v0.1.0 (2026-08-13)

### FEATURE_002: Visible workflow handoff and session title integration

- Description: Preserve the exact `/workflow` query as a visible human Session message while keeping internal authoring guidance in plugin context, so DSH title and Workspace surfaces can identify the session.
- Category: Fix
- Priority: High
- Status: Complete
- Released: v0.1.1 (2026-08-13)

### FEATURE_003: Reliable handoff preflight and background lifecycle projection

- Description: Validate command-authored child inputs before consuming the handoff grant, and keep background workflow UI state live until a real terminal event.
- Category: Fix
- Priority: Critical
- Status: Complete
- Released: v0.1.2 (2026-08-13)

### FEATURE_004: DSH 0.2.1-rc.2 compatibility upgrade

- Description: Migrate every runtime call surface to the DSH 0.2.1-rc.2 official semantics (subagents.startActivation with reserved child ids, snapshotEvents session reads, self-declared dsh-external-workflow message sources, session-owned background jobs, command-execution attachments, tool-result message shape) and rebuild the compatibility gate on the installed app.asar fingerprint plus official npm artifact assertions with twin tamper guards.
- Category: Upgrade
- Priority: Critical
- Status: Complete
- Released: v0.2.0 (2026-10-23)

### FEATURE_005: Read-only sub-agent security via dynamic tool composition

- Description: Read-only children compose a per-task dynamic agent preset derived from the parent-intersected allow-list and receive a name-level tool restrict before their first prompt, preserving the read-only guarantee on the 0.2.1 preset-composition model; providers without independent composition fail loudly.
- Category: New
- Priority: Critical
- Status: Complete
- Released: v0.2.0 (2026-10-23)

### FEATURE_006: DSH 0.2.1-rc.3 compatibility realignment

- Description: Repin every DSH peer and dev dependency to 0.2.1-rc.3 and refresh the compatibility gate (target, source tag, pins, npm artifact integrity, testedAt) after the desktop runtime updated to rc.3. The rc.2→rc.3 source diff over the 24 contact-surface packages is version-line-only, so the rc.2-verified call surfaces carry over unchanged; the documented DSH-upgrade realignment procedure was executed end to end.
- Category: Upgrade
- Priority: High
- Status: Complete
- Released: v0.2.1 (2026-10-26)

### FEATURE_007: Tool-entry JSON coercion for string-delivered parameters

- Description: run_workflow's manifest/args and workflow_manage's args, declared type:'json', are not parsed per argument by the DSH tool layer (upstream gap), so models that double-encode them as strings reached capsule validation raw and failed with "manifest must be an object". The tool entry now coerces: objects pass through, JSON strings parse, and non-JSON strings fail loudly with the parameter named.
- Category: Fix
- Priority: Critical
- Status: Complete
- Released: v0.2.2 (2026-10-27)

### FEATURE_008: Approval degradation to the user confirm card on unavailable

- Description: When the approval seam fail-closes with `unavailable` (no answerer covers callId-less pre-start requests in the deployment), a capability-generated workflow now degrades to the same user-questions confirm card trusted-local workflows use. Deterministic refusals (rejected, cancelled, policy never) never degrade — they deny directly, preserving the seam's audit trail and strict headless stance.
- Category: Fix
- Priority: Critical
- Status: Complete
- Released: v0.2.2 (2026-10-27)

### FEATURE_009: DSH 0.2.1-rc.5 compatibility realignment

- Description: Repin every DSH peer and dev dependency to 0.2.1-rc.5 and refresh the compatibility gate (target, source tag, pins, npm artifact integrity, testedAt) after the desktop runtime updated to rc.5. The rc.3→rc.5 source diff over the 12 peer contact-surface packages is version-line-only, so the rc.3-verified call surfaces carry over unchanged; the documented DSH-upgrade realignment procedure was executed end to end.
- Category: Upgrade
- Priority: High
- Status: Complete
- Released: v0.2.3 (2026-10-30)

## Summary

- Total: 9
- In Progress: 0
- Planned: 0
- Completed: 9
