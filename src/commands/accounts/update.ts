import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsUpdateCommand: CommandDefinition = {
  name: 'accounts_update',
  group: 'accounts',
  subcommand: 'update',
  description: 'Update an email account. Modify settings like daily sending limit, warmup config, tracking domain, and more.',
  examples: [
    'instantly accounts update user@example.com --daily-limit 50',
    'instantly accounts update user@example.com --first-name "John" --last-name "Doe"',
    'instantly accounts update user@example.com --tracking-domain-name "track.example.com"',
    'instantly accounts update user@example.com --sending-gap 10',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address of the account to update'),
    first_name: z.string().optional().describe('First name associated with the account'),
    last_name: z.string().optional().describe('Last name associated with the account'),
    daily_limit: z.coerce.number().optional().describe('Daily email sending limit'),
    tracking_domain_name: z.string().optional().describe('Tracking domain'),
    tracking_domain_status: z.string().optional().describe('Tracking domain status'),
    enable_slow_ramp: z.boolean().optional().describe('Whether to enable slow ramp up for sending limits'),
    inbox_placement_test_limit: z.coerce.number().optional().describe('The limit for inbox placement tests'),
    sending_gap: z.coerce.number().min(0).max(1440).optional().describe('Gap between emails in minutes (0-1440)'),
    signature: z.string().optional().describe('Email signature for the account'),
    skip_cname_check: z.boolean().optional().describe('Skip CNAME check for tracking domain'),
    remove_tracking_domain: z.boolean().optional().describe('Remove the tracking domain from the account'),
  }),

  cliMappings: {
    args: [{ field: 'email', name: 'email', required: true }],
    options: [
      { field: 'first_name', flags: '--first-name <name>', description: 'First name' },
      { field: 'last_name', flags: '--last-name <name>', description: 'Last name' },
      { field: 'daily_limit', flags: '--daily-limit <number>', description: 'Daily sending limit' },
      { field: 'tracking_domain_name', flags: '--tracking-domain-name <domain>', description: 'Tracking domain' },
      { field: 'tracking_domain_status', flags: '--tracking-domain-status <status>', description: 'Tracking domain status' },
      { field: 'enable_slow_ramp', flags: '--enable-slow-ramp', description: 'Enable slow ramp up' },
      { field: 'inbox_placement_test_limit', flags: '--inbox-placement-test-limit <number>', description: 'Inbox placement test limit' },
      { field: 'sending_gap', flags: '--sending-gap <minutes>', description: 'Gap between emails in minutes (0-1440)' },
      { field: 'signature', flags: '--signature <text>', description: 'Email signature' },
      { field: 'skip_cname_check', flags: '--skip-cname-check', description: 'Skip CNAME check' },
      { field: 'remove_tracking_domain', flags: '--remove-tracking-domain', description: 'Remove tracking domain' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/accounts/{email}' },

  fieldMappings: {
    email: 'path',
    first_name: 'body',
    last_name: 'body',
    daily_limit: 'body',
    tracking_domain_name: 'body',
    tracking_domain_status: 'body',
    enable_slow_ramp: 'body',
    inbox_placement_test_limit: 'body',
    sending_gap: 'body',
    signature: 'body',
    skip_cname_check: 'body',
    remove_tracking_domain: 'body',
  },

  handler: (input, client) => executeCommand(accountsUpdateCommand, input, client),
};
