# Changelog

## [0.2.2] - 2026-10-27

### Fixed

- Tool parameters declared `type: 'json'` (`manifest`, `args` on `run_workflow`, and `args` on `workflow_manage`) are now coerced at the tool entry: objects pass through, a JSON string is parsed, and a string that is not valid JSON fails loudly with the parameter named. The DSH tool layer does not parse `type: 'json'` per argument (upstream gap), so models that double-encode these values as strings previously reached capsule validation raw and failed with `manifest must be an object`.
- A capability-generated workflow whose approval request fail-closes with `unavailable` (deployments where no approval answerer covers callId-less pre-start requests) now degrades to the same user-questions confirm card trusted-local workflows use. Deterministic refusals (`rejected`, `cancelled`, policy `never`) never degrade — they deny directly, preserving the approval seam's audit trail and strict headless stance.

## [0.2.1] - 2026-10-26

### Changed

- Compatibility target realigned to DSH `0.2.1-rc.3` (source tag `dsh-v0.2.1-rc.3`, commit `1f81c047`): all `@deepseek-ai/dsh-*` peers and dev dependencies re-pinned, and `compatibility.json` target, pins, npm artifact integrity hashes, and `testedAt` updated. Zero source changes — the rc.2→rc.3 diff over the 24 contact-surface packages is version-line-only, so every rc.2-verified call surface carries over unchanged (the documented DSH-upgrade realignment procedure, executed for real).

## [Unreleased]

### Fixed

- Version metadata now derives from the shipped manifests instead of stale literals: `pluginVersion` reads the package version and `dshVersion` reads the recorded compatibility target, so capsule provenance, run runtime metadata, and the capsule `minDshVersion` gate can no longer drift below the real values. A guard spec pins both against `package.json` and `compatibility.json`.
- Read-only package rows now carry explicit plugin config for packages whose schema requires it: `dsh-tool-fs-search` declares `sampleOverCapGlobResults` required with no fallback (official tool-catalog value `true`), so a bare row failed every child at the composition mount. Row type gained an optional `config` field; test doubles mirror the mount validation, and an engine spec with a glob/grep-capable parent exercises the fs-search row end to end.
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
