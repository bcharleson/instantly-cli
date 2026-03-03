import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const blocklistGetCommand: CommandDefinition = {
  name: 'blocklist_get',
  group: 'blocklist',
  subcommand: 'get',
  description: 'Get a blocklist entry by ID.',
  examples: ['instantly blocklist get <entry-id>'],

  inputSchema: z.object({ id: z.string().describe('Blocklist entry ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/block-lists-entries/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(blocklistGetCommand, input, client),
};
