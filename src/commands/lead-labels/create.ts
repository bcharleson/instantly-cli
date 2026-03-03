import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsCreateCommand: CommandDefinition = {
  name: 'lead_labels_create',
  group: 'lead-labels',
  subcommand: 'create',
  description: 'Create a new lead label for categorizing leads.',
  examples: ['instantly lead-labels create --label "Hot Lead" --interest-status positive'],

  inputSchema: z.object({
    label: z.string().describe('Display label'),
    interest_status_label: z.enum(['positive', 'negative', 'neutral']).describe('Interest status: positive, negative, or neutral'),
    description: z.string().optional().describe('Description of the label purpose'),
    use_with_ai: z.boolean().optional().describe('Use with AI features'),
  }),

  cliMappings: {
    options: [
      { field: 'label', flags: '--label <label>', description: 'Label name (required)' },
      { field: 'interest_status_label', flags: '--interest-status <status>', description: 'Interest status (required)' },
      { field: 'description', flags: '--description <text>', description: 'Label description' },
      { field: 'use_with_ai', flags: '--use-with-ai', description: 'Enable for AI features' },
    ],
  },

  endpoint: { method: 'POST', path: '/lead-labels' },
  fieldMappings: { label: 'body', interest_status_label: 'body', description: 'body', use_with_ai: 'body' },
  handler: (input, client) => executeCommand(leadLabelsCreateCommand, input, client),
};
