# Changelog

## [Unreleased]

### Fixed

- Dynamic child presets are now registered under the exact id the activation request references as `agentPreset`. The id was previously minted per request while the registration site used a random name, so every read-only and repair child failed at spawn with `Unknown agent preset`. Test doubles now mirror the runtime preset-registry validation (an unregistered `agentPreset` fails the activation stub), and the read-only name→package mapping and child roster gained a dedicated unit spec.
- `check:compatibility` fails with a one-line diagnostic (exit 1) when the asar archive or `DSH_ASAR_PATH` target cannot be opened, instead of an uncaught stack trace.
- Documented the DSH-bundled pnpm fork's `allowBuilds` prerequisite for non-registry installs (git, tarball, `file:`) in both READMEs.

### Changed

- Compatibility target upgraded to DSH `0.2.1-rc.2` (desktop build `332895e0`): all `@deepseek-ai/*` peers and dev dependencies pinned to the exact runtime versions.
- Task spawning migrated to the 0.2.1 `subagents.startActivation` contract (`delivery: 'caller'`); live child Agents resolve from the host agents registry, and message sources declare a dedicated `dsh-external-workflow` kind.
- Read-only child tooling now composes a per-task agent preset derived from the parent-intersected allow-list and injects an equal-strength tool restrict before the child's first prompt (provider `agentPreset` capability gate; fail-loud preserved). Structured-output repair children compose an empty tool composition.
- The reference mechanism no longer needs a source snapshot checkout: `check:compatibility` verifies the local app.asar runtime fingerprint plus official npm artifact structure assertions (event vocabulary, render consumption, type artifacts), with tamper detection on both scripts. `DSH_ASAR_PATH` overrides the standard install path.
- Session event reads migrated to `snapshotEvents()`; tool/result evidence reads the 0.2.1 message-level `toolCallId`/`isError`; `commands.execute` gained the submitted-attachments argument; background-job owners are session ids.
- `skipLibCheck` enabled: official npm artifact declarations are no longer full-file checked (one shipped d.ts is internally inconsistent); plugin-own resolution and usage checking is unchanged.

---

## [0.1.2] - 2026-08-13

### Fixed

- Smoke-validate command-authored inline workflows with the engine's shared child-task and deterministic admission contract before consuming the one-shot handoff grant. Invalid metadata, input schemas, read-only/agent/token limits (including concurrent reservations), provider capabilities/adapters, nested workflows, and concurrency now fail before any child starts, and the current Agent can correct the source in the same turn without falling into a disabled approval prompt.
- Publish dynamic workflow starts as session-scoped native events so a background run remains `running` after its launching tool step or turn closes; only the matching terminal `tool-workflow/run-end` decides completion, failure, or cancellation.
- State the exact `modelHint` values (`fast`, `balanced`, `deep`) in both workflow-authoring prompts.

---

## [0.1.1] - 2026-08-13

### Fixed

- Preserve the original `/workflow` query as a visible human Session message so DSH can render it, generate a session title, and identify the conversation in its Workspace.
- Keep workflow authoring instructions in separate plugin context while retaining exact one-shot approval semantics.
- Document DSH Web's manual-order five-session collapse and the “Last updated” view workaround.

---

## [0.1.0] - 2026-08-13

### Added

- Initial KodaX-parity dynamic workflow layer for DeepSeek Harness.

<!-- last-sync: f6cef1442dca3a47e1b132741b599a2d4bdbc8b8 -->
