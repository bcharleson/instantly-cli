import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const campaignsBulkPauseCommand: CommandDefinition = {
  name: 'campaigns_bulk-pause',
  group: 'campaigns',
  subcommand: 'bulk-pause',
  description: 'Pause multiple campaigns at once. Pass campaign IDs as a comma-separated list or JSON array.',
  examples: [
    'instantly campaigns bulk-pause --ids "id1,id2,id3"',
    'instantly campaigns bulk-pause --ids \'["id1","id2","id3"]\'',
  ],

  inputSchema: z.object({
    ids: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch { return val.split(',').map((s: string) => s.trim()); }
        }
        return val;
      },
      z.array(z.string()).min(1).describe('Campaign IDs to pause'),
    ),
  }),

  cliMappings: {
    options: [
      { field: 'ids', flags: '--ids <ids>', description: 'Comma-separated or JSON array of campaign IDs' },
    ],
  },

  endpoint: { method: 'POST', path: '/campaigns/{id}/pause' },
  fieldMappings: {},

  handler: async (input, client) => {
    const results: Array<{ id: string; status: string; error?: string }> = [];
    for (const id of input.ids) {
      try {
        await client.post(`/campaigns/${encodeURIComponent(id)}/pause`);
        results.push({ id, status: 'paused' });
      } catch (err: any) {
        results.push({ id, status: 'failed', error: err.message ?? String(err) });
      }
    }
    return results;
  },
};
