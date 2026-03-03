import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsDeleteCommand: CommandDefinition = {
  name: 'campaigns_delete',
  group: 'campaigns',
  subcommand: 'delete',
  description: 'Delete a campaign by ID. This action cannot be undone.',
  examples: [
    'instantly campaigns delete <campaign-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID to delete'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/campaigns/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(campaignsDeleteCommand, input, client),
};
