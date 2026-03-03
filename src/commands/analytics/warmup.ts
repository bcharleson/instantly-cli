import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const analyticsWarmupCommand: CommandDefinition = {
  name: 'analytics_warmup',
  group: 'analytics',
  subcommand: 'warmup',
  description: 'Get warmup analytics for email accounts. Returns sent, landed inbox, landed spam, and health score.',
  examples: [
    'instantly analytics warmup --emails "user1@domain.com,user2@domain.com"',
  ],

  inputSchema: z.object({
    emails: z.string().describe('Comma-separated email addresses to get warmup analytics for'),
  }),

  cliMappings: {
    options: [
      { field: 'emails', flags: '--emails <emails>', description: 'Comma-separated email addresses' },
    ],
  },

  endpoint: { method: 'POST', path: '/accounts/warmup-analytics' },
  fieldMappings: { emails: 'body' },

  handler: async (input, client) => {
    const emails = typeof input.emails === 'string'
      ? input.emails.split(',').map((e: string) => e.trim())
      : input.emails;
    return client.post('/accounts/warmup-analytics', { emails });
  },
};
