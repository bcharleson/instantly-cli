import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailMarkReadCommand: CommandDefinition = {
  name: 'email_mark_read',
  group: 'email',
  subcommand: 'mark-read',
  description: 'Mark an email thread as read.',
  examples: ['instantly email mark-read <thread-id>'],

  inputSchema: z.object({
    thread_id: z.string().describe('Thread ID to mark as read'),
  }),

  cliMappings: {
    args: [{ field: 'thread_id', name: 'thread-id', required: true }],
  },

  endpoint: { method: 'POST', path: '/emails/threads/{thread_id}/mark-as-read' },
  fieldMappings: { thread_id: 'path' },
  handler: (input, client) => executeCommand(emailMarkReadCommand, input, client),
};
