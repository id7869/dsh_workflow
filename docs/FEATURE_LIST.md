# Feature List

## Version Info

- Current Release: v0.2.0
- Planned Version: none
- Last Updated: 2026-10-23

## Version Summary

| Version | Status | Progress |
| --- | --- | ---: |
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

## Summary

- Total: 5
- In Progress: 0
- Planned: 0
- Completed: 5
