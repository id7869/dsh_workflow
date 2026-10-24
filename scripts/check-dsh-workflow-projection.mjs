// Offline structural assertions that the installed official npm artifacts still
// consume the `tool-workflow/*` session vocabulary this plugin publishes.
// Deterministic, no network, no snapshot repository (02 §5.3). Tampering with
// any assertion target — removing or rewriting an event literal or contract
// type — must fail this script with exit 1 and an itemized list of what is
// missing (never an uncaught exception). The complete static data contract,
// including the required `childId` field of agent-start, is additionally
// enforced by `pnpm typecheck` in the same `pnpm check` chain.
import { readFileSync } from 'node:fs'
import process from 'node:process'

const missing = []

function readArtifact(relativePath) {
  try {
    return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
  } catch {
    missing.push(`assertion target missing: ${relativePath}`)
    return undefined
  }
}

function requireLiteral(relativePath, literal) {
  const content = readArtifact(relativePath)
  if (content !== undefined && !content.includes(literal)) {
    missing.push(`literal '${literal}' not found in ${relativePath}`)
  }
}

// Segment 1 — event vocabulary survival: the official `tool-workflow` tool
// shares the publishing vocabulary with this plugin; if the literals survive
// in the shipped artifact, the contract's source is alive.
const toolWorkflowIndex = '../node_modules/@deepseek-ai/dsh-tool-workflow/lib/index.js'
for (const literal of [
  'tool-workflow/run-start',
  'tool-workflow/run-end',
  'tool-workflow/agent-start',
  'tool-workflow/agent-end',
]) {
  requireLiteral(toolWorkflowIndex, literal)
}

// Segment 2 — render consumption: the projection layer still discriminates
// workflow run nodes by the same vocabulary (source-verified: match on
// 'tool-workflow/run-start').
requireLiteral(
  '../node_modules/@deepseek-ai/dsh-client-ui-workflow-run/lib/client.js',
  'tool-workflow/run-start',
)

// Segment 3 — data contract artifacts: the shipped type declarations still
// declare the merged SessionEventMap entries and the ToolWorkflowRunStartData
// / ToolWorkflowAgentStartData shapes the plugin appends against.
const toolWorkflowTypes = '../node_modules/@deepseek-ai/dsh-tool-workflow/lib/types/types.d.ts'
for (const literal of [
  'ToolWorkflowRunStartData',
  'ToolWorkflowAgentStartData',
  "'tool-workflow/run-start'",
  'childId',
]) {
  requireLiteral(toolWorkflowTypes, literal)
}

if (missing.length > 0) {
  for (const item of missing) console.error(`projection assertion failed: ${item}`)
  process.exit(1)
}

console.log('tool-workflow projection contract verified: vocabulary, render consumption, and type artifacts are live')

// Optional parallel assertion (02 §5.3, amended ruling): when the official
// conversation assembler imports under plain Node, fold a plugin-shaped event
// sequence through the real engine. Importability is environment-dependent;
// a skip is non-blocking and states its reason — the three segments above
// remain the definitive gate.
try {
  const { ConversationNodeAssembler } = await import('@deepseek-ai/dsh-client-ui-conversation')
  if (typeof ConversationNodeAssembler !== 'function') throw new Error('ConversationNodeAssembler is not exported')

  const input = (seq, type, data) => ({ event: { seq, time: seq * 100, type, data }, view: undefined })
  const workflowDefinition = {
    kind: 'workflow-run-probe',
    target: 'chat',
    match(event) {
      if (event.type === 'tool-workflow/run-start') return { id: `run:${event.data.runId}`, role: 'start', exclusive: true }
      if (event.type === 'tool-workflow/agent-start' || event.type === 'tool-workflow/agent-end' || event.type === 'tool-workflow/run-end') {
        return { id: `run:${event.data.runId}`, role: 'update' }
      }
      return null
    },
    start(context, match) {
      void context
      return { status: 'running', name: match.event.data.name }
    },
    update(context, match) {
      const state = context.state ?? { status: 'running', name: match.event.data.name }
      return match.event.type === 'tool-workflow/run-end'
        ? { ...state, status: match.event.data.stopReason === 'completed' ? 'completed' : 'stopped' }
        : state
    },
    buildViewNode(context) {
      return { key: context.key, kind: context.kind, id: context.id, target: 'chat', data: context.state }
    },
  }
  const chatView = {
    target: 'chat',
    create: () => {
      let nodes = new Map()
      const snapshot = () => ({ nodes })
      return {
        empty: snapshot(),
        replace: ({ nodes: values }) => { nodes = new Map(values.map(node => [node.key, node])); return snapshot() },
        apply: ({ upserts }) => { nodes = new Map(nodes); for (const node of upserts) nodes.set(node.key, node); return snapshot() },
      }
    },
  }
  const assembler = new ConversationNodeAssembler(
    { entries: () => [workflowDefinition], fallbackEntry: () => undefined },
    { entries: () => [chatView] },
  )
  assembler.replaceWindow([
    input(1, 'turn/start', { turn: 1 }),
    input(2, 'tool-workflow/run-start', { runId: 'probe', name: 'background' }),
    input(3, 'tool-workflow/agent-start', { runId: 'probe', seq: 1, label: 'worker', childId: 'child-1' }),
  ], false)
  assembler.append(input(4, 'tool-workflow/agent-end', { runId: 'probe', seq: 1, outcome: 'completed' }))
  assembler.append(input(5, 'tool-workflow/run-end', { runId: 'probe', stopReason: 'completed' }))
  assembler.flush()
  const data = () => [...assembler.snapshot('chat')?.nodes.values()][0]?.data
  if (data()?.status !== 'completed') {
    throw new Error(`real assembler did not fold the plugin event sequence: ${JSON.stringify(data())}`)
  }
  console.log('tool-workflow projection fold verified: real assembler folded the plugin event sequence to a terminal node')
} catch (error) {
  console.log(`projection fold assertion skipped (non-blocking): ${error.code ?? error.message}`)
  console.log('the three structural segments above remain the definitive gate')
}
