import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const crmActionsListPhoneNumbersCommand: CommandDefinition = {
  name: 'crm_actions_list-phone-numbers',
  group: 'crm-actions',
  subcommand: 'list-phone-numbers',
  description: 'List all phone numbers associated with the current organization.',
  examples: ['instantly crm-actions list-phone-numbers'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/crm-actions/phone-numbers' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(crmActionsListPhoneNumbersCommand, input, client),
};
