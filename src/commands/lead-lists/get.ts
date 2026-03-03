import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsGetCommand: CommandDefinition = {
  name: 'lead_lists_get',
  group: 'lead-lists',
  subcommand: 'get',
  description: 'Get a lead list by ID.',
  examples: ['instantly lead-lists get <list-id>'],

  inputSchema: z.object({ id: z.string().describe('Lead list ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/lead-lists/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(leadListsGetCommand, input, client),
};
