import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsCreateCommand: CommandDefinition = {
  name: 'lead_lists_create',
  group: 'lead-lists',
  subcommand: 'create',
  description: 'Create a new lead list.',
  examples: ['instantly lead-lists create --name "Q1 Prospects"'],

  inputSchema: z.object({
    name: z.string().describe('Lead list name'),
  }),

  cliMappings: {
    options: [{ field: 'name', flags: '-n, --name <name>', description: 'List name (required)' }],
  },

  endpoint: { method: 'POST', path: '/lead-lists' },
  fieldMappings: { name: 'body' },
  handler: (input, client) => executeCommand(leadListsCreateCommand, input, client),
};
