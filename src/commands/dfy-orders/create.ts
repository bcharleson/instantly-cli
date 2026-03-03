import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersCreateCommand: CommandDefinition = {
  name: 'dfy_orders_create',
  group: 'dfy-orders',
  subcommand: 'create',
  description: 'Place a DFY email account order. Supports regular DFY, pre-warmed up, and extra accounts order types.',
  examples: [
    'instantly dfy-orders create --items \'[{"domain":"example.com","accounts":[{"first_name":"John","last_name":"Doe","email_prefix":"john"}]}]\' --order-type "dfy"',
  ],

  inputSchema: z.object({
    items: z.string().describe('JSON array of order items (domain, email_provider, forwarding_domain, accounts)'),
    order_type: z.string().describe('Order type: dfy, pre_warmed_up, or extra_accounts'),
    simulation: z.boolean().optional().describe('Run a simulation without placing the order'),
  }),

  cliMappings: {
    options: [
      { field: 'items', flags: '--items <json>', description: 'JSON array of order items' },
      { field: 'order_type', flags: '--order-type <type>', description: 'Order type: dfy, pre_warmed_up, extra_accounts' },
      { field: 'simulation', flags: '--simulation', description: 'Simulate order without placing it' },
    ],
  },

  endpoint: { method: 'POST', path: '/dfy-email-account-orders' },
  fieldMappings: { items: 'body', order_type: 'body', simulation: 'body' },

  handler: async (input, client) => {
    const items = typeof input.items === 'string' ? JSON.parse(input.items) : input.items;
    return client.post('/dfy-email-account-orders', {
      items,
      order_type: input.order_type,
      ...(input.simulation !== undefined && { simulation: input.simulation }),
    });
  },
};
