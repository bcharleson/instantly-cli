import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsTestAiCommand: CommandDefinition = {
  name: 'lead_labels_test_ai',
  group: 'lead-labels',
  subcommand: 'test-ai',
  description: 'Test AI reply label prediction. Simulates how AI auto-tagging would label an incoming reply.',
  examples: ['instantly lead-labels test-ai --reply-text "Yes, I\'m interested in learning more"'],

  inputSchema: z.object({
    reply_text: z.string().describe('The reply text to classify'),
  }),

  cliMappings: {
    options: [
      { field: 'reply_text', flags: '--reply-text <text>', description: 'Reply text to classify' },
    ],
  },

  endpoint: { method: 'POST', path: '/lead-labels/ai-reply-label' },
  fieldMappings: { reply_text: 'body' },
  handler: (input, client) => executeCommand(leadLabelsTestAiCommand, input, client),
};
