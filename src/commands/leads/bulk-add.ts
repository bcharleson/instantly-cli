import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';
import { ensureHtml } from '../../core/format.js';

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
    leads: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.record(z.string(), z.any())),
    ).describe('Array of lead objects with at least an email field'),
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

    // Auto-convert plain text email bodies to HTML in custom_variables
    // Fields like email_1_body, email_2_body, email_3_body need HTML for proper rendering
    for (const lead of leads) {
      if (lead.custom_variables && typeof lead.custom_variables === 'object') {
        for (const [key, value] of Object.entries(lead.custom_variables)) {
          if (key.includes('body') && typeof value === 'string' && value.length > 0) {
            lead.custom_variables[key] = ensureHtml(value);
          }
        }
      }
    }

    return executeCommand(leadsBulkAddCommand, { ...input, leads }, client);
  },
};
