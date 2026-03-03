import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsUpdateCommand: CommandDefinition = {
  name: 'lead_lists_update',
  group: 'lead-lists',
  subcommand: 'update',
  description: 'Update a lead list.',
  examples: ['instantly lead-lists update <list-id> --name "Updated Name"'],

  inputSchema: z.object({
    id: z.string().describe('Lead list ID'),
    name: z.string().optional().describe('New list name'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [{ field: 'name', flags: '-n, --name <name>', description: 'New name' }],
  },

  endpoint: { method: 'PATCH', path: '/lead-lists/{id}' },
  fieldMappings: { id: 'path', name: 'body' },
  handler: (input, client) => executeCommand(leadListsUpdateCommand, input, client),
};
