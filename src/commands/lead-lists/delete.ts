import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsDeleteCommand: CommandDefinition = {
  name: 'lead_lists_delete',
  group: 'lead-lists',
  subcommand: 'delete',
  description: 'Delete a lead list by ID.',
  examples: ['instantly lead-lists delete <list-id>'],

  inputSchema: z.object({ id: z.string().describe('Lead list ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/lead-lists/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(leadListsDeleteCommand, input, client),
};
