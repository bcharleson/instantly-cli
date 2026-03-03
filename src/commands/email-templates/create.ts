import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailTemplatesCreateCommand: CommandDefinition = {
  name: 'email_templates_create',
  group: 'email-templates',
  subcommand: 'create',
  description: 'Create a new email template.',
  examples: ['instantly email-templates create --name "Welcome Email" --body "<p>Hello!</p>" --subject "Welcome"'],

  inputSchema: z.object({
    name: z.string().describe('Email template name'),
    body: z.string().describe('Email body in HTML or text format'),
    subject: z.string().optional().describe('Email template subject'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Email template name (required)' },
      { field: 'body', flags: '--body <html>', description: 'Email body in HTML or text format (required)' },
      { field: 'subject', flags: '--subject <subject>', description: 'Email template subject' },
    ],
  },

  endpoint: { method: 'POST', path: '/email-templates' },
  fieldMappings: { name: 'body', body: 'body', subject: 'body' },
  handler: (input, client) => executeCommand(emailTemplatesCreateCommand, input, client),
};
