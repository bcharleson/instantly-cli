import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allCommands } from '../commands/index.js';
import { buildAuthStatus } from '../commands/auth/status.js';
import { runHealth } from '../commands/health/index.js';
import { createCommandContext } from '../core/command-context.js';
import { isMutatingCommand } from '../core/mutating.js';
import { boundWorkspaceOf, displayProfileSlug, resolveCredentials } from '../core/auth.js';
import { fetchLiveWorkspace } from '../core/workspace.js';

const MCP_AGENCY_READ_HINT =
  ' Agency: pass profile (client slug). Confirm status (profile, workspace_id, workspace_name) first. One process, one profile.';
const MCP_AGENCY_WRITE_HINT =
  ' Agency: pass profile (client slug) and workspace_id matching that profile\'s bound workspace. Confirm status first. One process, one profile.';

const isolationShape = {
  profile: z
    .string()
    .optional()
    .describe(
      'Named client profile slug. Agency: pass this on every tool (or set INSTANTLY_PROFILE). ' +
        'One process, one profile. Do not pass multiple slugs.',
    ),
  workspace_id: z
    .string()
    .optional()
    .describe(
      'Workspace UUID bound to that profile. Mutating tools require profile + workspace_id matching the bound pair. ' +
        'On the default single-key path, when passed must match the live workspace.',
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
        description: `${cmdDef.description}${isMutatingCommand(cmdDef) ? MCP_AGENCY_WRITE_HINT : MCP_AGENCY_READ_HINT}`,
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
        'Show source, profile slug (or default), workspace_id, and workspace_name. Confirm this bound pair before any other command. Agency: pass profile.',
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
        'Read-only rollup of disconnected accounts, bounce totals, warmup status, and campaign sending status. Agency: pass profile. Confirm status (profile, workspace_id, workspace_name) first. One process, one profile.',
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
        const bound = boundWorkspaceOf(ctx.credentials);
        let live = ctx.liveWorkspace;
        if (!live) {
          try {
            live = await fetchLiveWorkspace(ctx.client);
          } catch {
            live = bound ? { id: bound.id, name: bound.name } : undefined;
          }
        }
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  source: ctx.credentials.source,
                  profile: displayProfileSlug(ctx.credentials),
                  workspace_id: live?.id ?? bound?.id ?? null,
                  workspace_name: live?.name ?? bound?.name ?? null,
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
