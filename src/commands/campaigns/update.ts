import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsUpdateCommand: CommandDefinition = {
  name: 'campaigns_update',
  group: 'campaigns',
  subcommand: 'update',
  description: 'Update an existing campaign. Pass the fields you want to change.',
  examples: [
    'instantly campaigns update <campaign-id> --name "Updated Name"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID'),
    name: z.string().optional().describe('New campaign name'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '-n, --name <name>', description: 'New campaign name' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/campaigns/{id}' },
  fieldMappings: { id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(campaignsUpdateCommand, input, client),
};
