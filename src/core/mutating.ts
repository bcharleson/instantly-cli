import type { CommandDefinition } from './types.js';

/**
 * POST endpoints that only read or preview data. Everything else that is not
 * GET is treated as a write and requires `--workspace` when a profile is set.
 */
const READ_ONLY_POST_COMMANDS = new Set([
  'leads_list',
  'analytics_warmup',
  'enrichment_count',
  'enrichment_preview',
  'inbox_placement_analytics_insights',
  'inbox_placement_analytics_stats_by_date',
  'inbox_placement_analytics_stats_by_test',
  'lead_labels_test_ai',
]);

export function isMutatingCommand(cmdDef: CommandDefinition): boolean {
  if (cmdDef.mutating === true) return true;
  if (cmdDef.mutating === false) return false;
  const method = cmdDef.endpoint.method;
  if (method === 'GET') return false;
  if (method === 'PATCH' || method === 'DELETE') return true;
  if (method === 'POST' && READ_ONLY_POST_COMMANDS.has(cmdDef.name)) return false;
  return method === 'POST';
}
