import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const crmActionsDeletePhoneNumberCommand: CommandDefinition = {
  name: 'crm_actions_delete-phone-number',
  group: 'crm-actions',
  subcommand: 'delete-phone-number',
  description: 'Delete a phone number from the organization.',
  examples: ['instantly crm-actions delete-phone-number <id>'],

  inputSchema: z.object({ id: z.string().describe('Phone number record ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/crm-actions/phone-numbers/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(crmActionsDeletePhoneNumberCommand, input, client),
};
