import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const blocklistDeleteCommand: CommandDefinition = {
  name: 'blocklist_delete',
  group: 'blocklist',
  subcommand: 'delete',
  description: 'Remove an entry from the blocklist.',
  examples: ['instantly blocklist delete <entry-id>'],

  inputSchema: z.object({ id: z.string().describe('Blocklist entry ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/block-lists-entries/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(blocklistDeleteCommand, input, client),
};
