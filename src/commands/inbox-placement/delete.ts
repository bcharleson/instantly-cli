import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementDeleteCommand: CommandDefinition = {
  name: 'inbox_placement_delete',
  group: 'inbox-placement',
  subcommand: 'delete',
  description: 'Delete an inbox placement test.',
  examples: ['instantly inbox-placement delete <id>'],

  inputSchema: z.object({ id: z.string().describe('Test ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/inbox-placement-tests/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(inboxPlacementDeleteCommand, input, client),
};
