import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const backgroundJobsListCommand: CommandDefinition = {
  name: 'background_jobs_list',
  group: 'background-jobs',
  subcommand: 'list',
  description: 'List background jobs. Track long-running tasks like bulk imports and exports.',
  examples: ['instantly background-jobs list', 'instantly background-jobs list --status completed --type import'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    ids: z.string().optional().describe('Comma-separated job IDs'),
    type: z.string().optional().describe('Job type filter'),
    entity_type: z.string().optional().describe('Entity type filter'),
    entity_id: z.string().optional().describe('Entity ID filter'),
    status: z.string().optional().describe('Status filter'),
    sort_column: z.string().optional().describe('Sort column'),
    sort_order: z.string().optional().describe('Sort order (asc/desc)'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'ids', flags: '--ids <ids>', description: 'Filter by job IDs' },
      { field: 'type', flags: '--type <type>', description: 'Job type' },
      { field: 'entity_type', flags: '--entity-type <type>', description: 'Entity type' },
      { field: 'entity_id', flags: '--entity-id <id>', description: 'Entity ID' },
      { field: 'status', flags: '--status <status>', description: 'Job status' },
      { field: 'sort_order', flags: '--sort-order <order>', description: 'Sort order (asc/desc)' },
    ],
  },

  endpoint: { method: 'GET', path: '/background-jobs' },
  fieldMappings: { limit: 'query', starting_after: 'query', ids: 'query', type: 'query', entity_type: 'query', entity_id: 'query', status: 'query', sort_column: 'query', sort_order: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(backgroundJobsListCommand, input, client),
};
