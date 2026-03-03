import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesCreateCommand: CommandDefinition = {
  name: 'subsequences_create',
  group: 'subsequences',
  subcommand: 'create',
  description: 'Create a new subsequence for a campaign. Requires JSON for conditions, schedule, and sequences.',
  examples: [
    'instantly subsequences create --campaign-id <id> --name "Follow-up" --conditions \'{"type":"reply"}\' --schedule \'{"delay_days":3}\' --sequences \'[{"steps":[]}]\'',
  ],

  inputSchema: z.object({
    parent_campaign: z.string().describe('Parent campaign ID'),
    name: z.string().describe('Subsequence name'),
    conditions: z.string().describe('Trigger conditions (JSON)'),
    subsequence_schedule: z.string().describe('Schedule config (JSON)'),
    sequences: z.string().describe('Email sequences (JSON array)'),
  }),

  cliMappings: {
    options: [
      { field: 'parent_campaign', flags: '--campaign-id <id>', description: 'Parent campaign ID' },
      { field: 'name', flags: '--name <name>', description: 'Subsequence name' },
      { field: 'conditions', flags: '--conditions <json>', description: 'Trigger conditions (JSON)' },
      { field: 'subsequence_schedule', flags: '--schedule <json>', description: 'Schedule config (JSON)' },
      { field: 'sequences', flags: '--sequences <json>', description: 'Sequences (JSON array)' },
    ],
  },

  endpoint: { method: 'POST', path: '/subsequences' },
  fieldMappings: { parent_campaign: 'body', name: 'body', conditions: 'body', subsequence_schedule: 'body', sequences: 'body' },

  handler: async (input, client) => {
    const body: Record<string, any> = {
      parent_campaign: input.parent_campaign,
      name: input.name,
      conditions: typeof input.conditions === 'string' ? JSON.parse(input.conditions) : input.conditions,
      subsequence_schedule: typeof input.subsequence_schedule === 'string' ? JSON.parse(input.subsequence_schedule) : input.subsequence_schedule,
      sequences: typeof input.sequences === 'string' ? JSON.parse(input.sequences) : input.sequences,
    };
    return client.post('/subsequences', body);
  },
};
