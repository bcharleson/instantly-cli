import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsPauseCommand: CommandDefinition = {
  name: 'campaigns_pause',
  group: 'campaigns',
  subcommand: 'pause',
  description: 'Pause a running campaign. The campaign can be reactivated later.',
  examples: [
    'instantly campaigns pause <campaign-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID to pause'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'POST', path: '/campaigns/{id}/pause' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(campaignsPauseCommand, input, client),
};
