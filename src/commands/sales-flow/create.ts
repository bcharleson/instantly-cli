import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const salesFlowCreateCommand: CommandDefinition = {
  name: 'sales_flow_create',
  group: 'sales-flow',
  subcommand: 'create',
  description: 'Create a new sales flow.',
  examples: ['instantly sales-flow create --name "My Sales Flow" --queries \'[{"actionType":"email-open","values":{"occurrence-days":1}}]\''],

  inputSchema: z.object({
    name: z.string().describe('Name of the sales flow'),
    queries: z.string().describe('JSON array of query objects with actionType and values'),
    is_default: z.boolean().optional().describe('Whether this is the default sales flow'),
    list_id: z.string().optional().describe('List ID, or "all-lists" for all'),
    campaign_id: z.string().optional().describe('Campaign ID, or null for all campaigns'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Sales flow name (required)' },
      { field: 'queries', flags: '--queries <json>', description: 'JSON array of query objects (required)' },
      { field: 'is_default', flags: '--is-default <boolean>', description: 'Whether this is the default sales flow' },
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID or "all-lists"' },
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/sales-flow' },
  fieldMappings: {
    name: 'body',
    queries: 'body',
    is_default: 'body',
    list_id: 'body',
    campaign_id: 'body',
  },
  handler: (input, client) => executeCommand(salesFlowCreateCommand, input, client),
};
