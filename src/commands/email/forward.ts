import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';
import { ensureHtml } from '../../core/format.js';

export const emailForwardCommand: CommandDefinition = {
  name: 'email_forward',
  group: 'email',
  subcommand: 'forward',
  description: 'Forward an email to another recipient.',
  examples: [
    'instantly email forward --forward-uuid <id> --eaccount "user@domain.com" --to "other@domain.com" --subject "Fwd: Hello"',
  ],

  inputSchema: z.object({
    forward_uuid: z.string().describe('ID of the email to forward'),
    eaccount: z.string().describe('Email account to send from'),
    to: z.string().describe('Recipient email address'),
    subject: z.string().describe('Email subject line'),
    body_text: z.string().optional().describe('Additional plain text body'),
    body_html: z.string().optional().describe('Additional HTML body'),
  }),

  cliMappings: {
    options: [
      { field: 'forward_uuid', flags: '--forward-uuid <id>', description: 'Email ID to forward' },
      { field: 'eaccount', flags: '--eaccount <email>', description: 'Sending account email' },
      { field: 'to', flags: '--to <email>', description: 'Recipient email' },
      { field: 'subject', flags: '--subject <subject>', description: 'Subject line' },
      { field: 'body_text', flags: '--body-text <text>', description: 'Additional text body' },
      { field: 'body_html', flags: '--body-html <html>', description: 'Additional HTML body' },
    ],
  },

  endpoint: { method: 'POST', path: '/emails/forward' },
  fieldMappings: {
    forward_uuid: 'body',
    eaccount: 'body',
    to: 'body',
    subject: 'body',
    body_text: 'body',
    body_html: 'body',
  },

  handler: async (input, client) => {
    const { body_text, body_html, ...rest } = input;
    const body: Record<string, any> = { ...rest };
    if (body_text || body_html) {
      body.body = {};
      if (body_text) body.body.text = body_text;
      // Auto-generate HTML from plain text if no HTML body provided
      body.body.html = body_html ?? ensureHtml(body_text);
    }
    return client.post('/emails/forward', body);
  },
};
