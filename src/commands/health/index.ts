import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { boundWorkspaceOf, displayProfileSlug } from '../../core/auth.js';
import { createCommandContext } from '../../core/command-context.js';
import { fetchLiveWorkspace } from '../../core/workspace.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

const ACCOUNT_PAGE_LIMIT = 100;
const ACCOUNT_MAX = 500;
const CAMPAIGN_MAX = 200;

interface AccountRow {
  email?: string;
  status?: number;
  warmup_status?: number;
  [key: string]: unknown;
}

interface CampaignRow {
  id?: string;
  name?: string;
  status?: number;
  [key: string]: unknown;
}

function countBy(values: Array<string | number | undefined>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = value === undefined || value === null ? 'unknown' : String(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

async function collectPaginated<T extends Record<string, unknown>>(
  client: InstantlyClient,
  path: string,
  max: number,
): Promise<T[]> {
  const items: T[] = [];
  try {
    for await (const page of client.paginate<T>({ method: 'GET', path, limit: ACCOUNT_PAGE_LIMIT })) {
      items.push(...page);
      if (items.length >= max) break;
    }
    return items.slice(0, max);
  } catch {
    const res = await client.get<unknown>(path, { limit: ACCOUNT_PAGE_LIMIT });
    if (Array.isArray(res)) return (res as T[]).slice(0, max);
    if (res && typeof res === 'object' && Array.isArray((res as { items?: unknown }).items)) {
      return ((res as { items: T[] }).items).slice(0, max);
    }
    return [];
  }
}

/**
 * Read-only rollup of existing Instantly endpoints. Does not invent stats.
 */
export async function runHealth(client: InstantlyClient): Promise<Record<string, unknown>> {
  const [accounts, campaigns, overview] = await Promise.all([
    collectPaginated<AccountRow>(client, '/accounts', ACCOUNT_MAX),
    collectPaginated<CampaignRow>(client, '/campaigns', CAMPAIGN_MAX),
    client.get<Record<string, unknown>>('/campaigns/analytics/overview').catch((error: unknown) => ({
      error: error instanceof Error ? error.message : String(error),
    })),
  ]);

  const disconnected = accounts.filter((account) => {
    const status = account.status;
    return typeof status === 'number' && status < 0;
  });

  return {
    accounts: {
      total: accounts.length,
      by_status: countBy(accounts.map((account) => account.status)),
      disconnected: disconnected.map((account) => ({
        email: account.email ?? null,
        status: account.status ?? null,
        warmup_status: account.warmup_status ?? null,
      })),
      warmup: {
        by_warmup_status: countBy(accounts.map((account) => account.warmup_status)),
      },
    },
    bounce: {
      source: '/campaigns/analytics/overview',
      overview,
    },
    campaigns: {
      total: campaigns.length,
      by_status: countBy(campaigns.map((campaign) => campaign.status)),
      sending: campaigns.map((campaign) => ({
        id: campaign.id ?? null,
        name: campaign.name ?? null,
        status: campaign.status ?? null,
      })),
    },
  };
}

export function registerHealthCommand(program: Command): void {
  program
    .command('health')
    .description(
      'Read-only rollup of disconnected accounts, bounce totals, warmup status, and campaign sending status',
    )
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;
      try {
        const ctx = await createCommandContext({
          apiKey: globalOpts.apiKey,
          profile: globalOpts.profile,
          workspace: globalOpts.workspace,
          mutating: false,
        });
        const report = await runHealth(ctx.client);
        const bound = boundWorkspaceOf(ctx.credentials);
        let live = ctx.liveWorkspace;
        if (!live) {
          try {
            live = await fetchLiveWorkspace(ctx.client);
          } catch {
            live = bound ? { id: bound.id, name: bound.name } : undefined;
          }
        }
        output(
          {
            source: ctx.credentials.source,
            profile: displayProfileSlug(ctx.credentials),
            workspace_id: live?.id ?? bound?.id ?? null,
            workspace_name: live?.name ?? bound?.name ?? null,
            ...report,
          },
          globalOpts,
        );
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
