import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailTemplatesUpdateCommand: CommandDefinition = {
  name: 'email_templates_update',
  group: 'email-templates',
  subcommand: 'update',
  description: 'Update an email template.',
  examples: ['instantly email-templates update <template-id> --name "Updated Template" --subject "New Subject"'],

  inputSchema: z.object({
    id: z.string().describe('Email template ID'),
    name: z.string().optional().describe('Email template name'),
    body: z.string().optional().describe('Email body in HTML or text format'),
    subject: z.string().optional().describe('Email template subject'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Email template name' },
      { field: 'body', flags: '--body <html>', description: 'Email body in HTML or text format' },
      { field: 'subject', flags: '--subject <subject>', description: 'Email template subject' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/email-templates/{id}' },
  fieldMappings: { id: 'path', name: 'body', body: 'body', subject: 'body' },
  handler: (input, client) => executeCommand(emailTemplatesUpdateCommand, input, client),
};
