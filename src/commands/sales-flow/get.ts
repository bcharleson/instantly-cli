import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const salesFlowGetCommand: CommandDefinition = {
  name: 'sales_flow_get',
  group: 'sales-flow',
  subcommand: 'get',
  description: 'Get a sales flow by ID.',
  examples: ['instantly sales-flow get <flow-id>'],

  inputSchema: z.object({ id: z.string().describe('Sales flow ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/sales-flow/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(salesFlowGetCommand, input, client),
};
