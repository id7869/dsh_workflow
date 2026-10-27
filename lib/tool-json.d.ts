/**
 * Tool parameters declared `type: 'json'` are not parsed per argument by the
 * DSH tool layer (upstream gap, 09-排查报告 Finding A): a model may deliver
 * the value as a JSON string. Objects pass through; strings parse; a string
 * that is not valid JSON fails loudly instead of reaching capsule validation.
 *
 * The `type: 'object'` declaration on the tool parameters is the first line
 * of defense (the tool wrapper's validateArgs rejects string delivery before
 * execute); this coercion is the second line for callers that reach execute
 * directly — older DSH versions without the wrapper validation, tests, or
 * programmatic calls.
 */
export declare function coerceToolJson(value: unknown, label: string): unknown;
