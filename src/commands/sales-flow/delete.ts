import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const salesFlowDeleteCommand: CommandDefinition = {
  name: 'sales_flow_delete',
  group: 'sales-flow',
  subcommand: 'delete',
  description: 'Delete a sales flow by ID.',
  examples: ['instantly sales-flow delete <flow-id>'],

  inputSchema: z.object({ id: z.string().describe('Sales flow ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/sales-flow/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(salesFlowDeleteCommand, input, client),
};
