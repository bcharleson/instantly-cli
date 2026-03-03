import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementUpdateCommand: CommandDefinition = {
  name: 'inbox_placement_update',
  group: 'inbox-placement',
  subcommand: 'update',
  description: 'Update an inbox placement test.',
  examples: ['instantly inbox-placement update <id> --name "Updated Test"'],

  inputSchema: z.object({
    id: z.string().describe('Test ID'),
    name: z.string().optional().describe('Test name'),
    status: z.coerce.number().optional().describe('Test status'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Test name' },
      { field: 'status', flags: '--status <status>', description: 'Test status' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/inbox-placement-tests/{id}' },
  fieldMappings: { id: 'path', name: 'body', status: 'body' },
  handler: (input, client) => executeCommand(inboxPlacementUpdateCommand, input, client),
};
