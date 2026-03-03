import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailUnreadCountCommand: CommandDefinition = {
  name: 'email_unread_count',
  group: 'email',
  subcommand: 'unread-count',
  description: 'Get the count of unread emails in Unibox.',
  examples: ['instantly email unread-count'],

  inputSchema: z.object({}),

  cliMappings: {},

  endpoint: { method: 'GET', path: '/emails/unread/count' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(emailUnreadCountCommand, input, client),
};
