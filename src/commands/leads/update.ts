import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsUpdateCommand: CommandDefinition = {
  name: 'leads_update',
  group: 'leads',
  subcommand: 'update',
  description: 'Update a lead by ID. Supports updating name, company, phone, website, interest status, assignment, and custom variables.',
  examples: [
    'instantly leads update <lead-id> --first-name "Jane" --last-name "Smith"',
    'instantly leads update <lead-id> --company-name "Acme Inc" --website "https://acme.com"',
    'instantly leads update <lead-id> --assigned-to <user-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Lead ID to update'),
    first_name: z.string().optional().describe('First name of the lead'),
    last_name: z.string().optional().describe('Last name of the lead'),
    company_name: z.string().optional().describe('Company name of the lead'),
    website: z.string().optional().describe('Website of the lead'),
    phone: z.string().optional().describe('Phone number of the lead'),
    personalization: z.string().optional().describe('Personalization of the lead'),
    lt_interest_status: z.coerce.number().optional().describe('Lead interest status value'),
    pl_value_lead: z.string().optional().describe('Potential value of the lead'),
    assigned_to: z.string().optional().describe('User ID to assign the lead to'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'first_name', flags: '--first-name <name>', description: 'First name' },
      { field: 'last_name', flags: '--last-name <name>', description: 'Last name' },
      { field: 'company_name', flags: '--company-name <name>', description: 'Company name' },
      { field: 'website', flags: '--website <url>', description: 'Website URL' },
      { field: 'phone', flags: '--phone <phone>', description: 'Phone number' },
      { field: 'personalization', flags: '--personalization <text>', description: 'Personalization text' },
      { field: 'lt_interest_status', flags: '--interest-status <status>', description: 'Interest status value' },
      { field: 'pl_value_lead', flags: '--pl-value <value>', description: 'Potential lead value' },
      { field: 'assigned_to', flags: '--assigned-to <user-id>', description: 'Assign to user ID' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/leads/{id}' },

  fieldMappings: {
    id: 'path',
    first_name: 'body',
    last_name: 'body',
    company_name: 'body',
    website: 'body',
    phone: 'body',
    personalization: 'body',
    lt_interest_status: 'body',
    pl_value_lead: 'body',
    assigned_to: 'body',
  },

  handler: (input, client) => executeCommand(leadsUpdateCommand, input, client),
};
