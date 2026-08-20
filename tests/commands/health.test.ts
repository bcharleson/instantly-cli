import { describe, it, expect, vi } from 'vitest';
import { runHealth } from '../../src/commands/health/index.js';
import { InstantlyClient } from '../../src/core/client.js';

describe('runHealth', () => {
  it('rolls up existing account, bounce, warmup, and campaign fields without inventing stats', async () => {
    const client = {
      paginate: vi.fn(async function* (opts: { path: string }) {
        if (opts.path === '/accounts') {
          yield [
            { email: 'a@example.com', status: -1, warmup_status: 0 },
            { email: 'b@example.com', status: 1, warmup_status: 1 },
          ];
        }
        if (opts.path === '/campaigns') {
          yield [{ id: 'camp-1', name: 'Outreach', status: 1 }];
        }
      }),
      get: vi.fn().mockResolvedValue({ bounced: 4, sent: 100 }),
    } as unknown as InstantlyClient;

    const report = await runHealth(client);

    expect(report.accounts).toMatchObject({
      total: 2,
      by_status: { '-1': 1, '1': 1 },
      disconnected: [{ email: 'a@example.com', status: -1, warmup_status: 0 }],
      warmup: { by_warmup_status: { '0': 1, '1': 1 } },
    });
    expect(report.bounce).toEqual({
      source: '/campaigns/analytics/overview',
      overview: { bounced: 4, sent: 100 },
    });
    expect(report.campaigns).toMatchObject({
      total: 1,
      by_status: { '1': 1 },
      sending: [{ id: 'camp-1', name: 'Outreach', status: 1 }],
    });
  });
});
