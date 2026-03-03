import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsCreateCommand: CommandDefinition = {
  name: 'accounts_create',
  group: 'accounts',
  subcommand: 'create',
  description: 'Create a new email account via SMTP/IMAP credentials.',
  examples: [
    'instantly accounts create --email "user@domain.com" --smtp-host "smtp.domain.com" --smtp-port 587 --smtp-username "user" --smtp-password "pass" --imap-host "imap.domain.com" --imap-port 993 --imap-username "user" --imap-password "pass"',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address for the account'),
    first_name: z.string().optional().describe('Sender first name'),
    last_name: z.string().optional().describe('Sender last name'),
    smtp_host: z.string().describe('SMTP server host'),
    smtp_port: z.coerce.number().describe('SMTP server port'),
    smtp_username: z.string().describe('SMTP username'),
    smtp_password: z.string().describe('SMTP password'),
    imap_host: z.string().describe('IMAP server host'),
    imap_port: z.coerce.number().describe('IMAP server port'),
    imap_username: z.string().describe('IMAP username'),
    imap_password: z.string().describe('IMAP password'),
    daily_limit: z.coerce.number().optional().describe('Daily sending limit'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '-e, --email <email>', description: 'Email address' },
      { field: 'first_name', flags: '--first-name <name>', description: 'Sender first name' },
      { field: 'last_name', flags: '--last-name <name>', description: 'Sender last name' },
      { field: 'smtp_host', flags: '--smtp-host <host>', description: 'SMTP host' },
      { field: 'smtp_port', flags: '--smtp-port <port>', description: 'SMTP port' },
      { field: 'smtp_username', flags: '--smtp-username <user>', description: 'SMTP username' },
      { field: 'smtp_password', flags: '--smtp-password <pass>', description: 'SMTP password' },
      { field: 'imap_host', flags: '--imap-host <host>', description: 'IMAP host' },
      { field: 'imap_port', flags: '--imap-port <port>', description: 'IMAP port' },
      { field: 'imap_username', flags: '--imap-username <user>', description: 'IMAP username' },
      { field: 'imap_password', flags: '--imap-password <pass>', description: 'IMAP password' },
      { field: 'daily_limit', flags: '--daily-limit <limit>', description: 'Daily sending limit' },
    ],
  },

  endpoint: { method: 'POST', path: '/accounts' },

  fieldMappings: {
    email: 'body',
    first_name: 'body',
    last_name: 'body',
    smtp_host: 'body',
    smtp_port: 'body',
    smtp_username: 'body',
    smtp_password: 'body',
    imap_host: 'body',
    imap_port: 'body',
    imap_username: 'body',
    imap_password: 'body',
    daily_limit: 'body',
  },

  handler: (input, client) => executeCommand(accountsCreateCommand, input, client),
};
