import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsBulkAddCommand: CommandDefinition = {
  name: 'leads_bulk_add',
  group: 'leads',
  subcommand: 'bulk-add',
  description: 'Add leads in bulk to a campaign or list. Accepts a JSON array of lead objects via --leads flag or stdin.',
  examples: [
    'instantly leads bulk-add --campaign-id <id> --leads \'[{"email":"a@b.com"},{"email":"c@d.com"}]\'',
    'cat leads.json | instantly leads bulk-add --campaign-id <id> --leads -',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Campaign ID to add leads to'),
    list_id: z.string().optional().describe('Lead list ID to add leads to'),
    leads: z.array(z.record(z.string(), z.any())).describe('Array of lead objects with at least an email field'),
    skip_if_in_workspace: z.boolean().optional().describe('Skip leads already in workspace'),
    skip_if_in_campaign: z.boolean().optional().describe('Skip leads already in this campaign'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Lead list ID' },
      { field: 'leads', flags: '--leads <json>', description: 'JSON array of lead objects' },
      { field: 'skip_if_in_workspace', flags: '--skip-if-in-workspace', description: 'Skip existing leads' },
      { field: 'skip_if_in_campaign', flags: '--skip-if-in-campaign', description: 'Skip leads in campaign' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads/add' },

  fieldMappings: {
    campaign_id: 'body',
    list_id: 'body',
    leads: 'body',
    skip_if_in_workspace: 'body',
    skip_if_in_campaign: 'body',
  },

  handler: async (input, client) => {
    // Parse leads from JSON string if needed
    let leads = input.leads;
    if (typeof leads === 'string') {
      leads = JSON.parse(leads);
    }
    return executeCommand(leadsBulkAddCommand, { ...input, leads }, client);
  },
};
