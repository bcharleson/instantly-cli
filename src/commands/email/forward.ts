import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { ensureHtml } from '../../core/format.js';
import { InstantlyError } from '../../core/errors.js';

export const emailForwardCommand: CommandDefinition = {
  name: 'email_forward',
  group: 'email',
  subcommand: 'forward',
  description: 'Forward an email to another recipient. Pass --expect-from to validate the original sender before forwarding (recommended).',
  examples: [
    'instantly email forward --forward-uuid <id> --expect-from "lead@example.com" --eaccount "me@domain.com" --to "other@domain.com" --subject "Fwd: Hello"',
  ],

  inputSchema: z.object({
    forward_uuid: z.string().describe('ID of the email to forward'),
    eaccount: z.string().describe('Email account to send from'),
    to: z.string().describe('Recipient email address'),
    subject: z.string().describe('Email subject line'),
    expect_from: z.string().optional().describe('Expected original sender — validates against the thread before forwarding (recommended)'),
    body_text: z.string().optional().describe('Additional plain text body'),
    body_html: z.string().optional().describe('Additional HTML body'),
    skip_validation: z.boolean().optional().describe('Skip sender validation (not recommended)'),
  }),

  cliMappings: {
    options: [
      { field: 'forward_uuid', flags: '--forward-uuid <id>', description: 'Email ID to forward' },
      { field: 'expect_from', flags: '--expect-from <email>', description: 'Expected original sender (validates before forwarding)' },
      { field: 'eaccount', flags: '--eaccount <email>', description: 'Sending account email' },
      { field: 'to', flags: '--to <email>', description: 'Recipient email' },
      { field: 'subject', flags: '--subject <subject>', description: 'Subject line' },
      { field: 'body_text', flags: '--body-text <text>', description: 'Additional text body' },
      { field: 'body_html', flags: '--body-html <html>', description: 'Additional HTML body' },
      { field: 'skip_validation', flags: '--skip-validation', description: 'Skip sender validation' },
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
    const { body_text, body_html, expect_from, skip_validation, ...rest } = input;

    // Validate original sender if --expect-from is provided (unless --skip-validation)
    if (expect_from && !skip_validation) {
      const email = await client.get<Record<string, any>>(`/emails/${encodeURIComponent(input.forward_uuid)}`);
      const participants = extractParticipants(email);
      const expectNorm = expect_from.toLowerCase().trim();
      if (!participants.includes(expectNorm)) {
        throw new InstantlyError(
          `Sender mismatch — forward-uuid belongs to thread with "${participants.join(', ') || 'unknown'}" but --expect-from is "${expect_from}". Aborting to prevent forwarding the wrong thread.`,
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

    return client.post('/emails/forward', body);
  },
};

/** Extract all participant email addresses from an email object */
function extractParticipants(email: Record<string, any>): string[] {
  const participants: string[] = [];

  if (email.from_address_email) {
    participants.push(String(email.from_address_email).toLowerCase().trim());
  }
  if (email.to_address_email_list) {
    const addrs = typeof email.to_address_email_list === 'string'
      ? email.to_address_email_list.split(',')
      : Array.isArray(email.to_address_email_list) ? email.to_address_email_list : [];
    participants.push(...addrs.map((a: string) => a.toLowerCase().trim()));
  }
  if (email.lead_email) {
    participants.push(String(email.lead_email).toLowerCase().trim());
  }

  return [...new Set(participants)];
}
