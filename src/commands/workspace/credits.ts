import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const workspaceCreditsCommand: CommandDefinition = {
  name: 'workspace_credits',
  group: 'workspace',
  subcommand: 'credits',
  description:
    'Show workspace credit balance summary. Aggregates data from workspace, plan details, ' +
    'and subscription endpoints into a single view so you don\'t have to chain multiple commands.',
  examples: [
    'instantly workspace credits',
    'instantly workspace credits --fields plan_name,credits',
  ],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspaces/current' },
  fieldMappings: {},

  handler: async (_input, client) => {
    // Fetch all three sources in parallel
    const [workspace, plan, subscription] = await Promise.all([
      client.get<Record<string, unknown>>('/workspaces/current').catch(() => null),
      client.get<Record<string, unknown>>('/workspace-billing/plan-details').catch(() => null),
      client.get<Record<string, unknown>>('/workspace-billing/subscription-details').catch(() => null),
    ]);

    // Extract credit-related fields from the plan details
    const planCredits: Record<string, unknown> = {};
    if (plan) {
      // The plan response varies by workspace — pull out known credit fields
      for (const [key, val] of Object.entries(plan)) {
        if (
          key.includes('credit') ||
          key.includes('limit') ||
          key.includes('usage') ||
          key.includes('balance') ||
          key === 'plan_name' ||
          key === 'name' ||
          key === 'pid'
        ) {
          planCredits[key] = val;
        }
      }
    }

    // Extract subscription line items that mention credits
    const subscriptionInfo: Record<string, unknown> = {};
    if (subscription) {
      for (const [key, val] of Object.entries(subscription)) {
        if (
          key.includes('credit') ||
          key.includes('item') ||
          key.includes('plan') ||
          key.includes('status') ||
          key.includes('renewal') ||
          key.includes('period')
        ) {
          subscriptionInfo[key] = val;
        }
      }
    }

    return {
      workspace_name: workspace?.name ?? null,
      workspace_id: workspace?.id ?? null,
      plan: planCredits,
      subscription: subscriptionInfo,
      _cli_note:
        'Credit fields vary by plan. Use "instantly workspace-billing plan-details" ' +
        'and "instantly workspace-billing subscription-details" for raw API responses.',
    };
  },
};

