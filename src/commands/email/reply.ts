import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailReplyCommand: CommandDefinition = {
  name: 'email_reply',
  group: 'email',
  subcommand: 'reply',
  description: 'Send a reply to an email. Requires the email ID to reply to and the sending account.',
  examples: [
    'instantly email reply --reply-to-uuid <id> --eaccount "user@domain.com" --subject "Re: Hello" --body-text "Thanks!"',
  ],

  inputSchema: z.object({
    reply_to_uuid: z.string().describe('ID of the email to reply to'),
    eaccount: z.string().describe('Email account to send from'),
    subject: z.string().describe('Email subject line'),
    body_text: z.string().optional().describe('Plain text email body'),
    body_html: z.string().optional().describe('HTML email body'),
    cc_address_email_list: z.string().optional().describe('Comma-separated CC addresses'),
    bcc_address_email_list: z.string().optional().describe('Comma-separated BCC addresses'),
  }),

  cliMappings: {
    options: [
      { field: 'reply_to_uuid', flags: '--reply-to-uuid <id>', description: 'Email ID to reply to' },
      { field: 'eaccount', flags: '--eaccount <email>', description: 'Sending account email' },
      { field: 'subject', flags: '--subject <subject>', description: 'Subject line' },
      { field: 'body_text', flags: '--body-text <text>', description: 'Plain text body' },
      { field: 'body_html', flags: '--body-html <html>', description: 'HTML body' },
      { field: 'cc_address_email_list', flags: '--cc <emails>', description: 'CC addresses' },
      { field: 'bcc_address_email_list', flags: '--bcc <emails>', description: 'BCC addresses' },
    ],
  },

  endpoint: { method: 'POST', path: '/emails/reply' },
  fieldMappings: {
    reply_to_uuid: 'body',
    eaccount: 'body',
    subject: 'body',
    body_text: 'body',
    body_html: 'body',
    cc_address_email_list: 'body',
    bcc_address_email_list: 'body',
  },

  handler: async (input, client) => {
    const { body_text, body_html, ...rest } = input;
    const body: Record<string, any> = { ...rest };
    if (body_text || body_html) {
      body.body = {};
      if (body_text) body.body.text = body_text;
      if (body_html) body.body.html = body_html;
    }
    return client.post('/emails/reply', body);
  },
};
