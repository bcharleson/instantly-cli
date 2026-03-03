import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const blocklistCreateCommand: CommandDefinition = {
  name: 'blocklist_create',
  group: 'blocklist',
  subcommand: 'create',
  description: 'Add an email or domain to the blocklist.',
  examples: [
    'instantly blocklist create --value "spam@domain.com"',
    'instantly blocklist create --value "baddomain.com"',
  ],

  inputSchema: z.object({
    bl_value: z.string().describe('Email or domain to block'),
  }),

  cliMappings: {
    options: [{ field: 'bl_value', flags: '--value <email-or-domain>', description: 'Email or domain to block' }],
  },

  endpoint: { method: 'POST', path: '/block-lists-entries' },
  fieldMappings: { bl_value: 'body' },
  handler: (input, client) => executeCommand(blocklistCreateCommand, input, client),
};
