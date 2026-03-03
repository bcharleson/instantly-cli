import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const auditLogsListCommand: CommandDefinition = {
  name: 'audit_logs_list',
  group: 'audit-logs',
  subcommand: 'list',
  description: 'List audit log records for tracking workspace activities.',
  examples: [
    'instantly audit-logs list',
    'instantly audit-logs list --start-date 2025-01-01 --end-date 2025-03-01',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(1000).default(50).describe('Items per page (1-1000)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    activity_type: z.coerce.number().optional().describe('Activity type filter'),
    search: z.string().optional().describe('Search term'),
    start_date: z.string().optional().describe('Start date filter'),
    end_date: z.string().optional().describe('End date filter'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-1000)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'activity_type', flags: '--activity-type <type>', description: 'Activity type' },
      { field: 'search', flags: '--search <query>', description: 'Search term' },
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date' },
    ],
  },

  endpoint: { method: 'GET', path: '/audit-logs' },
  fieldMappings: { limit: 'query', starting_after: 'query', activity_type: 'query', search: 'query', start_date: 'query', end_date: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(auditLogsListCommand, input, client),
};
