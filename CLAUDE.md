# Claude Code Instructions — Instantly CLI

## Project Overview

This is the official CLI and MCP server for the [Instantly.ai](https://instantly.ai) cold email platform. It wraps the Instantly V2 API (156 commands across 31 groups) into both a terminal CLI and an MCP server for AI assistants.

**Dual interface, single codebase:** Every API endpoint is defined once as a `CommandDefinition` object that powers both the CLI subcommand and the MCP tool.

## Architecture

### CommandDefinition Pattern

Every API endpoint lives in one file under `src/commands/<group>/<subcommand>.ts` and exports a single `CommandDefinition` object:

```typescript
interface CommandDefinition {
  name: string;           // MCP tool name: "campaigns_list"
  group: string;          // CLI group: "campaigns"
  subcommand: string;     // CLI subcommand: "list"
  description: string;    // Shared help text
  inputSchema: ZodObject; // Validates CLI flags AND MCP input
  cliMappings: {...};     // Maps Zod fields to Commander args/options
  endpoint: { method, path };
  fieldMappings: {...};   // Where each field goes: path | query | body
  handler: (input, client) => Promise<unknown>;
}
```

**Adding a new endpoint = creating one file + adding it to the allCommands array in `src/commands/index.ts`.**

### Key Files

- `src/core/types.ts` — CommandDefinition interface and shared types
- `src/core/client.ts` — HTTP client (auth, retry, rate limiting, pagination)
- `src/core/handler.ts` — executeCommand() builds HTTP requests from CommandDefinition + input
- `src/core/auth.ts` — API key resolution (--api-key flag > env var > config file)
- `src/core/output.ts` — JSON output formatting, --fields, --quiet, --pretty
- `src/core/errors.ts` — Typed error classes
- `src/core/config.ts` — ~/.instantly/config.json manager
- `src/commands/index.ts` — Command registry, auto-registration, input validation
- `src/mcp/server.ts` — MCP server (registers all CommandDefinitions as tools)
- `src/index.ts` — CLI entry point
- `src/mcp.ts` — Direct MCP entry point

### Directory Structure

```
src/
├── index.ts                 # CLI entry
├── mcp.ts                   # MCP entry
├── core/                    # Shared infrastructure
│   ├── types.ts
│   ├── client.ts
│   ├── handler.ts
│   ├── auth.ts
│   ├── config.ts
│   ├── output.ts
│   └── errors.ts
├── commands/
│   ├── index.ts             # Registry + registerAllCommands()
│   ├── auth/                # login, logout, oauth (special commands)
│   ├── campaigns/           # 11 commands
│   ├── leads/               # 12 commands
│   ├── accounts/            # 12 commands
│   ├── email/               # 8 commands
│   ├── analytics/           # 6 commands
│   ├── webhooks/            # 8 commands
│   ├── lead-lists/          # 6 commands
│   ├── enrichment/          # 10 commands
│   ├── blocklist/           # 5 commands
│   ├── custom-tags/         # 6 commands
│   ├── lead-labels/         # 6 commands
│   ├── workspace/           # 6 commands
│   ├── subsequences/        # 8 commands
│   └── ... (16 more groups)
└── mcp/
    └── server.ts
```

## Tech Stack

- **TypeScript** (ESM, strict mode)
- **Node.js 18+** (target node18 in tsup)
- **Commander.js** — CLI framework
- **Zod v4** — Input validation (shared between CLI and MCP)
- **@modelcontextprotocol/sdk** — MCP server
- **@inquirer/prompts** — Interactive prompts (login/oauth only, dynamically imported)
- **tsup** — Bundler (two entry points: index.ts, mcp.ts)
- **vitest** — Testing

## Development Commands

```bash
npm run build      # Build with tsup → dist/
npm run dev        # Run CLI with tsx (no build needed)
npm test           # Run vitest
npm run typecheck  # TypeScript type checking
```

## API Quirks

- Lead list is `POST /api/v2/leads/list` (not GET)
- Account uses email as ID in some endpoints: `/accounts/{email}`
- Account pagination uses datetime cursor; campaigns/leads use UUID cursor
- Rate limit is workspace-wide: 100 req/10s, 600 req/min
- Auth: Bearer token via `Authorization: Bearer <key>`
- Base URL: `https://api.instantly.ai/api/v2`

## Adding New Commands

1. Create `src/commands/<group>/<subcommand>.ts`
2. Export a `CommandDefinition` object following existing patterns
3. Import and add it to the `allCommands` array in `src/commands/index.ts`
4. Build and test: `npm run build && npm test`

Use `executeCommand()` from `src/core/handler.ts` as the handler for standard CRUD endpoints. Only write custom handlers when the API requires special request transformation (e.g., splitting comma-separated strings into arrays).

## Important Conventions

- **@inquirer/prompts is external** — marked as external in tsup.config.ts and dynamically imported only in login.ts and oauth.ts. This ensures Node 18 compatibility for all non-interactive commands.
- **Zod validation runs before API calls** — the `registerCommand()` function in `src/commands/index.ts` validates input against the schema and gives clear "Missing required option(s)" errors.
- **Unknown subcommand errors list available commands** — each group has a `command:*` handler.
- **All output is JSON to stdout** — never use console.log for anything except structured output in command handlers. Use console.error for errors.
- **Tests mock the HTTP client** — tests in `tests/commands/` verify that CommandDefinitions produce correct HTTP requests without hitting the real API.

## Do Not

- Do not add static imports of `@inquirer/prompts` — always use dynamic `await import('@inquirer/prompts')` to preserve Node 18 compatibility
- Do not modify the output format — agents depend on JSON to stdout
- Do not add interactive prompts to API commands — only login/oauth should be interactive
- Do not create new files without adding them to the `allCommands` array in `src/commands/index.ts`
