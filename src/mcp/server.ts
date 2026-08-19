import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allCommands } from '../commands/index.js';
import { buildAuthStatus } from '../commands/auth/status.js';
import { runHealth } from '../commands/health/index.js';
import { createCommandContext } from '../core/command-context.js';
import { isMutatingCommand } from '../core/mutating.js';
import { resolveCredentials } from '../core/auth.js';

const isolationShape = {
  profile: z
    .string()
    .optional()
    .describe(
      'Named workspace profile slug (~/.instantly/profiles/<slug>.json). ' +
        'One tool call uses exactly one workspace. Do not pass multiple slugs.',
    ),
  workspace_id: z
    .string()
    .optional()
    .describe(
      'Workspace UUID confirmation. Required for mutating tools when a profile is selected (must match the bound id). When passed on the default single-key path, must match the live workspace.',
    ),
};

function isolationFromArgs(args: Record<string, unknown>): {
  profile?: string;
  workspace_id?: string;
  input: Record<string, unknown>;
} {
  const { profile, workspace_id, ...input } = args;
  return {
    profile: typeof profile === 'string' ? profile : undefined,
    workspace_id: typeof workspace_id === 'string' ? workspace_id : undefined,
    input,
  };
}

export async function startMcpServer(): Promise<void> {
  // Fail fast if no default credential source exists. Per-call `profile`
  // can still select a named workspace; we never iterate profiles here.
  await resolveCredentials();

  const server = new McpServer({
    name: 'instantly',
    version: '0.1.0',
  });

  for (const cmdDef of allCommands) {
    const shape = { ...cmdDef.inputSchema.shape, ...isolationShape };

    server.registerTool(
      cmdDef.name,
      {
        description: cmdDef.description,
        inputSchema: shape,
      },
      async (args: Record<string, unknown>) => {
        try {
          const { profile, workspace_id, input } = isolationFromArgs(args);
          const { client } = await createCommandContext({
            profile,
            workspace: workspace_id,
            mutating: isMutatingCommand(cmdDef),
          });
          const result = await cmdDef.handler(input, client);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify({
                  error: error.message ?? String(error),
                  code: error.code ?? 'UNKNOWN_ERROR',
                }),
              },
            ],
            isError: true,
          };
        }
      },
    );
  }

  server.registerTool(
    'status',
    {
      description:
        'Show the active credential source, profile slug (if any), and live workspace id/name.',
      inputSchema: {
        profile: isolationShape.profile,
      },
    },
    async (args: Record<string, unknown>) => {
      try {
        const result = await buildAuthStatus({
          profile: typeof args.profile === 'string' ? args.profile : undefined,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
          isError: result.authenticated === false,
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: error.message ?? String(error),
                code: error.code ?? 'UNKNOWN_ERROR',
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'health',
    {
      description:
        'Read-only rollup of disconnected accounts, bounce totals, warmup status, and campaign sending status for the active profile or default key.',
      inputSchema: isolationShape,
    },
    async (args: Record<string, unknown>) => {
      try {
        const { profile, workspace_id } = isolationFromArgs(args);
        const ctx = await createCommandContext({
          profile,
          workspace: workspace_id,
          mutating: false,
        });
        const report = await runHealth(ctx.client);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  source: ctx.credentials.source,
                  profile: ctx.credentials.profile?.slug ?? null,
                  workspace_id: ctx.liveWorkspace?.id ?? ctx.credentials.profile?.workspace_id ?? null,
                  workspace_name: ctx.liveWorkspace?.name ?? ctx.credentials.profile?.workspace_name ?? null,
                  ...report,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: error.message ?? String(error),
                code: error.code ?? 'UNKNOWN_ERROR',
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Instantly MCP server started. Tools registered:', allCommands.length + 2);
}
