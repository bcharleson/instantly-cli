import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const salesFlowUpdateCommand: CommandDefinition = {
  name: 'sales_flow_update',
  group: 'sales-flow',
  subcommand: 'update',
  description: 'Update a sales flow.',
  examples: ['instantly sales-flow update <flow-id> --name "Updated Flow Name"'],

  inputSchema: z.object({
    id: z.string().describe('Sales flow ID'),
    name: z.string().optional().describe('Name of the sales flow'),
    queries: z.string().optional().describe('JSON array of query objects with actionType and values'),
    is_default: z.boolean().optional().describe('Whether this is the default sales flow'),
    list_id: z.string().optional().describe('List ID, or "all-lists" for all'),
    campaign_id: z.string().optional().describe('Campaign ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Sales flow name' },
      { field: 'queries', flags: '--queries <json>', description: 'JSON array of query objects' },
      { field: 'is_default', flags: '--is-default <boolean>', description: 'Whether this is the default sales flow' },
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID or "all-lists"' },
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/sales-flow/{id}' },
  fieldMappings: {
    id: 'path',
    name: 'body',
    queries: 'body',
    is_default: 'body',
    list_id: 'body',
    campaign_id: 'body',
  },
  handler: (input, client) => executeCommand(salesFlowUpdateCommand, input, client),
};
