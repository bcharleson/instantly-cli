import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const backgroundJobsGetCommand: CommandDefinition = {
  name: 'background_jobs_get',
  group: 'background-jobs',
  subcommand: 'get',
  description: 'Get a background job by ID. Returns job details including type, status, progress, and associated entity.',
  examples: [
    'instantly background-jobs get <job-id>',
    'instantly background-jobs get <job-id> --data-fields "success_count,failed_count,total_to_process"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Background job ID'),
    data_fields: z.string().optional().describe('Comma-separated list of fields to include from the data object'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'data_fields', flags: '--data-fields <fields>', description: 'Comma-separated data fields to include' },
    ],
  },

  endpoint: { method: 'GET', path: '/background-jobs/{id}' },

  fieldMappings: {
    id: 'path',
    data_fields: 'query',
  },

  handler: (input, client) => executeCommand(backgroundJobsGetCommand, input, client),
};
