# DSH Workflow

`@dsh-external/workflow` turns DeepSeek Harness's one-off multi-agent execution into a reusable, governed, observable, and resumable workflow layer. It independently implements the complete workflow capability model demonstrated by KodaX while integrating with DSH's Cordis services, subagent providers, tool restrictions, approval flow, Session log, background jobs, commands, and native workflow events.

[中文 README](README.md) · [KodaX parity matrix](docs/KODAX_PARITY.md) · [Configuration](docs/CONFIGURATION.md) · [Security](docs/SECURITY.md)

## Why it matters to DSH

DSH already provides strong harness primitives. This plugin composes them into durable workflow assets:

| One-off orchestration | DSH Workflow |
| --- | --- |
| Re-describe decomposition every turn | Save project or personal named workflows |
| Results live only in chat | Durable run graph, events, artifacts, summary, and cost |
| Restart after interruption | Snapshot rerun and effect-cache resume |
| Prompt-level limits | Manifest, preflight, token reservation, concurrency and agent caps |
| Generated scripts are hard to govern | Capability VM, JSON boundary, deterministic guards, approval classes |
| Multi-agent work is a technique | Multi-agent work becomes a shareable engineering asset |

The native DSH `workflow` tool remains the best fit for a single foreground fan-out. This plugin is the reusable process layer above it.

## What's new in 0.2.0 (2026-10-23)

A full compatibility upgrade to DSH 0.2.1-rc.2, accepted against the real runtime:

- **Runtime surface migration**: child spawning moved to `subagents.startActivation` (`delivery: 'caller'` with reserved child ids), session event reads to `snapshotEvents()`, a self-declared `dsh-external-workflow` message source, session-owned background jobs, the command-execution attachments argument, and tool-result evidence on the new message shape — all aligned with the official 0.2.1 call semantics.
- **Read-only sub-agent security**: a read-only task now composes a dedicated dynamic agent preset at task start and injects an equal-strength tool restrict before the child's first prompt, preserving the parent-intersected allow-list semantics (see the [safety model](#safety-model)); providers without independent composition fail loudly.
- **Acceptance**: 187/187 tests green; the compatibility gate (asar fingerprint pins plus tool-workflow projection assertions with twin tamper guards) exits 0; and a real-runtime E2E — four parallel investigators completing with real model usage and cost records.
- **Install prerequisite**: non-registry first installs (git/tarball/`file:`) need the `allowBuilds` key in the profile's `pnpm-workspace.yaml`; see the note in [Install](#install).

See [CHANGELOG](CHANGELOG.md) for the itemized changes and evidence.

## Install

Requires Node.js `>=22.19` and the DSH revision pinned in [`compatibility.json`](compatibility.json).

```sh
dsh plugin --profile web add "github:dsh-external/dsh_workflow#main"
dsh --profile web --dump-config
```

> First-time installs from non-registry forms (git source, tarball, `file:` path) hit the build-approval gate of the DSH-bundled pnpm fork (`[ERR_PNPM_IGNORED_BUILDS]`, exit 1 — even though this package ships no install scripts). Copy the exact `allowBuilds` key printed in that error into the profile's `pnpm-workspace.yaml` (for example `~/.dsh/profiles/web/pnpm-workspace.yaml`) and re-run the install command. The key follows the install spec; a `file:` install uses `'@dsh-external/workflow@file:<tarball path>'`.

Restart the profile, then try:

```text
/workflow list
/workflow parallel-investigation {"question":"Why is this test flaky?"}
/workflow create Design a reusable parallel security review for this repository
/workflow review --risk high --requirement "preserve the public API" --test-evidence "pnpm test passed" --wait
/workflow runs
```

The model-facing surface is `workflow_list`, `run_workflow`, and `workflow_manage`.

Workflow starts return `{ runId, status, jobId? }` immediately by default so a long process does not occupy the current turn. Commands that support waiting accept `--wait`; tool input uses `wait: true`. `/workflow create <request>` and free-text requests are handed to the current Agent and therefore reject `--wait`. `/workflow show` defaults to the latest run and `/workflow stop` defaults to the active run.

## Capability surface

- Strict `dsh.workflow` v1 capsules carrying manifest, source, intent, inputs, requirements, and provenance.
- `async function run(wf, args)` with phase, agent spawn/run/wait/snapshot/output/send/stop, parallel, pipeline, synthesis, one-level nesting, artifacts, logging, and budget visibility.
- `runAgent` returns `null` for ordinary terminal child failure so workflows can degrade intentionally, while `wait` on an explicit handle retains the complete failure. Required object schemas get exactly one same-route, tool-free repair when native structured capture is absent and fail explicitly if still invalid.
- Per-agent scope, constraints, read-only policy, provider/subagent type, fast/balanced/deep routing, explicit model, isolation, token allocation, evidence, verification, structured output, and terse results.
- Deterministic project/personal discovery, trusted-local approval, save/archive/rename/revise/delete, immutable run snapshots, cached resume, retention, and identity ambiguity checks.
- Two concrete built-ins, including packet-based scoped review with strict schemas, read contracts, a second high-risk primary, per-finding verification, and an audit artifact; plus all six KodaX workflow patterns. Public `writeReviewPackets()` creates content-addressed, non-overwriting packet/evidence files from caller-captured diff, requirements, and test evidence. `/workflow review` captures Git scope and launches that built-in without requiring a patched DSH core `/review` command.
- Stable ProcessSnapshot, WorkflowOutcome, and AgentResult projections with progress, explicit unverified outcomes, verification evidence, routes, usage, artifacts, and replay origin.
- Durable lifecycle controls through service APIs, tools, `/workflow`, DSH background jobs, and native `tool-workflow/*` Session events.
- Scout-then-author generation with structured output, a three-attempt repair loop, source policy, quality lint, preflight, and approval.
- `/workflow create <request>` and free-text `/workflow <request>` return from the command plane immediately and hand explicit Workflow intent to the current Agent, matching KodaX's Worker-owned scout-then-author path. The exact user query is delivered as a human Session message, so it is visible in chat, feeds DSH title generation, and identifies the session in its Workspace; the authoring contract is delivered separately as collapsed plugin context. The Agent investigates with its normal tools and then calls `run_workflow` with `source + manifest`, so authoring cannot strand the UI in `command/run`. The exact handed-off message grants one inline start once, after a pre-launch smoke run validates the same child-task contract used by the engine. Invalid authored fields (for example a `modelHint` outside `fast | balanced | deep`) fail before a real child starts and leave the same-turn grant available for a corrected retry. Internal relays, later direct user messages, and repeated valid calls cannot reuse it, while tool-produced scouting context does not revoke it by accident. `approvalMode: always` and trusted-local gates remain enforced. In DSH Web's manual-order view, Workspace groups with more than five sessions collapse the remainder; expand the group or choose Last updated to promote active sessions.
- Dynamic workflow starts are session-scoped native events. A background workflow therefore stays `running` when its launching tool step or Agent turn closes, and only its actual `tool-workflow/run-end` projects completion, failure, or cancellation instead of a false interruption.

See the [complete parity contract](docs/KODAX_PARITY.md) for the evidence-backed capability matrix. The implementation references behavior only and does not copy KodaX's source-available code.

## Safety model

Generated scripts run in a separate QuickJS WebAssembly heap. The host exposes only a JSON capability bridge; imports, process/filesystem/shell/network access, timers, nondeterministic clock/randomness, and non-JSON boundary values are rejected. CPU slices, wall time, memory, and stack are bounded, and wall timeout closes the bridge and aborts the run.

Read-only execution dynamically intersects the parent Agent's visible catalog with a trusted allow-list, so unknown or newly added mutation tools are excluded by default: read-only children compose a per-task agent preset derived from that list, and an agent/created listener injects the same-strength tool restrict before the first prompt. Read evidence, successful mutation-tool plus Git-workspace change evidence, required changed paths, final-text checks, and bounded same-actor repair are built in. Deployments can add non-Git workspace evidence, worktrees, and target/effort dispatch through public adapter registrations; unsupported requests fail loudly.

## Development

The compatibility baseline is the local DSH desktop install (app.asar runtime fingerprint plus official npm artifact assertions); no source snapshot checkout is required. The standard install path resolves automatically, or set `DSH_ASAR_PATH` to point elsewhere.

```sh
pnpm install
pnpm check
pnpm test:coverage
pnpm pack
```

The suite currently contains 187 tests and enforces 80% global statement, branch, function, and line coverage thresholds. The compatibility target is recorded in [`compatibility.json`](compatibility.json); after a DSH upgrade, `pnpm run check:compatibility` fails by design — realign that file before releasing again.

## Known limitations

- Trusted-local `.ts` uses Node 22's native erasable-syntax TypeScript support and Node's module cache (restart DSH after edits); publish transform-only syntax or hot-reloaded modules as `.mjs/.js`.
- The current DSH one-shot subagent seam has no native existing-agent target, per-agent effort, or generic worktree option. Deployments register dispatch/isolation adapters; absent adapters fail loudly.
- Built-in verification covers observed tool/read evidence, Git workspace mutation, per-required-path before/after fingerprints, and result postconditions; non-Git or external-authority policies register a verification adapter.
- Only generated capsule runs carry immutable source snapshots that can be saved/rerun from history.
- KodaX capsules are not treated as wire-compatible with `dsh.workflow` v1.

## License

MIT. See [LICENSE](LICENSE).
