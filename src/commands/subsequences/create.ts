import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { normalizeSequenceBodies, SEQUENCE_BODY_HINT } from '../../core/format.js';
import {
  SEQUENCE_DELAY_HINT,
  validateAndNormalizeSequences,
  withSequenceTimeline,
} from '../../core/sequences.js';

const SEQUENCE_FIELD_HINT = `${SEQUENCE_BODY_HINT} ${SEQUENCE_DELAY_HINT}`;

export const subsequencesCreateCommand: CommandDefinition = {
  name: 'subsequences_create',
  group: 'subsequences',
  subcommand: 'create',
  description:
    'Create a new subsequence for a campaign. Requires JSON for conditions, schedule, and sequences. ' +
    SEQUENCE_FIELD_HINT,
  examples: [
    'instantly subsequences create --campaign-id <id> --name "Follow-up" --conditions \'{"type":"reply"}\' --schedule \'{"delay_days":3}\' --sequences \'[{"steps":[{"type":"email","delay":0,"delay_unit":"days","variants":[{"subject":"Hi","body":"Hello"}]}]}]\'',
  ],

  inputSchema: z.object({
    parent_campaign: z.string().describe('Parent campaign ID'),
    name: z.string().describe('Subsequence name'),
    conditions: z.string().describe('Trigger conditions (JSON)'),
    subsequence_schedule: z.string().describe('Schedule config (JSON)'),
    sequences: z.string().describe(`Email sequences (JSON array). ${SEQUENCE_FIELD_HINT}`),
  }),

  cliMappings: {
    options: [
      { field: 'parent_campaign', flags: '--campaign-id <id>', description: 'Parent campaign ID' },
      { field: 'name', flags: '--name <name>', description: 'Subsequence name' },
      { field: 'conditions', flags: '--conditions <json>', description: 'Trigger conditions (JSON)' },
      { field: 'subsequence_schedule', flags: '--schedule <json>', description: 'Schedule config (JSON)' },
      { field: 'sequences', flags: '--sequences <json>', description: SEQUENCE_FIELD_HINT },
    ],
  },

  endpoint: { method: 'POST', path: '/subsequences' },
  fieldMappings: { parent_campaign: 'body', name: 'body', conditions: 'body', subsequence_schedule: 'body', sequences: 'body' },

  handler: async (input, client) => {
    const sequences = validateAndNormalizeSequences(
      typeof input.sequences === 'string' ? JSON.parse(input.sequences) : input.sequences,
      'subsequence',
    );
    const body: Record<string, any> = {
      parent_campaign: input.parent_campaign,
      name: input.name,
      conditions: typeof input.conditions === 'string' ? JSON.parse(input.conditions) : input.conditions,
      subsequence_schedule: typeof input.subsequence_schedule === 'string' ? JSON.parse(input.subsequence_schedule) : input.subsequence_schedule,
      sequences: normalizeSequenceBodies(sequences),
    };
    const created = await client.post('/subsequences', body);
    return withSequenceTimeline(created, sequences, 'subsequence');
  },
};
