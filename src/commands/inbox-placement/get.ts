import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementGetCommand: CommandDefinition = {
  name: 'inbox_placement_get',
  group: 'inbox-placement',
  subcommand: 'get',
  description: 'Get an inbox placement test by ID.',
  examples: ['instantly inbox-placement get <id>'],

  inputSchema: z.object({
    id: z.string().describe('Test ID'),
    with_metadata: z.boolean().optional().describe('Include metadata'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [{ field: 'with_metadata', flags: '--with-metadata', description: 'Include metadata' }],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-tests/{id}' },
  fieldMappings: { id: 'path', with_metadata: 'query' },
  handler: (input, client) => executeCommand(inboxPlacementGetCommand, input, client),
};
