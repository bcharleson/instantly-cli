import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsUpdateCommand: CommandDefinition = {
  name: 'lead_labels_update',
  group: 'lead-labels',
  subcommand: 'update',
  description: 'Update a lead label.',
  examples: ['instantly lead-labels update <label-id> --label "Updated Label"'],

  inputSchema: z.object({
    id: z.string().describe('Lead label ID'),
    label: z.string().optional().describe('New display label'),
    interest_status_label: z.enum(['positive', 'negative', 'neutral']).optional().describe('Interest status: positive, negative, or neutral'),
    description: z.string().optional().describe('New description'),
    use_with_ai: z.boolean().optional().describe('Use with AI features'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'label', flags: '--label <label>', description: 'Label name' },
      { field: 'interest_status_label', flags: '--interest-status <status>', description: 'Interest status' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'use_with_ai', flags: '--use-with-ai', description: 'Enable for AI features' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/lead-labels/{id}' },
  fieldMappings: { id: 'path', label: 'body', interest_status_label: 'body', description: 'body', use_with_ai: 'body' },
  handler: (input, client) => executeCommand(leadLabelsUpdateCommand, input, client),
};
