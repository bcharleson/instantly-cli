import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceBillingSubscriptionDetailsCommand: CommandDefinition = {
  name: 'workspace_billing_subscription-details',
  group: 'workspace-billing',
  subcommand: 'subscription-details',
  description: 'Get workspace subscription details.',
  examples: ['instantly workspace-billing subscription-details'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspace-billing/subscription-details' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceBillingSubscriptionDetailsCommand, input, client),
};
