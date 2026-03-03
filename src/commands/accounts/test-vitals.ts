import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsTestVitalsCommand: CommandDefinition = {
  name: 'accounts_test_vitals',
  group: 'accounts',
  subcommand: 'test-vitals',
  description: 'Test account vitals (DNS, SMTP, IMAP connectivity) for an email account. Returns diagnostic results.',
  examples: [
    'instantly accounts test-vitals <account-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Account ID to test'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'POST', path: '/accounts/{id}/test-vitals' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(accountsTestVitalsCommand, input, client),
};
