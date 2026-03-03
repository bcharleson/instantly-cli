import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailUpdateCommand: CommandDefinition = {
  name: 'email_update',
  group: 'email',
  subcommand: 'update',
  description: 'Update an email by ID. Supports marking as read/unread and setting reminders.',
  examples: [
    'instantly email update <email-id> --is-unread 0',
    'instantly email update <email-id> --reminder-ts "2026-03-10T10:00:00.000Z"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Email ID to update'),
    is_unread: z.coerce.number().optional().describe('Mark as unread (1) or read (0)'),
    reminder_ts: z.string().optional().describe('Reminder timestamp (ISO 8601 format, or null to clear)'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'is_unread', flags: '--is-unread <value>', description: 'Mark as unread (1) or read (0)' },
      { field: 'reminder_ts', flags: '--reminder-ts <timestamp>', description: 'Reminder timestamp (ISO 8601)' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/emails/{id}' },

  fieldMappings: {
    id: 'path',
    is_unread: 'body',
    reminder_ts: 'body',
  },

  handler: (input, client) => executeCommand(emailUpdateCommand, input, client),
};
