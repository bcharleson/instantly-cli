import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailVerificationVerifyCommand: CommandDefinition = {
  name: 'email_verification_verify',
  group: 'email-verification',
  subcommand: 'verify',
  description: 'Verify an email address. Optionally provide a webhook URL for async results.',
  examples: [
    'instantly email-verification verify --email "john@example.com"',
    'instantly email-verification verify --email "john@example.com" --webhook-url "https://example.com/hook"',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address to verify'),
    webhook_url: z.string().optional().describe('Webhook URL for async results'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '--email <email>', description: 'Email to verify (required)' },
      { field: 'webhook_url', flags: '--webhook-url <url>', description: 'Webhook for async results' },
    ],
  },

  endpoint: { method: 'POST', path: '/email-verification' },
  fieldMappings: { email: 'body', webhook_url: 'body' },
  handler: (input, client) => executeCommand(emailVerificationVerifyCommand, input, client),
};
