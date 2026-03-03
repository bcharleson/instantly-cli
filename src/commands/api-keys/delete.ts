import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const apiKeysDeleteCommand: CommandDefinition = {
  name: 'api_keys_delete',
  group: 'api-keys',
  subcommand: 'delete',
  description: 'Delete an API key by ID.',
  examples: ['instantly api-keys delete <key-id>'],

  inputSchema: z.object({ id: z.string().describe('API key ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/api-keys/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(apiKeysDeleteCommand, input, client),
};
