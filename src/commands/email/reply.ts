import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { ensureHtml } from '../../core/format.js';
import { InstantlyError } from '../../core/errors.js';

export const emailReplyCommand: CommandDefinition = {
  name: 'email_reply',
  group: 'email',
  subcommand: 'reply',
  description: 'Send a reply to an email. Pass --to to validate the recipient before sending (recommended to prevent replying to the wrong person).',
  examples: [
    'instantly email reply --reply-to-uuid <id> --to "lead@example.com" --eaccount "me@domain.com" --subject "Re: Hello" --body-text "Thanks!"',
    'instantly email reply --reply-to-uuid <id> --eaccount "me@domain.com" --subject "Re: Hello" --body-text "Thanks!" --skip-validation',
  ],

  inputSchema: z.object({
    reply_to_uuid: z.string().describe('ID of the email to reply to'),
    eaccount: z.string().describe('Email account to send from'),
    subject: z.string().describe('Email subject line'),
    to: z.string().optional().describe('Expected recipient email — validates against the thread before sending (recommended)'),
    body_text: z.string().optional().describe('Plain text email body'),
    body_html: z.string().optional().describe('HTML email body'),
    cc_address_email_list: z.string().optional().describe('Comma-separated CC addresses'),
    bcc_address_email_list: z.string().optional().describe('Comma-separated BCC addresses'),
    skip_validation: z.boolean().optional().describe('Skip recipient validation (not recommended)'),
  }),

  cliMappings: {
    options: [
      { field: 'reply_to_uuid', flags: '--reply-to-uuid <id>', description: 'Email ID to reply to' },
      { field: 'to', flags: '--to <email>', description: 'Expected recipient (validates before sending)' },
      { field: 'eaccount', flags: '--eaccount <email>', description: 'Sending account email' },
      { field: 'subject', flags: '--subject <subject>', description: 'Subject line' },
      { field: 'body_text', flags: '--body-text <text>', description: 'Plain text body' },
      { field: 'body_html', flags: '--body-html <html>', description: 'HTML body' },
      { field: 'cc_address_email_list', flags: '--cc <emails>', description: 'CC addresses' },
      { field: 'bcc_address_email_list', flags: '--bcc <emails>', description: 'BCC addresses' },
      { field: 'skip_validation', flags: '--skip-validation', description: 'Skip recipient validation' },
    ],
  },

  endpoint: { method: 'POST', path: '/emails/reply' },
  fieldMappings: {
    reply_to_uuid: 'body',
    eaccount: 'body',
    subject: 'body',
    to: 'body',
    body_text: 'body',
    body_html: 'body',
    cc_address_email_list: 'body',
    bcc_address_email_list: 'body',
  },

  handler: async (input, client) => {
    const { body_text, body_html, to, skip_validation, ...rest } = input;

    // Validate recipient if --to is provided (unless --skip-validation)
    if (to && !skip_validation) {
      const email = await client.get<Record<string, any>>(`/emails/${encodeURIComponent(input.reply_to_uuid)}`);
      const threadRecipients = extractRecipients(email);
      const toNorm = to.toLowerCase().trim();
      if (!threadRecipients.includes(toNorm)) {
        throw new InstantlyError(
          `Recipient mismatch — reply-to-uuid belongs to "${threadRecipients.join(', ') || 'unknown'}" but --to is "${to}". Aborting to prevent sending to the wrong person.`,
          'VALIDATION_ERROR',
        );
      }
    }

    // Build the request body (exclude validation-only fields)
    const body: Record<string, any> = { ...rest };
    if (body_text || body_html) {
      body.body = {};
      if (body_text) body.body.text = body_text;
      // Auto-generate HTML from plain text if no HTML body provided
      body.body.html = body_html ?? ensureHtml(body_text);
    }

    const result = await client.post<Record<string, any>>('/emails/reply', body);

    // Attach confirmation metadata so the caller knows who received the reply
    if (to) {
      (result as any).__confirmed_recipient = to;
    }
    return result;
  },
};

/** Extract all recipient email addresses from an email object */
function extractRecipients(email: Record<string, any>): string[] {
  const recipients: string[] = [];

  // Check common Instantly email response fields
  if (email.to_address_email_list) {
    const addrs = typeof email.to_address_email_list === 'string'
      ? email.to_address_email_list.split(',')
      : Array.isArray(email.to_address_email_list) ? email.to_address_email_list : [];
    recipients.push(...addrs.map((a: string) => a.toLowerCase().trim()));
  }
  if (email.lead_email) {
    recipients.push(String(email.lead_email).toLowerCase().trim());
  }
  if (email.from_address_email && email.i_sent !== true) {
    // If the email was received (not sent by us), the from_address is the lead
    recipients.push(String(email.from_address_email).toLowerCase().trim());
  }

  // Deduplicate
  return [...new Set(recipients)];
}
