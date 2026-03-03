import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsDeleteCommand: CommandDefinition = {
  name: 'lead_labels_delete',
  group: 'lead-labels',
  subcommand: 'delete',
  description: 'Delete a lead label. Optionally reassign leads to a different interest status.',
  examples: ['instantly lead-labels delete <label-id>'],

  inputSchema: z.object({
    id: z.string().describe('Lead label ID to delete'),
    reassigned_status: z.coerce.number().optional().describe('Interest status to reassign leads to'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'reassigned_status', flags: '--reassign-status <status>', description: 'Reassign leads to this status' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/lead-labels/{id}' },
  fieldMappings: { id: 'path', reassigned_status: 'body' },
  handler: async (input, client) => {
    const body: Record<string, any> = {};
    if (input.reassigned_status !== undefined) body.reassigned_status = input.reassigned_status;
    return client.request({
      method: 'DELETE',
      path: `/lead-labels/${encodeURIComponent(String(input.id))}`,
      body,
    });
  },
};
