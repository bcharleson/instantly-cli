import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

/** Map friendly interest status names to API numeric values */
const INTEREST_STATUS_MAP: Record<string, number> = {
  'out_of_office': 0,
  'ooo': 0,
  'interested': 1,
  'meeting_booked': 2,
  'meeting_completed': 3,
  'won': 4,
  'not_interested': -1,
  'wrong_person': -2,
  'lost': -3,
  'no_show': -4,
};

const VALID_NAMES = Object.keys(INTEREST_STATUS_MAP).filter(k => !['ooo'].includes(k));
const VALID_NUMBERS = [...new Set(Object.values(INTEREST_STATUS_MAP))].sort((a, b) => a - b);

function resolveInterestStatus(value: string): number {
  // Try as a number first
  const num = Number(value);
  if (!isNaN(num) && VALID_NUMBERS.includes(num)) {
    return num;
  }
  // Try as a friendly name (case-insensitive, allow spaces or dashes)
  const normalized = value.toLowerCase().trim().replace(/[\s-]+/g, '_');
  const mapped = INTEREST_STATUS_MAP[normalized];
  if (mapped !== undefined) {
    return mapped;
  }
  throw new Error(
    `Invalid interest status "${value}". Valid values: ${VALID_NAMES.join(', ')} (or numeric: ${VALID_NUMBERS.join(', ')})`,
  );
}

export const leadsUpdateInterestStatusCommand: CommandDefinition = {
  name: 'leads_update_interest_status',
  group: 'leads',
  subcommand: 'update-interest-status',
  description: 'Update the interest status of a lead. Accepts friendly names (interested, not_interested, won, lost, etc.) or numeric codes.',
  examples: [
    'instantly leads update-interest-status --lead-id <id> --interest-status interested',
    'instantly leads update-interest-status --lead-id <id> --interest-status not_interested',
    'instantly leads update-interest-status --lead-id <id> --interest-status meeting_booked',
    'instantly leads update-interest-status --lead-id <id> --interest-status 1',
  ],

  inputSchema: z.object({
    lead_id: z.string().describe('ID of the lead to update'),
    interest_status: z.string().describe('Interest status: interested (1), not_interested (-1), meeting_booked (2), meeting_completed (3), won (4), wrong_person (-2), lost (-3), no_show (-4), out_of_office (0)'),
  }),

  cliMappings: {
    options: [
      { field: 'lead_id', flags: '--lead-id <id>', description: 'Lead ID' },
      { field: 'interest_status', flags: '--interest-status <status>', description: 'interested, not_interested, meeting_booked, won, lost, etc.' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/leads/{lead_id}' },

  fieldMappings: {
    lead_id: 'path',
  },

  handler: async (input, client) => {
    const statusNumber = resolveInterestStatus(input.interest_status);
    return client.patch(`/leads/${encodeURIComponent(input.lead_id)}`, {
      lt_interest_status: statusNumber,
    });
  },
};
