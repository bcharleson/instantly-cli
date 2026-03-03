import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const blocklistUpdateCommand: CommandDefinition = {
  name: 'blocklist_update',
  group: 'blocklist',
  subcommand: 'update',
  description: 'Update a blocklist entry by ID. Change the blocked email or domain value.',
  examples: [
    'instantly blocklist update <entry-id> --value "newdomain.com"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Blocklist entry ID to update'),
    bl_value: z.string().optional().describe('New email or domain to block'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'bl_value', flags: '--value <email-or-domain>', description: 'Email or domain to block' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/block-lists-entries/{id}' },

  fieldMappings: {
    id: 'path',
    bl_value: 'body',
  },

  handler: (input, client) => executeCommand(blocklistUpdateCommand, input, client),
};
