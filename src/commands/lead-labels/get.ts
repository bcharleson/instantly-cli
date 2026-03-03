import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsGetCommand: CommandDefinition = {
  name: 'lead_labels_get',
  group: 'lead-labels',
  subcommand: 'get',
  description: 'Get a lead label by ID.',
  examples: ['instantly lead-labels get <label-id>'],

  inputSchema: z.object({ id: z.string().describe('Lead label ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/lead-labels/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(leadLabelsGetCommand, input, client),
};
