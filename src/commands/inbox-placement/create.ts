import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const inboxPlacementCreateCommand: CommandDefinition = {
  name: 'inbox_placement_create',
  group: 'inbox-placement',
  subcommand: 'create',
  description: 'Create an inbox placement test. Send test emails to check deliverability.',
  examples: [
    'instantly inbox-placement create --name "Q1 Test" --type 0 --sending-method 0 --subject "Test" --body "Hello" --emails "seed1@test.com,seed2@test.com"',
  ],

  inputSchema: z.object({
    name: z.string().describe('Test name'),
    type: z.coerce.number().describe('Test type (0=one-time, 1=automated)'),
    sending_method: z.coerce.number().describe('Sending method (0=from Instantly, 1=external)'),
    email_subject: z.string().describe('Email subject'),
    email_body: z.string().describe('Email body'),
    emails: z.string().describe('Comma-separated seed emails'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Test name' },
      { field: 'type', flags: '--type <type>', description: '0=one-time, 1=automated' },
      { field: 'sending_method', flags: '--sending-method <method>', description: '0=Instantly, 1=external' },
      { field: 'email_subject', flags: '--subject <subject>', description: 'Email subject' },
      { field: 'email_body', flags: '--body <body>', description: 'Email body' },
      { field: 'emails', flags: '--emails <emails>', description: 'Seed emails (comma-separated)' },
    ],
  },

  endpoint: { method: 'POST', path: '/inbox-placement-tests' },
  fieldMappings: { name: 'body', type: 'body', sending_method: 'body', email_subject: 'body', email_body: 'body', emails: 'body' },

  handler: async (input, client) => {
    const emailList = typeof input.emails === 'string' ? input.emails.split(',').map((e: string) => e.trim()) : input.emails;
    return client.post('/inbox-placement-tests', {
      name: input.name,
      type: input.type,
      sending_method: input.sending_method,
      email_subject: input.email_subject,
      email_body: input.email_body,
      emails: emailList,
    });
  },
};
