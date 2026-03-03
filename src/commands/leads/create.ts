import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsCreateCommand: CommandDefinition = {
  name: 'leads_create',
  group: 'leads',
  subcommand: 'create',
  description: 'Create a single lead. Requires an email and either a campaign ID or list ID.',
  examples: [
    'instantly leads create --email "john@acme.com" --campaign-id <id>',
    'instantly leads create --email "john@acme.com" --campaign-id <id> --first-name "John" --last-name "Doe"',
  ],

  inputSchema: z.object({
    email: z.string().describe('Lead email address'),
    campaign_id: z.string().optional().describe('Campaign ID to add lead to'),
    list_id: z.string().optional().describe('Lead list ID to add lead to'),
    first_name: z.string().optional().describe('Lead first name'),
    last_name: z.string().optional().describe('Lead last name'),
    company_name: z.string().optional().describe('Lead company name'),
    website: z.string().optional().describe('Lead website URL'),
    phone: z.string().optional().describe('Lead phone number'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '-e, --email <email>', description: 'Email address (required)' },
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Lead list ID' },
      { field: 'first_name', flags: '--first-name <name>', description: 'First name' },
      { field: 'last_name', flags: '--last-name <name>', description: 'Last name' },
      { field: 'company_name', flags: '--company-name <name>', description: 'Company name' },
      { field: 'website', flags: '--website <url>', description: 'Website URL' },
      { field: 'phone', flags: '--phone <phone>', description: 'Phone number' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads' },

  fieldMappings: {
    email: 'body',
    campaign_id: 'body',
    list_id: 'body',
    first_name: 'body',
    last_name: 'body',
    company_name: 'body',
    website: 'body',
    phone: 'body',
  },

  handler: (input, client) => executeCommand(leadsCreateCommand, input, client),
};
