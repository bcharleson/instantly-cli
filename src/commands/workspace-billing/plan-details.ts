import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceBillingPlanDetailsCommand: CommandDefinition = {
  name: 'workspace_billing_plan-details',
  group: 'workspace-billing',
  subcommand: 'plan-details',
  description: 'Get workspace plan details.',
  examples: ['instantly workspace-billing plan-details'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspace-billing/plan-details' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceBillingPlanDetailsCommand, input, client),
};
